import puppeteer from 'puppeteer-core'

const CHROME = 'C:\\Users\\salym\\AppData\\Local\\Google\\Chrome\\Application\\chrome.exe'
const BASE = 'http://127.0.0.1:5173/'

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: true,
  args: ['--no-sandbox', '--disable-gpu', '--hide-scrollbars'],
})
const page = await browser.newPage()
page.setDefaultTimeout(8000)
await page.setViewport({ width: 1440, height: 900 })

const state = async () =>
  page.evaluate(() => ({
    href: location.href,
    hash: location.hash,
    auth: !!document.querySelector('.auth__form'),
    app: !!document.querySelector('.app'),
    hero: !!document.querySelector('.hero'),
    reveals: document.querySelectorAll('[data-reveal]').length,
    revealed: document.querySelectorAll('[data-reveal].is-in').length,
  }))

await page.goto(BASE, { waitUntil: 'networkidle0' })
console.log('départ', await state())

await page.click('a[href="#/espace"]')
await new Promise((r) => setTimeout(r, 400))
console.log('après clic espace', await state())

await page.type('#user', 'gerant')
await page.type('#pass', 'latransport2026')
await page.click('.auth__submit')
await page.waitForSelector('.app', { timeout: 8000 })
console.log('connecté', await state())

await page.evaluate(() => document.querySelector('.app__logout')?.click())
await new Promise((r) => setTimeout(r, 500))
console.log('déconnecté', await state())

await page.evaluate(() => {
  location.hash = ''
})
await new Promise((r) => setTimeout(r, 700))
console.log('retour accueil (hash vide)', await state())
await page.screenshot({ path: 'shots/debug-accueil.png' })

await page.evaluate(() => {
  location.hash = '#/espace'
})
await new Promise((r) => setTimeout(r, 700))
console.log('retour espace', await state())

await browser.close()
