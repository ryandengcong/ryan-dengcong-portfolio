import { expect, test } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

test('all sections, local illustrations, and valid navigation render without page errors', async ({ page }) => {
  const errors: string[] = []
  page.on('pageerror', (error) => errors.push(error.message))
  await page.goto('/')
  await expect(page).toHaveTitle(/Ryan M. Dengcong/)
  await expect(page.getByRole('heading', { level: 1 })).toHaveAttribute('aria-label', 'Building purposeful digital experiences.')
  await expect(page.getByRole('heading', { level: 1 })).toContainText('digital experiences')
  await expect(page.locator('link[rel="icon"]')).toHaveAttribute('href', './favicon.svg')
  await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', /web developer and programmer/i)
  await expect(page.locator('meta[property="og:image"]')).toHaveAttribute('content', /social-preview\.png$/)
  await expect(page.request.get('/images/social-preview.png').then((response) => response.status())).resolves.toBe(200)
  for (const section of ['home', 'about', 'skills', 'projects', 'contact']) {
    await expect(page.locator(`section#${section}`)).toHaveCount(1)
  }
  await page.getByRole('link', { name: 'Explore my work' }).click()
  await expect(page).toHaveURL(/#projects$/)
  const images = page.locator('.project-image-button img')
  await expect(images).toHaveCount(3)
  await expect(page.getByText('DEMONSTRATION · CONCEPT')).toHaveCount(3)
  await expect(page.locator('#projects')).toContainText('demonstrations rather than shipped or client work')
  for (const image of await images.all()) {
    await image.scrollIntoViewIfNeeded()
    await expect(image).toBeVisible()
    await expect.poll(() => image.evaluate((node: HTMLImageElement) => node.complete && node.naturalWidth > 0)).toBe(true)
  }
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true)
  expect(errors).toEqual([])
})

test('sample details dialog traps focus, closes with Escape, and restores focus', async ({ page }) => {
  await page.goto('/')
  const trigger = page.getByRole('button', { name: 'View Forma project details' })
  await trigger.click()
  const dialog = page.getByRole('dialog')
  await expect(dialog).toBeVisible()
  await expect(dialog.getByRole('heading')).toHaveText('Forma')
  await expect(dialog.getByText('SAMPLE PROJECT · CONCEPT ONLY')).toBeVisible()
  await expect(dialog.getByText('Repository link not added yet')).toBeVisible()
  await page.keyboard.press('Tab')
  expect(await dialog.evaluate((node) => node.contains(document.activeElement))).toBe(true)
  await page.keyboard.press('Escape')
  await expect(dialog).not.toBeVisible()
  await expect(trigger).toBeFocused()
  await trigger.click()
  const closeButton = page.getByRole('button', { name: 'Close project details' })
  await closeButton.click()
  await expect(dialog).toHaveClass(/is-closing/)
  await expect(dialog).not.toBeVisible()
})

test('mobile navigation opens, navigates, and dismisses with Escape', async ({ page, isMobile }) => {
  test.skip(!isMobile, 'Mobile menu is only present at mobile widths')
  await page.goto('/')
  const menu = page.getByRole('button', { name: 'Open navigation' })
  await menu.click()
  await expect(page.getByRole('navigation')).toBeVisible()
  await page.getByRole('navigation').getByRole('link', { name: 'Skills' }).click()
  await expect(page).toHaveURL(/#skills$/)
  await expect(page.getByRole('navigation')).not.toBeVisible()
  await menu.click()
  await page.keyboard.press('Escape')
  await expect(menu).toBeFocused()
  await expect(page.getByRole('navigation')).not.toBeVisible()
})

test('reduced-motion preference removes animation control and smooth scrolling', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/')
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
  await expect(page.getByRole('button', { name: 'Pause sculpture animation' })).toHaveCount(0)
  expect(await page.evaluate(() => getComputedStyle(document.documentElement).scrollBehavior)).toBe('auto')
  const card = page.locator('.project-card').nth(1)
  await card.scrollIntoViewIfNeeded()
  await card.hover({ position: { x: 20, y: 20 } })
  expect(await card.evaluate((node) => node.style.getPropertyValue('--image-x'))).toBe('0px')
})

test('project cards tilt gently with desktop pointer and settle back on exit', async ({ page, isMobile }) => {
  test.skip(isMobile, 'Project tilt is reserved for fine-pointer devices')
  await page.goto('/#projects')
  const card = page.locator('.project-card').nth(1)
  await card.scrollIntoViewIfNeeded()
  const bounds = await card.boundingBox()
  if (!bounds) throw new Error('Project card did not render')
  await page.mouse.move(bounds.x + bounds.width * 0.9, bounds.y + bounds.height * 0.15)
  await expect.poll(() => card.evaluate((node) => parseFloat(node.style.getPropertyValue('--image-x')))).toBeLessThan(-1)
  const rotation = await card.evaluate((node) => {
    const transform = new DOMMatrixReadOnly(getComputedStyle(node).transform)
    return Math.max(Math.abs(Math.atan2(transform.m23, transform.m33)), Math.abs(Math.atan2(transform.m12, transform.m11))) * 180 / Math.PI
  })
  expect(rotation).toBeLessThanOrEqual(2.6)
  await page.mouse.move(10, 10)
  await expect.poll(() => card.evaluate((node) => Math.abs(parseFloat(node.style.getPropertyValue('--image-x'))))).toBeLessThan(0.1)
})

test('WebGL failure preserves the artwork and the complete usable portfolio', async ({ page }) => {
  await page.addInitScript(() => {
    const original = HTMLCanvasElement.prototype.getContext
    // Simulate a browser/device with WebGL disabled while preserving 2D contexts.
    HTMLCanvasElement.prototype.getContext = function (type: string, ...args: unknown[]) {
      if (type === 'webgl' || type === 'webgl2' || type === 'experimental-webgl') return null
      return original.apply(this, [type, ...args] as Parameters<typeof original>)
    } as typeof original
  })
  await page.goto('/')
  await expect(page.getByTestId('sculpture-error-fallback')).toBeVisible()
  await page.getByRole('link', { name: 'Explore my work' }).click()
  await page.getByRole('button', { name: 'View Metric project details' }).click()
  await expect(page.getByRole('dialog').getByRole('heading')).toHaveText('Metric')
})

test('professional background and declared skills are shown without unverified technologies', async ({ page }) => {
  await page.goto('/#about')
  await expect(page.getByText('Bachelor of Science in Information Technology (BSIT)')).toBeVisible()
  await expect(page.getByText('Experienced developer')).toBeVisible()
  await expect(page.getByText('Frontend & Backend Development')).toBeVisible()
  await expect(page.getByText("Hi, I'm Ryan M. Dengcong, a Web Developer and Programmer with a background in Bachelor of Science in Information Technology and experience in both frontend and backend development.")).toBeVisible()

  const skills = page.locator('#skills')
  await expect(skills.locator('.skill-card')).toHaveCount(2)
  const frontend = skills.locator('.skill-card').filter({ has: page.getByRole('heading', { name: 'Frontend Development' }) })
  const backend = skills.locator('.skill-card').filter({ has: page.getByRole('heading', { name: 'Backend Development' }) })
  await expect(frontend.locator('.skill-tags')).toHaveText('HTMLCSSJavaScript')
  await expect(backend.locator('.skill-tags')).toHaveText('PHPPython')
  await expect(skills).not.toContainText(/React|TypeScript|Three\.js|Node\.js|SQL/)
})

test('configured email copy and GitHub contact links work', async ({ page, context }) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write'])
  await page.goto('/#contact')
  await expect(page.locator('.social-links').getByRole('link', { name: 'GitHub' })).toHaveAttribute('href', 'https://github.com/ryandengcong')
  const email = page.locator('.email-link')
  await expect(email).toHaveText('rdengcong@gmail.com')
  await expect(email).toHaveAttribute('href', 'mailto:rdengcong@gmail.com')
  await page.getByRole('button', { name: 'Copy email address' }).click()
  await expect(page.getByRole('status')).toHaveText('Copied')
  await expect.poll(() => page.evaluate(() => navigator.clipboard.readText())).toBe('rdengcong@gmail.com')
  await expect(page.locator('.social-placeholder')).toHaveCount(0)
  await expect(page.locator('a[href="mailto:"]')).toHaveCount(0)
  await expect(page.locator('a[href="#"]')).toHaveCount(0)
})

test('sculpture can be paused and safely falls back after context loss', async ({ page }) => {
  await page.goto('/')
  const canvas = page.locator('canvas')
  await expect(canvas).toBeVisible()
  await page.getByRole('button', { name: 'Pause sculpture animation' }).click()
  await expect(page.getByRole('button', { name: 'Play sculpture animation' })).toHaveAttribute('aria-pressed', 'true')
  await page.getByRole('button', { name: 'Play sculpture animation' }).click()
  await expect(page.getByRole('button', { name: 'Pause sculpture animation' })).toHaveAttribute('aria-pressed', 'false')
  await canvas.dispatchEvent('webglcontextlost', { cancelable: true })
  await expect(page.getByTestId('sculpture-fallback')).toBeVisible()
  await expect(canvas).toHaveCount(0)
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
})

test('page and project dialog pass automated WCAG accessibility checks', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/')
  for (const id of ['about', 'skills', 'projects', 'contact']) {
    await page.locator(`#${id}`).scrollIntoViewIfNeeded()
  }
  const pageAudit = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze()
  expect(pageAudit.violations).toEqual([])
  await page.getByRole('button', { name: 'View Forma project details' }).click()
  const dialogAudit = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze()
  expect(dialogAudit.violations).toEqual([])
})

test('layout fits small phones, tablets, and desktop widths', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/')
  for (const width of [320, 390, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 900 })
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true)
    if (width === 320) {
      expect(await page.locator('#hero-heading').evaluate((node) => node.scrollWidth <= node.clientWidth)).toBe(true)
    }
  }
})
