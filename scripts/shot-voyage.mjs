import puppeteer from 'puppeteer-core'

const CHROME = 'C:\\Users\\salym\\AppData\\Local\\Google\\Chrome\\Application\\chrome.exe'
const BASE = 'https://salymbo.github.io/LATRANSPORT/'

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: true,
  args: ['--no-sandbox', '--disable-gpu', '--hide-scrollbars'],
})
const page = await browser.newPage()
page.setDefaultTimeout(25000)
await page.setViewport({ width: 1600, height: 1000 })

await page.goto(BASE, { waitUntil: 'networkidle0' })
await page.click('a[href="#/espace"]')
await page.waitForSelector('.auth__form')
await page.type('#user', process.env.CHECK_EMAIL)
await page.type('#pass', process.env.CHECK_PASSWORD)
await page.click('.auth__submit')
await page.waitForSelector('.kpi')
await new Promise((r) => setTimeout(r, 800))

await page.evaluate(() => {
  ;[...document.querySelectorAll('.app__nav-item')].find((b) => b.textContent.trim() === 'Voyages')?.click()
})
await page.waitForSelector('.table tbody tr', { timeout: 20000 })
await new Promise((r) => setTimeout(r, 500))

const ligne = await page.$eval('.table tbody tr', (tr) => [...tr.children].map((td) => td.textContent.trim()))
console.log('ligne affichée :', JSON.stringify(ligne))
await page.screenshot({ path: 'shots/voyage-enregistre.png', fullPage: true })

await page.evaluate(() => {
  ;[...document.querySelectorAll('.app__nav-item')].find((b) => b.textContent.trim() === 'Vue générale')?.click()
})
await new Promise((r) => setTimeout(r, 900))
const kpis = await page.$$eval('.kpi', (els) => els.map((k) => `${k.querySelector('.kpi__label').textContent} = ${k.querySelector('.kpi__value').textContent}`))
console.log('KPI :', kpis.join(' | '))
await page.screenshot({ path: 'shots/dashboard-1-voyage.png', fullPage: true })

await browser.close()
