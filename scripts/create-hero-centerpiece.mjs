import sharp from 'sharp'
import fs from 'fs'

async function makeCenterpiece() {
  const size = 720
  // Clean circular mask
  const circleSvg = Buffer.from(
    `<svg width="${size}" height="${size}">
      <circle cx="${size / 2}" cy="${size / 2}" r="${size / 2 - 2}" fill="#fff"/>
    </svg>`
  )

  await sharp('public/images/hero-paan-cropped.png')
    .resize(size, size)
    .composite([{ input: circleSvg, blend: 'dest-in' }])
    .png()
    .toFile('public/images/hero-banarasi-paan.png')

  console.log('Successfully generated circular hero-banarasi-paan.png!')
}

makeCenterpiece().catch(console.error)
