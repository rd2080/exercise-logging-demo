import { expect, test } from '@playwright/test'

test('limits from set up hide clashing exercises on the list, with a way to show them', async ({ page }) => {
  await page.addInitScript(() => {
    if (sessionStorage.getItem('seeded')) return
    sessionStorage.setItem('seeded', '1')
    localStorage.setItem('exercise-demo:limits', JSON.stringify({ v: 1, limits: ['quiet', 'space', 'bogus'] }))
  })
  await page.goto('/?stage=exercises')
  const list = page.getByTestId('exercise-list')
  await expect(list).not.toContainText('Kettlebell swing')
  await expect(list).not.toContainText('Reverse lunge')
  await expect(list.getByText('Pull-up', { exact: true })).toHaveCount(0)
  await expect(list).toContainText('Push-up')
  await expect(page.getByTestId('limits-note')).toContainText('Hiding 5')
  await expect(page.getByTestId('result-count')).toHaveText(/^14 exercises/)
  await page.getByTestId('limits-toggle').click()
  await expect(list).toContainText('Kettlebell swing')
  await expect(page.getByTestId('result-count')).toHaveText(/^19 exercises/)
  await page.getByTestId('limits-toggle').click()
  await expect(list).not.toContainText('Kettlebell swing')
})

test('no limits means nothing is hidden, and an unknown saved limit is ignored', async ({ page }) => {
  await page.goto('/?stage=exercises')
  await expect(page.getByTestId('limits-note')).toHaveCount(0)
  await expect(page.getByTestId('result-count')).toHaveText(/^19 exercises/)
})

test('switching a limit on in set up is remembered after a reload', async ({ page }) => {
  await page.goto('/?stage=setup')
  await page.getByRole('button', { name: /^Limits/ }).click()
  await page.getByRole('switch', { name: /Train quietly/ }).click()
  await page.getByRole('dialog').getByRole('button', { name: 'Save limits' }).click()
  await page.waitForTimeout(300)
  const saved = await page.evaluate(() => localStorage.getItem('exercise-demo:limits'))
  expect(JSON.parse(saved!).limits).toEqual(['quiet'])
  await page.goto('/?stage=exercises')
  await expect(page.getByTestId('limits-note')).toContainText('Hiding 2')
})
