
// This is a mock implementation of GSMArena search service
// In a real implementation, you would connect to an API or scraping service

// Extended smartphone database with more models from GSMArena
const gsmArenaDatabase = [
  {
    id: "iphone-14-pro",
    name: "iPhone 14 Pro",
    image: "https://fdn2.gsmarena.com/vv/bigpic/apple-iphone-14-pro.jpg",
    brand: "Apple",
    specs: {
      display: "6.1 inches, 1179 x 2556 pixels, LTPO Super Retina XDR OLED",
      battery: "3200 mAh",
      ram: "6 GB",
      camera: "48 MP",
      processor: "Apple A16 Bionic",
      storage: "128/256/512GB/1TB",
      os: "iOS 16"
    }
  },
  {
    id: "iphone-14",
    name: "iPhone 14",
    image: "https://fdn2.gsmarena.com/vv/bigpic/apple-iphone-14.jpg",
    brand: "Apple",
    specs: {
      display: "6.1 inches, 1170 x 2532 pixels, Super Retina XDR OLED",
      battery: "3279 mAh",
      ram: "6 GB",
      camera: "12 MP",
      processor: "Apple A15 Bionic",
      storage: "128/256/512GB",
      os: "iOS 16"
    }
  },
  {
    id: "iphone-13-pro",
    name: "iPhone 13 Pro",
    image: "https://fdn2.gsmarena.com/vv/bigpic/apple-iphone-13-pro.jpg",
    brand: "Apple",
    specs: {
      display: "6.1 inches, 1170 x 2532 pixels, Super Retina XDR OLED",
      battery: "3095 mAh",
      ram: "6 GB",
      camera: "12 MP",
      processor: "Apple A15 Bionic",
      storage: "128/256/512GB/1TB",
      os: "iOS 15"
    }
  },
  {
    id: "samsung-galaxy-s23-ultra",
    name: "Samsung Galaxy S23 Ultra",
    image: "https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-s23-ultra-5g.jpg",
    brand: "Samsung",
    specs: {
      display: "6.8 inches, 1440 x 3088 pixels, Dynamic AMOLED 2X",
      battery: "5000 mAh",
      ram: "12 GB",
      camera: "200 MP",
      processor: "Qualcomm Snapdragon 8 Gen 2",
      storage: "256/512GB/1TB",
      os: "Android 13, One UI 5.1"
    }
  },
  {
    id: "samsung-galaxy-s23",
    name: "Samsung Galaxy S23",
    image: "https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-s23-5g.jpg",
    brand: "Samsung",
    specs: {
      display: "6.1 inches, 1080 x 2340 pixels, Dynamic AMOLED 2X",
      battery: "3900 mAh",
      ram: "8 GB",
      camera: "50 MP",
      processor: "Qualcomm Snapdragon 8 Gen 2",
      storage: "128/256GB",
      os: "Android 13, One UI 5.1"
    }
  },
  {
    id: "google-pixel-7-pro",
    name: "Google Pixel 7 Pro",
    image: "https://fdn2.gsmarena.com/vv/bigpic/google-pixel7-pro-new.jpg",
    brand: "Google",
    specs: {
      display: "6.7 inches, 1440 x 3120 pixels, LTPO AMOLED",
      battery: "5000 mAh",
      ram: "12 GB",
      camera: "50 MP",
      processor: "Google Tensor G2",
      storage: "128/256/512GB",
      os: "Android 13"
    }
  },
  {
    id: "google-pixel-7",
    name: "Google Pixel 7",
    image: "https://fdn2.gsmarena.com/vv/bigpic/google-pixel7-new.jpg",
    brand: "Google",
    specs: {
      display: "6.3 inches, 1080 x 2400 pixels, AMOLED",
      battery: "4355 mAh",
      ram: "8 GB",
      camera: "50 MP",
      processor: "Google Tensor G2",
      storage: "128/256GB",
      os: "Android 13"
    }
  },
  {
    id: "xiaomi-13-pro",
    name: "Xiaomi 13 Pro",
    image: "https://fdn2.gsmarena.com/vv/bigpic/xiaomi-13-pro.jpg",
    brand: "Xiaomi",
    specs: {
      display: "6.73 inches, 1440 x 3200 pixels, LTPO AMOLED",
      battery: "4820 mAh",
      ram: "12 GB",
      camera: "50 MP",
      processor: "Qualcomm Snapdragon 8 Gen 2",
      storage: "256/512GB",
      os: "Android 13, MIUI 14"
    }
  },
  {
    id: "realme-gt-5-pro",
    name: "Realme GT 5 Pro",
    image: "https://fdn2.gsmarena.com/vv/bigpic/realme-gt5-pro.jpg",
    brand: "Realme",
    specs: {
      display: "6.78 inches, 1264 x 2780 pixels, LTPO AMOLED",
      battery: "5400 mAh",
      ram: "12/16 GB",
      camera: "50 MP",
      processor: "Qualcomm Snapdragon 8 Gen 3",
      storage: "256/512GB/1TB",
      os: "Android 14, Realme UI"
    }
  },
  {
    id: "oneplus-12",
    name: "OnePlus 12",
    image: "https://fdn2.gsmarena.com/vv/bigpic/oneplus-12.jpg",
    brand: "OnePlus",
    specs: {
      display: "6.82 inches, 1440 x 3168 pixels, LTPO AMOLED",
      battery: "5400 mAh",
      ram: "12/16/24 GB",
      camera: "50 MP",
      processor: "Qualcomm Snapdragon 8 Gen 3",
      storage: "256/512GB/1TB",
      os: "Android 14, OxygenOS 14"
    }
  },
  {
    id: "vivo-x100-pro",
    name: "Vivo X100 Pro",
    image: "https://fdn2.gsmarena.com/vv/bigpic/vivo-x100-pro.jpg",
    brand: "Vivo",
    specs: {
      display: "6.78 inches, 1260 x 2800 pixels, LTPO AMOLED",
      battery: "5400 mAh",
      ram: "12/16 GB",
      camera: "50 MP",
      processor: "MediaTek Dimensity 9300",
      storage: "256/512GB/1TB",
      os: "Android 14, Funtouch OS 14"
    }
  },
  {
    id: "iqoo-12",
    name: "iQOO 12",
    image: "https://fdn2.gsmarena.com/vv/bigpic/iqoo-12.jpg",
    brand: "iQOO",
    specs: {
      display: "6.78 inches, 1440 x 3200 pixels, LTPO AMOLED",
      battery: "5000 mAh",
      ram: "12/16 GB",
      camera: "50 MP",
      processor: "Qualcomm Snapdragon 8 Gen 3",
      storage: "256/512GB/1TB",
      os: "Android 14, Funtouch OS 14"
    }
  },
  {
    id: "motorola-edge-50-ultra",
    name: "Motorola Edge 50 Ultra",
    image: "https://fdn2.gsmarena.com/vv/bigpic/motorola-edge-50-ultra.jpg",
    brand: "Motorola",
    specs: {
      display: "6.7 inches, 1220 x 2712 pixels, LTPO OLED",
      battery: "4500 mAh",
      ram: "12/16 GB",
      camera: "50 MP",
      processor: "Qualcomm Snapdragon 8s Gen 3",
      storage: "512GB/1TB",
      os: "Android 14"
    }
  },
  {
    id: "nothing-phone-2",
    name: "Nothing Phone (2)",
    image: "https://fdn2.gsmarena.com/vv/bigpic/nothing-phone-2.jpg", 
    brand: "Nothing",
    specs: {
      display: "6.7 inches, 1080 x 2412 pixels, LTPO OLED",
      battery: "4700 mAh",
      ram: "8/12 GB",
      camera: "50 MP",
      processor: "Qualcomm Snapdragon 8+ Gen 1",
      storage: "128/256/512GB",
      os: "Android 13, Nothing OS 2.0"
    }
  },
  {
    id: "samsung-galaxy-s22-ultra",
    name: "Samsung Galaxy S22 Ultra",
    image: "https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-s22-ultra-5g.jpg",
    brand: "Samsung",
    specs: {
      display: "6.8 inches, 1440 x 3088 pixels, Dynamic AMOLED 2X",
      battery: "5000 mAh",
      ram: "8/12 GB",
      camera: "108 MP",
      processor: "Exynos 2200 / Qualcomm Snapdragon 8 Gen 1",
      storage: "128/256/512GB/1TB",
      os: "Android 12, One UI 4.1"
    }
  },
  {
    id: "samsung-galaxy-s22-plus",
    name: "Samsung Galaxy S22+",
    image: "https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-s22-plus-5g.jpg",
    brand: "Samsung",
    specs: {
      display: "6.6 inches, 1080 x 2340 pixels, Dynamic AMOLED 2X",
      battery: "4500 mAh",
      ram: "8 GB",
      camera: "50 MP",
      processor: "Exynos 2200 / Qualcomm Snapdragon 8 Gen 1",
      storage: "128/256GB",
      os: "Android 12, One UI 4.1"
    }
  },
  {
    id: "samsung-galaxy-s22",
    name: "Samsung Galaxy S22",
    image: "https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-s22-5g.jpg",
    brand: "Samsung",
    specs: {
      display: "6.1 inches, 1080 x 2340 pixels, Dynamic AMOLED 2X",
      battery: "3700 mAh",
      ram: "8 GB",
      camera: "50 MP",
      processor: "Exynos 2200 / Qualcomm Snapdragon 8 Gen 1",
      storage: "128/256GB",
      os: "Android 12, One UI 4.1"
    }
  }
];

// This returns the currently trending phones (would be dynamic in a real API)
export const getTrendingSmartphones = () => {
  return [
    gsmArenaDatabase.find(phone => phone.id === "samsung-galaxy-s23-ultra"),
    gsmArenaDatabase.find(phone => phone.id === "iphone-14-pro"),
    gsmArenaDatabase.find(phone => phone.id === "oneplus-12"),
    gsmArenaDatabase.find(phone => phone.id === "google-pixel-7-pro")
  ].filter(phone => phone !== undefined);
};

export const searchSmartphones = (query: string) => {
  // Convert query to lowercase for case-insensitive search
  const searchTerm = query.toLowerCase();
  
  // Simulate an API delay
  return new Promise<typeof gsmArenaDatabase>((resolve) => {
    setTimeout(() => {
      // Search in name, brand and specs
      const results = gsmArenaDatabase.filter(phone => {
        const nameMatch = phone.name.toLowerCase().includes(searchTerm);
        const brandMatch = phone.brand.toLowerCase().includes(searchTerm);
        
        // Search in all spec values
        const specMatch = Object.values(phone.specs).some(spec => 
          typeof spec === 'string' && spec.toLowerCase().includes(searchTerm)
        );
        
        return nameMatch || brandMatch || specMatch;
      });
      
      resolve(results);
    }, 1000);
  });
};

export const getSmartphoneById = (id: string) => {
  // Simulate an API delay
  return new Promise<typeof gsmArenaDatabase[0] | null>((resolve) => {
    setTimeout(() => {
      const phone = gsmArenaDatabase.find(phone => phone.id === id) || null;
      resolve(phone);
    }, 500);
  });
};

export default {
  searchSmartphones,
  getSmartphoneById,
  getTrendingSmartphones
};
