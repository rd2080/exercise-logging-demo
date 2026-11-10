import { expect, test, type Page } from '@playwright/test'

const KEY = 'exercise-demo:entries'
const bar = (page: Page) => page.getByTestId('tab-bar')
const tab = (page: Page, name: string) => bar(page).getByRole('button', { name })
const detail = (page: Page) => page.getByTestId('exercise-detail')

const seed = (page: Page, entries: unknown[]) =>
  page.addInitScript(([k, v]) => localStorage.setItem(k, v), [KEY, JSON.stringify({ v: 1, entries })])

test('a row on Exercises opens the detail with figure, name, type, target and cue; the Exercises tab stays current', async ({ page }) => {
  await page.goto('/?stage=exercises')
  await page.getByTestId('exercise-list').getByRole('button', { name: /Push-up/ }).click()
  await expect(detail(page)).toBeVisible()
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Push-up')
  await expect(page.getByTestId('media-slot')).toBeVisible()
  await expect(page.getByTestId('detail-type')).toHaveText('Reps')
  await expect(page.getByTestId('detail-target')).toHaveText('Target: 3 sets of 10 reps')
  await expect(page.getByTestId('detail-cue')).not.toBeEmpty()
  await expect(bar(page)).toBeVisible()
  await expect(tab(page, 'Exercises')).toHaveAttribute('aria-current', 'page')
  await expect(page.getByTestId('history-empty')).toHaveText('No sets logged yet')
  await page.getByTestId('detail-back').click()
  await expect(page.getByTestId('exercises')).toBeVisible()
})

test('a row on Today opens the detail with Today current, and back returns to Today', async ({ page }) => {
  await page.goto('/?stage=today')
  await page.getByRole('button', { name: /Plank/ }).click()
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Plank')
  await expect(tab(page, 'Today')).toHaveAttribute('aria-current', 'page')
  await page.getByTestId('detail-back').click()
  await expect(page.getByTestId('today')).toBeVisible()
})

test('rows and controls are at least 48px', async ({ page }) => {
  await page.goto('/?stage=exercises')
  for (const b of await page.getByTestId('exercise-open').all()) {
    expect((await b.boundingBox())!.height).toBeGreaterThanOrEqual(48)
  }
  await page.getByTestId('exercise-open').first().click()
  for (const id of ['detail-back', 'log-set']) {
    const box = (await page.getByTestId(id).boundingBox())!
    expect(box.height).toBeGreaterThanOrEqual(48)
    expect(box.width).toBeGreaterThanOrEqual(48)
  }
})

test('Log a set opens the sheet on that exercise, and the saved set appears in the history', async ({ page }) => {
  await page.goto('/?stage=exercise&id=push-up')
  await page.getByRole('button', { name: 'Log a set' }).click()
  const sheet = page.getByRole('dialog')
  await expect(sheet.getByRole('heading', { name: 'Push-up' })).toBeVisible()
  await sheet.getByRole('button', { name: 'Log set' }).click()
  await expect(sheet).toHaveCount(0)
  const rows = page.getByTestId('history-list').getByRole('listitem')
  await expect(rows).toHaveCount(1)
  // On the detail page rows lead with the values, since the page already names the exercise.
  await expect(rows.first()).toContainText('12')
  await expect(rows.first()).toContainText('Reps · By hand')
  await expect(rows.first()).not.toContainText('Push-up')
  await expect(page.getByTestId('history-empty')).toHaveCount(0)
})

test('history shows only this exercise, newest first', async ({ page }) => {
  await seed(page, [
    { id: 'a', name: 'Push-up', trackingType: 'reps', values: { reps: 12 }, exerciseId: 'push-up' },
    { id: 'b', name: 'Plank', trackingType: 'time', values: { seconds: 40 }, exerciseId: 'plank' },
    { id: 'c', name: 'Push-up', trackingType: 'reps', values: { reps: 9 }, exerciseId: 'push-up' },
  ])
  await page.goto('/?stage=exercise&id=push-up')
  const rows = page.getByTestId('history-list').getByRole('listitem')
  await expect(rows).toHaveCount(2)
  await expect(rows.nth(0)).toContainText('12')
  await expect(rows.nth(1)).toContainText('9')
})

test('an unknown id shows the empty state with a way back', async ({ page }) => {
  await page.goto('/?stage=exercise&id=nope')
  await expect(page.getByRole('heading', { name: 'Exercise not found' })).toBeVisible()
  await expect(bar(page)).toBeVisible()
  await page.getByRole('button', { name: 'Back to exercises' }).first().click()
  await expect(page.getByTestId('exercises')).toBeVisible()
})

for (const width of [320, 390]) {
  test(`worst-case data with ten sets does not overflow at ${width}`, async ({ page }) => {
    await page.setViewportSize({ width, height: 700 })
    const entries = Array.from({ length: 10 }, (_, i) => ({
      id: `e${i}`,
      name: 'Single-arm kettlebell Turkish get-up, alternating sides',
      trackingType: 'reps',
      values: { reps: 90 + i },
      exerciseId: 'push-up',
    }))
    await seed(page, entries)
    await page.goto('/?stage=exercise&id=push-up&data=worst')
    await expect(page.getByTestId('history-list').getByRole('listitem')).toHaveCount(10)
    expect(await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth)).toBe(false)
    await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight))
    const barTop = (await bar(page).boundingBox())!.y
    const last = await page.evaluate(() => {
      const items = document.querySelectorAll('[data-testid=history-list] li')
      return items[items.length - 1].getBoundingClientRect().bottom
    })
    expect(last).toBeLessThanOrEqual(barTop)
    await page.goto('/?stage=exercises&data=worst')
    expect(await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth)).toBe(false)
  })
}
