import puppeteer from 'puppeteer-core'

const CHROME = 'C:\\Users\\salym\\AppData\\Local\\Google\\Chrome\\Application\\chrome.exe'
const BASE = process.argv[2] || 'http://127.0.0.1:5173/'
const OUT = 'shots'

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: true,
  args: ['--no-sandbox', '--disable-gpu', '--hide-scrollbars'],
})

const errors = []
const page = await browser.newPage()
page.setDefaultTimeout(10000)
page.on('console', (m) => m.type() === 'error' && errors.push(m.text()))
page.on('pageerror', (e) => errors.push(`pageerror: ${e.message}`))
await page.setViewport({ width: 1440, height: 900 })

const goHash = async (p, hash) => {
  await p.evaluate((h) => {
    location.hash = h
  }, hash)
  await new Promise((r) => setTimeout(r, 450))
}

// 1. Accueil → lien Espace gérant
await page.goto(BASE, { waitUntil: 'networkidle0' })
await page.click('a[href="#/espace"]')
await page.waitForSelector('.auth__form')
console.log('1. lien « Espace gérant » → page de connexion OK')
await page.screenshot({ path: `${OUT}/espace-login.png` })

// 2. Mauvais identifiants
await page.type('#user', 'gerant@latransport.tn')
await page.type('#pass', 'mauvais')
await page.click('.auth__submit')
await page.waitForSelector('.auth__error')
console.log('2. mauvais mot de passe → erreur :', await page.$eval('.auth__error', (e) => e.textContent))
await page.screenshot({ path: `${OUT}/espace-login-erreur.png` })

// 3. Bons identifiants
await page.$eval('#pass', (el) => {
  el.value = ''
})
await page.type('#pass', 'latransport2026')
await page.click('.auth__submit')
await page.waitForSelector('.app')
console.log('3. connexion → tableau de bord ; titre =', await page.$eval('.app__top h1', (e) => e.textContent))
await page.screenshot({ path: `${OUT}/espace-dashboard.png`, fullPage: true })

// 4. Autres vues
for (const [label, file] of [
  ['Camions', 'espace-camions.png'],
  ['Chauffeurs', 'espace-chauffeurs.png'],
  ['Voyages', 'espace-voyages.png'],
]) {
  await page.evaluate((l) => {
    const btn = [...document.querySelectorAll('.app__nav-item')].find((b) => b.textContent.trim() === l)
    btn?.click()
  }, label)
  await new Promise((r) => setTimeout(r, 350))
  await page.screenshot({ path: `${OUT}/${file}`, fullPage: true })
  console.log(`4. vue « ${label} » capturée`)
}

// 5. Accès direct sans session → connexion
const fresh = await browser.newPage()
fresh.setDefaultTimeout(10000)
await fresh.goto(`${BASE}#/dashboard`, { waitUntil: 'domcontentloaded' })
await new Promise((r) => setTimeout(r, 700))
console.log('5. accès direct #/dashboard sans session →', (await fresh.$('.auth__form')) ? 'connexion (protégé)' : 'PROBLÈME')
await fresh.close()

// 6. Déconnexion
await page.evaluate(() => document.querySelector('.app__logout')?.click())
await page.waitForSelector('.auth__form')
console.log('6. déconnexion → retour à la connexion OK')

// 7. Retour au site public
await goHash(page, '')
await page.waitForSelector('.hero')
const reveals = await page.$$eval('[data-reveal].is-in', (els) => els.length)
console.log(`7. retour site public → hero affiché, ${reveals} blocs révélés`)
await page.screenshot({ path: `${OUT}/site-accueil.png`, fullPage: true })

// 8. Mobile
const mobile = await browser.newPage()
mobile.setDefaultTimeout(10000)
await mobile.setViewport({ width: 390, height: 844, deviceScaleFactor: 2, isMobile: true, hasTouch: true })
await mobile.goto(BASE, { waitUntil: 'networkidle0' })
await goHash(mobile, '#/espace')
await mobile.waitForSelector('.auth__form')
await mobile.screenshot({ path: `${OUT}/espace-login-mobile.png`, fullPage: true })
await mobile.type('#user', 'gerant@latransport.tn')
await mobile.type('#pass', 'latransport2026')
await mobile.click('.auth__submit')
await mobile.waitForSelector('.app')
await new Promise((r) => setTimeout(r, 500))
await mobile.screenshot({ path: `${OUT}/espace-dashboard-mobile.png`, fullPage: true })
console.log('8. captures mobile OK')

console.log('\nerreurs console :', errors.length ? errors : 'aucune')
await browser.close()
