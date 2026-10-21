const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const outputDir = path.join(__dirname, '..', 'public', 'images', 'products');
const heroDir = path.join(__dirname, '..', 'public', 'images');

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// 39 Products specification with unique iconography, primary color, secondary color, and texture motif
const PRODUCTS = [
  { id: '01', nameHi: 'सौंफ', nameEn: 'Saunf / Fennel', file: 'item-01-saunf.webp', bg1: '#E8F5E9', bg2: '#C8E6C9', color: '#2E7D32', accent: '#81C784', icon: '🌱', rate: '30' },
  { id: '02', nameHi: 'गरी', nameEn: 'Gari / Copra', file: 'item-02-gari.webp', bg1: '#EFEBE9', bg2: '#D7CCC8', color: '#5D4037', accent: '#A1887F', icon: '🥥', rate: '25' },
  { id: '03', nameHi: 'जगत', nameEn: 'Jagat', file: 'item-03-jagat.webp', bg1: '#FFF8E1', bg2: '#FFECB3', color: '#F57F17', accent: '#FFD54F', icon: '🏺', rate: '110' },
  { id: '04', nameHi: 'भोला', nameEn: 'Bhola', file: 'item-04-bhola.webp', bg1: '#F1F8E9', bg2: '#DCEDC8', color: '#558B2F', accent: '#9CCC65', icon: '🍃', rate: '60' },
  { id: '05', nameHi: '64 नंबर', nameEn: '64 Number', file: 'item-05-64-number.webp', bg1: '#F3E5F5', bg2: '#E1BEE7', color: '#6A1B9A', accent: '#BA68C8', icon: '🏷️', rate: '50' },
  { id: '06', nameHi: 'छोटा रसना', nameEn: 'Chhota Rasna', file: 'item-06-chhota-rasna.webp', bg1: '#FFF3E0', bg2: '#FFE0B2', color: '#E65100', accent: '#FFB74D', icon: '🧪', rate: '45' },
  { id: '07', nameHi: 'बड़ा रसना', nameEn: 'Bada Rasna', file: 'item-07-bada-rasna.webp', bg1: '#FBE9E7', bg2: '#FFCCBC', color: '#D84315', accent: '#FF8A65', icon: '🫙', rate: '65' },
  { id: '08', nameHi: 'पीली, काली वाली', nameEn: 'Peeli, Kaali Wali', file: 'item-08-peeli-kaali-wali.webp', bg1: '#FFFDE7', bg2: '#FFF9C4', color: '#FBC02D', accent: '#424242', icon: '⚖️', rate: '60' },
  { id: '09', nameHi: 'डमरू 64', nameEn: 'Damru 64', file: 'item-09-damru-64.webp', bg1: '#E0F2F1', bg2: '#B2DFDB', color: '#00695C', accent: '#4DB6AC', icon: '🥁', rate: '90' },
  { id: '10', nameHi: 'चौड़ी', nameEn: 'Chaudi', file: 'item-10-chaudi.webp', bg1: '#E8EAF6', bg2: '#C5CAE9', color: '#283593', accent: '#7986CB', icon: '📐', rate: '35' },
  { id: '11', nameHi: 'डमरू 300', nameEn: 'Damru 300', file: 'item-11-damru-300.webp', bg1: '#E0F7FA', bg2: '#B2EBF2', color: '#00838F', accent: '#4DD0E1', icon: '⚜️', rate: '160' },
  { id: '12', nameHi: 'तीन हजार नंबर', nameEn: 'Teen Hazar No.', file: 'item-12-teen-hazar-number.webp', bg1: '#FCE4EC', bg2: '#F8BBD0', color: '#AD1457', accent: '#F06292', icon: '💎', rate: '90' },
  { id: '13', nameHi: 'महादेव', nameEn: 'Mahadev', file: 'item-13-mahadev.webp', bg1: '#EDE7F6', bg2: '#D1C4E9', color: '#4527A0', accent: '#9575CD', icon: '🔱', rate: '80' },
  { id: '14', nameHi: 'सूखा कत्था', nameEn: 'Sukha Kattha', file: 'item-14-sukha-kattha.webp', bg1: '#EFEBE9', bg2: '#D7CCC8', color: '#4E342E', accent: '#8D6E63', icon: '🪵', rate: '85' },
  { id: '15', nameHi: 'सरोज', nameEn: 'Saroj (15)', file: 'item-15-saroj.webp', bg1: '#F9FBE7', bg2: '#F0F4C3', color: '#827717', accent: '#DCE775', icon: '🪷', rate: '60' },
  { id: '16', nameHi: 'पाउच कत्था (16)', nameEn: 'Pouch Kattha 16', file: 'item-16-pouch-kattha.webp', bg1: '#EFEBE9', bg2: '#BCAAA4', color: '#3E2723', accent: '#6D4C41', icon: '📦', rate: '85' },
  { id: '17', nameHi: 'पाउच कत्था (17)', nameEn: 'Pouch Kattha 17', file: 'item-17-pouch-kattha.webp', bg1: '#D7CCC8', bg2: '#BCAAA4', color: '#4E342E', accent: '#795548', icon: '💼', rate: '25' },
  { id: '18', nameHi: 'सरोज (18)', nameEn: 'Saroj (18)', file: 'item-18-saroj.webp', bg1: '#F0F4C3', bg2: '#E6EE9C', color: '#9E9D24', accent: '#AFB42B', icon: '🏵️', rate: '60' },
  { id: '19', nameHi: 'पाउच जगत', nameEn: 'Pouch Jagat', file: 'item-19-pouch-jagat.webp', bg1: '#FFF9C4', bg2: '#FFF59D', color: '#F9A825', accent: '#FBC02D', icon: '✉️', rate: '30' },
  { id: '20', nameHi: 'पाउच कत्था (20)', nameEn: 'Pouch Kattha 20', file: 'item-20-pouch-kattha.webp', bg1: '#D7CCC8', bg2: '#A1887F', color: '#3E2723', accent: '#5D4037', icon: '🏷️', rate: '25' },
  { id: '21', nameHi: 'आशीर्वाद', nameEn: 'Ashirwad', file: 'item-21-ashirwad.webp', bg1: '#FFEBEE', bg2: '#FFCDD2', color: '#C62828', accent: '#E57373', icon: '🙏', rate: '40' },
  { id: '22', nameHi: 'पाउच भोला', nameEn: 'Pouch Bhola', file: 'item-22-pouch-bhola.webp', bg1: '#E8F5E9', bg2: '#C8E6C9', color: '#1B5E20', accent: '#4CAF50', icon: '🌿', rate: '20' },
  { id: '23', nameHi: 'पाउच 64', nameEn: 'Pouch 64', file: 'item-23-pouch-64.webp', bg1: '#EDE7F6', bg2: '#D1C4E9', color: '#512DA8', accent: '#7E57C2', icon: '🔖', rate: '20' },
  { id: '24', nameHi: 'गुलकंद', nameEn: 'Gulkand', file: 'item-24-gulkand.webp', bg1: '#FCE4EC', bg2: '#F8BBD0', color: '#880E4F', accent: '#C2185B', icon: '🌹', rate: '50' },
  { id: '25', nameHi: 'रवि', nameEn: 'Ravi', file: 'item-25-ravi.webp', bg1: '#FFF3E0', bg2: '#FFE0B2', color: '#EF6C00', accent: '#FFA726', icon: '☀️', rate: '65' },
  { id: '26', nameHi: 'कालवी (लाल वाली)', nameEn: 'Kalvi (Laal)', file: 'item-26-kalvi-laal-wali.webp', bg1: '#FFEBEE', bg2: '#EF9A9A', color: '#B71C1C', accent: '#E53935', icon: '🔴', rate: '70' },
  { id: '27', nameHi: 'लच्छा', nameEn: 'Lachha', file: 'item-27-lachha.webp', bg1: '#FFF8E1', bg2: '#FFECB3', color: '#FFA000', accent: '#FFD54F', icon: '🥥', rate: '15' },
  { id: '28', nameHi: 'मुलैठी', nameEn: 'Mulethi', file: 'item-28-mulethi.webp', bg1: '#EFEBE9', bg2: '#D7CCC8', color: '#6D4C41', accent: '#8D6E63', icon: '🥢', rate: '30' },
  { id: '29', nameHi: 'चेरी', nameEn: 'Cherry', file: 'item-29-cherry.webp', bg1: '#FFEBEE', bg2: '#FFCDD2', color: '#D32F2F', accent: '#EF5350', icon: '🍒', rate: '15' },
  { id: '30', nameHi: 'मिक्सचर', nameEn: 'Mixture', file: 'item-30-mixture.webp', bg1: '#FFF3E0', bg2: '#FFE0B2', color: '#F57C00', accent: '#FFB74D', icon: '🥗', rate: '15' },
  { id: '31', nameHi: 'निर्मली', nameEn: 'Nirmali', file: 'item-31-nirmali.webp', bg1: '#E0F2F1', bg2: '#80CBC4', color: '#004D40', accent: '#26A69A', icon: '🌰', rate: '75' },
  { id: '32', nameHi: 'इलायची', nameEn: 'Elaichi / Cardamom', file: 'item-32-elaichi.webp', bg1: '#E8F5E9', bg2: '#A5D6A7', color: '#1B5E20', accent: '#66BB6A', icon: '✨', rate: '160' },
  { id: '33', nameHi: 'लौंग', nameEn: 'Laung / Cloves', file: 'item-33-laung.webp', bg1: '#EFEBE9', bg2: '#BCAAA4', color: '#3E2723', accent: '#5D4037', icon: '📌', rate: '60' },
  { id: '34', nameHi: 'पिपरमिंट', nameEn: 'Peppermint', file: 'item-34-peppermint.webp', bg1: '#E0F7FA', bg2: '#80DEEA', color: '#006064', accent: '#26C6DA', icon: '❄️', rate: '25' },
  { id: '35', nameHi: 'ब्रास', nameEn: 'Brass Box', file: 'item-35-brass.webp', bg1: '#FFF8E1', bg2: '#FFE082', color: '#F57F17', accent: '#FFCA28', icon: '🏆', rate: '25' },
  { id: '36', nameHi: 'भोला भांग', nameEn: 'Bhola Bhang', file: 'item-36-bhola-bhang.webp', bg1: '#ECEFF1', bg2: '#CFD8DC', color: '#37474F', accent: '#78909C', icon: '🔒', rate: '45' },
  { id: '37', nameHi: 'चूना', nameEn: 'Chuna / Lime', file: 'item-37-chuna.webp', bg1: '#FAFAFA', bg2: '#EEEEEE', color: '#616161', accent: '#9E9E9E', icon: '⚪', rate: '20' },
  { id: '38', nameHi: 'चूना ट्यूब', nameEn: 'Chuna Tube', file: 'item-38-chuna-tube.webp', bg1: '#E0F2F1', bg2: '#B2DFDB', color: '#00796B', accent: '#4DB6AC', icon: '🧴', rate: '50' },
  { id: '39', nameHi: 'किमाम', nameEn: 'Kimam', file: 'item-39-kimam.webp', bg1: '#ECEFF1', bg2: '#B0BEC5', color: '#263238', accent: '#607D8B', icon: '🛡️', rate: '65' },
];

function generateProductSvg(p) {
  return `
<svg width="600" height="600" viewBox="0 0 600 600" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="bgGrad" cx="50%" cy="40%" r="70%">
      <stop offset="0%" stop-color="${p.bg1}" />
      <stop offset="100%" stop-color="${p.bg2}" />
    </radialGradient>
    <linearGradient id="cardGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FFFFFF" stop-opacity="0.9" />
      <stop offset="100%" stop-color="#FFFFFF" stop-opacity="0.4" />
    </linearGradient>
    <filter id="softShadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="12" stdDeviation="16" flood-color="${p.color}" flood-opacity="0.18" />
    </filter>
  </defs>

  <!-- Background Canvas -->
  <rect width="600" height="600" fill="url(#bgGrad)" />

  <!-- Decorative Outer Pattern Rings -->
  <circle cx="300" cy="270" r="230" fill="none" stroke="${p.accent}" stroke-width="1.5" stroke-dasharray="4 6" opacity="0.45" />
  <circle cx="300" cy="270" r="185" fill="none" stroke="${p.color}" stroke-width="1" opacity="0.3" />

  <!-- Botanical Leaf Sprigs in Corner -->
  <g opacity="0.25" fill="${p.color}">
    <path d="M 40,40 Q 90,60 110,120 Q 50,110 40,40 Z" />
    <path d="M 560,40 Q 510,60 490,120 Q 550,110 560,40 Z" />
    <path d="M 40,560 Q 90,540 110,480 Q 50,490 40,560 Z" />
    <path d="M 560,560 Q 510,540 490,480 Q 550,490 560,560 Z" />
  </g>

  <!-- Center Floating Studio Pedestal -->
  <ellipse cx="300" cy="380" rx="140" ry="26" fill="${p.color}" opacity="0.15" />
  <circle cx="300" cy="270" r="140" fill="url(#cardGrad)" stroke="#FFFFFF" stroke-width="3" filter="url(#softShadow)" />

  <!-- Central Emblem / Iconography -->
  <circle cx="300" cy="270" r="105" fill="${p.color}" opacity="0.08" />
  <text x="300" y="295" font-size="88" text-anchor="middle" font-family="'Apple Color Emoji', 'Segoe UI Emoji', sans-serif">
    ${p.icon}
  </text>

  <!-- Top Badge: Item Number & Rate List ID -->
  <rect x="220" y="32" width="160" height="34" rx="17" fill="#123F2B" />
  <text x="300" y="54" fill="#FFFFFF" font-size="13" font-weight="bold" font-family="sans-serif" text-anchor="middle" letter-spacing="1.5">
    ITEM #${p.id} • MANDI
  </text>

  <!-- Bottom Elegant Title Plaque -->
  <g transform="translate(50, 440)">
    <rect width="500" height="120" rx="18" fill="#FFFFFF" fill-opacity="0.95" stroke="${p.color}" stroke-opacity="0.2" filter="url(#softShadow)" />
    
    <!-- Hindi Name -->
    <text x="250" y="42" fill="#123F2B" font-size="28" font-weight="bold" font-family="'Noto Sans Devanagari', 'Rozha One', sans-serif" text-anchor="middle">
      ${p.nameHi}
    </text>
    
    <!-- English Name -->
    <text x="250" y="68" fill="#555555" font-size="16" font-weight="600" font-family="sans-serif" text-anchor="middle">
      ${p.nameEn}
    </text>

    <!-- Mandi Rate Tag & Unit Note -->
    <rect x="170" y="80" width="160" height="26" rx="13" fill="#17643D" />
    <text x="250" y="97" fill="#FFFFFF" font-size="13" font-weight="bold" font-family="sans-serif" text-anchor="middle">
      RATE: ₹${p.rate}
    </text>
  </g>
</svg>
  `;
}

function generateHeroPaanSvg() {
  return `
<svg width="800" height="800" viewBox="0 0 800 800" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="heroGlow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#4CAF50" stop-opacity="0.35" />
      <stop offset="60%" stop-color="#1B5E20" stop-opacity="0.1" />
      <stop offset="100%" stop-color="#123F2B" stop-opacity="0" />
    </radialGradient>
    <linearGradient id="leafGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#43A047" />
      <stop offset="50%" stop-color="#2E7D32" />
      <stop offset="100%" stop-color="#1B5E20" />
    </linearGradient>
    <linearGradient id="leafGrad2" x1="100%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#66BB6A" />
      <stop offset="60%" stop-color="#388E3C" />
      <stop offset="100%" stop-color="#1B5E20" />
    </linearGradient>
    <linearGradient id="silverVark" x1="0%" y1="0%" x2="100%" y2="80%">
      <stop offset="0%" stop-color="#FFFFFF" stop-opacity="0.95" />
      <stop offset="25%" stop-color="#E0E0E0" stop-opacity="0.8" />
      <stop offset="50%" stop-color="#FFFFFF" stop-opacity="0.98" />
      <stop offset="75%" stop-color="#CFD8DC" stop-opacity="0.75" />
      <stop offset="100%" stop-color="#FFFFFF" stop-opacity="0.9" />
    </linearGradient>
    <radialGradient id="goldPlate" cx="45%" cy="40%" r="60%">
      <stop offset="0%" stop-color="#FFF9C4" />
      <stop offset="40%" stop-color="#FFD54F" />
      <stop offset="80%" stop-color="#FFA000" />
      <stop offset="100%" stop-color="#B58A45" />
    </radialGradient>
    <filter id="paanShadow" x="-30%" y="-30%" width="160%" height="160%">
      <feDropShadow dx="0" dy="18" stdDeviation="24" flood-color="#0B2014" flood-opacity="0.45" />
    </filter>
  </defs>

  <!-- Ambient Light Halo -->
  <circle cx="400" cy="400" r="380" fill="url(#heroGlow)" />

  <!-- Traditional Polished Brass Thali Base -->
  <g filter="url(#paanShadow)">
    <circle cx="400" cy="420" r="280" fill="url(#goldPlate)" stroke="#D4AF37" stroke-width="6" />
    <circle cx="400" cy="420" r="255" fill="none" stroke="#FFE082" stroke-width="2.5" stroke-dasharray="6 8" opacity="0.8" />
    <circle cx="400" cy="420" r="240" fill="#123F2B" opacity="0.08" />
  </g>

  <!-- Fresh Underlying Banarasi Leaves Layer -->
  <g transform="translate(400, 410) rotate(-18)" filter="url(#paanShadow)">
    <path d="M 0,-180 C 130,-120 190,40 100,160 C 20,240 0,260 0,260 C 0,260 -20,240 -100,160 C -190,40 -130,-120 0,-180 Z"
          fill="url(#leafGrad2)" stroke="#81C784" stroke-width="1.5" opacity="0.95" />
    <!-- Leaf Central Spine & Veins -->
    <path d="M 0,-170 Q 0,40 0,250" stroke="#A5D6A7" stroke-width="3" fill="none" opacity="0.7" />
  </g>

  <g transform="translate(400, 410) rotate(32)" filter="url(#paanShadow)">
    <path d="M 0,-180 C 130,-120 190,40 100,160 C 20,240 0,260 0,260 C 0,260 -20,240 -100,160 C -190,40 -130,-120 0,-180 Z"
          fill="url(#leafGrad1)" stroke="#81C784" stroke-width="1.5" opacity="0.9" />
  </g>

  <!-- The Master Banarasi Gilori (Triangular Fold) -->
  <g transform="translate(400, 395)" filter="url(#paanShadow)">
    <!-- Base Triangular Fold -->
    <path d="M 0,-140 L 150,110 Q 0,85 -150,110 Z" fill="url(#leafGrad1)" stroke="#A5D6A7" stroke-width="2.5" />
    
    <!-- Secondary Overlapping Wing Fold -->
    <path d="M -150,110 L 0,-140 L 40,100 Z" fill="url(#leafGrad2)" opacity="0.92" />
    <path d="M 0,-140 L 150,110 L -30,80 Z" fill="url(#leafGrad1)" opacity="0.88" />

    <!-- Pure Silver Foil (Chaandi Ka Vark) Patches -->
    <polygon points="-40,-20 30,-50 60,30 -10,40" fill="url(#silverVark)" opacity="0.9" />
    <polygon points="-90,40 -30,10 -20,70 -80,90" fill="url(#silverVark)" opacity="0.85" />
    <polygon points="20,-80 70,-70 50,-20 10,-40" fill="url(#silverVark)" opacity="0.8" />

    <!-- Gulkand & Fennel Sprinkles at Apex -->
    <circle cx="5" cy="5" r="7" fill="#C2185B" opacity="0.9" />
    <circle cx="-15" cy="18" r="5" fill="#880E4F" opacity="0.85" />
    <circle cx="22" cy="14" r="6" fill="#81C784" opacity="0.9" />
    <circle cx="-5" cy="30" r="5" fill="#AED581" opacity="0.9" />

    <!-- Aromatic Clove (Laung) Pinning the Fold -->
    <g transform="translate(0, -10) rotate(15)">
      <!-- Clove Stem -->
      <line x1="0" y1="0" x2="0" y2="40" stroke="#3E2723" stroke-width="7" stroke-linecap="round" />
      <circle cx="0" cy="0" r="10" fill="#4E342E" stroke="#FFD54F" stroke-width="1.5" />
      <!-- Clove Crown Segments -->
      <circle cx="-4" cy="-5" r="3" fill="#D7CCC8" />
      <circle cx="4" cy="-5" r="3" fill="#D7CCC8" />
      <circle cx="0" cy="4" r="3" fill="#D7CCC8" />
    </g>
  </g>

  <!-- Scattered Rose Petals & Cardamom on Thali -->
  <g fill="#E91E63" opacity="0.85">
    <path d="M 230,480 C 240,460 270,470 260,495 C 245,510 220,500 230,480 Z" />
    <path d="M 520,460 C 535,440 565,455 550,480 C 535,495 510,480 520,460 Z" />
    <path d="M 370,550 C 390,540 410,555 400,575 C 385,590 360,570 370,550 Z" />
  </g>
  <!-- Cardamom Pods -->
  <g fill="#81C784" stroke="#2E7D32" stroke-width="1.5">
    <ellipse cx="280" cy="450" rx="14" ry="7" transform="rotate(30 280 450)" />
    <ellipse cx="490" cy="510" rx="13" ry="6" transform="rotate(-40 490 510)" />
  </g>
</svg>
  `;
}

function generatePaanLeafSvg(variantIndex) {
  const angles = [-15, 12, -8, 20, -22, 10];
  const rot = angles[variantIndex % angles.length];
  const color1 = variantIndex % 2 === 0 ? '#43A047' : '#2E7D32';
  const color2 = variantIndex % 2 === 0 ? '#1B5E20' : '#388E3C';

  return `
<svg width="240" height="240" viewBox="0 0 240 240" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="orbitLeafGrad${variantIndex}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${color1}" />
      <stop offset="100%" stop-color="${color2}" />
    </linearGradient>
    <filter id="leafShadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="6" stdDeviation="8" flood-color="#051C0F" flood-opacity="0.35" />
    </filter>
  </defs>

  <g transform="translate(120, 120) rotate(${rot})" filter="url(#leafShadow)">
    <!-- Heart-shaped betel leaf silhouette -->
    <path d="M 0,-85 C 55,-55 80,15 45,65 C 10,95 0,105 0,105 C 0,105 -10,95 -45,65 C -80,15 -55,-55 0,-85 Z"
          fill="url(#orbitLeafGrad${variantIndex})" stroke="#81C784" stroke-width="1.8" />
    
    <!-- Central Spine -->
    <path d="M 0,-80 Q 0,20 0,100" stroke="#A5D6A7" stroke-width="2.5" fill="none" opacity="0.8" />
    
    <!-- Delicate Side Veins -->
    <path d="M 0,-40 Q 25,-30 40,-15" stroke="#A5D6A7" stroke-width="1.2" fill="none" opacity="0.6" />
    <path d="M 0,-40 Q -25,-30 -40,-15" stroke="#A5D6A7" stroke-width="1.2" fill="none" opacity="0.6" />
    <path d="M 0,-10 Q 30,5 45,25" stroke="#A5D6A7" stroke-width="1.2" fill="none" opacity="0.6" />
    <path d="M 0,-10 Q -30,5 -45,25" stroke="#A5D6A7" stroke-width="1.2" fill="none" opacity="0.6" />
    <path d="M 0,25 Q 25,40 32,55" stroke="#A5D6A7" stroke-width="1.2" fill="none" opacity="0.6" />
    <path d="M 0,25 Q -25,40 -32,55" stroke="#A5D6A7" stroke-width="1.2" fill="none" opacity="0.6" />

    <!-- Leaf Stem (Dandhi) -->
    <path d="M 0,105 Q 3,118 8,124" stroke="#1B5E20" stroke-width="3" fill="none" stroke-linecap="round" />
  </g>
</svg>
  `;
}

function generateFallbackSvg() {
  return `
<svg width="600" height="600" viewBox="0 0 600 600" xmlns="http://www.w3.org/2000/svg">
  <rect width="600" height="600" fill="#F6F8F5" />
  <circle cx="300" cy="270" r="140" fill="#E8F5E9" stroke="#17643D" stroke-width="2" />
  <text x="300" y="295" font-size="88" text-anchor="middle" font-family="sans-serif">🍃</text>
  <text x="300" y="460" fill="#123F2B" font-size="28" font-weight="bold" font-family="sans-serif" text-anchor="middle">PAAN MANDI</text>
  <text x="300" y="495" fill="#777777" font-size="16" font-family="sans-serif" text-anchor="middle">Product Photo Pending</text>
</svg>
  `;
}

async function run() {
  console.log('Generating 39 individual product WebP images...');
  for (const p of PRODUCTS) {
    const svg = generateProductSvg(p);
    const dest = path.join(outputDir, p.file);
    await sharp(Buffer.from(svg))
      .webp({ quality: 90 })
      .toFile(dest);
  }
  console.log('Done 39 products.');

  console.log('Generating Hero centerpiece Banarasi Paan WebP & PNG...');
  const heroSvg = generateHeroPaanSvg();
  await sharp(Buffer.from(heroSvg))
    .webp({ quality: 92 })
    .toFile(path.join(heroDir, 'hero-banarasi-paan.webp'));
  await sharp(Buffer.from(heroSvg))
    .png()
    .toFile(path.join(heroDir, 'hero-banarasi-paan.png'));

  console.log('Generating 6 individual orbiting paan leaf assets...');
  for (let i = 1; i <= 6; i++) {
    const leafSvg = generatePaanLeafSvg(i);
    await sharp(Buffer.from(leafSvg))
      .webp({ quality: 90 })
      .toFile(path.join(heroDir, `paan-leaf-${i}.webp`));
    await sharp(Buffer.from(leafSvg))
      .png()
      .toFile(path.join(heroDir, `paan-leaf-${i}.png`));
  }

  console.log('Generating fallback image...');
  await sharp(Buffer.from(generateFallbackSvg()))
    .webp({ quality: 90 })
    .toFile(path.join(heroDir, 'product-fallback.webp'));

  console.log('All image assets created successfully!');
}

run().catch((err) => {
  console.error('Asset generation failed:', err);
  process.exit(1);
});
