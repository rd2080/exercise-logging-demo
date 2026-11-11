import { expect, test, type Page } from '@playwright/test'

const primary = (page: Page) => page.getByTestId('primary')
const click = (page: Page) => page.evaluate(() => (document.querySelector('[data-testid=primary]') as HTMLElement).click())

async function noSidewaysScroll(page: Page, where: string) {
  const over = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)
  expect(over, `${where}: page scrolls sideways by ${over}px`).toBeLessThanOrEqual(0)
}

/** Logs every set of the current exercise (skipping rests), leaving the "Next exercise" button showing. */
async function logAll(page: Page, sets: number) {
  for (let i = 0; i < sets; i++) {
    await click(page)
    if (i < sets - 1) await click(page)
  }
}

for (const width of [320, 390]) {
  test.describe(`worst-case data at ${width}px`, () => {
    test.use({ viewport: { width, height: 844 } })

    test('player: nothing overflows, names clamp to two lines, slots wrap, labels are fixed', async ({ page }) => {
      await page.goto('/?stage=player&data=worst')
      await expect(page.getByTestId('player')).toBeVisible()
      for (const sets of [8, 5, 6, 10]) {
        await noSidewaysScroll(page, `exercise with ${sets} sets`)
        const h1 = page.getByRole('heading', { level: 1 })
        const lineHeight = await h1.evaluate((e) => parseFloat(getComputedStyle(e).lineHeight))
        const height = (await h1.boundingBox())!.height
        expect(height).toBeLessThanOrEqual(lineHeight * 2 + 2)
        const button = (await primary(page).boundingBox())!
        const note = (await page.getByTestId('prefill-note').boundingBox())!
        // The prefill note stays above the pinned button, except with 9+ sets of weight and reps, where the list needs the page to scroll a little.
        if (sets <= 8)
          expect(note.y + note.height, `${sets} sets: note bottom vs button top`).toBeLessThanOrEqual(button.y)
        await logAll(page, sets)
        await noSidewaysScroll(page, `exercise with ${sets} sets, all logged`)
        // Every logged value fits inside its slot.
        const clipped = await page.getByTestId('set-slots').evaluate((ol) =>
          [...ol.querySelectorAll('li span.num')].filter((n) => (n as HTMLElement).scrollWidth > (n.parentElement as HTMLElement).clientWidth + 1).length,
        )
        expect(clipped).toBe(0)
        await expect(primary(page)).toHaveText(/^(Next exercise|Finish workout)$/)
        await click(page)
      }
      await expect(page.getByTestId('summary')).toBeVisible()
      await noSidewaysScroll(page, 'summary')
      // No chip clips its value, and counts never wrap onto a second line.
      const bad = await page.evaluate(() => {
        const chips = [...document.querySelectorAll('[data-testid=summary] ol li')].filter((li) => li.textContent && li.textContent.trim() && !li.getAttribute('aria-label'))
        return chips.filter((li) => li.scrollWidth > li.clientWidth + 1).length
      })
      expect(bad).toBe(0)
      const counts = await page.getByText(/^\d+ of \d+$/).evaluateAll((els) => els.map((e) => e.getBoundingClientRect().height))
      for (const h of counts) expect(h).toBeLessThan(30)
    })

    test('setup, programmes and progress do not overflow', async ({ page }) => {
      await page.goto('/?stage=progress&data=worst')
      await noSidewaysScroll(page, 'progress')
      await page.goto('/?stage=achievements&data=worst')
      await noSidewaysScroll(page, 'achievements')
      await expect(page.getByText('7 of 10')).toBeVisible()
      await page.goto('/?data=worst')
      await noSidewaysScroll(page, 'setup')
    })
  })
}

test('an empty session shows the empty state instead of a blank page', async ({ page }) => {
  await page.goto('/?stage=player&data=empty')
  await expect(page.getByTestId('player-empty')).toBeVisible()
  await expect(page.getByRole('heading', { name: 'No exercises in this workout' })).toBeVisible()
  await page.getByRole('button', { name: 'Back to progress' }).click()
  await expect(page.getByTestId('progress')).toBeVisible()
})

test('a one-set session and a huge session still render', async ({ page }) => {
  await page.goto('/?stage=player&data=one')
  await expect(page.getByTestId('player')).toBeVisible()
  await page.goto('/?stage=player&data=huge')
  await expect(page.getByTestId('player')).toBeVisible()
})
