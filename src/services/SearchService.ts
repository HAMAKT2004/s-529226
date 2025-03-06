
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
    const id = partialUrl.split('.php?id=')[1] || cleanId(name);
    
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

  return smartphones;
};

// Function to get detailed specs for a specific smartphone
const getDetailedSmartphoneSpecs = async (id: string): Promise<Record<string, any>> => {
  try {
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
    
    return await extractSmartphoneData(response.data);
  } catch (error) {
    console.error("Error searching smartphones:", error);
    return [];
  }
};

// Get smartphone by ID
export const getSmartphoneById = async (id: string): Promise<Smartphone | null> => {
  try {
    // In a real implementation, we would scrape the detailed phone page
    const response = await axios.get(`https://api.allorigins.win/raw?url=${encodeURIComponent(`https://www.gsmarena.com/${id}.php`)}`);
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
    return null;
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
      const id = partialUrl.split('.php?id=')[1] || cleanId(name);
      
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
      { id: 'apple_iphone_16_pro', name: 'Apple iPhone 16 Pro', image: 'https://fdn2.gsmarena.com/vv/bigpic/apple-iphone-16-pro.jpg', brand: 'Apple', specs: {} },
      { id: 'samsung_galaxy_s24_ultra', name: 'Samsung Galaxy S24 Ultra', image: 'https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-s24-ultra-5g.jpg', brand: 'Samsung', specs: {} },
      { id: 'google_pixel_9_pro', name: 'Google Pixel 9 Pro', image: 'https://fdn2.gsmarena.com/vv/bigpic/google-pixel-9-pro.jpg', brand: 'Google', specs: {} },
      { id: 'xiaomi_14t_pro', name: 'Xiaomi 14T Pro', image: 'https://fdn2.gsmarena.com/vv/bigpic/xiaomi-14t-pro.jpg', brand: 'Xiaomi', specs: {} }
    ];
  }
};

export default {
  searchSmartphones,
  getSmartphoneById,
  getTrendingSmartphones
};
