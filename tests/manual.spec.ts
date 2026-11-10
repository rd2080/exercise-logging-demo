import { expect, test, type Page } from '@playwright/test'

const sheet = (page: Page) => page.getByRole('dialog')
const plus = (page: Page) => page.getByTestId('add-exercise')

test.beforeEach(async ({ page }) => {
  await page.goto('/?stage=progress')
  await expect(page.getByTestId('progress')).toBeVisible()
})

test('the plus button is icon only, 48px, labelled, and opens the pick step', async ({ page }) => {
  const box = (await plus(page).boundingBox())!
  expect(box.width).toBeGreaterThanOrEqual(48)
  expect(box.height).toBeGreaterThanOrEqual(48)
  await expect(plus(page)).toHaveAccessibleName('Log an exercise')
  expect(((await plus(page).innerText()) || '').trim()).toBe('')
  await plus(page).click()
  await expect(sheet(page).getByRole('heading', { name: 'What did you do?' })).toBeVisible()
  for (const n of ['Push-up', 'Reverse lunge', 'Plank', 'Goblet squat', 'Something else'])
    await expect(sheet(page).getByRole('radio', { name: new RegExp(n) })).toBeVisible()
  await page.screenshot({ path: 'screenshots/manual-pick.png' })
})

test('the empty state also offers Log an exercise', async ({ page }) => {
  await page.getByTestId('empty-secondary').click()
  await expect(sheet(page)).toBeVisible()
})

test('a plan exercise logs in two taps with prefilled values, the cue and the media above the inputs', async ({ page }) => {
  await plus(page).click()
  await sheet(page).getByRole('radio', { name: /Push-up/ }).click()
  await expect(sheet(page).getByRole('heading', { name: 'Push-up' })).toBeVisible()
  // Name, one cue and the media slot sit above the inputs.
  const media = (await sheet(page).getByTestId('media-slot').boundingBox())!
  const cue = (await sheet(page).getByTestId('manual-cue').boundingBox())!
  const inputs = (await sheet(page).getByTestId('manual-inputs').boundingBox())!
  expect(media.y).toBeLessThan(cue.y)
  expect(cue.y + cue.height).toBeLessThanOrEqual(inputs.y)
  await expect(sheet(page).getByTestId('manual-note')).toHaveText('Prefilled from your last session')
  await expect(sheet(page).getByTestId('manual-inputs').getByRole('status')).toHaveText('12')
  await page.screenshot({ path: 'screenshots/manual-log.png' })
  await sheet(page).getByRole('button', { name: 'Log set' }).click()
  await expect(sheet(page)).toHaveCount(0)
  const row = page.getByTestId('entry-list').getByRole('listitem').first()
  await expect(row).toContainText('Push-up')
  await expect(row).toContainText('Added by hand')
  await expect(row).toContainText('12')
  await expect(page.getByRole('heading', { name: 'Logged by hand' })).toBeVisible()
  await expect(page.getByTestId('empty-state')).toHaveCount(0)
})

test('logging the same exercise again prefills from the entry you just made', async ({ page }) => {
  await plus(page).click()
  await sheet(page).getByRole('radio', { name: /Push-up/ }).click()
  await sheet(page).getByRole('button', { name: 'Increase reps' }).click()
  await sheet(page).getByRole('button', { name: 'Log set' }).click()
  await plus(page).click()
  await sheet(page).getByRole('radio', { name: /Push-up/ }).click()
  await expect(sheet(page).getByTestId('manual-note')).toHaveText('Same as your last set')
  await expect(sheet(page).getByTestId('manual-inputs').getByRole('status')).toHaveText('13')
  await sheet(page).getByRole('button', { name: 'Log set' }).click()
  await expect(page.getByTestId('entry-list').getByRole('listitem')).toHaveCount(2)
  // Most recent first.
  await expect(page.getByTestId('entry-list').getByRole('listitem').first()).toContainText('13')
})

test('every tracking type shows the right fields and no timer', async ({ page }) => {
  const cases: [RegExp, string[]][] = [
    [/Reverse lunge/, ['Left', 'Right']],
    [/Plank/, ['Hold time']],
    [/Goblet squat/, ['Weight', 'Reps']],
  ]
  for (const [pick, fields] of cases) {
    await plus(page).click()
    await sheet(page).getByRole('radio', { name: pick }).click()
    for (const f of fields) await expect(sheet(page).getByRole('group', { name: f })).toBeVisible()
    await expect(page.getByTestId('timer')).toHaveCount(0)
    await expect(sheet(page).getByRole('button', { name: /second hold/ })).toHaveCount(0)
    await sheet(page).getByRole('button', { name: 'Log set' }).click()
  }
  await expect(page.getByTestId('entry-list').getByRole('listitem')).toHaveCount(3)
})

test('Something else: needs a name, then a type, then prefills a stated default', async ({ page }) => {
  await plus(page).click()
  await sheet(page).getByRole('radio', { name: /Something else/ }).click()
  const next = sheet(page).getByRole('button', { name: 'Set amounts' })
  await expect(next).toBeDisabled()
  await expect(sheet(page).getByText('Enter a name to continue.')).toBeVisible()
  await sheet(page).getByLabel('Exercise name').fill('  Burpees  ')
  await sheet(page).getByRole('radio', { name: /Reps per side/ }).click()
  await expect(next).toBeEnabled()
  await page.screenshot({ path: 'screenshots/manual-custom.png' })
  await next.click()
  await expect(sheet(page).getByRole('heading', { name: 'Burpees' })).toBeVisible()
  await expect(sheet(page).getByTestId('manual-note')).toHaveText('A starting point. Adjust it to what you did.')
  // No demo media or form cue exists for a new exercise, and the sheet says so.
  await expect(sheet(page).getByTestId('media-slot')).toHaveCount(0)
  await expect(sheet(page).getByTestId('manual-no-media')).toBeVisible()
  await sheet(page).getByRole('button', { name: 'Log set' }).click()
  await expect(page.getByTestId('entry-list').getByRole('listitem').first()).toContainText('Burpees')
  await expect(page.getByTestId('entry-list').getByRole('listitem').first()).toContainText('8 / 8')
})

test('Change exercise goes back to the pick step', async ({ page }) => {
  await plus(page).click()
  await sheet(page).getByRole('radio', { name: /Plank/ }).click()
  await sheet(page).getByRole('button', { name: 'Change exercise' }).click()
  await expect(sheet(page).getByRole('heading', { name: 'What did you do?' })).toBeVisible()
})

test('the first entry unlocks the First set goal', async ({ page }) => {
  await expect(page.getByRole('listitem', { name: /First set: .* Locked, 0 of 1/ })).toBeVisible()
  await plus(page).click()
  await sheet(page).getByRole('radio', { name: /Push-up/ }).click()
  await sheet(page).getByRole('button', { name: 'Log set' }).click()
  await expect(page.getByRole('listitem', { name: /First set: .* Unlocked, 1 of 1/ })).toBeVisible()
})

test('button labels name the result in sentence case', async ({ page }) => {
  await plus(page).click()
  await sheet(page).getByRole('radio', { name: /Something else/ }).click()
  await sheet(page).getByLabel('Exercise name').fill('Burpees')
  const labels = [await sheet(page).getByRole('button', { name: 'Set amounts' }).innerText()]
  await sheet(page).getByRole('button', { name: 'Set amounts' }).click()
  labels.push(await sheet(page).getByRole('button', { name: 'Log set' }).innerText())
  labels.push(await sheet(page).getByRole('button', { name: 'Change exercise' }).innerText())
  for (const l of labels) {
    expect(l).toMatch(/^[A-Z][a-z]/)
    expect(l).not.toBe(l.toUpperCase())
    expect(l).not.toMatch(/^(Submit|Next|OK|Continue|Save)$/)
  }
})

for (const [width, height] of [[320, 667], [390, 844]]) {
  test(`worst-case names and an empty plan hold up at ${width}x${height}`, async ({ page }) => {
    await page.setViewportSize({ width, height })
    await page.goto('/?stage=progress&data=worst')
    await plus(page).click()
    await sheet(page).getByRole('radio', { name: /Something else/ }).click()
    const long = 'Single-arm kettlebell Turkish get-up, alternating sides now'
    await sheet(page).getByLabel('Exercise name').fill(long)
    await sheet(page).getByRole('radio', { name: /Weight and reps/ }).click()
    await sheet(page).getByRole('button', { name: 'Set amounts' }).click()
    expect(await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth)).toBe(false)
    await sheet(page).getByRole('button', { name: 'Log set' }).click()
    const row = page.getByTestId('entry-list').getByRole('listitem').first()
    await expect(row).toContainText('Turkish get-up')
    expect(await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth)).toBe(false)
    await page.screenshot({ path: `screenshots/manual-long-${width}.png` })

    await page.goto('/?stage=progress&data=empty')
    await plus(page).click()
    await expect(sheet(page).getByRole('radio', { name: /Something else/ })).toBeVisible()
    await expect(sheet(page).getByRole('radio')).toHaveCount(1)
  })
}

test('the 48px target rule holds for the sheet controls', async ({ page }) => {
  await plus(page).click()
  await sheet(page).getByRole('radio', { name: /Push-up/ }).click()
  const small = await sheet(page).evaluate((el) =>
    [...el.querySelectorAll('button, [role=radio]')]
      .map((b) => b.getBoundingClientRect())
      .filter((r) => r.width > 0 && (r.height < 48 || r.width < 48)).length,
  )
  expect(small).toBe(0)
})
