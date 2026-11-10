import { expect, test, type Page } from '@playwright/test'

const KEY = 'exercise-demo:entries'
const sheet = (page: Page) => page.getByRole('dialog')
const rows = (page: Page) => page.getByTestId('entry-list').getByRole('listitem')

async function logPushUp(page: Page) {
  await page.getByTestId('add-exercise').click()
  await sheet(page).getByRole('button', { name: /Push-up/ }).click()
  await sheet(page).getByRole('button', { name: 'Log set' }).click()
  await expect(sheet(page)).toHaveCount(0)
}

test('entries survive a reload, newest first, with the First set goal still unlocked', async ({ page }) => {
  await page.goto('/?stage=progress')
  await logPushUp(page)
  await page.getByTestId('add-exercise').click()
  await sheet(page).getByRole('button', { name: /Plank/ }).click()
  await sheet(page).getByRole('button', { name: 'Increase hold time' }).click()
  await sheet(page).getByRole('button', { name: 'Log set' }).click()
  await expect(rows(page)).toHaveCount(2)

  await page.reload()
  await expect(rows(page)).toHaveCount(2)
  await expect(rows(page).nth(0)).toContainText('Plank')
  await expect(rows(page).nth(0)).toContainText('30 s')
  await expect(rows(page).nth(1)).toContainText('Push-up')
  await expect(page.getByTestId('empty-state')).toHaveCount(0)
  await expect(page.getByRole('listitem', { name: /First set: .* Unlocked, 1 of 1/ })).toBeVisible()
})

test('a reload also keeps the last-entry prefill working', async ({ page }) => {
  await page.goto('/?stage=progress')
  await page.getByTestId('add-exercise').click()
  await sheet(page).getByRole('button', { name: /Push-up/ }).click()
  await sheet(page).getByRole('button', { name: 'Increase reps' }).click()
  await sheet(page).getByRole('button', { name: 'Log set' }).click()
  await page.reload()
  await page.getByTestId('add-exercise').click()
  await sheet(page).getByRole('button', { name: /Push-up/ }).click()
  await expect(sheet(page).getByTestId('manual-note')).toHaveText('Same as your last set')
  await expect(sheet(page).getByTestId('manual-inputs').getByRole('status')).toHaveText('13')
})

test('nothing is saved until you log something, and the saved data has a version', async ({ page }) => {
  await page.goto('/?stage=progress')
  expect(await page.evaluate((k) => localStorage.getItem(k), KEY)).toBeNull()
  await logPushUp(page)
  const saved = JSON.parse((await page.evaluate((k) => localStorage.getItem(k), KEY))!)
  expect(saved.v).toBe(1)
  expect(saved.entries).toHaveLength(1)
  expect(saved.entries[0]).toMatchObject({ name: 'Push-up', trackingType: 'reps', values: { reps: 12 } })
})

test('unreadable, wrong-version or malformed saved data is ignored without crashing', async ({ browser }) => {
  const cases: Record<string, string> = {
    'not json': '{oops',
    'wrong version': JSON.stringify({ v: 99, entries: [] }),
    'entries not a list': JSON.stringify({ v: 1, entries: 'nope' }),
    'null': 'null',
  }
  for (const [label, value] of Object.entries(cases)) {
    const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } })
    const page = await ctx.newPage()
    await page.addInitScript(([k, v]) => localStorage.setItem(k, v), [KEY, value])
    await page.goto('/?stage=progress')
    await expect(page.getByTestId('empty-state'), label).toBeVisible()
    await logPushUp(page)
    await expect(rows(page), label).toHaveCount(1)
    await ctx.close()
  }
})

test('invalid and duplicate saved entries are dropped, valid ones kept', async ({ browser }) => {
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } })
  const page = await ctx.newPage()
  const good = { id: 'a', name: 'Burpees', trackingType: 'reps', values: { reps: 15 } }
  const entries = [
    good,
    { ...good }, // duplicate id
    { id: 'b', name: '', trackingType: 'reps', values: { reps: 5 } }, // empty name
    { id: 'c', name: 'X'.repeat(200), trackingType: 'reps', values: { reps: 5 } }, // too long
    { id: 'd', name: 'Rowing', trackingType: 'swimming', values: { reps: 5 } }, // unknown type
    { id: 'e', name: 'Rowing', trackingType: 'reps', values: { reps: -3 } }, // negative
    { id: 'f', name: 'Rowing', trackingType: 'reps', values: { reps: 'ten' } }, // not a number
    { id: 'g', name: 'Rowing', trackingType: 'reps', values: { evil: 1 } }, // unknown field
    { id: 'h', name: '<img src=x onerror=alert(1)>', trackingType: 'reps', values: { reps: 4 } }, // markup is just text
  ]
  await page.addInitScript(([k, v]) => localStorage.setItem(k, v), [KEY, JSON.stringify({ v: 1, entries })])
  await page.goto('/?stage=progress')
  await expect(rows(page)).toHaveCount(2)
  await expect(rows(page).nth(0)).toContainText('Burpees')
  await expect(rows(page).nth(1)).toContainText('<img src=x onerror=alert(1)>')
  expect(await page.locator('img[src="x"]').count()).toBe(0)
  await ctx.close()
})

test('when the browser refuses to store anything, logging still works for this visit', async ({ browser }) => {
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } })
  const page = await ctx.newPage()
  await page.addInitScript(() => {
    Storage.prototype.getItem = () => {
      throw new Error('blocked')
    }
    Storage.prototype.setItem = () => {
      throw new Error('blocked')
    }
  })
  await page.goto('/?stage=progress')
  await logPushUp(page)
  await expect(rows(page)).toHaveCount(1)
  await ctx.close()
})

test('a change in another tab shows up here', async ({ browser }) => {
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } })
  const a = await ctx.newPage()
  const b = await ctx.newPage()
  await a.goto('/?stage=progress')
  await b.goto('/?stage=progress')
  await logPushUp(b)
  await expect(rows(a)).toHaveCount(1)
  await expect(rows(a).first()).toContainText('Push-up')
  await ctx.close()
})

test('the dev data modes do not break saved entries', async ({ page }) => {
  await page.goto('/?stage=progress')
  await logPushUp(page)
  for (const mode of ['worst', 'empty', 'huge', 'one']) {
    await page.goto(`/?stage=progress&data=${mode}`)
    await expect(rows(page), mode).toHaveCount(1)
  }
})
