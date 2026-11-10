import { expect, test, type Page } from '@playwright/test'

const primary = (page: Page) => page.getByTestId('primary')

async function open(page: Page) {
  await page.goto('/?stage=player')
  await expect(page.getByTestId('player')).toBeVisible()
}

/** Logs every set of the current exercise, skipping rests, then moves on. */
async function finishExercise(page: Page, sets: number) {
  for (let i = 0; i < sets; i++) {
    await primary(page).click()
    if ((await primary(page).innerText()) === 'Skip rest') await primary(page).click()
  }
  await primary(page).click()
}

test('name and one form cue sit above the inputs', async ({ page }) => {
  await open(page)
  const name = await page.getByRole('heading', { level: 1 }).boundingBox()
  const cue = await page.getByTestId('form-cue').boundingBox()
  const inputs = await page.getByTestId('inputs').boundingBox()
  expect(name!.y).toBeLessThan(cue!.y)
  expect(cue!.y + cue!.height).toBeLessThanOrEqual(inputs!.y)
  await expect(page.getByTestId('form-cue')).not.toBeEmpty()
})

test('the media slot is present on every exercise', async ({ page }) => {
  await open(page)
  const counts = [3, 3, 2]
  for (const sets of counts) {
    await expect(page.getByTestId('media-slot')).toBeVisible()
    await finishExercise(page, sets)
  }
  await expect(page.getByTestId('media-slot')).toBeVisible()
})

test('logging a set is one tap, prefilled from the last session', async ({ page }) => {
  await open(page)
  await expect(page.getByTestId('prefill-note')).toHaveText("Prefilled from your last session")
  await expect(page.getByTestId('inputs').getByRole('status')).toHaveText('12')
  await primary(page).click()
  await expect(page.getByLabel('Set 1: 12')).toBeVisible()
  await expect(page.getByTestId('rest')).toBeVisible()
})

test('a first-time exercise prefills from the plan', async ({ page }) => {
  await open(page)
  await finishExercise(page, 3)
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Reverse lunge')
  await expect(page.getByTestId('prefill-note')).toHaveText("Prefilled from today's plan")
  await primary(page).click()
  await expect(page.getByLabel('Set 1: 8 / 8')).toBeVisible()
})

test('no work timer for reps or reps per side', async ({ page }) => {
  await open(page)
  await expect(page.getByTestId('timer')).toHaveCount(0)
  await finishExercise(page, 3)
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Reverse lunge')
  await expect(page.getByTestId('timer')).toHaveCount(0)
  await expect(page.getByRole('button', { name: /second hold/ })).toHaveCount(0)
})

test('a timed hold leads in, counts down, and returns to logging', async ({ page }) => {
  await page.clock.install()
  await open(page)
  await finishExercise(page, 3)
  await finishExercise(page, 3)
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Plank')
  await page.getByRole('button', { name: /second hold/ }).click()
  await expect(page.getByRole('heading', { name: 'Get into position' })).toBeVisible()
  await page.clock.fastForward(3500)
  await expect(page.getByTestId('hold').getByRole('heading', { name: 'Hold' })).toBeVisible()
  await page.clock.fastForward(30000)
  await expect(page.getByTestId('inputs')).toBeVisible()
  await expect(page.getByTestId('prefill-note')).toHaveText('Taken from your timed hold')
})

test('button labels name the result in sentence case', async ({ page }) => {
  await open(page)
  const labels: string[] = []
  for (let i = 0; i < 9; i++) {
    labels.push(await primary(page).innerText())
    await primary(page).click()
  }
  for (const label of labels) {
    expect(label).toMatch(/^[A-Z][a-z]/)
    expect(label).not.toMatch(/^(Submit|Next|OK|Continue)$/)
    expect(label).not.toBe(label.toUpperCase())
  }
  expect(labels).toContain('Log set')
  expect(labels).toContain('Skip rest')
})

test('every control is at least 48px and nothing overflows sideways', async ({ page }) => {
  await open(page)
  for (let i = 0; i < 4; i++) {
    const small = await page.evaluate(() =>
      [...document.querySelectorAll('button:not([data-testid=data-toggle] button)')]
        .map((b) => b.getBoundingClientRect())
        .filter((r) => r.width < 48 || r.height < 48).length,
    )
    expect(small).toBe(0)
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth > window.innerWidth,
    )
    expect(overflow).toBe(false)
    await page.screenshot({ path: `screenshots/exercise-${i + 1}.png` })
    await finishExercise(page, [3, 3, 2, 3][i])
  }
})

test('reduced motion shows start and end frames instead of the loop', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await open(page)
  const slot = page.getByTestId('media-slot')
  await expect(slot.getByText('Start')).toBeVisible()
  await expect(slot.getByText('Bottom')).toBeVisible()
})

test('the workout ends on a summary of what was logged', async ({ page }) => {
  await open(page)
  for (const sets of [3, 3, 2, 3]) await finishExercise(page, sets)
  await expect(page.getByTestId('summary')).toBeVisible()
  await expect(page.getByText('11 sets across 4 exercises.')).toBeVisible()
})

for (const height of [667, 844]) {
  test(`the logged value and its source note stay above the button at 390x${height}`, async ({ page }) => {
    await page.setViewportSize({ width: 390, height })
    await open(page)
    for (const sets of [3, 3, 2, 3]) {
      const button = await primary(page).boundingBox()
      const note = await page.getByTestId('prefill-note').boundingBox()
      const slots = await page.getByTestId('set-slots').boundingBox()
      expect(note!.y + note!.height).toBeLessThanOrEqual(button!.y - 4)
      expect(slots!.y + slots!.height).toBeLessThanOrEqual(button!.y)
      await finishExercise(page, sets)
    }
  })
}

test('starting from Today runs a skippable 5-4-3-2-1 get-ready countdown, then the first set', async ({ page }) => {
  await page.goto('/?stage=today')
  await page.getByTestId('start-workout').click()
  const ready = page.getByTestId('ready')
  await expect(ready).toBeVisible()
  await expect(ready.getByTestId('timer')).toHaveText(/^[1-5]$/)
  await expect(page.getByTestId('inputs')).toHaveCount(0)
  await expect(page.getByTestId('primary')).toHaveText('Skip countdown')
  await expect(page.getByTestId('inputs')).toBeVisible({ timeout: 8000 })
  await expect(page.getByTestId('primary')).toHaveText('Log set')
})

test('skipping the countdown goes straight to logging, and opening the player by address has none', async ({ page }) => {
  await page.goto('/?stage=today')
  await page.getByTestId('start-workout').click()
  await page.getByTestId('primary').click()
  await expect(page.getByTestId('inputs')).toBeVisible()
  await page.goto('/?stage=player')
  await expect(page.getByTestId('ready')).toHaveCount(0)
  await expect(page.getByTestId('inputs')).toBeVisible()
})
