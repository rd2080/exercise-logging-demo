import { expect, test, type Page } from '@playwright/test'

const count = (page: Page) => page.getByTestId('result-count')
const rows = (page: Page) => page.getByTestId('exercise-list').getByRole('listitem')
const search = (page: Page) => page.getByTestId('search')

async function openFilters(page: Page) {
  await page.getByTestId('open-filters').click()
  await expect(page.getByRole('dialog')).toBeVisible()
}

test.beforeEach(async ({ page }) => {
  await page.goto('/?stage=exercises')
  await expect(page.getByTestId('exercises')).toBeVisible()
})

test('the whole library shows with a count, a search box and a Filters button', async ({ page }) => {
  await expect(count(page)).toHaveText('19 exercises')
  await expect(rows(page)).toHaveCount(19)
  await expect(search(page)).toBeVisible()
  await expect(page.getByTestId('open-filters')).toHaveAccessibleName('Filters')
  await expect(page.getByTestId('filter-badge')).toHaveCount(0)
  await expect(rows(page).first()).toContainText('Bodyweight · Beginner')
  await page.screenshot({ path: 'screenshots/exercises-library.png' })
})

test('search narrows live, ignores case and extra spaces, and matches any word order', async ({ page }) => {
  await search(page).fill('PULL')
  // Pull-up, Chin-up and Hanging knee raise use a pull-up bar, and Band pull-apart has the word too.
  await expect(count(page)).toHaveText('4 of 19 exercises')
  await search(page).fill('  kettlebell   swing ')
  await expect(rows(page)).toHaveCount(1)
  await expect(rows(page).first()).toContainText('Kettlebell swing')
  await search(page).fill('swing kettlebell')
  await expect(rows(page)).toHaveCount(1)
})

test('search also matches the type, equipment and level', async ({ page }) => {
  await search(page).fill('timed hold')
  await expect(count(page)).toHaveText('4 of 19 exercises')
  await search(page).fill('resistance band')
  await expect(rows(page)).toHaveCount(1)
  await search(page).fill('advanced')
  await expect(count(page)).toHaveText('2 of 19 exercises')
})

test('the clear button empties the search and restores the list', async ({ page }) => {
  await search(page).fill('squat')
  await expect(rows(page).first()).toBeVisible()
  await page.getByRole('button', { name: 'Clear search' }).click()
  await expect(search(page)).toHaveValue('')
  await expect(count(page)).toHaveText('19 exercises')
})

test('filters: choices in a group are alternatives, groups narrow each other, the count is live', async ({ page }) => {
  await openFilters(page)
  const sheet = page.getByRole('dialog')
  await expect(sheet.getByRole('button', { name: /Show 19 exercises/ })).toBeVisible()
  await sheet.getByRole('button', { name: 'Reps', exact: true }).click()
  await expect(sheet.getByRole('button', { name: /Show 10 exercises/ })).toBeVisible()
  await sheet.getByRole('button', { name: 'Timed hold' }).click() // reps OR time
  await expect(sheet.getByRole('button', { name: /Show 14 exercises/ })).toBeVisible()
  await sheet.getByRole('button', { name: 'Beginner' }).click() // and beginner
  await expect(sheet.getByRole('button', { name: /Show 6 exercises/ })).toBeVisible()
  await page.screenshot({ path: 'screenshots/exercises-filters.png' })
  await sheet.getByRole('button', { name: /Show 6 exercises/ }).click()
  await expect(count(page)).toHaveText('6 of 19 exercises')
  await expect(rows(page)).toHaveCount(6)
  await expect(page.getByTestId('open-filters')).toHaveAccessibleName('Filters, 3 selected')
  await expect(page.getByTestId('filter-badge')).toHaveText('3')
})

test('Reset clears the filters but keeps the search text', async ({ page }) => {
  await search(page).fill('push')
  await openFilters(page)
  const sheet = page.getByRole('dialog')
  await expect(sheet.getByRole('button', { name: 'Reset' })).toBeDisabled()
  await sheet.getByRole('button', { name: 'Intermediate' }).click()
  await expect(sheet.getByRole('button', { name: 'Reset' })).toBeEnabled()
  await sheet.getByRole('button', { name: 'Reset' }).click()
  await expect(sheet.getByRole('button', { name: 'Intermediate' })).toHaveAttribute('aria-pressed', 'false')
  await expect(search(page)).toHaveValue('push')
})

test('no matches shows the empty state, which can be reset; the sheet button says so too', async ({ page }) => {
  await search(page).fill('zzzz')
  await expect(page.getByRole('heading', { name: 'No exercises match' })).toBeVisible()
  await expect(count(page)).toHaveText('0 of 19 exercises')
  await page.getByRole('button', { name: 'Reset filters' }).click()
  await expect(page.getByRole('heading', { name: 'No exercises match' })).toHaveCount(0)
  await expect(search(page)).toHaveValue('')
  await expect(count(page)).toHaveText('19 exercises')
  // The sheet says so when nothing matches, and the button is disabled.
  await openFilters(page)
  const sheet = page.getByRole('dialog')
  await sheet.getByRole('button', { name: 'Resistance band' }).click()
  await sheet.getByRole('button', { name: 'Advanced' }).click()
  await expect(sheet.getByRole('button', { name: 'No exercises match' })).toBeDisabled()
})

test('chips and controls are at least 48px, labels are sentence case, nothing overflows', async ({ page }) => {
  await openFilters(page)
  const small = await page.getByRole('dialog').evaluate((el) =>
    [...el.querySelectorAll('button')]
      .map((b) => b.getBoundingClientRect())
      .filter((r) => r.width > 0 && (r.height < 48 || r.width < 40)).length,
  )
  expect(small).toBe(0)
  expect(await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth)).toBe(false)
})

test('opening a library exercise without a demo shows a clear note, and logging still works', async ({ page }) => {
  await rows(page).filter({ hasText: 'Pull-up' }).first().getByRole('button').click()
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Pull-up')
  await expect(page.getByTestId('media-slot')).toBeVisible()
  await expect(page.getByTestId('no-demo')).toBeVisible()
  await page.getByTestId('log-set').click()
  await expect(page.getByRole('dialog').getByTestId('manual-note')).toHaveText('Prefilled from today\'s plan')
  await page.getByRole('dialog').getByRole('button', { name: 'Log set' }).click()
  await expect(page.getByTestId('history-list').getByRole('listitem')).toHaveCount(1)
})

for (const width of [320, 390]) {
  test(`worst-case names and the huge list hold up at ${width}`, async ({ page }) => {
    await page.setViewportSize({ width, height: 700 })
    for (const mode of ['worst', 'huge', 'one']) {
      await page.goto(`/?stage=exercises&data=${mode}`)
      await expect(rows(page).first()).toBeVisible()
      expect(await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth), mode).toBe(false)
    }
    await page.goto('/?stage=exercises&data=huge')
    await search(page).fill('squat 7')
    await expect(rows(page).first()).toBeVisible()
    await page.goto('/?stage=exercises&data=empty')
    await expect(page.getByRole('heading', { name: 'No exercises yet' })).toBeVisible()
    await expect(search(page)).toHaveCount(0)
  })
}
