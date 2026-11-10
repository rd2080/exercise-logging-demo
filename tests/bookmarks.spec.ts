import { expect, test } from '@playwright/test'

test('the category chips filter the list and the row shows the category', async ({ page }) => {
  await page.goto('/?stage=exercises')
  await page.getByTestId('open-filters').click()
  const sheet = page.getByRole('dialog')
  await sheet.getByRole('button', { name: 'Core' }).click()
  await expect(sheet.getByRole('button', { name: /Show 4 exercises/ })).toBeVisible()
  await sheet.getByRole('button', { name: /Show 4 exercises/ }).click()
  const rows = page.getByTestId('exercise-list').getByRole('listitem')
  await expect(rows).toHaveCount(4)
  await expect(rows.first()).toContainText('Core ·')
})

test('saving an exercise shows a toast only on the tap, survives a reload and can be filtered to', async ({ page }) => {
  await page.goto('/?stage=exercises')
  await page.getByTestId('exercise-open').first().click()
  const toast = page.getByTestId('save-toast')
  await expect(toast).toHaveText('')
  const mark = page.getByTestId('bookmark')
  await expect(mark).toHaveAttribute('aria-pressed', 'false')
  expect((await mark.boundingBox())!.width).toBeGreaterThanOrEqual(48)
  await mark.click()
  await expect(toast).toHaveText('Saved to your exercises')
  await expect(mark).toHaveAttribute('aria-pressed', 'true')
  await expect(toast).toHaveText('', { timeout: 4000 })
  // Coming back to the screen does not repeat the toast.
  await page.getByTestId('detail-back').click()
  await page.getByTestId('exercise-open').first().click()
  await expect(toast).toHaveText('')
  await expect(mark).toHaveAttribute('aria-pressed', 'true')
  await page.reload()
  await page.goto('/?stage=exercises')
  await expect(page.getByTestId('exercise-list').getByRole('listitem').first()).toContainText('(saved)')
  await page.getByTestId('open-filters').click()
  await page.getByRole('dialog').getByRole('button', { name: 'Saved only' }).click()
  await page.getByRole('dialog').getByRole('button', { name: /Show 1 exercise/ }).click()
  await expect(page.getByTestId('exercise-list').getByRole('listitem')).toHaveCount(1)
  await expect(page.getByTestId('filter-badge')).toHaveText('1')
})

test('removing a saved exercise says so', async ({ page }) => {
  await page.addInitScript(() => {
    if (sessionStorage.getItem('seeded')) return
    sessionStorage.setItem('seeded', '1')
    localStorage.setItem('exercise-demo:saved', JSON.stringify({ v: 1, ids: ['push-up', 5, 'x'.repeat(80)] }))
  })
  await page.goto('/?stage=exercises')
  await page.getByTestId('exercise-open').first().click()
  await expect(page.getByTestId('bookmark')).toHaveAttribute('aria-pressed', 'true')
  await page.getByTestId('bookmark').click()
  await expect(page.getByTestId('save-toast')).toHaveText('Removed from saved')
  const saved = await page.evaluate(() => JSON.parse(localStorage.getItem('exercise-demo:saved')!).ids)
  expect(saved).toEqual([])
})

test('library rows show a drawn thumbnail where one exists and a marked placeholder tile otherwise', async ({ page }) => {
  await page.goto('/?stage=exercises')
  const rows = page.getByTestId('exercise-list').getByRole('listitem')
  await expect(rows.first().getByTestId('thumb-figure')).toBeVisible() // push-up has a figure
  await expect(rows.nth(1).getByTestId('thumb-placeholder')).toHaveText('Push') // incline push-up does not
  const box = (await rows.first().getByTestId('thumb-figure').boundingBox())!
  expect(box.width).toBeGreaterThanOrEqual(48)
  expect(await rows.first().evaluate((r) => r.scrollWidth <= r.clientWidth)).toBe(true)
})

test('thumbnails do not make rows overflow at 320 with long names', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 640 })
  await page.goto('/?stage=exercises&data=worst')
  const ok = await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)
  expect(ok).toBe(true)
})

test('Saved only with nothing saved says so, and the toast clears the Back and bookmark buttons', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 640 })
  await page.goto('/?stage=exercises')
  await page.getByTestId('open-filters').click()
  await page.getByRole('dialog').getByRole('button', { name: 'Saved only' }).click()
  await page.getByRole('dialog').getByRole('button', { name: /Show 0|No exercises match/ }).waitFor()
  await page.keyboard.press('Escape')
  await page.waitForTimeout(500)
  await expect(page.getByRole('heading', { name: 'Nothing saved yet' })).toBeVisible()
  await page.goto('/?stage=exercises')
  await page.getByTestId('exercise-open').first().click()
  await page.getByTestId('bookmark').click()
  const toast = (await page.getByTestId('save-toast').locator('p').boundingBox())!
  const back = (await page.getByTestId('detail-back').boundingBox())!
  const mark = (await page.getByTestId('bookmark').boundingBox())!
  expect(toast.y).toBeGreaterThanOrEqual(back.y + back.height - 1)
  expect(toast.y).toBeGreaterThanOrEqual(mark.y + mark.height - 1)
})
