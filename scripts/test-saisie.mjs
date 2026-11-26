import puppeteer from 'puppeteer-core'

const CHROME = 'C:\\Users\\salym\\AppData\\Local\\Google\\Chrome\\Application\\chrome.exe'
const BASE = process.argv[2] || 'https://salymbo.github.io/LATRANSPORT/'
const EMAIL = process.env.CHECK_EMAIL
const PASS = process.env.CHECK_PASSWORD

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: true,
  args: ['--no-sandbox', '--disable-gpu', '--hide-scrollbars'],
})
const page = await browser.newPage()
page.setDefaultTimeout(25000)
const erreurs = []
page.on('pageerror', (e) => erreurs.push(e.message))
await page.setViewport({ width: 1600, height: 1000 })

await page.goto(BASE, { waitUntil: 'networkidle0' })
await page.click('a[href="#/espace"]')
await page.waitForSelector('.auth__form')
await page.type('#user', EMAIL)
await page.type('#pass', PASS)
await page.click('.auth__submit')
await page.waitForSelector('.kpi')

await page.evaluate(() => {
  ;[...document.querySelectorAll('.app__nav-item')].find((b) => b.textContent.trim() === 'Voyages')?.click()
})
await page.waitForSelector('.panel__outils .btn')
const avant = await page.$$eval('.table tbody tr', (r) => r.length)
console.log('voyages avant :', avant)

await page.click('.panel__outils .btn')
await page.waitForSelector('.modal__panel')

const setInput = (selector, valeur) =>
  page.$eval(
    selector,
    (el, v) => {
      const proto = el.tagName === 'SELECT' ? window.HTMLSelectElement.prototype : window.HTMLInputElement.prototype
      Object.getOwnPropertyDescriptor(proto, 'value').set.call(el, v)
      el.dispatchEvent(new Event('input', { bubbles: true }))
      el.dispatchEvent(new Event('change', { bubbles: true }))
    },
    valeur,
  )

const aujourdhui = new Date().toISOString().slice(0, 10)
const selects = await page.$$('.form-grid select')
await page.$eval('.form-grid input[type="date"]', (el, v) => {
  Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set.call(el, v)
  el.dispatchEvent(new Event('input', { bubbles: true }))
  el.dispatchEvent(new Event('change', { bubbles: true }))
}, aujourdhui)

await selects[0].evaluate((el) => {
  Object.getOwnPropertyDescriptor(window.HTMLSelectElement.prototype, 'value').set.call(el, '147 TU 227')
  el.dispatchEvent(new Event('change', { bubbles: true }))
})
await selects[1].evaluate((el) => {
  Object.getOwnPropertyDescriptor(window.HTMLSelectElement.prototype, 'value').set.call(el, 'Habib')
  el.dispatchEvent(new Event('change', { bubbles: true }))
})
await selects[2].evaluate((el) => {
  Object.getOwnPropertyDescriptor(window.HTMLSelectElement.prototype, 'value').set.call(el, '1/500')
  el.dispatchEvent(new Event('change', { bubbles: true }))
})
await selects[3].evaluate((el) => {
  Object.getOwnPropertyDescriptor(window.HTMLSelectElement.prototype, 'value').set.call(el, 'Police')
  el.dispatchEvent(new Event('change', { bubbles: true }))
})

await setInput('.form-grid__large input', 'Bizerte → Mateur')
await setInput('input[placeholder="ex. 1245/2026"]', '1245/2026')
await setInput('input[placeholder="ex. LT-0891"]', 'LT-0891')
await setInput('input[placeholder="Nom du client"]', 'Casa')
await setInput('input[type="number"]', '27.5')

await page.click('.modal__actions .btn--solid')
await page.waitForSelector('.panel__succes', { timeout: 20000 })

const apres = await page.evaluate(() => {
  const tr = document.querySelector('.table tbody tr')
  return {
    succes: document.querySelector('.panel__succes')?.textContent,
    lignes: document.querySelectorAll('.table tbody tr').length,
    premiereLigne: tr ? [...tr.children].map((td) => td.textContent.trim()) : null,
    kpis: [...document.querySelectorAll('.kpi')].map((k) => k.querySelector('.kpi__value')?.textContent),
  }
})

console.log('message :', apres.succes)
console.log('voyages après :', apres.lignes)
console.log('1re ligne :', JSON.stringify(apres.premiereLigne))
console.log('KPI :', apres.kpis.join(' | '))
await page.screenshot({ path: 'shots/voyage-enregistre.png', fullPage: true })
console.log('erreurs JS :', erreurs.length ? erreurs : 'aucune')
await browser.close()
