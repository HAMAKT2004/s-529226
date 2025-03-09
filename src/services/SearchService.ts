import axios from 'axios';
import { load } from 'cheerio';

// Define interfaces for our smartphone data
export interface Smartphone {
  id: string;
  name: string;
  image: string;
  brand: string;
  specs: Record<string, string>;
  releaseDate?: string;
  weight?: string;
  os?: string;
  storage?: string;
  displaySize?: string;
  camera?: string;
  battery?: string;
  processor?: string;
  url?: string;
}

// Function to clean GSMArena IDs to make them URL-friendly
const cleanId = (name: string): string => {
  return name.toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]/g, '')
    .replace(/-+/g, '-');
};

// Function to extract smartphone data from GSMArena search results
const extractSmartphoneData = async (html: string): Promise<Smartphone[]> => {
  const $ = load(html);
  const smartphones: Smartphone[] = [];

  // GSMArena search results are in divs with makers class
  $('.makers ul li').each((_, element) => {
    const nameElement = $(element).find('span a');
    const name = nameElement.text().trim();
    const partialUrl = nameElement.attr('href') || '';
    
    // Extract ID from URL or generate from name
    let id;
    if (partialUrl.includes('.php?id=')) {
      id = partialUrl.split('.php?id=')[1];
    } else {
      // For detailed URLs like samsung-galaxy-s24-ultra-12288.php
      const match = partialUrl.match(/([a-zA-Z0-9-]+)\.php$/);
      id = match ? match[1] : cleanId(name);
    }
    
    const image = $(element).find('img').attr('src') || '';
    
    // Extract basic specs that are visible in search results
    const specs: Record<string, string> = {};
    $(element).find('.specs li').each((_, specElement) => {
      const specText = $(specElement).text().trim();
      
      if (specText.includes('display')) {
        specs.display = specText.replace('display', '').trim();
      } else if (specText.includes('camera')) {
        specs.camera = specText.replace('camera', '').trim();
      } else if (specText.includes('RAM')) {
        specs.ram = specText;
      } else if (specText.includes('battery')) {
        specs.battery = specText.replace('battery', '').trim();
      } else {
        // Add other specs
        const key = specText.split(' ')[0].toLowerCase();
        specs[key] = specText;
      }
    });

    // Extract brand from name (usually first word)
    const brand = name.split(' ')[0];

    smartphones.push({
      id,
      name,
      image,
      brand,
      specs,
      url: `https://www.gsmarena.com/${partialUrl}`
    });
  });

  console.log("Extracted smartphones:", smartphones.length);
  return smartphones;
};

// Function to get detailed specs for a specific smartphone
const getDetailedSmartphoneSpecs = async (id: string): Promise<Record<string, any>> => {
  try {
    console.log("Fetching detailed specs for ID:", id);
    // In a real implementation, we would scrape the detailed page
    // For demo purposes, we'll simulate this with a proxy service
    const response = await axios.get(`https://api.allorigins.win/raw?url=https://www.gsmarena.com/phone_finder.php3?IDxPhone=${id}`);
    const $ = load(response.data);
    
    const detailedSpecs: Record<string, any> = {};
    
    // Extract all spec tables
    $('.specs-list-main').each((_, table) => {
      const category = $(table).find('th').text().trim();
      detailedSpecs[category] = {};
      
      $(table).find('tr').each((_, row) => {
        const key = $(row).find('td.ttl').text().trim();
        const value = $(row).find('td.nfo').text().trim();
        
        if (key && value) {
          detailedSpecs[category][key] = value;
        }
      });
    });
    
    console.log("Fetched detailed specs:", Object.keys(detailedSpecs).length > 0 ? "Found specs" : "No specs found");
    return detailedSpecs;
  } catch (error) {
    console.error("Error fetching detailed specs:", error);
    return {};
  }
};

// Search smartphones on GSMArena
export const searchSmartphones = async (query: string): Promise<Smartphone[]> => {
  try {
    console.log("Searching for:", query);
    // Using a CORS proxy to access GSMArena
    const response = await axios.get(`https://api.allorigins.win/raw?url=${encodeURIComponent(`https://www.gsmarena.com/results.php3?sQuickSearch=yes&sName=${encodeURIComponent(query)}`)}`);
    
    const smartphones = await extractSmartphoneData(response.data);
    console.log(`Found ${smartphones.length} smartphones for query: ${query}`);
    return smartphones;
  } catch (error) {
    console.error("Error searching smartphones:", error);
    return [];
  }
};

// Get smartphone by ID
export const getSmartphoneById = async (id: string): Promise<Smartphone | null> => {
  try {
    console.log("Getting smartphone by ID:", id);
    
    // For demo purposes, returning mock data for certain IDs
    const mockData = {
      "iphone-14-pro": {
        id: "iphone-14-pro",
        name: "iPhone 14 Pro",
        brand: "Apple",
        image: "https://fdn2.gsmarena.com/vv/bigpic/apple-iphone-14-pro.jpg",
        specs: {
          display: "6.1 inches, LTPO Super Retina XDR OLED",
          camera: "48 MP main, 12 MP ultrawide, 12 MP telephoto",
          ram: "6 GB RAM",
          battery: "3200 mAh",
          platform: "iOS 16",
          storage: "128GB/256GB/512GB/1TB"
        },
        releaseDate: "September 2022",
        weight: "206 g",
        os: "iOS 16, upgradable to iOS 16.5",
        storage: "128GB/256GB/512GB/1TB",
        displaySize: "6.1 inches",
        camera: "48 MP, f/1.8, 24mm (wide)",
        battery: "Li-Ion 3200 mAh",
        processor: "Apple A16 Bionic"
      },
      "samsung-galaxy-s24-ultra": {
        id: "samsung-galaxy-s24-ultra",
        name: "Samsung Galaxy S24 Ultra",
        brand: "Samsung",
        image: "https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-s24-ultra-5g.jpg",
        specs: {
          display: "6.8 inches, Dynamic AMOLED 2X",
          camera: "200 MP main, 12 MP ultrawide, 10 MP telephoto",
          ram: "12 GB RAM",
          battery: "5000 mAh",
          platform: "Android 14, One UI 6.1",
          storage: "256GB/512GB/1TB"
        },
        releaseDate: "February 2024",
        weight: "234 g",
        os: "Android 14, One UI 6.1",
        storage: "256GB/512GB/1TB",
        displaySize: "6.8 inches",
        camera: "200 MP, f/1.7, 23mm (wide)",
        battery: "Li-Ion 5000 mAh",
        processor: "Snapdragon 8 Gen 3"
      },
      "google-pixel-7-pro": {
        id: "google-pixel-7-pro",
        name: "Google Pixel 7 Pro",
        brand: "Google",
        image: "https://fdn2.gsmarena.com/vv/bigpic/google-pixel7-pro-new.jpg",
        specs: {
          display: "6.7 inches, LTPO AMOLED",
          camera: "50 MP main, 12 MP ultrawide, 48 MP telephoto",
          ram: "12 GB RAM",
          battery: "5000 mAh",
          platform: "Android 13",
          storage: "128GB/256GB/512GB"
        },
        releaseDate: "October 2022",
        weight: "212 g",
        os: "Android 13, upgradable to Android 14",
        storage: "128GB/256GB/512GB",
        displaySize: "6.7 inches",
        camera: "50 MP, f/1.9, 25mm (wide)",
        battery: "Li-Ion 5000 mAh",
        processor: "Google Tensor G2"
      }
    };
    
    // Check if we have mock data for this ID
    if (id in mockData) {
      console.log("Found mock data for ID:", id);
      return mockData[id as keyof typeof mockData];
    }
    
    // Otherwise, try to fetch real data
    const response = await axios.get(`https://api.allorigins.win/raw?url=${encodeURIComponent(`https://www.gsmarena.com/${id}.php`)}`);
    console.log("Got response from GSMArena");
    const $ = load(response.data);
    
    const name = $('.specs-phone-name-title').text().trim();
    const image = $('.specs-photo-main img').attr('src') || '';
    const brand = name.split(' ')[0];
    
    // Extract all specs
    const specs: Record<string, string> = {};
    
    $('.specs-list tr').each((_, row) => {
      const key = $(row).find('td.ttl').text().trim();
      const value = $(row).find('td.nfo').text().trim();
      
      if (key && value) {
        specs[key] = value;
      }
    });
    
    // Get release date, OS, etc.
    const releaseDate = specs['Released'] || '';
    const weight = specs['Weight'] || '';
    const os = specs['OS'] || '';
    const storage = specs['Internal'] || '';
    const displaySize = specs['Size'] || '';
    const camera = specs['Main Camera'] || '';
    const battery = specs['Battery'] || '';
    const processor = specs['Chipset'] || '';
    
    console.log("Extracted smartphone data for ID:", id, "Name:", name);
    
    return {
      id,
      name,
      image,
      brand,
      specs,
      releaseDate,
      weight,
      os,
      storage,
      displaySize,
      camera,
      battery,
      processor,
      url: `https://www.gsmarena.com/${id}.php`
    };
  } catch (error) {
    console.error("Error fetching smartphone by ID:", error);
    
    // Return a default phone as fallback in case of error
    return {
      id,
      name: "Unknown Smartphone",
      image: "https://fdn2.gsmarena.com/vv/bigpic/apple-iphone-14-pro.jpg", // placeholder
      brand: "Unknown",
      specs: {
        display: "Unknown display",
        camera: "Unknown camera",
        ram: "Unknown RAM",
        battery: "Unknown battery"
      }
    };
  }
};

// Get trending smartphones
export const getTrendingSmartphones = async (): Promise<Smartphone[]> => {
  try {
    // Scrape GSMArena home page to get trending phones
    const response = await axios.get('https://api.allorigins.win/raw?url=https://www.gsmarena.com/');
    const $ = load(response.data);
    
    const trendingPhones: Smartphone[] = [];
    
    // GSMArena shows popular phones in their home page grid
    $('.module-phones-link').slice(0, 8).each((_, element) => {
      const nameElement = $(element).find('span');
      const name = nameElement.text().trim();
      const partialUrl = $(element).attr('href') || '';
      
      // Extract ID from URL or generate from name
      let id;
      if (partialUrl.includes('.php?id=')) {
        id = partialUrl.split('.php?id=')[1];
      } else {
        // For detailed URLs like samsung-galaxy-s24-ultra-12288.php
        const match = partialUrl.match(/([a-zA-Z0-9-]+)\.php$/);
        id = match ? match[1] : cleanId(name);
      }
      
      const image = $(element).find('img').attr('src') || '';
      const brand = name.split(' ')[0];
      
      trendingPhones.push({
        id,
        name,
        image,
        brand,
        specs: {}, // We'll fetch detailed specs separately
        url: `https://www.gsmarena.com/${partialUrl}`
      });
    });
    
    return trendingPhones;
  } catch (error) {
    console.error("Error fetching trending smartphones:", error);
    
    // Fallback to a few known popular phones if scraping fails
    return [
      { id: 'apple_iphone_16_pro', name: 'Apple iPhone 16 Pro', image: 'https://fdn2.gsmarena.com/vv/bigpic/apple-iphone-16-pro.jpg', brand: 'Apple', specs: { display: "6.3 inches", battery: "3900 mAh", ram: "8GB RAM", camera: "48MP main" } },
      { id: 'samsung_galaxy_s24_ultra', name: 'Samsung Galaxy S24 Ultra', image: 'https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-s24-ultra-5g.jpg', brand: 'Samsung', specs: { display: "6.8 inches", battery: "5000 mAh", ram: "12GB RAM", camera: "200MP main" } },
      { id: 'google_pixel_9_pro', name: 'Google Pixel 9 Pro', image: 'https://fdn2.gsmarena.com/vv/bigpic/google-pixel-9-pro.jpg', brand: 'Google', specs: { display: "6.7 inches", battery: "4950 mAh", ram: "16GB RAM", camera: "50MP main" } },
      { id: 'xiaomi_14t_pro', name: 'Xiaomi 14T Pro', image: 'https://fdn2.gsmarena.com/vv/bigpic/xiaomi-14t-pro.jpg', brand: 'Xiaomi', specs: { display: "6.67 inches", battery: "5000 mAh", ram: "12GB RAM", camera: "108MP main" } }
    ];
  }
};

export default {
  searchSmartphones,
  getSmartphoneById,
  getTrendingSmartphones
};
