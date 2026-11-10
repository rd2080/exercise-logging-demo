import { expect, test, type Page } from '@playwright/test'

const KEY = 'exercise-demo:entries'
const sheet = (page: Page) => page.getByRole('dialog')
const rows = (page: Page) => page.getByTestId('entry-list').locator('li')

async function log(page: Page, name: RegExp) {
  await page.getByTestId('add-exercise').click()
  await sheet(page).getByRole('button', { name }).click()
  await sheet(page).getByRole('button', { name: 'Log set' }).click()
  await expect(sheet(page)).toHaveCount(0)
}
const saved = async (page: Page) =>
  JSON.parse((await page.evaluate((k) => localStorage.getItem(k), KEY))!).entries

for (const width of [320, 390]) {
  test.describe(`at ${width}px`, () => {
    test.use({ viewport: { width, height: 844 } })

    test.beforeEach(async ({ page }) => {
      await page.goto('/?stage=progress')
      await log(page, /Push-up/)
    })

    test('tapping a row opens a prefilled sheet and Save changes updates and persists', async ({ page }) => {
      const row = rows(page).first().getByRole('button')
      expect((await row.boundingBox())!.height).toBeGreaterThanOrEqual(48)
      await row.click()
      await expect(sheet(page).getByRole('heading', { name: 'Push-up' })).toBeVisible()
      await expect(sheet(page).getByTestId('edit-inputs').getByRole('status')).toHaveText('12')
      await sheet(page).getByRole('button', { name: 'Increase reps' }).click()
      await sheet(page).getByRole('button', { name: 'Save changes' }).click()
      await expect(sheet(page)).toHaveCount(0)
      await expect(rows(page).first()).toContainText('13')
      expect((await saved(page))[0].values.reps).toBe(13)
      await page.reload()
      await expect(rows(page).first()).toContainText('13')
    })

    test('closing without saving changes nothing', async ({ page }) => {
      await rows(page).first().getByRole('button').click()
      await sheet(page).getByRole('button', { name: 'Increase reps' }).click()
      await page.keyboard.press('Escape')
      await expect(sheet(page)).toHaveCount(0)
      await expect(rows(page).first()).toContainText('12')
    })

    test('Delete entry asks in place, Keep entry backs out, confirming deletes the last entry', async ({ page }) => {
      await rows(page).first().getByRole('button').click()
      await sheet(page).getByRole('button', { name: 'Delete entry' }).click()
      await expect(sheet(page).getByText('Delete this entry?', { exact: true })).toBeVisible()
      await expect(page.getByRole('dialog')).toHaveCount(1)
      for (const n of ['Delete entry', 'Keep entry']) {
        const b = (await sheet(page).getByRole('button', { name: n }).boundingBox())!
        expect(b.height).toBeGreaterThanOrEqual(48)
      }
      await sheet(page).getByRole('button', { name: 'Keep entry' }).click()
      await expect(sheet(page).getByText('Delete this entry?', { exact: true })).toHaveCount(0)
      await expect(rows(page)).toHaveCount(1)

      await sheet(page).getByRole('button', { name: 'Delete entry' }).click()
      await sheet(page).getByRole('button', { name: 'Delete entry' }).click()
      await expect(sheet(page)).toHaveCount(0)
      await expect(page.getByTestId('empty-state')).toBeVisible()
      await expect(page.getByTestId('entry-list')).toHaveCount(0)
      expect(await saved(page)).toHaveLength(0)
      await expect(page.getByRole('listitem', { name: /First set: .* Unlocked/ })).toHaveCount(0)
      await page.reload()
      await expect(page.getByTestId('empty-state')).toBeVisible()
    })

    test('deleting one of two entries keeps the other and a long name wraps', async ({ page }) => {
      await page.getByTestId('add-exercise').click()
      await sheet(page).getByRole('button', { name: /Something else/ }).click()
      await sheet(page).getByLabel('Exercise name').fill('Supercalifragilisticexpialidocious'.repeat(2))
      await sheet(page).getByRole('button', { name: 'Set amounts' }).click()
      await sheet(page).getByRole('button', { name: 'Log set' }).click()
      await rows(page).first().getByRole('button').click()
      const h = (await sheet(page).getByRole('heading').boundingBox())!
      expect(h.x + h.width).toBeLessThanOrEqual(width)
      await sheet(page).getByRole('button', { name: 'Delete entry' }).click()
      await sheet(page).getByRole('button', { name: 'Delete entry' }).click()
      await expect(rows(page)).toHaveCount(1)
      await expect(rows(page).first()).toContainText('Push-up')
      await expect(page.getByRole('listitem', { name: /First set: .* Unlocked/ })).toBeVisible()
      const doc = await page.evaluate(() => document.documentElement.scrollWidth)
      expect(doc).toBeLessThanOrEqual(width)
    })
  })
}

test('a timed entry edits in seconds with its own tape and no timer', async ({ page }) => {
  await page.goto('/?stage=progress')
  await log(page, /Plank/)
  await rows(page).first().getByRole('button').click()
  await expect(sheet(page).getByRole('group', { name: 'Hold time' })).toBeVisible()
  await sheet(page).getByRole('button', { name: 'Increase hold time' }).click()
  await sheet(page).getByRole('button', { name: 'Save changes' }).click()
  await expect(rows(page).first()).toContainText('30 s')
})
