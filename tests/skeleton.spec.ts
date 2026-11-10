import { expect, test } from '@playwright/test'

test('a screen that loads on demand shows a skeleton first, then the real screen', async ({ page }) => {
  // Hold the code for the Exercises screen back so the skeleton can be seen.
  let release: () => void = () => {}
  const held = new Promise<void>((r) => (release = r))
  await page.route(/ExercisesScreen/, async (route) => {
    await held
    await route.continue()
  })
  await page.goto('/?stage=today')
  await page.getByTestId('tab-bar').getByRole('button', { name: 'Exercises' }).click()
  const sk = page.getByTestId('skeleton')
  await expect(sk).toBeVisible()
  await expect(sk).toHaveAttribute('aria-busy', 'true')
  await expect(sk).toHaveAccessibleName('Loading')
  release()
  await expect(page.getByTestId('exercises')).toBeVisible()
  await expect(sk).toHaveCount(0)
})

test('the skeleton does not pulse when reduced motion is on, and does not overflow at 320', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.setViewportSize({ width: 320, height: 640 })
  let release: () => void = () => {}
  const held = new Promise<void>((r) => (release = r))
  await page.route(/ProgressScreen/, async (route) => {
    await held
    await route.continue()
  })
  await page.goto('/?stage=today')
  await page.getByRole('button', { name: 'Progress' }).click()
  const sk = page.getByTestId('skeleton')
  await expect(sk).toBeVisible()
  const name = await sk.locator('div').first().evaluate((e) => getComputedStyle(e).animationName)
  expect(name).toBe('none')
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true)
  release()
  await expect(page.getByTestId('progress')).toBeVisible()
})
