import puppeteer from 'puppeteer-core'
import { mkdirSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const here = dirname(fileURLToPath(import.meta.url))
const outDir = join(here, '..', 'shots')
mkdirSync(outDir, { recursive: true })

const CHROME = 'C:\\Users\\salym\\AppData\\Local\\Google\\Chrome\\Application\\chrome.exe'
const URL = process.env.SITE_URL || 'http://127.0.0.1:5173/'

async function autoScroll(page) {
  await page.evaluate(async () => {
    const step = Math.round(window.innerHeight * 0.8)
    for (let y = 0; y < document.body.scrollHeight; y += step) {
      window.scrollTo(0, y)
      await new Promise((r) => setTimeout(r, 120))
    }
    window.scrollTo(0, 0)
    await new Promise((r) => setTimeout(r, 300))
  })
}

async function report(page, label) {
  const data = await page.evaluate(() => {
    const vw = document.documentElement.clientWidth
    const overflowing = []
    for (const el of document.querySelectorAll('body *')) {
      const r = el.getBoundingClientRect()
      if (r.width === 0 && r.height === 0) continue
      if (r.right > vw + 1 || r.left < -1) {
        overflowing.push({
          tag: el.tagName.toLowerCase(),
          cls: (el.className || '').toString().slice(0, 60),
          left: Math.round(r.left),
          right: Math.round(r.right),
          width: Math.round(r.width),
        })
      }
    }
    return {
      vw,
      scrollWidth: document.documentElement.scrollWidth,
      bodyScrollWidth: document.body.scrollWidth,
      pageHeight: document.body.scrollHeight,
      overflowing: overflowing.slice(0, 12),
    }
  })
  console.log(`\n=== ${label}`)
  console.log(JSON.stringify(data, null, 2))
}

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: true,
  args: ['--no-sandbox', '--disable-gpu', '--hide-scrollbars'],
  defaultViewport: null,
})

try {
  // Desktop
  const desktop = await browser.newPage()
  await desktop.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 })
  await desktop.goto(URL, { waitUntil: 'networkidle0', timeout: 30000 })
  await autoScroll(desktop)
  await report(desktop, 'desktop 1440')
  await desktop.screenshot({ path: join(outDir, 'desktop.png'), fullPage: true })

  // Mobile
  const mobile = await browser.newPage()
  await mobile.setViewport({
    width: 390,
    height: 844,
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true,
  })
  await mobile.goto(URL, { waitUntil: 'networkidle0', timeout: 30000 })
  await autoScroll(mobile)
  await report(mobile, 'mobile 390')
  await mobile.screenshot({ path: join(outDir, 'mobile.png'), fullPage: true })

  // Mobile menu open
  await mobile.click('.burger')
  await mobile.waitForFunction(() => !document.querySelector('.menu')?.hasAttribute('hidden'), { timeout: 3000 })
  await mobile.screenshot({ path: join(outDir, 'mobile-menu.png') })
} finally {
  await browser.close()
}

console.log('\nCaptures écrites dans', outDir)
