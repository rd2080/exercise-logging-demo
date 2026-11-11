import { expect, test, type Page } from '@playwright/test'

const primary = (page: Page) => page.getByTestId('primary')
const NOW = new Date(2026, 10, 11, 10, 0, 0)

async function stubFullscreen(page: Page) {
  await page.addInitScript(() => {
    const fs = { enter: 0, exit: 0 }
    ;(window as unknown as { __fs: typeof fs }).__fs = fs
    Element.prototype.requestFullscreen = function () {
      fs.enter++
      Object.defineProperty(document, 'fullscreenElement', { value: this, configurable: true })
      return Promise.resolve()
    }
    document.exitFullscreen = () => {
      fs.exit++
      Object.defineProperty(document, 'fullscreenElement', { value: null, configurable: true })
      return Promise.resolve()
    }
  })
}
const fsCalls = (page: Page) => page.evaluate(() => (window as unknown as { __fs: { enter: number; exit: number } }).__fs)

test('each exercise: Start exercise, full screen, countdown, log set, rest, Start set 2, and again for the next', async ({ page }) => {
  await stubFullscreen(page)
  await page.clock.install({ time: NOW })
  await page.goto('/?stage=today')
  await page.getByTestId('start-workout').click()

  // 1. The exercise opens on Start exercise, with nothing to log yet.
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Push-up')
  await expect(page.getByTestId('intro')).toBeVisible()
  await expect(page.getByTestId('inputs')).toHaveCount(0)
  await expect(primary(page)).toHaveText('Start exercise')
  expect((await fsCalls(page)).enter).toBe(0)

  // 2. Start exercise goes full screen and counts 5 to 1.
  await primary(page).click()
  expect((await fsCalls(page)).enter).toBe(1)
  await expect(page.getByTestId('ready')).toContainText('Exercise starts in')
  await expect(page.getByTestId('ready').getByTestId('timer')).toHaveText('5')
  await expect(primary(page)).toHaveText('Skip countdown')
  await page.clock.fastForward(5200)

  // 3. Then the exercise: Log set.
  await expect(page.getByTestId('inputs')).toBeVisible()
  await expect(primary(page)).toHaveText('Log set')
  await page.clock.fastForward(500)
  await primary(page).click()

  // 4. Rest counts down; when it ends the button says Start set 2 and waits for a tap.
  await expect(page.getByTestId('rest')).toBeVisible()
  await expect(primary(page)).toHaveText('Skip rest')
  await page.clock.fastForward(61_000)
  await expect(page.getByTestId('rest')).toContainText('Rest over')
  await expect(primary(page)).toHaveText('Start set 2')
  await expect(page.getByTestId('inputs')).toHaveCount(0)
  await primary(page).click()
  await expect(page.getByTestId('inputs')).toBeVisible()
  await expect(page.getByLabel(/Set 2/).first()).toBeVisible()

  // 5. Skipping the rest also leads to Start set N, in one tap, then the last set ends the exercise.
  await page.clock.fastForward(500)
  await primary(page).click() // log set 2
  await primary(page).click() // skip rest -> log row for set 3
  await page.clock.fastForward(500)
  await primary(page).click() // log set 3
  await expect(page.getByTestId('exercise-done')).toBeVisible()
  expect((await fsCalls(page)).exit).toBeGreaterThanOrEqual(1) // full screen ends with the exercise
  await expect(primary(page)).toHaveText('Next exercise')

  // 6. The next exercise starts the same way, and goes full screen again.
  await primary(page).click()
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Reverse lunge')
  await expect(primary(page)).toHaveText('Start exercise')
  await primary(page).click()
  expect((await fsCalls(page)).enter).toBe(2)
})

test('a double tap on Start set cannot also log that set', async ({ page }) => {
  await page.goto('/?stage=today')
  await page.getByTestId('start-workout').click()
  await primary(page).click() // Start exercise
  await primary(page).click() // skip countdown
  await page.waitForTimeout(500)
  await primary(page).click() // log set 1 -> rest
  await expect(page.getByTestId('rest')).toBeVisible()
  await primary(page).dblclick() // Skip rest, then a stray second tap
  await expect(page.getByTestId('inputs')).toBeVisible()
  await expect(page.getByTestId('rest')).toHaveCount(0)
})

test('the reps exercise has no work timer anywhere in the guided flow', async ({ page }) => {
  await page.goto('/?stage=today')
  await page.getByTestId('start-workout').click()
  await expect(page.getByTestId('timer')).toHaveCount(0) // intro
  await primary(page).click()
  await expect(page.getByTestId('ready').getByTestId('timer')).toBeVisible() // the countdown to the exercise only
  await primary(page).click()
  await expect(page.getByTestId('inputs')).toBeVisible()
  await expect(page.getByTestId('timer')).toHaveCount(0) // while doing the set
})

test('a finished workout is done for the day: no start button, no exercises, also on the programme page', async ({ page }) => {
  await page.clock.setFixedTime(NOW)
  const at = NOW.getTime() - 3600_000
  const entries = [
    ['push-up', 'Push-up', 'reps', 3, { reps: 10 }],
    ['reverse-lunge', 'Reverse lunge', 'reps_per_side', 3, { left: 8, right: 8 }],
    ['plank', 'Plank', 'time', 2, { seconds: 30 }],
    ['goblet-squat', 'Goblet squat', 'weight_reps', 3, { kg: 12, reps: 10 }],
  ].flatMap(([id, name, type, sets, values]) =>
    Array.from({ length: sets as number }, (_, i) => ({ id: `${id}-${i}`, name, trackingType: type, values, exerciseId: id, at: at + i, source: 'workout' })),
  )
  await page.addInitScript(([e]) => {
    if (sessionStorage.getItem('seeded')) return
    sessionStorage.setItem('seeded', '1')
    localStorage.setItem('exercise-demo:entries', JSON.stringify({ v: 1, entries: e }))
    localStorage.setItem('exercise-demo:programme', JSON.stringify({ v: 1, id: 'foundation', startedAt: new Date(2026, 10, 9, 9).getTime() }))
  }, [entries])
  await page.goto('/?stage=today')
  const start = page.getByTestId('start-workout')
  await expect(start).toBeDisabled()
  await expect(start).toContainText('Workout done today')
  await expect(page.getByTestId('workout-done')).toContainText('All logged today')
  await expect(page.getByTestId('exercise-open')).toHaveCount(0)
  await page.getByTestId('programme-row').click()
  await expect(page.getByTestId('programme-start')).toBeDisabled()
  await expect(page.getByTestId('programme-start')).toHaveText('Workout done today')
})

test('a workout with a set still to log is not done, and finishing the guided flow marks it done', async ({ page }) => {
  await page.clock.install({ time: NOW })
  await page.goto('/?stage=today')
  await expect(page.getByTestId('start-workout')).toBeEnabled()
  await page.getByTestId('start-workout').click()
  for (const sets of [3, 3, 2, 3]) {
    await primary(page).click() // Start exercise
    await primary(page).click() // skip countdown
    await page.clock.fastForward(500)
    for (let i = 0; i < sets; i++) {
      await primary(page).click() // log set
      if (i < sets - 1) {
        await primary(page).click() // skip rest -> log row
        await page.clock.fastForward(500)
      }
    }
    await primary(page).click() // Next exercise / Finish workout
  }
  await expect(page.getByTestId('summary')).toBeVisible()
  await page.getByRole('button', { name: /Back to today/ }).click()
  await expect(page.getByTestId('start-workout')).toBeDisabled()
  await expect(page.getByTestId('exercise-open')).toHaveCount(0)
})

test('warm-up and cool-down are separate flows, timed moves count down, reps moves do not, and each is done for the day once finished', async ({ page }) => {
  await page.clock.install({ time: NOW })
  await page.goto('/?stage=today')
  await page.getByTestId('start-warmup').click()
  const routine = page.getByTestId('routine')
  await expect(routine).toBeVisible()
  await expect(page.getByTestId('routine-move')).toHaveText('Arm circles')
  await expect(page.getByTestId('routine-timer')).toBeVisible() // a 30 second move has a countdown
  await page.getByTestId('routine-primary').click() // Start 30 seconds
  await page.clock.fastForward(31_000)
  await expect(page.getByTestId('routine-timer')).toContainText('0:00')
  await page.getByTestId('routine-primary').click() // Next move
  await expect(page.getByTestId('routine-move')).toHaveText('Hip hinges')
  await expect(page.getByTestId('routine-timer')).toHaveCount(0) // a reps move has no timer
  await expect(page.getByTestId('routine-primary')).toHaveText('Next move')
  await page.getByTestId('routine-primary').click()
  await expect(page.getByTestId('routine-primary')).toHaveText('Finish warm-up')
  await page.getByTestId('routine-primary').click()

  // Back on Today, the warm-up is done and gone; the workout and cool-down are untouched.
  await expect(page.getByTestId('today')).toBeVisible()
  await expect(page.getByTestId('warmup-done')).toContainText('Done today')
  await expect(page.getByTestId('start-warmup')).toHaveCount(0)
  await expect(page.getByTestId('start-workout')).toBeEnabled()
  await expect(page.getByTestId('start-cooldown')).toBeVisible()
  await page.reload()
  await expect(page.getByTestId('warmup-done')).toBeVisible()

  // Leaving early marks nothing; and tomorrow it starts fresh.
  await page.getByTestId('start-cooldown').click()
  await page.getByTestId('routine-exit').click()
  await expect(page.getByTestId('start-cooldown')).toBeVisible()
  await page.clock.setFixedTime(new Date(2026, 10, 12, 10, 0, 0))
  await page.reload()
  await expect(page.getByTestId('start-warmup')).toBeVisible()
})
