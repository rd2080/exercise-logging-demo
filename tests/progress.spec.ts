import { expect, test } from '@playwright/test'

test.beforeEach(async ({ page }) => {
  await page.goto('/?stage=progress')
  await expect(page.getByTestId('progress')).toBeVisible()
})

test('the empty state shows a picture, a headline, where sets will appear, and one main button', async ({ page }) => {
  const empty = page.getByTestId('empty-state')
  await expect(empty.getByRole('heading', { name: 'Your sets will be logged here' })).toBeVisible()
  await expect(empty.getByText(/shows up here with what you did/)).toBeVisible()
  await expect(empty.getByRole('button')).toHaveCount(1)
  await expect(empty.getByRole('button')).toHaveText('Start your first workout')
})

test('the main button starts the first workout', async ({ page }) => {
  await page.getByTestId('empty-action').click()
  await expect(page.getByTestId('player')).toBeVisible()
})

test('goals are visible up front, all locked, each with its requirement and count', async ({ page }) => {
  const goals = page.getByTestId('goal-list').getByRole('listitem')
  await expect(goals).toHaveCount(4)
  for (const name of [/First set: Log your first set\. Locked, 0 of 1/, /Week one: .* Locked, 0 of 3/])
    await expect(page.getByRole('listitem', { name })).toBeVisible()
  await expect(page.getByText('Goals to unlock')).toBeVisible()
  // Only goals with more than one step draw a count strip.
  await expect(page.getByRole('listitem', { name: /Week one/ }).locator('span[aria-hidden=true]').last().locator('span')).toHaveCount(3)
})

for (const height of [667, 844]) {
  test(`controls are at least 48px and nothing overflows at 390x${height}`, async ({ page }) => {
    await page.setViewportSize({ width: 390, height })
    await page.reload()
    const small = await page.evaluate(
      () =>
        [...document.querySelectorAll('button')]
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
