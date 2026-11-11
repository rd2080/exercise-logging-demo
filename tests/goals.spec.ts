import { expect, test } from '@playwright/test'

const DAY = new Date(2026, 10, 11, 10, 0, 0).getTime()
const ENT = 'exercise-demo:entries'

// The fixture session: Push-up 3 x 10 reps, Reverse lunge 3 x 8 per side, Plank 2 x 30 s, Goblet squat 3 x 10 at 12 kg.
const PLAN = [
  ['push-up', 'Push-up', 'reps', 3, { reps: 10 }],
  ['reverse-lunge', 'Reverse lunge', 'reps_per_side', 3, { left: 8, right: 8 }],
  ['plank', 'Plank', 'time', 2, { seconds: 30 }],
  ['goblet-squat', 'Goblet squat', 'weight_reps', 3, { kg: 12, reps: 10 }],
] as const

function session(at: number, fullTarget: boolean, skipLast = false) {
  const list: unknown[] = []
  let n = 0
  for (const [id, name, type, sets, target] of PLAN) {
    const count = skipLast && id === 'goblet-squat' ? sets - 1 : sets
    for (let i = 0; i < count; i++) {
      const values = fullTarget ? { ...target } : Object.fromEntries(Object.entries(target).map(([k, v]) => [k, (v as number) - 1]))
      list.push({ id: `${id}-${at}-${n++}`, name, trackingType: type, values, exerciseId: id, at: at + n * 1000, source: 'workout' })
    }
  }
  return list
}

async function seed(page: import('@playwright/test').Page, entries: unknown[], now = DAY + 3600_000) {
  await page.clock.setFixedTime(new Date(now))
  await page.addInitScript(([k, e]) => {
    if (sessionStorage.getItem('seeded')) return
    sessionStorage.setItem('seeded', '1')
    localStorage.setItem(k as string, JSON.stringify({ v: 1, entries: e }))
  }, [ENT, entries])
}

const state = (page: import('@playwright/test').Page, title: string) =>
  page.getByTestId('goal-list').getByRole('listitem').filter({ hasText: title })

test('logging every set of every exercise unlocks Full session, and Hit the plan when the targets were met', async ({ page }) => {
  await seed(page, session(DAY, true))
  await page.goto('/?stage=achievements')
  await expect(state(page, 'First set')).toHaveAttribute('aria-label', /Unlocked/)
  await expect(state(page, 'Full session')).toHaveAttribute('aria-label', /Unlocked, 1 of 1/)
  await expect(state(page, 'Hit the plan')).toHaveAttribute('aria-label', /Unlocked, 1 of 1/)
  await expect(state(page, 'Week one')).toHaveAttribute('aria-label', /Locked, 1 of 3/)
})

test('a session that missed some targets unlocks Full session but not Hit the plan', async ({ page }) => {
  await seed(page, session(DAY, false))
  await page.goto('/?stage=achievements')
  await expect(state(page, 'Full session')).toHaveAttribute('aria-label', /Unlocked/)
  await expect(state(page, 'Hit the plan')).toHaveAttribute('aria-label', /Locked/)
})

test('one set short of the whole session leaves Full session locked', async ({ page }) => {
  await seed(page, session(DAY, true, true))
  await page.goto('/?stage=achievements')
  await expect(state(page, 'First set')).toHaveAttribute('aria-label', /Unlocked/)
  await expect(state(page, 'Full session')).toHaveAttribute('aria-label', /Locked/)
})

test('sets logged by hand do not count toward a full session', async ({ page }) => {
  const hand = session(DAY, true).map((e) => ({ ...(e as object), source: 'hand' }))
  await seed(page, hand)
  await page.goto('/?stage=achievements')
  await expect(state(page, 'Full session')).toHaveAttribute('aria-label', /Locked/)
  await expect(state(page, 'Week one')).toHaveAttribute('aria-label', /Locked, 0 of 3/)
})

test('three sessions on different days in the first week unlock Week one', async ({ page }) => {
  const day = 24 * 3600_000
  await seed(page, [...session(DAY, true), ...session(DAY + day, true), ...session(DAY + 2 * day, true)], DAY + 3 * day)
  await page.goto('/?stage=achievements')
  await expect(state(page, 'Week one')).toHaveAttribute('aria-label', /Unlocked, 3 of 3/)
})
