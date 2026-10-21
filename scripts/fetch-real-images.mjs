// Node.js script to fetch authentic photographs from Wikimedia Commons & Unsplash
import fs from 'fs'
import path from 'path'

const imgDir = path.resolve('public/images/products')
if (!fs.existsSync(imgDir)) {
  fs.mkdirSync(imgDir, { recursive: true })
}

const userAgent = 'PaanMandiWholesale/1.0 (admin@paanmandi.in; educational Indian paan heritage platform)'

// Search Wikimedia Commons API for a title, retrieve the 640px thumbnail URL, and download
async function fetchFromWikimedia(searchTerm, targetFileName) {
  try {
    const apiUrl = `https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch=${encodeURIComponent(searchTerm)}&gsrnamespace=6&gsrlimit=3&prop=imageinfo&iiprop=url&iiurlwidth=640&format=json`
    const res = await fetch(apiUrl, {
      headers: { 'User-Agent': userAgent }
    })
    if (!res.ok) {
      console.log(`[API FAIL] ${searchTerm}: status ${res.status}`)
      return false
    }
    const data = await res.json()
    const pages = data.query?.pages
    if (!pages) {
      console.log(`[NO PAGES] ${searchTerm}`)
      return false
    }
    
    // Pick first valid imageinfo with thumburl or url
    let imgUrl = null
    for (const id in pages) {
      const page = pages[id]
      const info = page.imageinfo?.[0]
      if (info?.thumburl || info?.url) {
        imgUrl = info.thumburl || info.url
        break
      }
    }

    if (!imgUrl) {
      console.log(`[NO URL] ${searchTerm}`)
      return false
    }

    console.log(`[DOWNLOADING] ${searchTerm} -> ${targetFileName} from ${imgUrl}`)
    const imgRes = await fetch(imgUrl, {
      headers: { 'User-Agent': userAgent }
    })
    if (!imgRes.ok) {
      console.log(`[IMG FAIL] ${targetFileName}: ${imgRes.status}`)
      return false
    }
    const buffer = Buffer.from(await imgRes.arrayBuffer())
    const dest = path.join(imgDir, targetFileName)
    fs.writeFileSync(dest, buffer)
    console.log(`[OK] Saved ${targetFileName} (${buffer.length} bytes)`)
    return true
  } catch (err) {
    console.error(`[ERROR] ${searchTerm}:`, err.message)
    return false
  }
}

// Download direct URL (e.g. Unsplash or direct CDN)
async function fetchDirect(url, targetFileName) {
  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }
    })
    if (!res.ok) {
      console.log(`[DIRECT FAIL] ${targetFileName}: ${res.status}`)
      return false
    }
    const buffer = Buffer.from(await res.arrayBuffer())
    const dest = path.join(imgDir, targetFileName)
    fs.writeFileSync(dest, buffer)
    console.log(`[OK DIRECT] Saved ${targetFileName} (${buffer.length} bytes)`)
    return true
  } catch (err) {
    console.error(`[ERROR DIRECT] ${targetFileName}:`, err.message)
    return false
  }
}

async function run() {
  console.log('Testing image fetch for authentic paan supplies...')
  await fetchFromWikimedia('Fennel seeds', 'item-01-saunf.webp')
  await fetchFromWikimedia('Cardamom pods', 'item-32-elaichi.webp')
  await fetchFromWikimedia('Cloves spice', 'item-33-laung.webp')
}

run()
