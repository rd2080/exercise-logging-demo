import { expect, test } from '@playwright/test'

function hold(page: import('@playwright/test').Page, file: RegExp) {
  let release: () => void = () => {}
  const held = new Promise<void>((r) => (release = r))
  return page.route(file, async (route) => {
    await held
    await route.continue()
  }).then(() => release)
}

test('opening a screen by address shows a skeleton while its code loads, then the real screen', async ({ page }) => {
  const release = await hold(page, /ExercisesScreen/)
  await page.goto('/?stage=exercises', { waitUntil: 'commit' })
  const sk = page.getByTestId('skeleton')
  await expect(sk).toBeVisible()
  await expect(sk).toHaveAccessibleName('Loading')
  await expect(sk).toContainText('Loading')
  release()
  await expect(page.getByTestId('exercises')).toBeVisible()
  await expect(sk).toHaveCount(0)
})

test('moving to a screen that is still loading keeps the current screen and the tab bar, with no skeleton', async ({ page }) => {
  await page.goto('/?stage=today')
  await expect(page.getByTestId('today')).toBeVisible()
  const release = await hold(page, /ProgressScreen/)
  await page.getByTestId('tab-bar').getByRole('button', { name: 'Progress' }).click()
  await page.waitForTimeout(400)
  await expect(page.getByTestId('today')).toBeVisible()
  await expect(page.getByTestId('tab-bar')).toBeVisible()
  await expect(page.getByTestId('skeleton')).toHaveCount(0)
  release()
  await expect(page.getByTestId('progress')).toBeVisible()
})

test('the skeleton does not pulse when reduced motion is on, and does not overflow at 320', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.setViewportSize({ width: 320, height: 640 })
  const release = await hold(page, /ProgressScreen/)
  await page.goto('/?stage=progress', { waitUntil: 'commit' })
  const sk = page.getByTestId('skeleton')
  await expect(sk).toBeVisible()
  const name = await sk.locator('div').first().evaluate((e) => getComputedStyle(e).animationName)
  expect(name).toBe('none')
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true)
  release()
  await expect(page.getByTestId('progress')).toBeVisible()
})
