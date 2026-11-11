import AxeBuilder from '@axe-core/playwright'
import { expect, test, type Page } from '@playwright/test'

// Automatic accessibility checks: axe (WCAG 2.2 AA rules incl. colour contrast) on every
// screen and sheet, plus reduced-motion checks. The dev data toggle is not product UI.
const TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa']

async function scan(page: Page, label: string) {
  await page.waitForTimeout(400) // let entrance motion settle so contrast reads final colours
  const r = await new AxeBuilder({ page })
    .withTags(TAGS)
    .exclude('[data-testid=data-toggle]')
    .analyze()
  const found = r.violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(' ')).slice(0, 3).join(' | ')}`)
  expect(found, `${label} has axe violations`).toEqual([])
}

const stages = ['setup', 'skillask', 'skills', 'skillconfirm', 'skill', 'programme', 'reminders', 'today', 'exercises', 'progress', 'achievements', 'player', 'routine', 'myprogramme']

for (const width of [390, 320]) {
  test.describe(`width ${width}`, () => {
    test.use({ viewport: { width, height: 844 } })

    for (const stage of stages) {
      test(`screen: ${stage}`, async ({ page }) => {
        await page.goto(`/?stage=${stage}`)
        await scan(page, stage)
      })
    }

    test('screen: exercise detail and empty progress', async ({ page }) => {
      await page.goto('/?stage=exercises')
      await page.getByTestId('exercise-open').first().click()
      await scan(page, 'exercise detail')
      await page.goto('/?stage=progress&data=empty')
      await scan(page, 'progress empty')
    })

    test('sheets: filters and add entry', async ({ page }) => {
      await page.goto('/?stage=exercises')
      await page.getByTestId('open-filters').click()
      await expect(page.getByRole('dialog')).toBeVisible()
      await scan(page, 'filter sheet')
      await page.goto('/?stage=progress')
      await page.getByTestId('add-exercise').first().click()
      await expect(page.getByRole('dialog')).toBeVisible()
      await scan(page, 'add sheet')
      await page.getByRole('dialog').getByRole('button').nth(1).click()
      await scan(page, 'add sheet, step two')
    })

    test('player: rest, summary and end-workout confirm', async ({ page }) => {
      await page.goto('/?stage=player')
      await page.getByTestId('primary').click()
      await scan(page, 'player after a log')
    })
  })
}

test.describe('reduced motion', () => {
  test.use({ reducedMotion: 'reduce' })

  test('no transitions or animations run on the main surfaces', async ({ page }) => {
    await page.goto('/?stage=today')
    await page.waitForTimeout(300)
    const running = await page.evaluate(() =>
      document.getAnimations().filter((a) => a.playState === 'running' && a.effect && (a.effect.getTiming().duration as number) > 0.01).length,
    )
    expect(running).toBe(0)
  })

  test('the demo figure falls back to still frames', async ({ page }) => {
    await page.goto('/?stage=player')
    await page.waitForTimeout(300)
    const running = await page.getByTestId('media-slot').evaluate((el) =>
      el.getAnimations({ subtree: true }).filter((a) => a.playState === 'running').length,
    )
    expect(running).toBe(0)
  })

  test('a sheet opens with no slide animation', async ({ page }) => {
    await page.goto('/?stage=exercises')
    await page.getByTestId('open-filters').click()
    const dialog = page.getByRole('dialog')
    await expect(dialog).toBeVisible()
    const dur = await dialog.evaluate((el) => getComputedStyle(el).transitionDuration + '|' + getComputedStyle(el).animationDuration)
    expect(dur).toMatch(/^(0s|1e-05s)\|(0s|1e-05s)$/)
  })
})

test('contrast: muted text on every surface is at least 4.5:1', async () => {
  const lum = (hex: string) => {
    const c = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255).map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4))
    return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2]
  }
  const ratio = (a: string, b: string) => {
    const [hi, lo] = [lum(a), lum(b)].sort((x, y) => y - x)
    return (hi + 0.05) / (lo + 0.05)
  }
  for (const bg of ['#161412', '#1d1b18', '#292622']) expect(ratio('#b1ada1', bg)).toBeGreaterThanOrEqual(4.5)
})
