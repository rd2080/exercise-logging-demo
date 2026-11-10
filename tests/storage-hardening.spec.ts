import { expect, test, type Page } from '@playwright/test'

const KEY = 'exercise-demo:entries'
const rows = (page: Page) => page.getByTestId('entry-list').getByRole('listitem')

async function seed(page: Page, entries: unknown[]) {
  await page.addInitScript(
    ([k, v]) => {
      if (!sessionStorage.getItem('seeded')) {
        localStorage.setItem(k, v)
        sessionStorage.setItem('seeded', '1')
      }
    },
    [KEY, JSON.stringify({ v: 1, entries })],
  )
}

async function logPushUp(page: Page) {
  await page.getByTestId('add-exercise').click()
  await page.getByRole('dialog').getByRole('button', { name: /Push-up/ }).click()
  await page.getByRole('dialog').getByRole('button', { name: 'Log set' }).click()
  await expect(page.getByRole('dialog')).toHaveCount(0)
}

test('values must match the tracking type, whole numbers and the stepper limits', async ({ page }) => {
  const e = (id: string, trackingType: string, values: unknown, extra: object = {}) => ({
    id,
    name: `Ex ${id}`,
    trackingType,
    values,
    ...extra,
  })
  await seed(page, [
    e('ok1', 'reps', { reps: 99 }),
    e('ok2', 'reps_per_side', { left: 0, right: 99 }),
    e('ok3', 'time', { seconds: 300 }),
    e('ok4', 'weight_reps', { kg: 22.5, reps: 5 }),
    e('b1', 'reps', {}),
    e('b2', 'reps', { reps: 100 }),
    e('b3', 'reps', { reps: 1.5 }),
    e('b4', 'reps', { reps: 5, kg: 5 }),
    e('b5', 'reps_per_side', { left: 3 }),
    e('b6', 'time', { seconds: 301 }),
    e('b7', 'time', { seconds: 10.5 }),
    e('b8', 'weight_reps', { kg: 301, reps: 5 }),
    e('b9', 'weight_reps', { kg: 20.25, reps: 5 }),
    e('b10', 'weight_reps', { reps: 5 }),
    e('b11', 'reps', { reps: 5 }, { exerciseId: 'x'.repeat(81) }),
    e('ok5', 'reps', { reps: 5 }, { exerciseId: 'x'.repeat(80) }),
  ])
  await page.goto('/?stage=progress')
  await expect(rows(page)).toHaveCount(5)
  for (const id of ['ok1', 'ok2', 'ok3', 'ok4', 'ok5']) {
    await expect(page.getByTestId('entry-list')).toContainText(`Ex ${id}`)
  }
})

test('control and bidi characters are stripped from names; empty names are dropped', async ({ page }) => {
  await seed(page, [
    { id: 'a', name: 'Pu\u0007sh‮-up⁦', trackingType: 'reps', values: { reps: 3 } },
    { id: 'b', name: '‮\u0001 ⁩', trackingType: 'reps', values: { reps: 3 } },
  ])
  await page.goto('/?stage=progress')
  await expect(rows(page)).toHaveCount(1)
  await expect(rows(page).first()).toContainText('Push-up')
  expect(await rows(page).first().innerText()).not.toMatch(/[‪-‮⁦-⁩\u0007]/)
})

test('a failed save shows a muted note only when there are entries', async ({ browser }) => {
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } })
  const page = await ctx.newPage()
  await page.addInitScript(() => {
    Storage.prototype.setItem = () => {
      throw new Error('full')
    }
  })
  await page.goto('/?stage=progress')
  await expect(page.getByTestId('save-failed')).toHaveCount(0)
  await logPushUp(page)
  await expect(page.getByTestId('save-failed')).toHaveText(
    'Not saved on this device. Your entries will be lost when you close this page.',
  )
  await ctx.close()
})

test('no note when saving works', async ({ page }) => {
  await page.goto('/?stage=progress')
  await logPushUp(page)
  await expect(rows(page)).toHaveCount(1)
  await expect(page.getByTestId('save-failed')).toHaveCount(0)
})

test('a clear() in another tab does not write an empty list back', async ({ browser }) => {
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } })
  const a = await ctx.newPage()
  const b = await ctx.newPage()
  await a.goto('/?stage=progress')
  await logPushUp(a)
  await expect(rows(a)).toHaveCount(1)
  await b.goto('/?stage=progress')
  await expect(rows(b)).toHaveCount(1)
  await b.evaluate(() => localStorage.clear())
  await a.waitForTimeout(300)
  await expect(rows(a)).toHaveCount(1)
  expect(await a.evaluate((k) => localStorage.getItem(k), KEY)).toBeNull()
  await ctx.close()
})

test('entries get distinct ids without crypto.randomUUID', async ({ browser }) => {
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } })
  const page = await ctx.newPage()
  await page.addInitScript(() => {
    Object.defineProperty(Crypto.prototype, 'randomUUID', { value: undefined, configurable: true })
  })
  await page.goto('/?stage=progress')
  await logPushUp(page)
  await logPushUp(page)
  const saved = JSON.parse((await page.evaluate((k) => localStorage.getItem(k), KEY))!)
  const ids = (saved.entries as { id: string }[]).map((x) => x.id)
  expect(ids).toHaveLength(2)
  expect(new Set(ids).size).toBe(2)
  expect(ids[0]).toMatch(/^[0-9a-f]{32}$/)
  await ctx.close()
})

test('the stepper readout has an accessible name', async ({ page }) => {
  await page.goto('/?stage=progress')
  await page.getByTestId('add-exercise').click()
  await page.getByRole('dialog').getByRole('button', { name: /Push-up/ }).click()
  await expect(page.getByRole('dialog').getByRole('status', { name: 'Reps' })).toHaveText('12')
})
