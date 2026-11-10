import { expect, test, type Page } from '@playwright/test'

const primary = (page: Page) => page.getByTestId('primary')

async function open(page: Page) {
  await page.goto('/?stage=player')
  await expect(page.getByTestId('player')).toBeVisible()
}

async function logOne(page: Page) {
  await primary(page).click()
  await expect(page.getByTestId('rest')).toBeVisible()
}

test('sets logged in the player are saved and show on Progress after a reload', async ({ page }) => {
  await open(page)
  await logOne(page)
  await primary(page).click() // skip rest
  await logOne(page)
  await page.getByRole('button', { name: 'End workout' }).click()
  await page.getByRole('button', { name: 'End workout' }).last().click()
  await expect(page.getByRole('heading', { name: 'Workout logged' })).toBeFocused()
  await expect(page.getByText('2 sets across 1 exercise.')).toBeVisible()
  await page.getByRole('button', { name: 'Back to today' }).click()
  await page.reload()
  await page.goto('/?stage=progress')
  await expect(page.getByRole('heading', { name: 'Logged sets' })).toBeVisible()
  await expect(page.getByTestId('entry-list').getByRole('listitem')).toHaveCount(2)
  await expect(page.getByTestId('entry-list')).not.toContainText('By hand')
})

test('closing with sets logged asks first, and keep going stays in the workout', async ({ page }) => {
  await open(page)
  await logOne(page)
  await page.getByRole('button', { name: 'End workout' }).click()
  await expect(page.getByText('End workout?')).toBeVisible()
  await page.getByRole('button', { name: 'Keep going' }).click()
  await expect(page.getByTestId('player')).toBeVisible()
  await expect(page.getByText('End workout?')).toHaveCount(0)
})

test('ending with no sets logged exits at once and says so', async ({ page }) => {
  await open(page)
  await page.getByRole('button', { name: 'End workout' }).click()
  await expect(page.getByRole('heading', { name: 'No sets logged' })).toBeFocused()
  await expect(page.getByText('Nothing was saved.')).toBeVisible()
  await expect(page.getByText('0 sets across 0 exercises.')).toHaveCount(0)
})

test('exercise changes are announced', async ({ page }) => {
  await open(page)
  for (let i = 0; i < 2; i++) {
    await logOne(page)
    await primary(page).click()
  }
  await primary(page).click() // third set
  await primary(page).click() // next exercise
  await expect(page.getByRole('status').filter({ hasText: 'Exercise 2 of 4' })).toHaveCount(1)
})

test('manual entries still say by hand', async ({ page }) => {
  await page.addInitScript(() => {
    if (!localStorage.getItem('exercise-demo:entries'))
      localStorage.setItem(
        'exercise-demo:entries',
        JSON.stringify({ v: 1, entries: [{ id: 'a', name: 'Dips', trackingType: 'reps', values: { reps: 5 } }] }),
      )
  })
  await page.goto('/?stage=progress')
  await expect(page.getByTestId('entry-list')).toContainText('By hand')
})

test('the start of a hold is announced: get into position, then the hold begins', async ({ page }) => {
  await page.clock.install()
  await page.goto('/?stage=player')
  await expect(page.getByTestId('player')).toBeVisible() // the screen loads on demand
  for (const sets of [3, 3]) {
    for (let i = 0; i < sets; i++) {
      await page.evaluate(() => (document.querySelector('[data-testid=primary]') as HTMLElement).click())
      if (i < sets - 1) await page.evaluate(() => (document.querySelector('[data-testid=primary]') as HTMLElement).click())
    }
    await page.evaluate(() => (document.querySelector('[data-testid=primary]') as HTMLElement).click())
  }
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Plank')
  await page.getByRole('button', { name: /second hold/ }).click()
  await expect(page.getByText('Get into position. The hold starts in 3 seconds.')).toBeAttached()
  await page.clock.fastForward(3500)
  await expect(page.getByText('Hold started, 25 seconds')).toBeAttached()
})
