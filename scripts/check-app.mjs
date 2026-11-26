import puppeteer from 'puppeteer-core'

const CHROME = 'C:\\Users\\salym\\AppData\\Local\\Google\\Chrome\\Application\\chrome.exe'
const BASE = process.argv[2] || 'http://127.0.0.1:5173/'
const EMAIL = process.env.CHECK_EMAIL
const PASS = process.env.CHECK_PASSWORD
const OUT = 'shots'

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: true,
  args: ['--no-sandbox', '--disable-gpu', '--hide-scrollbars'],
})

const page = await browser.newPage()
page.setDefaultTimeout(15000)
const erreurs = []
page.on('console', (m) => m.type() === 'error' && erreurs.push(m.text()))
page.on('pageerror', (e) => erreurs.push(`pageerror: ${e.message}`))
await page.setViewport({ width: 1440, height: 900 })

await page.goto(BASE, { waitUntil: 'networkidle0' })
await page.click('a[href="#/espace"]')
await page.waitForSelector('.auth__form')

await page.type('#user', EMAIL)
await page.type('#pass', PASS)
await page.click('.auth__submit')
await page.waitForSelector('.app')
await page.waitForSelector('.kpi', { timeout: 20000 })
await new Promise((r) => setTimeout(r, 400))

const infos = await page.evaluate(() => ({
  titre: document.querySelector('.app__top h1')?.textContent,
  bandeauDemo: !!document.querySelector('.app__bandeau'),
  kpis: [...document.querySelectorAll('.kpi')].map((k) => ({
    label: k.querySelector('.kpi__label')?.textContent,
    valeur: k.querySelector('.kpi__value')?.textContent,
    note: k.querySelector('.kpi__note')?.textContent,
  })),
  voyagesAffiches: document.querySelectorAll('.feed li').length,
}))

console.log('Connexion :', EMAIL)
console.log('Titre :', infos.titre)
console.log('Bandeau démo :', infos.bandeauDemo ? 'PRÉSENT (problème)' : 'absent ✅')
console.log('KPI :')
infos.kpis.forEach((k) => console.log(`   ${k.label} = ${k.valeur} (${k.note})`))
console.log('Derniers voyages listés :', infos.voyagesAffiches)

await page.screenshot({ path: `${OUT}/espace-supabase.png`, fullPage: true })

// Vues
for (const [label, file] of [
  ['Camions', 'espace-supabase-camions.png'],
  ['Chauffeurs', 'espace-supabase-chauffeurs.png'],
  ['Voyages', 'espace-supabase-voyages.png'],
]) {
  await page.evaluate((l) => {
    ;[...document.querySelectorAll('.app__nav-item')].find((b) => b.textContent.trim() === l)?.click()
  }, label)
  await new Promise((r) => setTimeout(r, 400))
  const lignes = await page.$$eval('.table tbody tr', (rows) => rows.length)
  console.log(`Vue ${label} : ${lignes} lignes`)
  await page.screenshot({ path: `${OUT}/${file}`, fullPage: true })
}

// Persistance après rechargement
await page.reload({ waitUntil: 'networkidle0' })
await new Promise((r) => setTimeout(r, 800))
const apresReload = await page.evaluate(() => ({
  hash: location.hash,
  app: !!document.querySelector('.app'),
  auth: !!document.querySelector('.auth__form'),
}))
console.log('Après rechargement :', JSON.stringify(apresReload))

// Déconnexion
await page.evaluate(() => document.querySelector('.app__logout')?.click())
await page.waitForSelector('.auth__form')
console.log('Déconnexion : OK')

// Mauvais mot de passe
await page.type('#user', EMAIL)
await page.type('#pass', 'mauvais-mot-de-passe')
await page.click('.auth__submit')
await page.waitForSelector('.auth__error')
console.log('Mauvais mot de passe :', await page.$eval('.auth__error', (e) => e.textContent))

console.log('\nerreurs console :', erreurs.length ? erreurs : 'aucune')
await browser.close()
