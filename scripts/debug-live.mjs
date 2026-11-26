import puppeteer from 'puppeteer-core'

const CHROME = 'C:\\Users\\salym\\AppData\\Local\\Google\\Chrome\\Application\\chrome.exe'
const BASE = process.argv[2]
const EMAIL = process.env.CHECK_EMAIL
const PASS = process.env.CHECK_PASSWORD

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: true,
  args: ['--no-sandbox', '--disable-gpu'],
})

const page = await browser.newPage()
const reseaux = []
const erreurs = []
page.on('console', (m) => m.type() === 'error' && erreurs.push(m.text()))
page.on('pageerror', (e) => erreurs.push('pageerror: ' + e.message))
page.on('response', async (r) => {
  const u = r.url()
  if (u.includes('supabase.co')) reseaux.push(`${r.status()} ${r.request().method()} ${u.replace('https://lphbcryrfmkcpvkpyylo.supabase.co', '')}`)
})

await page.setViewport({ width: 1440, height: 900 })
await page.goto(BASE, { waitUntil: 'networkidle0' })
await page.click('a[href="#/espace"]')
await page.waitForSelector('.auth__form')
console.log('note démo visible :', !!(await page.$('.auth__note')))

await page.type('#user', EMAIL)
await page.type('#pass', PASS)
await page.click('.auth__submit')
await new Promise((r) => setTimeout(r, 6000))

const etat = await page.evaluate(() => ({
  hash: location.hash,
  app: !!document.querySelector('.app'),
  auth: !!document.querySelector('.auth__form'),
  erreur: document.querySelector('.auth__error')?.textContent || null,
  note: document.querySelector('.auth__note')?.textContent || null,
  bandeau: document.querySelector('.app__bandeau')?.textContent || null,
}))

console.log('état :', JSON.stringify(etat, null, 2))
console.log('requêtes supabase :', reseaux.length ? reseaux : 'aucune')
console.log('erreurs console :', erreurs.length ? erreurs : 'aucune')
await page.screenshot({ path: 'shots/live-debug.png' })
await browser.close()
