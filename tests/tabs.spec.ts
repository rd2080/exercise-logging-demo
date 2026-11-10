import { expect, test, type Page } from '@playwright/test'

const bar = (page: Page) => page.getByTestId('tab-bar')
const tab = (page: Page, name: string) => bar(page).getByRole('button', { name })

test('three tabs, sentence case, the current one marked, each at least 48px', async ({ page }) => {
  await page.goto('/?stage=today')
  await expect(bar(page)).toBeVisible()
  const names = await bar(page).getByRole('button').allInnerTexts()
  expect(names).toEqual(['Today', 'Exercises', 'Progress'])
  await expect(tab(page, 'Today')).toHaveAttribute('aria-current', 'page')
  await expect(tab(page, 'Exercises')).not.toHaveAttribute('aria-current', 'page')
  for (const b of await bar(page).getByRole('button').all()) {
    const box = (await b.boundingBox())!
    expect(box.height).toBeGreaterThanOrEqual(48)
    expect(box.width).toBeGreaterThanOrEqual(48)
  }
  await page.screenshot({ path: 'screenshots/tabs-today.png' })
})

test('tapping a tab switches screen and moves the marker', async ({ page }) => {
  await page.goto('/?stage=today')
  await tab(page, 'Exercises').click()
  await expect(page.getByTestId('exercises')).toBeVisible()
  await expect(tab(page, 'Exercises')).toHaveAttribute('aria-current', 'page')
  await expect(tab(page, 'Today')).not.toHaveAttribute('aria-current', 'page')
  await page.screenshot({ path: 'screenshots/tabs-exercises.png' })
  await tab(page, 'Progress').click()
  await expect(page.getByTestId('progress')).toBeVisible()
  await tab(page, 'Today').click()
  await expect(page.getByTestId('today')).toBeVisible()
})

test('Today lists the workout with one inline Start workout button', async ({ page }) => {
  await page.goto('/?stage=today')
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Today')
  await expect(page.getByText('4 exercises, 11 sets')).toBeVisible()
  await expect(page.getByTestId('start-workout')).toHaveText('Start workout')
  // The tab bar is the only floating element: the button is in the flow and ends above it.
  const pos = await page.getByTestId('start-workout').evaluate((e) => getComputedStyle(e).position)
  expect(pos).not.toBe('fixed')
})

test('Exercises lists every exercise with its type and target', async ({ page }) => {
  await page.goto('/?stage=exercises')
  await expect(page.getByTestId('result-count')).toHaveText('19 exercises')
  const rows = page.getByTestId('exercise-list').getByRole('listitem')
  await expect(rows).toHaveCount(19)
  await expect(rows.nth(0)).toContainText('Push-up')
  await expect(rows.nth(0)).toContainText('Reps · 3 × 10')
  await expect(rows.nth(8)).toContainText('Timed hold · 2 × 30 s')
})

test('the bar is hidden in the player, set up, programmes and reminders', async ({ page }) => {
  for (const stage of ['player', 'programme', 'reminders']) {
    await page.goto(`/?stage=${stage}`)
    await expect(bar(page)).toHaveCount(0)
  }
  await page.goto('/')
  await expect(page.getByTestId('setup')).toBeVisible()
  await expect(bar(page)).toHaveCount(0)
})

test('Start workout opens the player without the bar, and finishing returns to Today', async ({ page }) => {
  await page.goto('/?stage=today')
  await page.getByTestId('start-workout').click()
  await expect(page.getByTestId('player')).toBeVisible()
  await expect(bar(page)).toHaveCount(0)
  await page.getByRole('button', { name: 'End workout' }).click()
  await expect(page.getByTestId('summary')).toBeVisible()
  await page.getByRole('button', { name: 'Back to today' }).click()
  await expect(page.getByTestId('today')).toBeVisible()
  await expect(bar(page)).toBeVisible()
})

for (const [width, height] of [[320, 844], [390, 667], [390, 844]]) {
  test(`content clears the bar and nothing overflows at ${width}x${height}`, async ({ page }) => {
    await page.setViewportSize({ width, height })
    for (const stage of ['today', 'exercises', 'progress']) {
      await page.goto(`/?stage=${stage}&data=worst`)
      await expect(bar(page)).toBeVisible()
      expect(await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth)).toBe(false)
      // Scroll to the end: the last piece of content must sit above the bar.
      await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight))
      const barTop = (await bar(page).boundingBox())!.y
      const lastBottom = await page.evaluate(() => {
        const main = document.querySelector('main')!
        const last = [...main.querySelectorAll('li, button, p')].pop()!
        return last.getBoundingClientRect().bottom
      })
      expect(lastBottom, `${stage}: last content vs bar`).toBeLessThanOrEqual(barTop)
    }
  })
}

test('an empty session shows the empty state on Today and Exercises', async ({ page }) => {
  await page.goto('/?stage=today&data=empty')
  await expect(page.getByRole('heading', { name: 'No workout today' })).toBeVisible()
  await tab(page, 'Exercises').click()
  await expect(page.getByRole('heading', { name: 'No exercises yet' })).toBeVisible()
  await page.getByRole('button', { name: 'Choose a programme' }).click()
  await expect(page.getByTestId('setup')).toBeVisible()
})

test('the player summary still works after the label change', async ({ page }) => {
  await page.goto('/?stage=player')
  await page.getByRole('button', { name: 'End workout' }).click()
  await expect(page.getByRole('button', { name: 'Back to today' })).toBeVisible()
})

test('tapping the current tab scrolls to the top', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 500 })
  await page.goto('/?stage=progress')
  await page.evaluate(() => window.scrollTo(0, 400))
  expect(await page.evaluate(() => window.scrollY)).toBeGreaterThan(100)
  await tab(page, 'Progress').click()
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0)
})

test('with no programmes, the programme step shows an empty state with a way back', async ({ page }) => {
  await page.goto('/?data=empty')
  await page.getByRole('button', { name: /^Goals/ }).click()
  await page.getByRole('checkbox', { name: 'Improve fitness' }).click()
  await page.getByRole('button', { name: 'Save goals' }).click()
  await page.getByRole('button', { name: /^Activity level/ }).click()
  await page.getByRole('radio', { name: /Lightly active/ }).click()
  await page.getByRole('button', { name: /^Equipment/ }).click()
  await page.getByRole('checkbox', { name: /None, bodyweight only/ }).click()
  await page.getByRole('button', { name: 'Save equipment' }).click()
  await page.getByTestId('create-plan').click()
  await expect(page.getByRole('heading', { name: 'No programmes yet' })).toBeVisible()
  await page.getByRole('button', { name: 'Back to set up' }).click()
  await expect(page.getByTestId('setup')).toBeVisible()
})

test('finishing set up with programmes brings the tab bar back on Progress', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('button', { name: /^Goals/ }).click()
  await page.getByRole('checkbox', { name: 'Improve fitness' }).click()
  await page.getByRole('button', { name: 'Save goals' }).click()
  await page.getByRole('button', { name: /^Activity level/ }).click()
  await page.getByRole('radio', { name: /Lightly active/ }).click()
  await page.getByRole('button', { name: /^Equipment/ }).click()
  await page.getByRole('checkbox', { name: /None, bodyweight only/ }).click()
  await page.getByRole('button', { name: 'Save equipment' }).click()
  await page.getByTestId('create-plan').click()
  await page.getByTestId('start-programme').click()
  await page.getByRole('button', { name: 'Not now' }).click()
  await expect(page.getByTestId('progress')).toBeVisible()
  await expect(bar(page)).toBeVisible()
})

test('Today keeps one tape colour beside the button, Exercises keys rows by type', async ({ page }) => {
  await page.goto('/?stage=today')
  const today = await page.locator('[data-testid=today] li .tape-fill').count()
  expect(today).toBe(0)
  await page.goto('/?stage=exercises')
  await expect(page.locator('[data-testid=exercise-list] li .tape-fill')).toHaveCount(19)
})

test('Today states the length, muscles and equipment of the session', async ({ page }) => {
  await page.goto('/?stage=today')
  const facts = page.getByTestId('session-facts')
  await expect(facts).toContainText('About ')
  await expect(facts).toContainText('Works chest')
  await expect(facts).toContainText('Needs dumbbells')
})
