import puppeteer from 'puppeteer-core'

const CHROME = 'C:\\Users\\salym\\AppData\\Local\\Google\\Chrome\\Application\\chrome.exe'
const URL = process.argv[2] || 'http://127.0.0.1:8080/LATRANSPORT/'

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: true,
  args: ['--no-sandbox', '--disable-gpu', '--hide-scrollbars'],
})

const page = await browser.newPage()
const failed = []
const errors = []
page.on('requestfailed', (r) => failed.push(`${r.failure()?.errorText} ${r.url()}`))
page.on('response', (r) => {
  if (r.status() >= 400) failed.push(`HTTP ${r.status()} ${r.url()}`)
})
page.on('console', (m) => {
  if (m.type() === 'error') errors.push(m.text())
})

await page.setViewport({ width: 1440, height: 900 })
await page.goto(URL, { waitUntil: 'networkidle0', timeout: 30000 })
await new Promise((r) => setTimeout(r, 1200))

const info = await page.evaluate(() => ({
  title: document.title,
  h1: document.querySelector('h1')?.innerText.replace(/\n/g, ' '),
  logoLoaded: (() => {
    const img = document.querySelector('.hero__logo')
    return img ? img.complete && img.naturalWidth > 0 : false
  })(),
  logoUrl: document.querySelector('.hero__logo')?.currentSrc,
  favicon: document.querySelector('link[rel="icon"]')?.href,
  sections: [...document.querySelectorAll('section')].map((s) => s.id).filter(Boolean),
}))

console.log(JSON.stringify({ ...info, failedRequests: failed, consoleErrors: errors }, null, 2))

await page.screenshot({ path: 'shots/pages-preview.png', fullPage: false })
await browser.close()
