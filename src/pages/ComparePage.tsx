
import React, { useState } from "react";
import { Link } from "react-router-dom";
import MainLayout from "@/components/layouts/MainLayout";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useCompare } from "@/context/CompareContext";
import { motion } from "framer-motion";
import { ChevronRight, X, ShoppingCart, AlertCircle, ChevronDown, ChevronUp } from "lucide-react";

// Expanded specs data for comparison
const productSpecs = {
  "iphone-14-pro": {
    display: "6.1 inches, 1179 x 2556 pixels, LTPO Super Retina XDR OLED",
    processor: "Apple A16 Bionic",
    ram: "6 GB",
    storage: "128GB/256GB/512GB/1TB",
    mainCamera: "48 MP, f/1.8, 24mm (wide)",
    selfieCamera: "12 MP, f/1.9, 23mm (wide)",
    battery: "3200 mAh, 23W wired, 15W MagSafe wireless",
    os: "iOS 16",
    weight: "206 g",
    dimensions: "147.5 x 71.5 x 7.9 mm",
    network: "5G, LTE, HSPA, GSM",
    sim: "Nano-SIM and eSIM",
    wlan: "Wi-Fi 802.11 a/b/g/n/ac/6, dual-band, hotspot",
    bluetooth: "5.3, A2DP, LE",
    gps: "Yes, with A-GPS, GLONASS, GALILEO, BDS, QZSS",
    nfc: "Yes",
    radio: "No",
    usb: "Lightning, USB 2.0",
    sensors: "Face ID, accelerometer, gyro, proximity, compass, barometer",
    colors: "Deep Purple, Gold, Silver, Space Black",
    waterResistant: "IP68 (up to 6m for 30 mins)",
    audioJack: "No",
    price: 999
  },
  "samsung-galaxy-s23-ultra": {
    display: "6.8 inches, 1440 x 3088 pixels, Dynamic AMOLED 2X",
    processor: "Qualcomm Snapdragon 8 Gen 2",
    ram: "8GB/12GB",
    storage: "256GB/512GB/1TB",
    mainCamera: "200 MP, f/1.7, 23mm (wide)",
    selfieCamera: "12 MP, f/2.2, 26mm (wide)",
    battery: "5000 mAh, 45W wired, 15W wireless",
    os: "Android 13, One UI 5.1",
    weight: "234 g",
    dimensions: "163.4 x 78.1 x 8.9 mm",
    network: "5G, LTE, HSPA, GSM",
    sim: "Nano-SIM and eSIM",
    wlan: "Wi-Fi 802.11 a/b/g/n/ac/6e, dual-band, Wi-Fi Direct",
    bluetooth: "5.3, A2DP, LE",
    gps: "Yes, with A-GPS, GLONASS, BDS, GALILEO",
    nfc: "Yes",
    radio: "No",
    usb: "USB Type-C 3.2, OTG",
    sensors: "Fingerprint (under display, ultrasonic), accelerometer, gyro, proximity, compass, barometer",
    colors: "Phantom Black, Cream, Green, Lavender",
    waterResistant: "IP68 (up to 1.5m for 30 mins)",
    audioJack: "No",
    price: 1199
  },
  "google-pixel-7-pro": {
    display: "6.7 inches, 1440 x 3120 pixels, LTPO AMOLED",
    processor: "Google Tensor G2",
    ram: "12 GB",
    storage: "128GB/256GB/512GB",
    mainCamera: "50 MP, f/1.9, 25mm (wide)",
    selfieCamera: "10.8 MP, f/2.2, 21mm (wide)",
    battery: "5000 mAh, 30W wired, 23W wireless",
    os: "Android 13",
    weight: "212 g",
    dimensions: "162.9 x 76.6 x 8.9 mm",
    network: "5G, LTE, HSPA, GSM",
    sim: "Nano-SIM and eSIM",
    wlan: "Wi-Fi 802.11 a/b/g/n/ac/6e, dual-band, Wi-Fi Direct",
    bluetooth: "5.2, A2DP, LE",
    gps: "Yes, with A-GPS, GLONASS, GALILEO, BDS, QZSS",
    nfc: "Yes",
    radio: "No",
    usb: "USB Type-C 3.2, OTG",
    sensors: "Fingerprint (under display, optical), accelerometer, gyro, proximity, compass, barometer",
    colors: "Obsidian, Snow, Hazel",
    waterResistant: "IP68 (up to 1.5m for 30 mins)",
    audioJack: "No",
    price: 899
  },
  "iphone-14": {
    display: "6.1 inches, 1170 x 2532 pixels, Super Retina XDR OLED",
    processor: "Apple A15 Bionic",
    ram: "6 GB",
    storage: "128GB/256GB/512GB",
    mainCamera: "12 MP, f/1.5, 26mm (wide)",
    selfieCamera: "12 MP, f/1.9, 23mm (wide)",
    battery: "3279 mAh, 20W wired, 15W MagSafe wireless",
    os: "iOS 16",
    weight: "172 g",
    dimensions: "146.7 x 71.5 x 7.8 mm",
    network: "5G, LTE, HSPA, GSM",
    sim: "Nano-SIM and eSIM",
    wlan: "Wi-Fi 802.11 a/b/g/n/ac/6, dual-band, hotspot",
    bluetooth: "5.3, A2DP, LE",
    gps: "Yes, with A-GPS, GLONASS, GALILEO, BDS, QZSS",
    nfc: "Yes",
    radio: "No",
    usb: "Lightning, USB 2.0",
    sensors: "Face ID, accelerometer, gyro, proximity, compass, barometer",
    colors: "Blue, Purple, Yellow, Midnight, Starlight, Red",
    waterResistant: "IP68 (up to 6m for 30 mins)",
    audioJack: "No",
    price: 799
  },
  "samsung-galaxy-s23": {
    display: "6.1 inches, 1080 x 2340 pixels, Dynamic AMOLED 2X",
    processor: "Qualcomm Snapdragon 8 Gen 2",
    ram: "8 GB",
    storage: "128GB/256GB",
    mainCamera: "50 MP, f/1.8, 24mm (wide)",
    selfieCamera: "12 MP, f/2.2, 26mm (wide)",
    battery: "3900 mAh, 25W wired, 15W wireless",
    os: "Android 13, One UI 5.1",
    weight: "168 g",
    dimensions: "146.3 x 70.9 x 7.6 mm",
    network: "5G, LTE, HSPA, GSM",
    sim: "Nano-SIM and eSIM",
    wlan: "Wi-Fi 802.11 a/b/g/n/ac/6e, dual-band, Wi-Fi Direct",
    bluetooth: "5.3, A2DP, LE",
    gps: "Yes, with A-GPS, GLONASS, BDS, GALILEO",
    nfc: "Yes",
    radio: "No",
    usb: "USB Type-C 3.2, OTG",
    sensors: "Fingerprint (under display, ultrasonic), accelerometer, gyro, proximity, compass, barometer",
    colors: "Phantom Black, Cream, Green, Lavender",
    waterResistant: "IP68 (up to 1.5m for 30 mins)",
    audioJack: "No",
    price: 799
  },
  "google-pixel-7": {
    display: "6.3 inches, 1080 x 2400 pixels, AMOLED",
    processor: "Google Tensor G2",
    ram: "8 GB",
    storage: "128GB/256GB",
    mainCamera: "50 MP, f/1.9, 25mm (wide)",
    selfieCamera: "10.8 MP, f/2.2, 21mm (wide)",
    battery: "4355 mAh, 20W wired, 20W wireless",
    os: "Android 13",
    weight: "197 g",
    dimensions: "155.6 x 73.2 x 8.7 mm",
    network: "5G, LTE, HSPA, GSM",
    sim: "Nano-SIM and eSIM",
    wlan: "Wi-Fi 802.11 a/b/g/n/ac/6e, dual-band, Wi-Fi Direct",
    bluetooth: "5.2, A2DP, LE",
    gps: "Yes, with A-GPS, GLONASS, GALILEO, BDS, QZSS",
    nfc: "Yes",
    radio: "No",
    usb: "USB Type-C 3.1, OTG",
    sensors: "Fingerprint (under display, optical), accelerometer, gyro, proximity, compass, barometer",
    colors: "Obsidian, Snow, Lemongrass",
    waterResistant: "IP68 (up to 1.5m for 30 mins)",
    audioJack: "No",
    price: 599
  },
  "oneplus-12": {
    display: "6.82 inches, 1440 x 3168 pixels, LTPO AMOLED",
    processor: "Qualcomm Snapdragon 8 Gen 3",
    ram: "12/16/24 GB",
    storage: "256/512GB/1TB",
    mainCamera: "50 MP, f/1.6, 23mm (wide)",
    selfieCamera: "32 MP, f/2.4, 21mm (wide)",
    battery: "5400 mAh, 100W wired, 50W wireless",
    os: "Android 14, OxygenOS 14",
    weight: "220 g",
    dimensions: "164.3 x 75.8 x 9.2 mm",
    network: "5G, LTE, HSPA, GSM",
    sim: "Dual SIM (Nano-SIM, dual stand-by)",
    wlan: "Wi-Fi 802.11 a/b/g/n/ac/6e/7, tri-band",
    bluetooth: "5.4, A2DP, LE, aptX HD",
    gps: "Yes, with A-GPS, GLONASS, BDS, GALILEO, QZSS, NavIC",
    nfc: "Yes",
    radio: "No",
    usb: "USB Type-C 3.2, OTG",
    sensors: "Fingerprint (under display, optical), accelerometer, gyro, proximity, compass, color spectrum",
    colors: "Flowy Emerald, Silky Black",
    waterResistant: "IP65",
    audioJack: "No",
    price: 969
  },
  "xiaomi-13-pro": {
    display: "6.73 inches, 1440 x 3200 pixels, LTPO AMOLED",
    processor: "Qualcomm Snapdragon 8 Gen 2",
    ram: "12 GB",
    storage: "256/512GB",
    mainCamera: "50 MP, f/1.9, 23mm (wide)",
    selfieCamera: "32 MP, f/2.0, 26mm (wide)",
    battery: "4820 mAh, 120W wired, 50W wireless",
    os: "Android 13, MIUI 14",
    weight: "229 g",
    dimensions: "162.9 x 74.6 x 8.4 mm",
    network: "5G, LTE, HSPA, GSM",
    sim: "Dual SIM (Nano-SIM, dual stand-by)",
    wlan: "Wi-Fi 802.11 a/b/g/n/ac/6e, dual-band, Wi-Fi Direct",
    bluetooth: "5.3, A2DP, LE",
    gps: "Yes, with A-GPS, GLONASS, BDS, GALILEO, QZSS, NavIC",
    nfc: "Yes",
    radio: "No",
    usb: "USB Type-C 2.0, OTG",
    sensors: "Fingerprint (under display, optical), accelerometer, gyro, proximity, compass, color spectrum",
    colors: "Ceramic Black, Ceramic White, Flora Green",
    waterResistant: "IP68 (up to 1.5m for 30 mins)",
    audioJack: "No",
    price: 1299
  },
  "realme-gt-5-pro": {
    display: "6.78 inches, 1264 x 2780 pixels, LTPO AMOLED",
    processor: "Qualcomm Snapdragon 8 Gen 3",
    ram: "12/16 GB",
    storage: "256/512GB/1TB",
    mainCamera: "50 MP, f/1.4, 24mm (wide)",
    selfieCamera: "32 MP, f/2.5, 22mm (wide)",
    battery: "5400 mAh, 100W wired, 50W wireless",
    os: "Android 14, Realme UI",
    weight: "199 g",
    dimensions: "162.2 x 75.5 x 8.5 mm",
    network: "5G, LTE, HSPA, GSM",
    sim: "Dual SIM (Nano-SIM, dual stand-by)",
    wlan: "Wi-Fi 802.11 a/b/g/n/ac/6e/7, tri-band",
    bluetooth: "5.4, A2DP, LE, aptX HD",
    gps: "Yes, with A-GPS, BDS, GALILEO, GLONASS, QZSS",
    nfc: "Yes",
    radio: "No",
    usb: "USB Type-C 2.0, OTG",
    sensors: "Fingerprint (under display, optical), accelerometer, gyro, proximity, compass",
    colors: "Red Rock, Bright Moon, Bright Night",
    waterResistant: "IP64",
    audioJack: "No",
    price: 679
  }
};

// Group comparison fields
const comparisonGroups = {
  essential: [
    { key: 'display', label: 'Display' },
    { key: 'processor', label: 'Processor' },
    { key: 'ram', label: 'RAM' },
    { key: 'storage', label: 'Storage' },
    { key: 'mainCamera', label: 'Main Camera' },
    { key: 'battery', label: 'Battery' },
    { key: 'os', label: 'Operating System' },
    { key: 'weight', label: 'Weight' },
    { key: 'price', label: 'Price' }
  ],
  advanced: [
    { key: 'dimensions', label: 'Dimensions' },
    { key: 'selfieCamera', label: 'Selfie Camera' },
    { key: 'network', label: 'Network' },
    { key: 'sim', label: 'SIM' },
    { key: 'wlan', label: 'Wi-Fi' },
    { key: 'bluetooth', label: 'Bluetooth' },
    { key: 'gps', label: 'GPS' },
    { key: 'nfc', label: 'NFC' },
    { key: 'usb', label: 'USB' },
    { key: 'sensors', label: 'Sensors' },
    { key: 'colors', label: 'Colors' },
    { key: 'waterResistant', label: 'Water Resistance' },
    { key: 'audioJack', label: 'Audio Jack' }
  ]
};

// Helper to highlight higher/lower values
const getBetterValue = (field: string, values: any[]) => {
  const numericValues = values.filter(v => !isNaN(parseFloat(String(v))));
  if (numericValues.length < 2) return null;
  
  let better;
  if (field === 'weight' || field === 'price') {
    // Lower is better
    better = Math.min(...numericValues.map(v => parseFloat(String(v))));
  } else if (field === 'battery' || field === 'ram' || field === 'mainCamera') {
    // Higher is better
    better = Math.max(...numericValues.map(v => parseFloat(String(v))));
  } else {
    return null;
  }
  
  return better;
};

// Helper for price display
const formatPrice = (price: number) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(price);
};

const ComparePage: React.FC = () => {
  const { compareList, removeFromCompare, clearCompareList } = useCompare();
  const [showAdvanced, setShowAdvanced] = useState(false);

  if (compareList.length === 0) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-12 text-center max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="bg-muted rounded-lg p-8 flex flex-col items-center"
          >
            <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
            <h1 className="text-2xl font-bold mb-4">Your Compare List is Empty</h1>
            <p className="text-muted-foreground mb-6">
              Add products to compare their specifications and make better buying decisions.
            </p>
            <Button asChild>
              <Link to="/search">
                Find Products to Compare
                <ChevronRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </MainLayout>
    );
  }

  // Get specs for products in compare list
  const specs = compareList.map(product => {
    return {
      id: product.id,
      name: product.name,
      image: product.image,
      specs: productSpecs[product.id as keyof typeof productSpecs]
    };
  });

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Compare Products</h1>
            <p className="text-muted-foreground">Compare specifications side by side</p>
          </div>
          <Button 
            variant="destructive" 
            onClick={clearCompareList}
            size="sm"
          >
            Clear All
          </Button>
        </div>
        
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[200px]">Specification</TableHead>
                {specs.map((product) => (
                  <TableHead key={product.id} className="min-w-[180px]">
                    <div className="relative">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="absolute -top-1 -right-1 h-6 w-6 rounded-full bg-background border"
                        onClick={() => removeFromCompare(product.id)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                      <div className="flex flex-col items-center">
                        <div className="h-24 w-24 relative mb-2 bg-white rounded-md overflow-hidden p-2 border">
                          <img 
                            src={product.image} 
                            alt={product.name} 
                            className="h-full w-full object-contain"
                          />
                        </div>
                        <div className="text-center">
                          <p className="font-medium">{product.name}</p>
                          {product.specs.price && (
                            <p className="text-primary font-bold mt-1">{formatPrice(product.specs.price)}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {/* Essential specs */}
              {comparisonGroups.essential.map((field) => {
                const values = specs.map(p => p.specs?.[field.key as keyof typeof p.specs]);
                const betterValue = getBetterValue(field.key, values);
                
                return (
                  <TableRow key={field.key}>
                    <TableCell className="font-medium">{field.label}</TableCell>
                    {specs.map((product, index) => {
                      const value = product.specs?.[field.key as keyof typeof product.specs];
                      let valueDisplay = value;
                      
                      // Format price with Indian Rupee sign
                      if (field.key === 'price') {
                        valueDisplay = value ? formatPrice(value as number) : 'N/A';
                      }
                      
                      // Highlight better values
                      const isBetterValue = betterValue !== null && 
                        value !== undefined && 
                        parseFloat(String(value)) === betterValue;
                        
                      return (
                        <TableCell 
                          key={product.id + field.key}
                          className={isBetterValue ? "bg-green-50 dark:bg-green-900/20 font-medium" : ""}
                        >
                          {valueDisplay || "N/A"}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                );
              })}
              
              {/* Show/Hide advanced specs button */}
              <TableRow>
                <TableCell colSpan={specs.length + 1} className="text-center">
                  <Button 
                    variant="outline" 
                    onClick={() => setShowAdvanced(!showAdvanced)}
                    className="my-2"
                  >
                    {showAdvanced ? (
                      <>
                        <ChevronUp className="mr-2 h-4 w-4" />
                        Hide Advanced Specs
                      </>
                    ) : (
                      <>
                        <ChevronDown className="mr-2 h-4 w-4" />
                        Show More Specs
                      </>
                    )}
                  </Button>
                </TableCell>
              </TableRow>
              
              {/* Advanced specs */}
              {showAdvanced && comparisonGroups.advanced.map((field) => {
                const values = specs.map(p => p.specs?.[field.key as keyof typeof p.specs]);
                
                return (
                  <TableRow key={field.key}>
                    <TableCell className="font-medium">{field.label}</TableCell>
                    {specs.map((product) => (
                      <TableCell key={product.id + field.key}>
                        {product.specs?.[field.key as keyof typeof product.specs] || "N/A"}
                      </TableCell>
                    ))}
                  </TableRow>
                );
              })}
              
              {/* Action buttons row */}
              <TableRow>
                <TableCell>Actions</TableCell>
                {specs.map((product) => (
                  <TableCell key={product.id + "actions"}>
                    <div className="flex gap-2 flex-col">
                      <Button asChild size="sm">
                        <Link to={`/product/${product.id}`}>
                          View Details
                        </Link>
                      </Button>
                      <Button asChild variant="outline" size="sm">
                        <Link to={`/prices/${product.id}`}>
                          <ShoppingCart className="mr-1 h-3.5 w-3.5" />
                          Compare Prices
                        </Link>
                      </Button>
                    </div>
                  </TableCell>
                ))}
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </div>
    </MainLayout>
  );
};

export default ComparePage;
