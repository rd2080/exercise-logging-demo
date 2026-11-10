import { expect, test, type Page } from '@playwright/test'

const KEY = 'exercise-demo:entries'
const entry = { id: 'a1', name: 'Push-up', trackingType: 'reps', values: { reps: 13 }, exerciseId: 'push-up', source: 'hand' }

async function seed(page: Page) {
  await page.addInitScript(([k, v]) => localStorage.setItem(k, v), [KEY, JSON.stringify({ v: 1, entries: [entry] })])
}

test('delete confirmation: one decision at a time, safe default focused', async ({ page }) => {
  await seed(page)
  await page.goto('/?stage=progress')
  await page.getByRole('button', { name: /Edit entry/ }).click()
  const sheet = page.getByRole('dialog')
  await sheet.getByRole('button', { name: 'Delete entry' }).click()
  await expect(sheet.getByText('Delete this entry?')).toBeVisible()
  await expect(sheet.getByRole('button', { name: 'Save changes' })).toHaveCount(0)
  await expect(sheet.getByRole('button', { name: 'Keep entry' })).toBeFocused()
  await sheet.getByRole('button', { name: 'Keep entry' }).click()
  await expect(sheet.getByRole('button', { name: 'Save changes' })).toBeVisible()
})

test('tappable rows end in a chevron; read-only history rows do not', async ({ page }) => {
  await seed(page)
  await page.goto('/?stage=progress')
  await expect(page.getByRole('button', { name: /Edit entry/ }).locator('svg')).toHaveCount(2) // slot check + chevron
  await page.goto('/?stage=exercises')
  await expect(page.getByTestId('exercise-open').first().locator('svg')).toHaveCount(2) // thumbnail figure + chevron
  await page.goto('/?stage=exercise&id=push-up')
  await expect(page.getByTestId('history-list').getByRole('listitem').first().locator('svg')).toHaveCount(1) // slot check only
})

test('the log sheet from the detail page has no duplicate figure, tag or Change exercise', async ({ page }) => {
  await page.goto('/?stage=exercise&id=push-up')
  await page.getByRole('button', { name: 'Log a set' }).click()
  const sheet = page.getByRole('dialog')
  await expect(sheet.getByTestId('media-slot')).toHaveCount(0)
  await expect(sheet.getByRole('button', { name: 'Change exercise' })).toHaveCount(0)
  await expect(sheet.getByTestId('manual-cue')).toBeVisible()
  await expect(sheet.getByTestId('manual-note')).toBeVisible()
})

test('keep going returns focus to the X, Escape does the same, and nothing hides behind the footer', async ({ page }) => {
  await page.goto('/?stage=player')
  await page.getByTestId('primary').click() // log one set, rest starts
  await page.getByRole('button', { name: 'End workout' }).first().click()
  const confirm = page.getByTestId('end-confirm')
  await expect(confirm).toBeVisible()
  await confirm.getByRole('button', { name: 'Keep going' }).click()
  await expect(page.getByRole('button', { name: 'End workout' }).first()).toBeFocused()
  await page.getByRole('button', { name: 'End workout' }).first().click()
  await expect(confirm).toBeVisible()
  await page.keyboard.press('Escape')
  await expect(confirm).toHaveCount(0)
  // With the taller footer showing, the content can scroll clear of it.
  await page.getByRole('button', { name: 'End workout' }).first().click()
  await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight))
  const footerTop = (await confirm.boundingBox())!.y
  const lastBottom = await page.evaluate(() => {
    const main = document.querySelector('main')!
    const last = [...main.querySelectorAll('button, p, section')].pop()!
    return last.getBoundingClientRect().bottom
  })
  expect(lastBottom).toBeLessThanOrEqual(footerTop + 1)
})

for (const width of [320, 390]) {
  test(`the rest panel buttons do not wrap or clip at ${width}`, async ({ page }) => {
    await page.setViewportSize({ width, height: 844 })
    await page.goto('/?stage=player')
    await page.getByTestId('primary').click()
    const add = page.getByRole('button', { name: 'Add 15 seconds' })
    const box = (await add.boundingBox())!
    expect(box.height).toBeLessThan(60)
    expect(await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth)).toBe(false)
  })
}
