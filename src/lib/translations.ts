export type Language = 'en' | 'hi'

export const translations = {
  en: {
    // Brand
    brandName: 'PAAN MANDI',
    brandTagline: 'Aapki Paan Ki Dukaan, Ab Online!',
    announcement: 'Wholesale Paan & Shop Supplies at Mandi Rates • Pan-India Delivery',
    
    // Nav
    navShop: 'Shop Wholesale',
    navCategories: 'Categories',
    navCatalogue: 'All 39 Products',
    navAbout: 'About Us',
    navContact: 'Contact',
    navAdmin: 'Admin Dashboard',
    navAccount: 'Account',
    navOrders: 'My Orders',
    navLogin: 'Login / Register',
    navLogout: 'Sign Out',

    // Hero
    heroBadge: 'India’s #1 Wholesale Betel & Spice Mandi',
    heroTitlePrefix: 'Pure Indian Heritage,',
    heroTitleHighlight: 'Direct Mandi Rates',
    heroSubtitle: 'Supply your paan shop or event with authentic Banarasi leaves, Kattha, pure Chuna, Gulkand, Cardamom, and specialty mukhwas with total wholesale transparency.',
    heroCtaShop: 'Shop Wholesale',
    heroCtaExplore: 'Explore Products',
    heroStat1Val: '39+',
    heroStat1Lbl: 'Mandi Products',
    heroStat2Val: '100%',
    heroStat2Lbl: 'Rate Transparency',
    heroStat3Val: 'Pan-India',
    heroStat3Lbl: 'Cold & Safe Dispatch',
    scrollDown: 'Scroll to explore catalogue',

    // Category Tabs & Headings
    catAll: 'All Products (39)',
    catMukhya: 'मुख्य सामान (Main Supplies)',
    catAnya: 'अन्य सामान (Other Supplies)',
    featuredHeading: 'Wholesale Rate Catalogue',
    featuredSubheading: 'Verified supplier rates for all 39 essential paan mandi items. Transparent pricing for retailers and bulk buyers.',
    viewAllProducts: 'View Complete Catalogue',

    // Product Card & Details
    productSku: 'SKU',
    productSourceId: 'Item #',
    rate: 'Mandi Rate',
    unitUnconfirmedBadge: 'Needs Unit Confirmation',
    unitUnconfirmedTooltip: 'Rate supplied by owner. Packaging unit (kg/box/bundle/sachet) pending owner verification.',
    unitConfirmedBadge: 'Confirmed Unit',
    complianceReviewBadge: 'Compliance Review Required',
    complianceRestrictedMsg: 'This item requires legal verification before sale. Currently unavailable for checkout.',
    outOfStock: 'Sold Out',
    inStock: 'In Stock',
    moqLabel: 'Min. Order Qty',
    addToCart: 'Add to Cart',
    adding: 'Adding...',
    added: 'Added to Cart',
    viewDetails: 'View Details',
    duplicateNameNote: 'Distinct entry in rate list',

    // Filters & Search
    searchPlaceholder: 'Search by Hindi name, English name, or SKU...',
    filterCategory: 'Category',
    filterAllCategories: 'All Categories',
    filterStock: 'Stock Status',
    filterInStockOnly: 'In Stock Only',
    sortBy: 'Sort By',
    sortFeatured: 'Recommended',
    sortPriceAsc: 'Price: Low to High',
    sortPriceDesc: 'Price: High to Low',
    sortName: 'Product Name (A-Z)',
    resetFilters: 'Reset Filters',
    resultsFound: 'products found',
    noProductsFound: 'No products match your search criteria.',

    // Cart & Checkout
    cartTitle: 'Wholesale Cart',
    cartEmpty: 'Your wholesale cart is empty',
    cartSubtotal: 'Subtotal',
    cartTax: 'Estimated GST',
    cartDelivery: 'Delivery Fee',
    cartTotal: 'Grand Total',
    checkoutButton: 'Proceed to Wholesale Checkout',
    freeDeliveryNote: 'Free delivery on orders above ₹2,000',
    unitConfirmationDisclaimer: 'Notice: Some product units are subject to shop owner confirmation before final dispatch dispatch.',

    // Features / Wholesale Promises
    feature1Title: 'Direct Wholesale Rates',
    feature1Desc: 'Zero middlemen markup. Procure directly at genuine Mandi prices.',
    feature2Title: 'Fresh Banarasi Leaves',
    feature2Desc: 'Temperature-monitored packaging ensures leaves arrive crisp and aromatic.',
    feature3Title: 'Compliance & Safety',
    feature3Desc: 'Regulated items undergo strict verification. 100% legal transparency.',
    feature4Title: 'Pan-India Delivery',
    feature4Desc: 'Reliable freight and express dispatch across all major Indian commercial hubs.',

    // Admin
    adminDashboard: 'Admin Mandi Management',
    adminManageCatalogue: 'Manage 39 Rate List Records',
    adminEditRate: 'Edit Rate & Unit',
    adminConfirmUnit: 'Confirm Unit',
    adminUploadImage: 'Replace Photo',
    adminExportCsv: 'Export CSV',
    adminImportCsv: 'Import Rate List',
    adminComplianceReview: 'Compliance Status',
    adminSave: 'Save Changes',
    adminCancel: 'Cancel',

    // Language Toggle
    langEn: 'EN',
    langHi: 'हिन्दी',
    langToggleAria: 'Switch Language',
  },
  hi: {
    // Brand
    brandName: 'पान मंडी',
    brandTagline: 'आपकी पान की दुकान, अब ऑनलाइन!',
    announcement: 'थोक पान और दुकान का सामान मंडी भाव पर • पूरे भारत में सुरक्षित डिलीवरी',

    // Nav
    navShop: 'थोक खरीदारी करें',
    navCategories: 'श्रेणियां',
    navCatalogue: 'सभी 39 सामान',
    navAbout: 'हमारे बारे में',
    navContact: 'संपर्क करें',
    navAdmin: 'एडमिन डैशबोर्ड',
    navAccount: 'खाता',
    navOrders: 'मेरे ऑर्डर',
    navLogin: 'लॉग इन / रजिस्टर',
    navLogout: 'लॉग आउट',

    // Hero
    heroBadge: 'भारत की विश्वसनीय थोक पान और किराना मंडी',
    heroTitlePrefix: 'शुद्ध बनारसी परंपरा,',
    heroTitleHighlight: 'सीधे मंडी के भाव',
    heroSubtitle: 'अपनी पान की दुकान या उत्सव के लिए असली बनारसी पत्ते, सूखा कत्था, शुद्ध चूना, गुलकंद, इलायची और मखवास सीधे थोक भाव पर मंगाएं।',
    heroCtaShop: 'थोक खरीदारी करें',
    heroCtaExplore: 'सामान देखें',
    heroStat1Val: '39+',
    heroStat1Lbl: 'मंडी उत्पाद',
    heroStat2Val: '100%',
    heroStat2Lbl: 'भाव पारदर्शिता',
    heroStat3Val: 'अखिल भारतीय',
    heroStat3Lbl: 'शीतल व सुरक्षित डिलीवरी',
    scrollDown: 'सामान देखने के लिए नीचे स्क्रॉल करें',

    // Category Tabs & Headings
    catAll: 'सभी सामान (39)',
    catMukhya: 'मुख्य सामान',
    catAnya: 'अन्य सामान',
    featuredHeading: 'थोक भाव सूची',
    featuredSubheading: 'दुकानदारों और थोक खरीदारों के लिए 39 आवश्यक पान मंडी वस्तुओं के सत्यापित दर।',
    viewAllProducts: 'पूरी सूची देखें',

    // Product Card & Details
    productSku: 'एसकेयू',
    productSourceId: 'क्रमांक',
    rate: 'मंडी भाव',
    unitUnconfirmedBadge: 'इकाई पुष्टि प्रतीक्षित',
    unitUnconfirmedTooltip: 'दर मालिक द्वारा दी गई है। पैकेजिंग इकाई (किलो/पैकेट/डिब्बा/बंडल) मालिक की पुष्टि के अधीन है।',
    unitConfirmedBadge: 'पुष्ट इकाई',
    complianceReviewBadge: 'कानूनी समीक्षा आवश्यक',
    complianceRestrictedMsg: 'इस मद को बिक्री से पहले कानूनी सत्यापन की आवश्यकता है। वर्तमान में खरीद के लिए उपलब्ध नहीं है।',
    outOfStock: 'स्टॉक समाप्त',
    inStock: 'उपलब्ध',
    moqLabel: 'न्यूनतम ऑर्डर मात्रा',
    addToCart: 'कार्ट में जोड़ें',
    adding: 'जोड़ रहे हैं...',
    added: 'कार्ट में जोड़ा गया',
    viewDetails: 'विवरण देखें',
    duplicateNameNote: 'रेट लिस्ट में स्वतंत्र प्रविष्टि',

    // Filters & Search
    searchPlaceholder: 'हिंदी नाम, अंग्रेजी नाम या SKU से खोजें...',
    filterCategory: 'श्रेणी',
    filterAllCategories: 'सभी श्रेणियां',
    filterStock: 'स्टॉक स्थिति',
    filterInStockOnly: 'केवल उपलब्ध स्टॉक',
    sortBy: 'क्रमबद्ध करें',
    sortFeatured: 'अनुशंसित',
    sortPriceAsc: 'मूल्य: कम से ज्यादा',
    sortPriceDesc: 'मूल्य: ज्यादा से कम',
    sortName: 'उत्पाद का नाम (A-Z)',
    resetFilters: 'फ़िल्टर हटाएं',
    resultsFound: 'सामान मिले',
    noProductsFound: 'आपकी खोज के अनुसार कोई सामान नहीं मिला।',

    // Cart & Checkout
    cartTitle: 'थोक कार्ट',
    cartEmpty: 'आपकी थोक कार्ट खाली है',
    cartSubtotal: 'उप-योग',
    cartTax: 'अनुमानित जीएसटी',
    cartDelivery: 'डिलीवरी शुल्क',
    cartTotal: 'कुल योग',
    checkoutButton: 'थोक चेकआउट पर आगे बढ़ें',
    freeDeliveryNote: '₹2,000 से अधिक के ऑर्डर पर मुफ्त डिलीवरी',
    unitConfirmationDisclaimer: 'सूचना: अंतिम डिस्पैच से पहले कुछ उत्पादों की इकाई दुकानदार की पुष्टि के अधीन हो सकती है।',

    // Features / Wholesale Promises
    feature1Title: 'सीधे थोक भाव',
    feature1Desc: 'बिचौलियों का कोई कमीशन नहीं। असली मंडी दरों पर खरीदारी करें।',
    feature2Title: 'ताजे बनारसी पत्ते',
    feature2Desc: 'सुरक्षित तापमान पैकेजिंग से पत्ते ताजे व खुशबूदार पहुंचते हैं।',
    feature3Title: 'सुरक्षा एवं कानूनी नियम',
    feature3Desc: 'नियमित वस्तुओं का पूर्ण सत्यापन। 100% कानूनी पारदर्शिता।',
    feature4Title: 'पूरे भारत में आपूर्ति',
    feature4Desc: 'सभी प्रमुख व्यापारिक केंद्रों में तेज़ और विश्वसनीय ट्रांसपोर्ट सेवा।',

    // Admin
    adminDashboard: 'एडमिन मंडी प्रबंधन',
    adminManageCatalogue: '39 रेट लिस्ट रिकॉर्ड्स प्रबंधित करें',
    adminEditRate: 'भाव और इकाई बदलें',
    adminConfirmUnit: 'इकाई की पुष्टि करें',
    adminUploadImage: 'तस्वीर बदलें',
    adminExportCsv: 'सीएसवी निर्यात',
    adminImportCsv: 'रेट लिस्ट आयात',
    adminComplianceReview: 'कानूनी स्थिति',
    adminSave: 'सहेजें',
    adminCancel: 'रद्द करें',

    // Language Toggle
    langEn: 'EN',
    langHi: 'हिन्दी',
    langToggleAria: 'भाषा बदलें',
  },
} as const

export type TranslationKey = keyof typeof translations.en
