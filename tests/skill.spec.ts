import { expect, test, type Page } from '@playwright/test'

const create = (page: Page) => page.getByTestId('create-plan')
const tab = (page: Page, name: string) => page.getByTestId('tab-bar').getByRole('button', { name })

async function openRow(page: Page, name: RegExp) {
  await page.getByRole('button', { name }).click()
  await expect(page.getByRole('dialog')).toBeVisible()
}

/** The required answers, nothing else. Skill goal is not among them. */
async function basics(page: Page) {
  await openRow(page, /^Goals/)
  await page.getByRole('checkbox', { name: 'Improve fitness' }).click()
  await page.getByRole('button', { name: 'Save goals' }).click()
  await openRow(page, /^Activity level/)
  await page.getByRole('radio', { name: /Lightly active/ }).click()
  await openRow(page, /^Equipment/)
  await page.getByRole('checkbox', { name: /None, bodyweight only/ }).click()
  await page.getByRole('button', { name: 'Save equipment' }).click()
}

test('set up does not ask for a skill; the question comes after Create my plan', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('button', { name: /^Skill goal/ })).toHaveCount(0)
  await expect(page.getByRole('button', { name: /^Goals/ })).toBeVisible()
  await basics(page)
  await create(page).click()
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Want to learn a skill?')
  await expect(page.getByTestId('skill-yes')).toHaveText('Choose a skill')
  await expect(page.getByTestId('skill-no')).toHaveText('Not now')
  await page.getByTestId('skill-no').click()
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Choose your programme')
})

test('the question can go back to set up', async ({ page }) => {
  await page.goto('/')
  await basics(page)
  await create(page).click()
  await page.getByTestId('skill-ask-back').click()
  await expect(page.getByTestId('setup')).toBeVisible()
  await expect(page.getByTestId('answer-activity')).toHaveText('Lightly active')
})

test('Yes shows skills in groups with a search box on top; search and kind chips narrow the list', async ({ page }) => {
  await page.goto('/?stage=skills')
  const list = page.getByTestId('skill-list')
  await expect(page.getByRole('searchbox', { name: 'Search skills' })).toBeVisible()
  await expect(page.getByTestId('skills-count')).toHaveText('8 skills')
  for (const g of ['Strength skills', 'Balance skills', 'Endurance']) await expect(list.getByRole('heading', { name: g })).toBeVisible()
  await page.getByRole('searchbox', { name: 'Search skills' }).fill('pull-up')
  await expect(page.getByTestId('skills-count')).toHaveText('1 skill')
  await expect(list.getByRole('radio', { name: /First pull-up/ })).toBeVisible()
  await page.getByRole('searchbox', { name: 'Search skills' }).fill('')
  await page.getByRole('button', { name: 'Balance skills' }).click()
  await expect(page.getByTestId('skills-count')).toHaveText('3 skills')
  await expect(page.getByRole('button', { name: 'Balance skills' })).toHaveAttribute('aria-pressed', 'true')
  await expect(list.getByRole('heading', { name: 'Strength skills' })).toHaveCount(0)
  await page.getByRole('searchbox', { name: 'Search skills' }).fill('zzzz')
  await expect(page.getByRole('heading', { name: 'No skills match' })).toBeVisible()
  await page.getByRole('button', { name: 'Show all skills' }).click()
  await expect(page.getByTestId('skills-count')).toHaveText('8 skills')
})

test('choosing a skill asks permission to adjust exercises, then the flow continues to the programme', async ({ page }) => {
  await page.goto('/')
  await basics(page)
  await create(page).click()
  await page.getByTestId('skill-yes').click()
  await expect(page.getByTestId('skills-continue')).toBeDisabled()
  await page.getByRole('radio', { name: /Handstand push-up/ }).click()
  await expect(page.getByTestId('skills-continue')).toHaveText('Choose this skill')
  await page.getByTestId('skills-continue').click()
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Add steps toward handstand push-up?')
  await expect(page.getByTestId('chosen-skill')).toContainText('Strength skills')
  await expect(page.getByTestId('skill-adjust')).toHaveText('Adjust my exercises')
  await page.getByTestId('skill-adjust').click()
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Choose your programme')
  await expect(page.getByRole('radio', { name: /Handstand push-up/ })).toBeChecked()
  await expect(page.getByText('Matches your skill goal: handstand push-up')).toBeVisible()
  // The choice is saved with the agreement.
  const saved = await page.evaluate(() => JSON.parse(localStorage.getItem('exercise-demo:skill')!))
  expect(saved).toEqual({ v: 1, id: 'handstand', adjust: true })
})

test('declining the adjustment still keeps the skill goal, and a skill with no programme leaves the recommendation alone', async ({ page }) => {
  await page.goto('/')
  await basics(page)
  await create(page).click()
  await page.getByTestId('skill-yes').click()
  await page.getByRole('radio', { name: /First pull-up/ }).click()
  await page.getByTestId('skills-continue').click()
  await page.getByTestId('skill-keep').click()
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Choose your programme')
  await expect(page.getByRole('radio', { name: /Foundation strength/ })).toBeChecked()
  const saved = await page.evaluate(() => JSON.parse(localStorage.getItem('exercise-demo:skill')!))
  expect(saved).toEqual({ v: 1, id: 'first-pull-up', adjust: false })
})

test('back steps work: list to question, confirm to list', async ({ page }) => {
  await page.goto('/')
  await basics(page)
  await create(page).click()
  await page.getByTestId('skill-yes').click()
  await page.getByTestId('skills-back').click()
  await expect(page.getByTestId('skill-ask')).toBeVisible()
  await page.getByTestId('skill-yes').click()
  await page.getByRole('radio', { name: /Crow pose/ }).click()
  await page.getByTestId('skills-continue').click()
  await page.getByTestId('confirm-back').click()
  await expect(page.getByRole('radio', { name: /Crow pose/ })).toHaveAttribute('aria-checked', 'true')
})

test('the Skill tab is the fifth tab and starts empty with a way to choose', async ({ page }) => {
  await page.goto('/?stage=today')
  await expect(page.getByTestId('tab-bar').getByRole('button')).toHaveCount(5)
  await tab(page, 'Skill').click()
  await expect(page.getByTestId('skill-tab')).toBeVisible()
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Skill goal')
  await expect(page.getByRole('heading', { name: 'No skill goal yet' })).toBeVisible()
  await expect(tab(page, 'Skill')).toHaveAttribute('aria-current', 'page')
})

test('from the tab: choose, confirm, see it, switch the adjustment, change it, remove it', async ({ page }) => {
  await page.goto('/?stage=skill')
  await page.getByRole('button', { name: 'Choose a skill goal' }).click()
  await page.getByRole('radio', { name: /Pistol squat/ }).click()
  await page.getByTestId('skills-continue').click()
  await page.getByTestId('skill-keep').click()
  await expect(page.getByTestId('skill-tab')).toBeVisible()
  await expect(page.getByTestId('current-skill')).toContainText('Pistol squat')
  await expect(page.getByTestId('current-skill')).toContainText('Balance skills')
  const sw = page.getByRole('switch', { name: /Adjust my exercises/ })
  await expect(sw).toHaveAttribute('aria-checked', 'false')
  await sw.click()
  await expect(sw).toHaveAttribute('aria-checked', 'true')
  await page.reload()
  await expect(page.getByTestId('current-skill')).toContainText('Pistol squat')
  await expect(page.getByRole('switch', { name: /Adjust my exercises/ })).toHaveAttribute('aria-checked', 'true')

  await page.getByTestId('change-skill').click()
  await expect(page.getByRole('radio', { name: /Pistol squat/ })).toHaveAttribute('aria-checked', 'true')
  await page.getByRole('radio', { name: /Freestanding handstand/ }).click()
  await page.getByTestId('skills-continue').click()
  await page.getByTestId('skill-adjust').click()
  await expect(page.getByTestId('current-skill')).toContainText('Freestanding handstand')

  await page.getByTestId('remove-skill').click()
  await page.getByRole('dialog').getByRole('button', { name: 'Remove skill goal' }).click()
  await expect(page.getByRole('heading', { name: 'No skill goal yet' })).toBeVisible()
  expect(await page.evaluate(() => localStorage.getItem('exercise-demo:skill'))).toBeNull()
})

test('a saved skill skips the question when set up is run again, and an unknown saved skill is ignored', async ({ page }) => {
  await page.addInitScript(() => {
    if (sessionStorage.getItem('seeded')) return
    sessionStorage.setItem('seeded', '1')
    localStorage.setItem('exercise-demo:skill', JSON.stringify({ v: 1, id: 'handstand', adjust: false }))
  })
  await page.goto('/')
  await basics(page)
  await create(page).click()
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Choose your programme')
  await expect(page.getByRole('radio', { name: /Handstand push-up/ })).toBeChecked()

  await page.evaluate(() => localStorage.setItem('exercise-demo:skill', JSON.stringify({ v: 1, id: 'not-a-skill', adjust: true })))
  await page.goto('/?stage=skill')
  await expect(page.getByRole('heading', { name: 'No skill goal yet' })).toBeVisible()
})

test('the skill screens hold up at 320 with a very long skill name, and every target is 48px', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 640 })
  await page.goto('/?stage=skills&data=worst')
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true)
  for (const b of await page.getByTestId('skills').locator('button, [role=radio]').all()) {
    if (await b.isVisible()) expect((await b.boundingBox())!.height).toBeGreaterThanOrEqual(48)
  }
  await page.getByRole('radio', { name: /A skill with a very long name/ }).click()
  await page.getByTestId('skills-continue').click()
  await expect(page.getByTestId('skill-confirm')).toBeVisible()
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true)
})
