import { expect, test, type Page } from '@playwright/test'

const create = (page: Page) => page.getByTestId('create-plan')

async function openRow(page: Page, name: RegExp) {
  await page.getByRole('button', { name }).click()
  await expect(page.getByRole('dialog')).toBeVisible()
}

async function answerAll(page: Page, activity = 'Lightly active') {
  await openRow(page, /Choose goals/)
  await page.getByRole('checkbox', { name: 'Improve fitness' }).click()
  await page.getByRole('checkbox', { name: 'Build muscle' }).click()
  await page.getByRole('button', { name: 'Save goals' }).click()
  await openRow(page, /Choose activity level/)
  await page.getByRole('radio', { name: new RegExp(activity) }).click()
  await openRow(page, /Choose equipment/)
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
  await expect(page.getByText('Four answers, about a minute.')).toBeVisible()
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
  await openRow(page, /Choose goals/)
  await page.getByRole('checkbox', { name: 'Improve fitness' }).click()
  await page.getByRole('button', { name: 'Save goals' }).click()
  await expect(page.getByTestId('still-needed')).toHaveText('Still needed: activity level, equipment.')
  await expect(create(page)).toBeDisabled()
})

test('goals are ranked by pick order, capped at three', async ({ page }) => {
  await openRow(page, /Choose goals/)
  for (const g of ['Build muscle', 'Burn fat', 'Relieve stress'])
    await page.getByRole('checkbox', { name: g }).click()
  await expect(page.getByRole('checkbox', { name: 'Improve fitness' })).toBeDisabled()
  await expect(page.getByText('That is three. Remove one to pick another.')).toBeVisible()
  await page.getByRole('button', { name: 'Save goals' }).click()
  await expect(page.getByTestId('answer-goals')).toHaveText('Build muscle, Burn fat, Relieve stress')
})

test('picking an activity level answers in one tap and closes the sheet', async ({ page }) => {
  await openRow(page, /Choose activity level/)
  await page.getByRole('radio', { name: /Mostly sitting/ }).click()
  await expect(page.getByRole('dialog')).toHaveCount(0)
  await expect(page.getByTestId('answer-activity')).toHaveText('Mostly sitting')
})

test('None is exclusive and a pull-up bar asks follow-ups with the consequence in place', async ({ page }) => {
  await openRow(page, /Choose equipment/)
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
  await openRow(page, /Choose limits/)
  await page.getByRole('switch', { name: /Train quietly/ }).click()
  await page.getByRole('button', { name: 'Save limits' }).click()
  await expect(page.getByTestId('answer-limits')).toHaveText('Train quietly')
})

test('button labels name the result in sentence case', async ({ page }) => {
  await openRow(page, /Choose goals/)
  await expect(page.getByRole('button', { name: 'Save goals' })).toBeVisible()
  await page.keyboard.press('Escape')
  await expect(create(page)).toHaveText('Create my plan')
  await answerAll(page)
  await create(page).click()
  await expect(page.getByTestId('start-programme')).toHaveText(/^Start [a-z]/)
})

test('a lightly active user is recommended foundation strength and can start it', async ({ page }) => {
  await answerAll(page, 'Lightly active')
  await expect(create(page)).toBeEnabled()
  await create(page).click()
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Choose your programme')
  await expect(page.getByRole('radio', { name: /Foundation strength/ })).toBeChecked()
  await expect(page.getByText('Recommended for you')).toBeVisible()
  await expect(page.getByTestId('start-programme')).toHaveText('Start foundation strength')
  await page.getByRole('radio', { name: /Handstand push-up/ }).click()
  await expect(page.getByTestId('start-programme')).toHaveText('Start handstand push-up')
})

test('a first goal of learning a skill recommends the handstand programme, with the reason', async ({ page }) => {
  await openRow(page, /Choose goals/)
  await page.getByRole('checkbox', { name: /Learn a skill/ }).click()
  await page.getByRole('button', { name: 'Save goals' }).click()
  await openRow(page, /Choose activity level/)
  await page.getByRole('radio', { name: /Lightly active/ }).click()
  await openRow(page, /Choose equipment/)
  await page.getByRole('checkbox', { name: /None, bodyweight only/ }).click()
  await page.getByRole('button', { name: 'Save equipment' }).click()
  await create(page).click()
  await expect(page.getByRole('radio', { name: /Handstand push-up/ })).toBeChecked()
  await expect(page.getByText('Matches your first goal: learn a skill')).toBeVisible()
})

test('an eight week programme draws a strip twice as long as a four week one', async ({ page }) => {
  await answerAll(page)
  await create(page).click()
  const widths = await page.getByRole('img', { name: /weeks$/ }).evaluateAll((els) =>
    els.map((e) => (e.firstElementChild as HTMLElement).getBoundingClientRect().width),
  )
  expect(widths[1] / widths[0]).toBeCloseTo(2, 1)
  await expect(page.getByText('Sample programmes for this demo.')).toBeVisible()
})

test('a very active user is recommended the handstand push-up programme', async ({ page }) => {
  await answerAll(page, 'Very active')
  await create(page).click()
  await expect(page.getByRole('radio', { name: /Handstand push-up/ })).toBeChecked()
})

test('the flow ends on the empty progress page, then the player', async ({ page }) => {
  await answerAll(page)
  await create(page).click()
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
  await openRow(page, /Choose equipment/)
  await page.getByRole('checkbox', { name: 'Pull-up bar' }).click()
  await page.waitForTimeout(500)
  await check('setup-equipment-sheet')
  await page.getByRole('checkbox', { name: 'Pull-up bar' }).click()
  await page.getByRole('checkbox', { name: /None, bodyweight only/ }).click()
  await page.getByRole('button', { name: 'Save equipment' }).click()
  await openRow(page, /Choose goals/)
  await page.getByRole('checkbox', { name: 'Improve fitness' }).click()
  await page.getByRole('checkbox', { name: 'Build muscle' }).click()
  await page.getByRole('button', { name: 'Save goals' }).click()
  await openRow(page, /Choose activity level/)
  await page.getByRole('radio', { name: /Lightly active/ }).click()
  await page.waitForTimeout(500)
  await check('setup-ready')
  await create(page).click()
  await check('programmes')
  await page.getByTestId('start-programme').click()
  await check('reminders')
})
