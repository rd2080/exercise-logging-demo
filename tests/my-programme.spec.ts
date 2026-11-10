import { expect, test, type Page } from '@playwright/test'

const PROG = 'exercise-demo:programme'
const ENT = 'exercise-demo:entries'
// Wednesday 11 November 2026, 10:00 local time. The programme started on Monday 9 November.
const NOW = new Date(2026, 10, 11, 10, 0, 0)
const MON = new Date(2026, 10, 9, 9, 0, 0).getTime()
const at = (day: number, h = 11) => new Date(2026, 10, day, h, 0, 0).getTime()

function entry(id: string, when: number, source: 'workout' | 'hand' | null = 'workout') {
  return { id, name: 'Push-up', trackingType: 'reps', values: { reps: 10 }, exerciseId: 'push-up', at: when, ...(source ? { source } : {}) }
}

async function setup(page: Page, opts: { programme?: string | null; startedAt?: number; entries?: unknown[]; now?: Date } = {}) {
  await page.clock.setFixedTime(opts.now ?? NOW)
  const programme = opts.programme === undefined ? 'foundation' : opts.programme
  await page.addInitScript(
    ([pk, ek, prog, started, ents]) => {
      // Seed once per tab, so a reload keeps what the app saved in between.
      if (sessionStorage.getItem('seeded')) return
      sessionStorage.setItem('seeded', '1')
      if (prog) localStorage.setItem(pk as string, JSON.stringify({ v: 1, id: prog, startedAt: started }))
      localStorage.setItem(ek as string, JSON.stringify({ v: 1, entries: ents }))
    },
    [PROG, ENT, programme, opts.startedAt ?? MON, opts.entries ?? []],
  )
}

const dots = (page: Page) => page.getByTestId('week-dots').getByRole('listitem')

test('Today shows your programme and week, and opens the programme page with Today still marked', async ({ page }) => {
  await setup(page)
  await page.goto('/?stage=today')
  const row = page.getByTestId('programme-row')
  await expect(row).toContainText('Foundation strength')
  await expect(row).toContainText('Week 1 of 4')
  await expect(row).not.toContainText('Your programme')
  await row.click()
  await expect(page.getByTestId('my-programme')).toBeVisible()
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Foundation strength')
  await expect(page.getByTestId('programme-status')).toHaveText('Week 1 of 4 · Stage 1: Lace up')
  await expect(page.getByTestId('tab-bar').getByRole('button', { name: 'Today' })).toHaveAttribute('aria-current', 'page')
  await page.getByTestId('programme-back').click()
  await expect(page.getByTestId('today')).toBeVisible()
})

test('without a chosen programme, the Today row says so and leads to set up', async ({ page }) => {
  await setup(page, { programme: null })
  await page.goto('/?stage=today')
  await expect(page.getByTestId('programme-row')).toContainText('Choose a programme')
  await expect(page.getByTestId('programme-row')).toContainText('Weeks, stages and training days')
  await page.getByTestId('programme-row').click()
  await expect(page.getByTestId('setup')).toBeVisible()
  await page.goto('/?stage=myprogramme')
  await expect(page.getByRole('heading', { name: 'No programme yet' })).toBeVisible()
})

test('stats, stages and what you need come from the programme', async ({ page }) => {
  await setup(page)
  await page.goto('/?stage=myprogramme')
  const stats = page.getByTestId('stats')
  await expect(stats).toContainText('4')
  await expect(stats).toContainText('weeks')
  await expect(stats).toContainText('3')
  await expect(stats).toContainText('sessions a week')
  await expect(stats).toContainText('Beginner')
  const stages = page.getByTestId('stage-list').getByRole('listitem')
  await expect(stages).toHaveCount(2)
  await expect(stages.nth(0)).toContainText('Stage 1: Lace up')
  await expect(stages.nth(0)).toContainText('Weeks 1 to 2')
  await expect(stages.nth(0)).toContainText('Current stage')
  await expect(stages.nth(1)).toContainText('Stage 2: Build')
  await expect(stages.nth(1)).not.toContainText('Current stage')
  await expect(page.getByText('Bodyweight only')).toBeVisible()
  await expect(page.getByRole('list', { name: 'Focus' }).getByRole('listitem')).toHaveText(['Strength', 'Bodyweight'])
  await page.screenshot({ path: 'screenshots/programme-page.png', fullPage: true })
})

test('weekly dots: planned days outlined, done days laid in tape, today marked', async ({ page }) => {
  await setup(page, { entries: [entry('a', at(9))] }) // Monday workout
  await page.goto('/?stage=myprogramme')
  await expect(dots(page)).toHaveCount(7)
  await expect(dots(page).nth(0)).toHaveAttribute('data-state', 'done')
  await expect(dots(page).nth(0)).toHaveAccessibleName('Monday: workout done')
  await expect(dots(page).nth(2)).toHaveAttribute('data-state', 'planned')
  await expect(dots(page).nth(2)).toHaveAccessibleName('Wednesday, today: workout planned')
  await expect(dots(page).nth(2)).toHaveAttribute('data-today', 'true')
  await expect(dots(page).nth(4)).toHaveAttribute('data-state', 'planned')
  await expect(dots(page).nth(1)).toHaveAttribute('data-state', 'rest')
  await expect(page.getByTestId('week-summary')).toHaveText('1 of 3 sessions this week')
  await expect(page.getByTestId('overall')).toHaveText('1 of 12 sessions done')
  await page.screenshot({ path: 'screenshots/programme-dots.png' })
})

test('a planned day that passed without a workout looks different from one still to come', async ({ page }) => {
  await setup(page, { now: new Date(2026, 10, 13, 10, 0, 0), entries: [entry('a', at(9))] }) // Friday, only Monday done
  await page.goto('/?stage=myprogramme')
  await expect(dots(page).nth(0)).toHaveAttribute('data-state', 'done')
  await expect(dots(page).nth(2)).toHaveAttribute('data-state', 'missed') // Wednesday passed
  await expect(dots(page).nth(2)).toHaveAccessibleName('Wednesday: planned, no workout logged')
  await expect(dots(page).nth(4)).toHaveAttribute('data-state', 'planned') // Friday is today
  await expect(dots(page).nth(4)).toHaveAttribute('data-today', 'true')
})

test('the today marker is visible even when today is done', async ({ page }) => {
  await setup(page, { entries: [entry('a', at(11, 9))] }) // today, Wednesday
  await page.goto('/?stage=myprogramme')
  const li = dots(page).nth(2)
  await expect(li).toHaveAttribute('data-state', 'done')
  const marker = li.locator('span').last()
  const slot = li.locator('span').first()
  const m = (await marker.boundingBox())!
  const sl = (await slot.boundingBox())!
  expect(m.y).toBeGreaterThanOrEqual(sl.y + sl.height) // below the slot, not on top of it
  expect(m.height).toBeGreaterThanOrEqual(3)
})

test('only finished-workout days count: hand-logged sets, undated sets and sets before the start are ignored', async ({ page }) => {
  await setup(page, {
    entries: [
      entry('hand', at(10), 'hand'),
      entry('legacy', at(10), null),
      { ...entry('nodate', at(10)), at: undefined },
      entry('before', new Date(2026, 10, 8, 20, 0, 0).getTime()), // Sunday before the start
      entry('same-day-1', at(9, 11)),
      entry('same-day-2', at(9, 18)), // second set on the same day is still one session
    ],
  })
  await page.goto('/?stage=myprogramme')
  await expect(page.getByTestId('overall')).toHaveText('1 of 12 sessions done')
  await expect(page.getByTestId('week-summary')).toHaveText('1 of 3 sessions this week')
})

test('stage progress fills in order and the current stage moves with the week', async ({ page }) => {
  // Week 3 (Monday 23 November), three sessions done in stage 1's six.
  const start = new Date(2026, 10, 9, 9, 0, 0).getTime()
  await setup(page, {
    now: new Date(2026, 10, 25, 10, 0, 0),
    startedAt: start,
    entries: [entry('a', at(9)), entry('b', at(11)), entry('c', at(13))],
  })
  await page.goto('/?stage=myprogramme')
  // The current stage is the one with sessions still to do, so the label and the strips agree.
  await expect(page.getByTestId('programme-status')).toHaveText('Week 3 of 4 · Stage 1: Lace up')
  const stages = page.getByTestId('stage-list').getByRole('listitem')
  await expect(stages.nth(0)).toContainText('3 of 6')
  await expect(stages.nth(0)).toContainText('Current stage')
  await expect(stages.nth(1)).toContainText('0 of 6')
  await expect(stages.nth(1)).not.toContainText('Current stage')
})

test('once a stage is full the next one becomes current', async ({ page }) => {
  const start = new Date(2026, 10, 9, 9, 0, 0).getTime()
  const days = [9, 10, 11, 12, 13, 14] // six sessions fill stage 1
  await setup(page, { now: new Date(2026, 10, 16, 10, 0, 0), startedAt: start, entries: days.map((d) => entry(`e${d}`, at(d))) })
  await page.goto('/?stage=myprogramme')
  await expect(page.getByTestId('programme-status')).toHaveText('Week 2 of 4 · Stage 2: Build')
  const stages = page.getByTestId('stage-list').getByRole('listitem')
  await expect(stages.nth(0)).toContainText('6 of 6')
  await expect(stages.nth(1)).toContainText('Current stage')
})

test('a finished programme says so', async ({ page }) => {
  await setup(page, { now: new Date(2026, 11, 20, 10, 0, 0) }) // seven weeks in
  await page.goto('/?stage=myprogramme')
  await expect(page.getByTestId('programme-status')).toHaveText('Programme finished')
  await expect(page.getByTestId('stage-list').getByText('Current stage')).toHaveCount(0)
  await page.goto('/?stage=today')
  await expect(page.getByTestId('programme-row')).toContainText('Programme finished')
})

test('finishing a workout lights today in the weekly dots', async ({ page }) => {
  await setup(page)
  await page.goto('/?stage=myprogramme')
  await expect(dots(page).nth(2)).toHaveAttribute('data-state', 'planned')
  await page.getByTestId('programme-start').click()
  await expect(page.getByTestId('player')).toBeVisible()
  await page.getByTestId('primary').click() // skip the get-ready countdown
  await page.getByTestId('primary').click() // log one set
  await page.getByRole('button', { name: 'End workout' }).first().click()
  await page.getByTestId('end-confirm').getByRole('button', { name: 'End workout' }).click()
  await page.getByRole('button', { name: 'Back to today' }).click()
  await page.getByTestId('programme-row').click()
  await expect(dots(page).nth(2)).toHaveAttribute('data-state', 'done')
  await expect(page.getByTestId('week-summary')).toHaveText('1 of 3 sessions this week')
  await page.goto('/?stage=myprogramme')
  await expect(dots(page).nth(2)).toHaveAttribute('data-state', 'done') // saved with a date
})

test('choosing a programme in set up saves it and starts it now', async ({ page }) => {
  await page.clock.setFixedTime(NOW)
  await page.goto('/')
  await page.getByRole('button', { name: /^Goals/ }).click()
  await page.getByRole('checkbox', { name: 'Improve fitness' }).click()
  await page.getByRole('button', { name: 'Save goals' }).click()
  await page.getByRole('button', { name: /^Activity level/ }).click()
  await page.getByRole('radio', { name: /Very active/ }).click()
  await page.getByRole('button', { name: /^Equipment/ }).click()
  await page.getByRole('checkbox', { name: /None, bodyweight only/ }).click()
  await page.getByRole('button', { name: 'Save equipment' }).click()
  await page.getByTestId('create-plan').click()
  await page.getByTestId('start-programme').click() // handstand is recommended for very active
  await page.getByRole('button', { name: 'Not now' }).click()
  const saved = JSON.parse((await page.evaluate((k) => localStorage.getItem(k), PROG))!)
  expect(saved).toMatchObject({ v: 1, id: 'handstand' })
  expect(saved.startedAt).toBe(NOW.getTime())
  await page.getByTestId('tab-bar').getByRole('button', { name: 'Today' }).click()
  await expect(page.getByTestId('programme-row')).toContainText('Handstand push-up')
  await page.goto('/?stage=today')
  await expect(page.getByTestId('programme-row')).toContainText('Week 1 of 8')
})

test('Choose a different programme goes to set up', async ({ page }) => {
  await setup(page)
  await page.goto('/?stage=myprogramme')
  await page.getByTestId('programme-change').click()
  await expect(page.getByTestId('setup')).toBeVisible()
})

test('an unreadable or unknown saved programme is ignored', async ({ browser }) => {
  for (const value of ['{oops', JSON.stringify({ v: 1, id: 'nope', startedAt: NOW.getTime() }), JSON.stringify({ v: 1, id: 'foundation', startedAt: 'soon' })]) {
    const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } })
    const page = await ctx.newPage()
    await page.addInitScript(([k, v]) => localStorage.setItem(k, v), [PROG, value])
    await page.goto('/?stage=today')
    await expect(page.getByTestId('programme-row')).toContainText('Choose a programme')
    await ctx.close()
  }
})

test('controls are at least 48px', async ({ page }) => {
  await setup(page)
  await page.goto('/?stage=myprogramme')
  const small = await page.evaluate(() =>
    [...document.querySelectorAll('main button')]
      .map((b) => b.getBoundingClientRect())
      .filter((r) => r.height < 48 || r.width < 48).length,
  )
  expect(small).toBe(0)
})

for (const width of [320, 390]) {
  test(`worst-case programmes and a full month of workouts hold up at ${width}`, async ({ page }) => {
    await page.setViewportSize({ width, height: 700 })
    const days = [9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30]
    await setup(page, { entries: days.map((d) => entry(`e${d}`, at(d))), now: new Date(2026, 10, 30, 10, 0, 0) })
    for (const mode of ['worst', 'demo']) {
      await page.goto(`/?stage=myprogramme&data=${mode}`)
      await expect(page.getByTestId('my-programme')).toBeVisible()
      expect(await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth), mode).toBe(false)
      await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight))
      const barTop = (await page.getByTestId('tab-bar').boundingBox())!.y
      const last = await page.evaluate(() => {
        const items = [...document.querySelectorAll('main button, main li, main p')]
        return items[items.length - 1].getBoundingClientRect().bottom
      })
      expect(last, mode).toBeLessThanOrEqual(barTop)
    }
    await page.goto('/?stage=today&data=worst')
    expect(await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth)).toBe(false)
  })
}

test('the streak counts weeks in a row with a session, and a quiet week so far does not break it', async ({ page }) => {
  // Programme started 26 Oct; sessions in weeks of 26 Oct, 2 Nov. This week (9 Nov) has none yet.
  await setup(page, { startedAt: new Date(2026, 9, 26, 9).getTime(), entries: [entry('a', new Date(2026, 9, 27, 11).getTime()), entry('b', new Date(2026, 10, 3, 11).getTime())] })
  await page.goto('/?stage=myprogramme')
  await expect(page.getByTestId('streak')).toContainText('2 weeks in a row')
  await page.getByTestId('programme-back').click()
})

test('no sessions means no streak, with a way to start one', async ({ page }) => {
  await setup(page)
  await page.goto('/?stage=myprogramme')
  await expect(page.getByTestId('streak')).toContainText('No streak yet')
})

test('a missed week resets the streak', async ({ page }) => {
  await setup(page, { startedAt: new Date(2026, 9, 19, 9).getTime(), entries: [entry('a', new Date(2026, 9, 20, 11).getTime()), entry('b', at(10))] })
  await page.goto('/?stage=myprogramme')
  await expect(page.getByTestId('streak')).toContainText('1 week in a row')
})

test('moving to the next stage asks first, credits the rest of the stage and survives a reload', async ({ page }) => {
  await setup(page)
  await page.goto('/?stage=myprogramme')
  await expect(page.getByTestId('programme-status')).toContainText('Stage 1: Lace up')
  await page.getByTestId('advance').click()
  await expect(page.getByRole('dialog')).toContainText('cannot be undone')
  await page.getByRole('button', { name: 'Cancel' }).click()
  await expect(page.getByTestId('programme-status')).toContainText('Stage 1: Lace up')
  await page.getByTestId('advance').click()
  await page.getByRole('button', { name: 'Switch to stage 2' }).click()
  await expect(page.getByTestId('programme-status')).toContainText('Stage 2')
  await page.reload()
  await expect(page.getByTestId('programme-status')).toContainText('Stage 2')
  const saved = await page.evaluate(() => JSON.parse(localStorage.getItem('exercise-demo:programme')!))
  expect(saved.skipped).toBeGreaterThan(0)
})

test('the last stage offers no move on', async ({ page }) => {
  await setup(page, { entries: [] })
  await page.addInitScript(() => localStorage.setItem('exercise-demo:programme', JSON.stringify({ v: 1, id: 'foundation', startedAt: Date.now(), skipped: 1000 })))
  await page.goto('/?stage=myprogramme')
  await expect(page.getByTestId('advance')).toHaveCount(0)
})

test('restarting the programme asks first, then starts week 1 again and keeps the logged sets', async ({ page }) => {
  await setup(page, { entries: [entry('a', at(10))] })
  await page.goto('/?stage=myprogramme')
  await expect(page.getByTestId('overall')).toContainText('1 of')
  await page.getByTestId('programme-restart').click()
  await page.getByRole('button', { name: 'Cancel' }).click()
  await expect(page.getByTestId('overall')).toContainText('1 of')
  await page.getByTestId('programme-restart').click()
  await page.getByRole('dialog').getByRole('button', { name: 'Restart programme' }).click()
  await expect(page.getByTestId('overall')).toContainText('0 of')
  await page.reload()
  await expect(page.getByTestId('overall')).toContainText('0 of')
  const ents = await page.evaluate(() => JSON.parse(localStorage.getItem('exercise-demo:entries')!).entries.length)
  expect(ents).toBe(1)
})

test('clearing all entries asks first and empties the list for good', async ({ page }) => {
  await setup(page, { entries: [entry('a', at(10)), entry('b', at(9))] })
  await page.goto('/?stage=progress')
  await page.getByTestId('clear-entries').click()
  await expect(page.getByRole('dialog')).toContainText('2 logged sets')
  await page.getByRole('button', { name: 'Cancel' }).click()
  await expect(page.getByTestId('clear-entries')).toBeVisible()
  await page.getByTestId('clear-entries').click()
  await page.getByRole('dialog').getByRole('button', { name: 'Clear all entries' }).click()
  await expect(page.getByTestId('clear-entries')).toHaveCount(0)
  await page.reload()
  await expect(page.getByTestId('clear-entries')).toHaveCount(0)
})

test('a double tap on a destructive trigger cannot confirm it, and focus moves into and back out of the sheet', async ({ page }) => {
  await setup(page, { entries: [entry('a', at(10)), entry('b', at(9))] })
  await page.goto('/?stage=progress')
  const trigger = page.getByTestId('clear-entries')
  await trigger.click()
  const dialog = page.getByRole('dialog')
  await expect(dialog).toBeVisible()
  // Cancel is the filled, focused choice. The action is outlined and ignores taps at first.
  await expect(dialog.getByRole('button', { name: 'Cancel' })).toBeFocused()
  await expect(dialog.getByRole('button', { name: 'Clear all entries' })).toBeDisabled()
  await page.waitForTimeout(800)
  await expect(dialog.getByRole('button', { name: 'Clear all entries' })).toBeEnabled()
  await dialog.getByRole('button', { name: 'Cancel' }).click()
  await expect(dialog).toHaveCount(0)
  await expect(trigger).toBeFocused()
  const kept = await page.evaluate(() => JSON.parse(localStorage.getItem('exercise-demo:entries')!).entries.length)
  expect(kept).toBe(2)
})

test('Today facts keep the sentence in the body face and only the number in the numeral face', async ({ page }) => {
  await page.goto('/?stage=today')
  const p = page.getByTestId('session-facts')
  const fam = await p.evaluate((e) => getComputedStyle(e).fontFamily)
  const num = await p.locator('.num').evaluate((e) => getComputedStyle(e).fontFamily)
  expect(fam).not.toBe(num)
})
