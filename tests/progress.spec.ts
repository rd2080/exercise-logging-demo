import { expect, test } from '@playwright/test'

test.beforeEach(async ({ page }) => {
  await page.goto('/?stage=progress')
  await expect(page.getByTestId('progress')).toBeVisible()
})

test('the empty state shows a picture, a headline, where sets will appear, and one main button', async ({ page }) => {
  const empty = page.getByTestId('empty-state')
  await expect(empty.getByRole('heading', { name: 'Your sets will be logged here' })).toBeVisible()
  await expect(empty.getByText(/shows up here with what you did/)).toBeVisible()
  // One main button, plus a quiet text button for logging by hand.
  await expect(empty.getByTestId('empty-action')).toHaveText('Start your first workout')
  await expect(empty.getByRole('button')).toHaveText(['Start your first workout', 'Log an exercise'])
})

test('the main button starts the first workout', async ({ page }) => {
  await page.getByTestId('empty-action').click()
  await expect(page.getByTestId('player')).toBeVisible()
})

test('goals are on their own Achievements page, visible up front, all locked, each with its requirement and count', async ({ page }) => {
  await page.goto('/?stage=achievements')
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Achievements')
  await expect(page.getByTestId('unlocked-count')).toHaveText('0 of 4 unlocked')
  const goals = page.getByTestId('goal-list').getByRole('listitem')
  await expect(goals).toHaveCount(4)
  for (const name of [/First set: Log your first set\. Locked, 0 of 1/, /Week one: .* Locked, 0 of 3/])
    await expect(page.getByRole('listitem', { name })).toBeVisible()
  // Only goals with more than one step draw a count strip.
  await expect(page.getByRole('listitem', { name: /Week one/ }).locator('span[aria-hidden=true]').last().locator('span')).toHaveCount(3)
  await page.goto('/?stage=progress')
  await expect(page.getByTestId('goal-list')).toHaveCount(0) // goals no longer sit under the log
})

for (const height of [667, 844]) {
  test(`controls are at least 48px and nothing overflows at 390x${height}`, async ({ page }) => {
    await page.setViewportSize({ width: 390, height })
    await page.reload()
    const small = await page.evaluate(
      () =>
        [...document.querySelectorAll('button:not([data-testid=data-toggle] button)')]
          .map((b) => b.getBoundingClientRect())
          .filter((r) => r.height < 48 || r.width < 48).length,
    )
    expect(small).toBe(0)
    expect(await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth)).toBe(false)
    const button = await page.getByTestId('empty-action').boundingBox()
    expect(button!.y + button!.height).toBeLessThanOrEqual(height)
    await page.screenshot({ path: `screenshots/progress-${height}.png` })
  })
}

const day = (d: number, h = 10) => new Date(2026, 10, d, h, 0, 0).getTime()
const entry = (id: string, at: number | null, name = 'Push-up') => ({
  id, name, trackingType: 'reps', values: { reps: 10 }, exerciseId: 'push-up', ...(at ? { at } : {}), source: 'workout',
})

test('logged sets are grouped by date, newest day first, with Today and Yesterday named and only the newest day open', async ({ page }) => {
  await page.clock.setFixedTime(new Date(2026, 10, 11, 12, 0, 0))
  await page.addInitScript(([e]) => {
    if (sessionStorage.getItem('seeded')) return
    sessionStorage.setItem('seeded', '1')
    localStorage.setItem('exercise-demo:entries', JSON.stringify({ v: 1, entries: e }))
  }, [[
    entry('a', day(11, 9)), entry('b', day(11, 10), 'Plank'), entry('c', day(10)), entry('d', day(4)), entry('e', null),
  ]])
  await page.goto('/?stage=progress')
  const heads = page.getByTestId('entry-list').locator('h3 button')
  await expect(heads).toHaveCount(4)
  await expect(heads.nth(0)).toContainText('Today')
  await expect(heads.nth(0)).toContainText('2 sets')
  await expect(heads.nth(1)).toContainText('Yesterday')
  await expect(heads.nth(2)).toContainText('Wed 4 Nov')
  await expect(heads.nth(3)).toContainText('Earlier')
  await expect(heads.nth(0)).toHaveAttribute('aria-expanded', 'true')
  await expect(heads.nth(1)).toHaveAttribute('aria-expanded', 'false')
  // Newest set first inside the day.
  const today = page.getByTestId(/^day-/).first().getByRole('listitem')
  await expect(today).toHaveCount(2)
  await expect(today.first()).toContainText('Plank')
  // Opening an older day shows only its own sets.
  await heads.nth(2).click()
  await expect(page.getByTestId(/^day-/).nth(2).getByRole('listitem')).toHaveCount(1)
  for (const h of await heads.all()) expect((await h.boundingBox())!.height).toBeGreaterThanOrEqual(48)
})

test('Achievements is its own tab and stays in view however many sets are logged', async ({ page }) => {
  await page.goto('/?stage=progress')
  await page.getByTestId('tab-bar').getByRole('button', { name: 'Achievements' }).click()
  await expect(page.getByTestId('achievements')).toBeVisible()
  await expect(page.getByTestId('tab-bar').getByRole('button', { name: 'Achievements' })).toHaveAttribute('aria-current', 'page')
  await expect(page.getByTestId('goal-list')).toBeVisible()
})

for (const width of [320, 390]) {
  test(`four tabs fit at ${width} wide without clipping`, async ({ page }) => {
    await page.setViewportSize({ width, height: 700 })
    await page.goto('/?stage=today')
    await page.evaluate(() => document.fonts.ready)
    const clipped = await page.evaluate(() =>
      [...document.querySelectorAll('nav[aria-label=Main] button')].some((b) => {
        const label = b.querySelector('span.font-semibold') as HTMLElement
        return label.scrollWidth > b.clientWidth || label.getBoundingClientRect().right > b.getBoundingClientRect().right + 0.5
      }),
    )
    expect(clipped).toBe(false)
  })
}
