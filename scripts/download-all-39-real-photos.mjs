// Comprehensive downloader for authentic food photographs for all 39 PAAN MANDI products
import fs from 'fs'
import path from 'path'

const imgDir = path.resolve('public/images/products')
if (!fs.existsSync(imgDir)) {
  fs.mkdirSync(imgDir, { recursive: true })
}

const userAgent = 'PaanMandiWholesale/1.0 (admin@paanmandi.in; verified educational Indian spices & supplies)'



// 39 unique products with real photographic queries
const TARGETS = [
  { id: '01', file: 'item-01-saunf.webp', wikiQuery: 'Fennel seed' },
  { id: '02', file: 'item-02-gari.webp', wikiQuery: 'Desiccated coconut' },
  { id: '03', file: 'item-03-jagat.webp', wikiQuery: 'Areca nut' },
  { id: '04', file: 'item-04-bhola.webp', wikiQuery: 'Betel nut whole' },
  { id: '05', file: 'item-05-64-number.webp', wikiQuery: 'Mukhwas seeds' },
  { id: '06', file: 'item-06-chhota-rasna.webp', wikiQuery: 'Rose syrup' },
  { id: '07', file: 'item-07-bada-rasna.webp', wikiQuery: 'Syrup bottle' },
  { id: '08', file: 'item-08-peeli-kaali-wali.webp', wikiQuery: 'Betel nut slices' },
  { id: '09', file: 'item-09-damru-64.webp', wikiQuery: 'Areca catechu seed' },
  { id: '10', file: 'item-10-chaudi.webp', wikiQuery: 'Sliced areca nut' },
  { id: '11', file: 'item-11-damru-300.webp', wikiQuery: 'Crushed betel nut' },
  { id: '12', file: 'item-12-teen-hazar-number.webp', wikiQuery: 'Betel nut' },
  { id: '13', file: 'item-13-mahadev.webp', wikiQuery: 'Indian spices mix' },
  { id: '14', file: 'item-14-sukha-kattha.webp', wikiQuery: 'Acacia catechu extract' },
  { id: '15', file: 'item-15-saroj.webp', wikiQuery: 'Spice packet' },
  { id: '16', file: 'item-16-pouch-kattha.webp', wikiQuery: 'Catechu resin' },
  { id: '17', file: 'item-17-pouch-kattha.webp', wikiQuery: 'Catechu' },
  { id: '18', file: 'item-18-saroj.webp', wikiQuery: 'Herbal packet' },
  { id: '19', file: 'item-19-pouch-jagat.webp', wikiQuery: 'Pouch packaging' },
  { id: '20', file: 'item-20-pouch-kattha.webp', wikiQuery: 'Brown spice paste' },
  { id: '21', file: 'item-21-ashirwad.webp', wikiQuery: 'Ayurvedic powder' },
  { id: '22', file: 'item-22-pouch-bhola.webp', wikiQuery: 'Indian digestive seeds' },
  { id: '23', file: 'item-23-pouch-64.webp', wikiQuery: 'Spiced seeds' },
  { id: '24', file: 'item-24-gulkand.webp', wikiQuery: 'Gulkand' },
  { id: '25', file: 'item-25-ravi.webp', wikiQuery: 'Mouth freshener seeds' },
  { id: '26', file: 'item-26-kalvi-laal-wali.webp', wikiQuery: 'Sweetened fennel' },
  { id: '27', file: 'item-27-lachha.webp', wikiQuery: 'Shredded coconut' },
  { id: '28', file: 'item-28-mulethi.webp', wikiQuery: 'Licorice root' },
  { id: '29', file: 'item-29-cherry.webp', wikiQuery: 'Glace cherries' },
  { id: '30', file: 'item-30-mixture.webp', wikiQuery: 'Mukhwas' },
  { id: '31', file: 'item-31-nirmali.webp', wikiQuery: 'Herb seeds' },
  { id: '32', file: 'item-32-elaichi.webp', wikiQuery: 'Cardamom pods' },
  { id: '33', file: 'item-33-laung.webp', wikiQuery: 'Cloves whole' },
  { id: '34', file: 'item-34-peppermint.webp', wikiQuery: 'Menthol crystals' },
  { id: '35', file: 'item-35-brass.webp', wikiQuery: 'Brass box' },
  { id: '36', file: 'item-36-bhola-bhang.webp', wikiQuery: 'Herbal tablets' },
  { id: '37', file: 'item-37-chuna.webp', wikiQuery: 'Slaked lime' },
  { id: '38', file: 'item-38-chuna-tube.webp', wikiQuery: 'Ointment tube white' },
  { id: '39', file: 'item-39-kimam.webp', wikiQuery: 'Glass jar amber' },
]

// Unsplash backup library for food/spice photography
const UNSPLASH_BACKUPS = [
  'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=600&auto=format&fit=crop&q=80', // Fennel
  'https://images.unsplash.com/photo-1628088062854-d1870b4553da?w=600&auto=format&fit=crop&q=80', // Coconut
  'https://images.unsplash.com/photo-1509358271058-acd22cc93898?w=600&auto=format&fit=crop&q=80', // Spices
  'https://images.unsplash.com/photo-1615485500704-8e990f9900f7?w=600&auto=format&fit=crop&q=80', // Cloves/Cardamom
  'https://images.unsplash.com/photo-1587132137056-bfbf0166836e?w=600&auto=format&fit=crop&q=80', // Dried seeds
  'https://images.unsplash.com/photo-1532336414038-cf19250c5757?w=600&auto=format&fit=crop&q=80', // Spices market
  'https://images.unsplash.com/photo-1608797178974-15b35a61dd7f?w=600&auto=format&fit=crop&q=80', // Red cherries
  'https://images.unsplash.com/photo-1546548970-71785318a17b?w=600&auto=format&fit=crop&q=80', // Sweets
  'https://images.unsplash.com/photo-1514733670139-4d87a1941d55?w=600&auto=format&fit=crop&q=80', // Glass jar / conserve
]

async function fetchFromWikimedia(query) {
  try {
    const apiUrl = `https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch=${encodeURIComponent(query)}&gsrnamespace=6&gsrlimit=5&prop=imageinfo&iiprop=url&iiurlwidth=640&format=json`
    const res = await fetch(apiUrl, { headers: { 'User-Agent': userAgent } })
    if (!res.ok) return null
    const data = await res.json()
    const pages = data.query?.pages
    if (!pages) return null

    for (const key of Object.keys(pages)) {
      const page = pages[key]
      const info = page.imageinfo?.[0]
      const url = info?.thumburl || info?.url
      // Avoid SVGs or PDFs
      if (url && (url.endsWith('.jpg') || url.endsWith('.jpeg') || url.endsWith('.png') || url.includes('.jpg?') || url.includes('.jpeg?') || url.includes('.png?'))) {
        return url
      }
    }
  } catch (e) {
    return null
  }
  return null
}

async function downloadUrl(url, targetFile) {
  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' }
    })
    if (!res.ok) return false
    const buffer = Buffer.from(await res.arrayBuffer())
    if (buffer.length < 5000) return false // Too small, likely an error page
    fs.writeFileSync(path.join(imgDir, targetFile), buffer)
    return true
  } catch {
    return false
  }
}

async function processAll() {
  console.log(`Starting download of ${TARGETS.length} authentic food photographs...`)
  let successCount = 0

  for (let i = 0; i < TARGETS.length; i++) {
    const target = TARGETS[i]
    console.log(`[${i + 1}/${TARGETS.length}] Processing item ${target.id} (${target.wikiQuery})...`)

    let url = await fetchFromWikimedia(target.wikiQuery)
    let downloaded = false

    if (url) {
      downloaded = await downloadUrl(url, target.file)
      if (downloaded) {
        console.log(`  -> OK from Wikimedia: ${target.file}`)
        successCount++
        continue
      }
    }

    // Fallback if Wikimedia didn't match or failed
    const fallbackUrl = UNSPLASH_BACKUPS[i % UNSPLASH_BACKUPS.length]
    console.log(`  -> Falling back to curated food photography for ${target.file}`)
    downloaded = await downloadUrl(fallbackUrl, target.file)
    if (downloaded) {
      console.log(`  -> OK from Curated Library: ${target.file}`)
      successCount++
    } else {
      console.error(`  -> FAILED both sources for ${target.file}`)
    }

    // Polite delay to not overwhelm servers
    await new Promise(r => setTimeout(r, 200))
  }

  console.log(`\nCompleted! Successfully downloaded ${successCount}/${TARGETS.length} authentic photographs.`)
}

processAll()
