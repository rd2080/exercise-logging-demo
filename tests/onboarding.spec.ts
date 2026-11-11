import { expect, test, type Page } from '@playwright/test'

const create = (page: Page) => page.getByTestId('create-plan')

async function openRow(page: Page, name: RegExp) {
  await page.getByRole('button', { name }).click()
  await expect(page.getByRole('dialog')).toBeVisible()
}

async function answerAll(page: Page, activity = 'Lightly active') {
  await openRow(page, /^Goals/)
  await page.getByRole('checkbox', { name: 'Improve fitness' }).click()
  await page.getByRole('checkbox', { name: 'Build muscle' }).click()
  await page.getByRole('button', { name: 'Save goals' }).click()
  await openRow(page, /^Activity level/)
  await page.getByRole('radio', { name: new RegExp(activity) }).click()
  await openRow(page, /^Equipment/)
  await page.getByRole('checkbox', { name: /None, bodyweight only/ }).click()
  await page.getByRole('button', { name: 'Save equipment' }).click()
  await expect(page.getByRole('dialog')).toHaveCount(0)
}

test.beforeEach(async ({ page }) => {
  await page.goto('/')
  await expect(page.getByTestId('setup')).toBeVisible()
})

test('all four questions are on one screen with a why line and a time estimate', async ({ page }) => {
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Set up your plan')
  await expect(page.getByText('Four answers, about a minute. Two extras are optional.')).toBeVisible()
  for (const why of [
    'Decides which programmes we suggest',
    'Sets how hard your first weeks start',
    'So we only plan what you can do',
    'Optional. Rules exercises out',
  ])
    await expect(page.getByText(why)).toBeVisible()
  const button = await create(page).boundingBox()
  const last = await page.getByTestId('answer-limits').boundingBox()
  expect(last!.y + last!.height).toBeLessThan(button!.y)
})

test('the main button is disabled until the required answers exist and says what is missing', async ({ page }) => {
  await expect(create(page)).toBeDisabled()
  await expect(page.getByTestId('still-needed')).toHaveText('Still needed: goal, activity level, equipment.')
  await openRow(page, /^Goals/)
  await page.getByRole('checkbox', { name: 'Improve fitness' }).click()
  await page.getByRole('button', { name: 'Save goals' }).click()
  await expect(page.getByTestId('still-needed')).toHaveText('Still needed: activity level, equipment.')
  await expect(create(page)).toBeDisabled()
})

test('goals are ranked by pick order, capped at three', async ({ page }) => {
  await openRow(page, /^Goals/)
  for (const g of ['Build muscle', 'Burn fat', 'Relieve stress'])
    await page.getByRole('checkbox', { name: g }).click()
  await expect(page.getByRole('checkbox', { name: 'Improve fitness' })).toBeDisabled()
  await expect(page.getByText('That is three. Remove one to pick another.')).toBeVisible()
  await page.getByRole('button', { name: 'Save goals' }).click()
  await expect(page.getByTestId('answer-goals')).toHaveText('Build muscle, Burn fat, Relieve stress')
})

test('picking an activity level answers in one tap and closes the sheet', async ({ page }) => {
  await openRow(page, /^Activity level/)
  await page.getByRole('radio', { name: /Mostly sitting/ }).click()
  await expect(page.getByRole('dialog')).toHaveCount(0)
  await expect(page.getByTestId('answer-activity')).toHaveText('Mostly sitting')
})

test('None is exclusive and a pull-up bar asks follow-ups with the consequence in place', async ({ page }) => {
  await openRow(page, /^Equipment/)
  await page.getByRole('checkbox', { name: 'Dumbbells' }).click()
  await page.getByRole('checkbox', { name: /None, bodyweight only/ }).click()
  await expect(page.getByRole('checkbox', { name: 'Dumbbells' })).not.toBeChecked()
  await page.getByRole('checkbox', { name: 'Pull-up bar' }).click()
  await expect(page.getByRole('checkbox', { name: /None, bodyweight only/ })).not.toBeChecked()
  const consequence = page.getByTestId('pullup-consequence')
  await expect(consequence).toHaveText('Your plan will skip hanging and swinging pull-up bar exercises.')
  await page.getByRole('switch', { name: /hang from the bar/ }).click()
  await expect(consequence).toHaveText('Your plan will skip swinging and jumping pull-up bar exercises.')
  await page.getByRole('switch', { name: /secure enough/ }).click()
  await expect(consequence).toHaveText('Your plan can include every pull-up bar exercise.')
})

test('limits are optional and default to none', async ({ page }) => {
  await expect(page.getByTestId('answer-limits')).toHaveText('No limits')
  await openRow(page, /^Limits/)
  await page.getByRole('switch', { name: /Train quietly/ }).click()
  await page.getByRole('button', { name: 'Save limits' }).click()
  await expect(page.getByTestId('answer-limits')).toHaveText('Train quietly')
})

test('button labels name the result in sentence case', async ({ page }) => {
  await openRow(page, /^Goals/)
  await expect(page.getByRole('button', { name: 'Save goals' })).toBeVisible()
  await page.keyboard.press('Escape')
  await expect(create(page)).toHaveText('Create my plan')
  await answerAll(page)
  await create(page).click()
  await page.getByTestId('skill-no').click()
  await expect(page.getByTestId('start-programme')).toHaveText('Start programme')
})

test('a lightly active user is recommended foundation strength and can start it', async ({ page }) => {
  await answerAll(page, 'Lightly active')
  await expect(create(page)).toBeEnabled()
  await create(page).click()
  await page.getByTestId('skill-no').click()
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Choose your programme')
  await expect(page.getByRole('radio', { name: /Foundation strength/ })).toBeChecked()
  await expect(page.getByText('Recommended for you')).toBeVisible()
    await page.getByRole('radio', { name: /Handstand push-up/ }).click()
  await expect(page.getByRole('radio', { name: /Handstand push-up/ })).toBeChecked()
})

test('an eight week programme draws a strip twice as long as a four week one', async ({ page }) => {
  await answerAll(page)
  await create(page).click()
  await page.getByTestId('skill-no').click()
  const widths = await page.getByRole('img', { name: /weeks$/ }).evaluateAll((els) =>
    els.map((e) => (e.firstElementChild as HTMLElement).getBoundingClientRect().width),
  )
  expect(widths[1] / widths[0]).toBeCloseTo(2, 1)
  await expect(page.getByText('Sample programmes for this demo.')).toBeVisible()
})

test('a very active user is recommended the handstand push-up programme', async ({ page }) => {
  await answerAll(page, 'Very active')
  await create(page).click()
  await page.getByTestId('skill-no').click()
  await expect(page.getByRole('radio', { name: /Handstand push-up/ })).toBeChecked()
})

test('the flow ends on the empty progress page, then the player', async ({ page }) => {
  await answerAll(page)
  await create(page).click()
  await page.getByTestId('skill-no').click()
  await page.getByTestId('start-programme').click()
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Get reminders on your training days?')
  await page.getByRole('button', { name: 'Not now' }).click()
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Progress')
  await page.getByRole('button', { name: 'Start your first workout' }).click()
  await expect(page.getByTestId('player')).toBeVisible()
})

test('every control is at least 48px, nothing overflows, and screens are captured', async ({ page }) => {
  const check = async (shot: string) => {
    const small = await page.evaluate(
      () =>
        [...document.querySelectorAll('button:not([data-testid=data-toggle] button), [role=switch], [role=checkbox], [role=radio]')]
          .filter((e) => e.getBoundingClientRect().width > 0)
          .map((e) => e.getBoundingClientRect())
          .filter((r) => r.height < 48 || r.width < 48).length,
    )
    expect(small).toBe(0)
    expect(await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth)).toBe(false)
    await page.screenshot({ path: `screenshots/${shot}.png` })
  }
  await check('setup-empty')
  await openRow(page, /^Equipment/)
  await page.getByRole('checkbox', { name: 'Pull-up bar' }).click()
  await page.waitForTimeout(500)
  await check('setup-equipment-sheet')
  await page.getByRole('checkbox', { name: 'Pull-up bar' }).click()
  await page.getByRole('checkbox', { name: /None, bodyweight only/ }).click()
  await page.getByRole('button', { name: 'Save equipment' }).click()
  await openRow(page, /^Goals/)
  await page.getByRole('checkbox', { name: 'Improve fitness' }).click()
  await page.getByRole('checkbox', { name: 'Build muscle' }).click()
  await page.getByRole('button', { name: 'Save goals' }).click()
  await openRow(page, /^Activity level/)
  await page.getByRole('radio', { name: /Lightly active/ }).click()
  await page.waitForTimeout(500)
  await check('setup-ready')
  await create(page).click()
  await page.getByTestId('skill-no').click()
  await check('programmes')
  await page.getByTestId('start-programme').click()
  await check('reminders')
})

test('a plain lead-in line sits under the title where it adds meaning, and not on goals', async ({ page }) => {
  await page.goto('/?stage=setup')
  await openRow(page, /^Goals/)
  await expect(page.getByTestId('sheet-lead')).toHaveCount(0)
  await page.keyboard.press('Escape')
  await page.waitForTimeout(400)
  await openRow(page, /^Activity level/)
  await expect(page.getByTestId('sheet-lead')).toContainText('true this month')
  await page.keyboard.press('Escape')
  await page.waitForTimeout(400)
  await openRow(page, /^Limits/)
  await expect(page.getByTestId('sheet-lead')).toHaveText('Skip this if nothing applies.')
})

test('weight and height are optional, validated, shown in the chosen unit and the unit is remembered', async ({ page }) => {
  await page.goto('/?stage=setup')
  await expect(page.getByTestId('create-plan')).toBeDisabled()
  await openRow(page, /^Weight and height/)
  const sheet = page.getByRole('dialog')
  await page.getByTestId('body-weight').fill('900')
  await expect(sheet.getByText(/Enter a weight between/)).toBeVisible()
  await expect(sheet.getByRole('button', { name: 'Save measurements' })).toBeDisabled()
  await page.getByTestId('body-weight').fill('70')
  await page.getByTestId('body-height').fill('175')
  await sheet.getByRole('button', { name: 'lb' }).click()
  await expect(page.getByTestId('body-weight')).toHaveValue('154.3')
  await sheet.getByRole('button', { name: 'ft' }).click()
  await expect(page.getByTestId('body-height')).toHaveValue('5')
  await expect(page.getByTestId('body-inches')).toHaveValue('9')
  await sheet.getByRole('button', { name: 'Save measurements' }).click()
  await expect(page.getByTestId('answer-body')).toHaveText('154 lb, 5 ft 9 in')
  await page.reload()
  await openRow(page, /^Weight and height/)
  await expect(page.getByRole('dialog').getByRole('button', { name: 'lb' })).toHaveAttribute('aria-pressed', 'true')
})

test('saving the measurements blank is fine and plan creation does not need them', async ({ page }) => {
  await page.goto('/?stage=setup')
  await expect(page.getByTestId('answer-body')).toHaveText('Add')
  await openRow(page, /^Weight and height/)
  await page.getByRole('dialog').getByRole('button', { name: 'Save measurements' }).click()
  await expect(page.getByTestId('answer-body')).toHaveText('Add')
})

test('ranking training styles changes the recommendation and says why', async ({ page }) => {
  await answerAll(page, 'Lightly active')
  await openRow(page, /^Training style/)
  await page.getByRole('checkbox', { name: /Skills/ }).click()
  await page.getByRole('checkbox', { name: /Bodyweight/ }).click()
  await page.getByRole('dialog').getByRole('button', { name: 'Save training style' }).click()
  await expect(page.getByTestId('answer-style')).toHaveText('Skills, Bodyweight')
  await create(page).click()
  await page.getByTestId('skill-no').click()
  await expect(page.getByRole('radio', { name: /Handstand push-up/ })).toBeChecked()
  await expect(page.getByText('Matches your favourite training style: skills')).toBeVisible()
})

test('without a training style the recommendation is unchanged', async ({ page }) => {
  await answerAll(page, 'Lightly active')
  await expect(page.getByTestId('answer-style')).toHaveText('Add')
  await create(page).click()
  await page.getByTestId('skill-no').click()
  await expect(page.getByRole('radio', { name: /Foundation strength/ })).toBeChecked()
})

test('dumbbells and a band each get a follow-up that starts safe and explains the consequence', async ({ page }) => {
  await page.goto('/?stage=setup')
  await openRow(page, /^Equipment/)
  const sheet = page.getByRole('dialog')
  await expect(page.getByTestId('dumbbells-checks')).toHaveCount(0)
  await sheet.getByRole('checkbox', { name: /Dumbbells/ }).click()
  await expect(page.getByTestId('dumbbells-consequence')).toHaveText('Your plan will keep dumbbell exercises light.')
  await sheet.getByRole('switch', { name: /heavier than 10 kg/ }).click()
  await expect(page.getByTestId('dumbbells-consequence')).toHaveText('Your plan can include heavy dumbbell exercises.')
  await sheet.getByRole('checkbox', { name: /Resistance band/ }).click()
  await expect(page.getByTestId('band-consequence')).toContainText('skip exercises that need an anchored band')
  await sheet.getByRole('switch', { name: /anchor the band/ }).click()
  await expect(page.getByTestId('band-consequence')).toContainText('can include anchored band exercises')
  for (const b of await sheet.getByRole('switch').all()) expect((await b.boundingBox())!.height).toBeGreaterThanOrEqual(48)
})


test('unit switches never drift, pasted text is cleaned, and edge values are judged in the canonical unit', async ({ page }) => {
  await page.goto('/?stage=setup')
  await openRow(page, /^Weight and height/)
  const sheet = page.getByRole('dialog')
  const w = page.getByTestId('body-weight')
  const h = page.getByTestId('body-height')
  await w.fill('70.5 kg')
  await expect(w).toHaveValue('70.5')
  await sheet.getByRole('button', { name: 'lb' }).click()
  await sheet.getByRole('button', { name: 'kg' }).click()
  await expect(w).toHaveValue('70.5')
  await w.fill('200')
  await sheet.getByRole('button', { name: 'lb' }).click()
  await w.fill('200')
  await sheet.getByRole('button', { name: 'kg' }).click()
  await sheet.getByRole('button', { name: 'lb' }).click()
  await expect(w).toHaveValue('200')
  await h.fill('171')
  await sheet.getByRole('button', { name: 'ft' }).click()
  await sheet.getByRole('button', { name: 'cm' }).click()
  await expect(h).toHaveValue('171')
  await h.fill('100')
  await sheet.getByRole('button', { name: 'ft' }).click()
  await expect(sheet.getByRole('button', { name: 'Save measurements' })).toBeEnabled()
  await page.getByTestId('body-inches').fill('12')
  await expect(page.getByTestId('body-inches')).toHaveValue('12')
  await expect(sheet.getByText('Inches go from 0 to 11.')).toBeVisible()
  await page.getByTestId('body-inches').fill('-5')
  await expect(page.getByTestId('body-inches')).toHaveValue('5')
  await w.fill('1e2')
  await expect(w).toHaveValue('12')
})

test('with the keyboard open on a small screen the weight field stays in view', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 340 })
  await page.goto('/?stage=setup')
  await page.getByRole('button', { name: /^Weight and height/ }).click()
  await page.waitForTimeout(800)
  await page.getByTestId('body-weight').focus()
  const box = (await page.getByTestId('body-weight').boundingBox())!
  const save = (await page.getByRole('button', { name: 'Save measurements' }).boundingBox())!
  expect(box.y + box.height).toBeLessThanOrEqual(save.y + 1)
})

test('a follow-up answer starts off again when its equipment is removed and added back', async ({ page }) => {
  await page.goto('/?stage=setup')
  await openRow(page, /^Equipment/)
  const sheet = page.getByRole('dialog')
  await sheet.getByRole('checkbox', { name: /Dumbbells/ }).click()
  await sheet.getByRole('switch', { name: /heavier than 10 kg/ }).click()
  await sheet.getByRole('checkbox', { name: /Dumbbells/ }).click()
  await sheet.getByRole('checkbox', { name: /Dumbbells/ }).click()
  await expect(sheet.getByRole('switch', { name: /heavier than 10 kg/ })).toHaveAttribute('aria-checked', 'false')
})

test('a follow-up block that appears is scrolled into view at 320x640', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 640 })
  await page.goto('/?stage=setup')
  await openRow(page, /^Equipment/)
  const sheet = page.getByRole('dialog')
  await sheet.getByRole('checkbox', { name: /Resistance band/ }).click()
  await page.waitForTimeout(700)
  const box = (await page.getByTestId('band-checks').boundingBox())!
  const save = (await sheet.getByRole('button', { name: 'Save equipment' }).boundingBox())!
  expect(box.y).toBeGreaterThan(0)
  expect(box.y + 100).toBeLessThanOrEqual(save.y)
})
