import puppeteer from 'puppeteer-core'

const CHROME = 'C:\\Users\\salym\\AppData\\Local\\Google\\Chrome\\Application\\chrome.exe'
const BASE = process.argv[2] || 'http://127.0.0.1:5173/'
const EMAIL = process.env.CHECK_EMAIL
const PASS = process.env.CHECK_PASSWORD

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: true,
  args: ['--no-sandbox', '--disable-gpu', '--hide-scrollbars'],
})
const page = await browser.newPage()
page.setDefaultTimeout(20000)
const erreurs = []
page.on('pageerror', (e) => erreurs.push(e.message))
await page.setViewport({ width: 1440, height: 900 })

await page.goto(BASE, { waitUntil: 'networkidle0' })
await page.click('a[href="#/espace"]')
await page.waitForSelector('.auth__form')
await page.type('#user', EMAIL)
await page.type('#pass', PASS)
await page.click('.auth__submit')
await page.waitForSelector('.kpi')

// Vue Voyages
await page.evaluate(() => {
  ;[...document.querySelectorAll('.app__nav-item')].find((b) => b.textContent.trim() === 'Voyages')?.click()
})
await page.waitForSelector('.table')
const avant = await page.$$eval('.table tbody tr', (r) => r.length)
console.log('voyages avant :', avant)

// Ouvrir le formulaire
await page.click('.panel__outils .btn')
await page.waitForSelector('.modal__panel')
await page.screenshot({ path: 'shots/voyage-formulaire.png' })
console.log('formulaire ouvert — champs :', await page.$$eval('.modal__panel input, .modal__panel select', (e) => e.length))

const setReactValue = async (selector, valeur) => {
  await page.$eval(
    selector,
    (el, v) => {
      const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set
      setter.call(el, v)
      el.dispatchEvent(new Event('input', { bubbles: true }))
      el.dispatchEvent(new Event('change', { bubbles: true }))
    },
    valeur,
  )
}

const aujourdhui = new Date().toISOString().slice(0, 10)
await setReactValue('.form-grid input[type="date"]', aujourdhui)
await setReactValue('.form-grid__large input', 'Bizerte → Menzel Bourguiba')
await setReactValue('input[type="number"]', '27.5')
await page.click('.modal__actions .btn--solid')
await new Promise((r) => setTimeout(r, 2500))

const resultat = await page.evaluate(() => ({
  modalOuverte: !!document.querySelector('.modal__panel'),
  erreur: document.querySelector('.modal__erreur')?.textContent || null,
  succes: document.querySelector('.panel__succes')?.textContent || null,
  lignes: document.querySelectorAll('.table tbody tr').length,
}))

console.log('après enregistrement :', JSON.stringify(resultat, null, 2))
await page.screenshot({ path: 'shots/voyage-apres.png', fullPage: true })
console.log('erreurs JS :', erreurs.length ? erreurs : 'aucune')
await browser.close()
