
import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import MainLayout from "@/components/layouts/MainLayout";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useCompare } from "@/context/CompareContext";
import { toast } from "@/hooks/use-toast";
import { 
  Phone, 
  Heart, 
  ShoppingCart, 
  Check, 
  Plus, 
  Loader, 
  PieChart, 
  Camera, 
  Battery, 
  Cpu, 
  MonitorSmartphone
} from "lucide-react";
import { motion } from "framer-motion";

// Mock data for product details - would come from an API in a real app
const productData = {
  "iphone-14-pro": {
    id: "iphone-14-pro",
    name: "iPhone 14 Pro",
    brand: "Apple",
    image: "https://fdn2.gsmarena.com/vv/bigpic/apple-iphone-14-pro.jpg",
    images: [
      "https://fdn2.gsmarena.com/vv/bigpic/apple-iphone-14-pro.jpg",
      "https://fdn2.gsmarena.com/vv/pics/apple/apple-iphone-14-pro-2.jpg",
      "https://fdn2.gsmarena.com/vv/pics/apple/apple-iphone-14-pro-3.jpg",
      "https://fdn2.gsmarena.com/vv/pics/apple/apple-iphone-14-pro-4.jpg"
    ],
    releaseDate: "September 2022",
    price: 999,
    specs: {
      display: {
        size: "6.1 inches",
        resolution: "1179 x 2556 pixels",
        type: "LTPO Super Retina XDR OLED",
        refreshRate: "120Hz"
      },
      platform: {
        chipset: "Apple A16 Bionic",
        cpu: "Hexa-core",
        gpu: "Apple GPU (5-core)"
      },
      memory: {
        ram: "6 GB",
        internal: "128GB/256GB/512GB/1TB"
      },
      camera: {
        main: "48 MP, f/1.8, 24mm (wide)",
        ultrawide: "12 MP, f/2.2, 13mm, 120˚",
        telephoto: "12 MP, f/2.8, 77mm (telephoto)",
        features: "TOF 3D LiDAR scanner, dual-LED dual-tone flash"
      },
      battery: {
        type: "Li-Ion 3200 mAh",
        charging: "Fast charging, MagSafe wireless charging"
      },
      os: "iOS 16, upgradable to iOS 16.5",
      colors: ["Space Black", "Silver", "Gold", "Deep Purple"],
      dimensions: "147.5 x 71.5 x 7.9 mm",
      weight: "206 g"
    }
  },
  "samsung-galaxy-s23-ultra": {
    id: "samsung-galaxy-s23-ultra",
    name: "Samsung Galaxy S23 Ultra",
    brand: "Samsung",
    image: "https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-s23-ultra-5g.jpg",
    images: [
      "https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-s23-ultra-5g.jpg",
      "https://fdn2.gsmarena.com/vv/pics/samsung/samsung-galaxy-s23-ultra-5g-1.jpg",
      "https://fdn2.gsmarena.com/vv/pics/samsung/samsung-galaxy-s23-ultra-5g-2.jpg",
      "https://fdn2.gsmarena.com/vv/pics/samsung/samsung-galaxy-s23-ultra-5g-3.jpg"
    ],
    releaseDate: "February 2023",
    price: 1199,
    specs: {
      display: {
        size: "6.8 inches",
        resolution: "1440 x 3088 pixels",
        type: "Dynamic AMOLED 2X",
        refreshRate: "120Hz"
      },
      platform: {
        chipset: "Qualcomm Snapdragon 8 Gen 2",
        cpu: "Octa-core",
        gpu: "Adreno 740"
      },
      memory: {
        ram: "8GB/12GB",
        internal: "256GB/512GB/1TB"
      },
      camera: {
        main: "200 MP, f/1.7, 23mm (wide)",
        ultrawide: "12 MP, f/2.2, 13mm, 120˚",
        telephoto1: "10 MP, f/2.4, 70mm (telephoto)",
        telephoto2: "10 MP, f/4.9, 230mm (periscope telephoto)",
        features: "LED flash, auto-HDR, panorama"
      },
      battery: {
        type: "Li-Ion 5000 mAh",
        charging: "45W wired, 15W wireless"
      },
      os: "Android 13, One UI 5.1",
      colors: ["Phantom Black", "Cream", "Green", "Lavender"],
      dimensions: "163.4 x 78.1 x 8.9 mm",
      weight: "234 g"
    }
  },
  "google-pixel-7-pro": {
    id: "google-pixel-7-pro",
    name: "Google Pixel 7 Pro",
    brand: "Google",
    image: "https://fdn2.gsmarena.com/vv/bigpic/google-pixel7-pro-new.jpg",
    images: [
      "https://fdn2.gsmarena.com/vv/bigpic/google-pixel7-pro-new.jpg",
      "https://fdn2.gsmarena.com/vv/pics/google/google-pixel7-pro-2.jpg",
      "https://fdn2.gsmarena.com/vv/pics/google/google-pixel7-pro-3.jpg",
      "https://fdn2.gsmarena.com/vv/pics/google/google-pixel7-pro-4.jpg"
    ],
    releaseDate: "October 2022",
    price: 899,
    specs: {
      display: {
        size: "6.7 inches",
        resolution: "1440 x 3120 pixels",
        type: "LTPO AMOLED",
        refreshRate: "120Hz"
      },
      platform: {
        chipset: "Google Tensor G2",
        cpu: "Octa-core",
        gpu: "Mali-G710 MP7"
      },
      memory: {
        ram: "12 GB",
        internal: "128GB/256GB/512GB"
      },
      camera: {
        main: "50 MP, f/1.9, 25mm (wide)",
        ultrawide: "12 MP, f/2.2, 126˚",
        telephoto: "48 MP, f/3.5, 120mm (telephoto)",
        features: "Dual-LED flash, Pixel Shift, Auto-HDR, panorama"
      },
      battery: {
        type: "Li-Ion 5000 mAh",
        charging: "30W wired, 23W wireless"
      },
      os: "Android 13",
      colors: ["Obsidian", "Snow", "Hazel"],
      dimensions: "162.9 x 76.6 x 8.9 mm",
      weight: "212 g"
    }
  }
};

const ProductPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { addToCompare, isInCompareList } = useCompare();
  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState<any>(null);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    // Simulate API fetch
    setLoading(true);
    setTimeout(() => {
      if (id && productData[id as keyof typeof productData]) {
        setProduct(productData[id as keyof typeof productData]);
      } else {
        // Handle product not found
      }
      setLoading(false);
    }, 1000);
  }, [id]);

  const handleAddToCompare = () => {
    if (!product) return;
    
    addToCompare({
      id: product.id,
      name: product.name,
      image: product.image
    });
    
    toast({
      title: "Added to compare list",
      description: `${product.name} has been added to your compare list.`,
    });
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-12 flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <Loader className="h-10 w-10 animate-spin text-primary mx-auto mb-4" />
            <p className="text-lg">Loading product details...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (!product) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-12 text-center">
          <h2 className="text-2xl font-bold mb-4">Product Not Found</h2>
          <p className="mb-8">The product you're looking for doesn't exist or has been removed.</p>
          <Button asChild>
            <Link to="/search">Browse Products</Link>
          </Button>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-4">
          <Link to="/search" className="text-sm text-muted-foreground hover:text-primary">
            ← Back to search results
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
          {/* Product Images */}
          <motion.div 
            className="bg-card rounded-lg p-4 border"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className="relative aspect-square bg-white rounded-md overflow-hidden mb-4">
              <img 
                src={product.images[selectedImage]} 
                alt={product.name} 
                className="w-full h-full object-contain p-4"
              />
            </div>
            <div className="flex gap-2 overflow-x-auto pb-2">
              {product.images.map((img: string, index: number) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`relative aspect-square w-20 h-20 border rounded-md overflow-hidden flex-shrink-0 bg-white ${
                    selectedImage === index ? "ring-2 ring-primary" : ""
                  }`}
                >
                  <img 
                    src={img} 
                    alt={`${product.name} - view ${index + 1}`} 
                    className="w-full h-full object-contain p-2"
                  />
                </button>
              ))}
            </div>
          </motion.div>

          {/* Product Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className="mb-2">
              <Badge variant="outline" className="mb-2">
                {product.brand}
              </Badge>
              <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
              <div className="flex items-center gap-2 mb-4">
                <p className="text-2xl font-bold text-primary">${product.price}</p>
                <span className="text-muted-foreground">
                  Release: {product.releaseDate}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="flex flex-col items-center justify-center bg-muted p-4 rounded-lg">
                <MonitorSmartphone className="h-8 w-8 text-primary mb-2" />
                <span className="text-xs text-muted-foreground">Display</span>
                <span className="font-medium text-center">{product.specs.display.size}</span>
              </div>
              <div className="flex flex-col items-center justify-center bg-muted p-4 rounded-lg">
                <Camera className="h-8 w-8 text-primary mb-2" />
                <span className="text-xs text-muted-foreground">Camera</span>
                <span className="font-medium text-center">{product.specs.camera.main.split(',')[0]}</span>
              </div>
              <div className="flex flex-col items-center justify-center bg-muted p-4 rounded-lg">
                <Battery className="h-8 w-8 text-primary mb-2" />
                <span className="text-xs text-muted-foreground">Battery</span>
                <span className="font-medium text-center">{product.specs.battery.type.split(' ')[2]}</span>
              </div>
              <div className="flex flex-col items-center justify-center bg-muted p-4 rounded-lg">
                <Cpu className="h-8 w-8 text-primary mb-2" />
                <span className="text-xs text-muted-foreground">Chipset</span>
                <span className="font-medium text-center text-xs">{product.specs.platform.chipset.split(' ').slice(0, 2).join(' ')}</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-4 mb-8">
              <Button onClick={handleAddToCompare} disabled={isInCompareList(product.id)}>
                {isInCompareList(product.id) ? (
                  <>
                    <Check className="mr-2 h-4 w-4" />
                    Added to Compare
                  </>
                ) : (
                  <>
                    <Plus className="mr-2 h-4 w-4" />
                    Add to Compare
                  </>
                )}
              </Button>
              <Button variant="outline">
                <Heart className="mr-2 h-4 w-4" />
                Add to Favorites
              </Button>
              <Button asChild variant="secondary">
                <Link to={`/prices/${product.id}`}>
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  Compare Prices
                </Link>
              </Button>
            </div>
            
            <div className="border-t pt-4">
              <h3 className="font-semibold mb-2">Available Colors</h3>
              <div className="flex flex-wrap gap-2">
                {product.specs.colors.map((color: string) => (
                  <Badge key={color} variant="outline">{color}</Badge>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Specifications */}
        <Tabs defaultValue="overview" className="mb-16">
          <TabsList className="mb-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="detailed">Detailed Specs</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="rounded-lg border p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
              <div>
                <h3 className="text-lg font-semibold flex items-center mb-4">
                  <MonitorSmartphone className="mr-2 h-5 w-5 text-primary" />
                  Display
                </h3>
                <table className="w-full">
                  <tbody>
                    <tr className="border-b">
                      <td className="py-2 text-muted-foreground">Size</td>
                      <td className="py-2 font-medium">{product.specs.display.size}</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2 text-muted-foreground">Resolution</td>
                      <td className="py-2 font-medium">{product.specs.display.resolution}</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2 text-muted-foreground">Type</td>
                      <td className="py-2 font-medium">{product.specs.display.type}</td>
                    </tr>
                    <tr>
                      <td className="py-2 text-muted-foreground">Refresh Rate</td>
                      <td className="py-2 font-medium">{product.specs.display.refreshRate}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div>
                <h3 className="text-lg font-semibold flex items-center mb-4">
                  <Camera className="mr-2 h-5 w-5 text-primary" />
                  Camera
                </h3>
                <table className="w-full">
                  <tbody>
                    <tr className="border-b">
                      <td className="py-2 text-muted-foreground">Main</td>
                      <td className="py-2 font-medium">{product.specs.camera.main}</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2 text-muted-foreground">Ultrawide</td>
                      <td className="py-2 font-medium">{product.specs.camera.ultrawide}</td>
                    </tr>
                    <tr>
                      <td className="py-2 text-muted-foreground">Telephoto</td>
                      <td className="py-2 font-medium">
                        {product.specs.camera.telephoto || product.specs.camera.telephoto1 || "N/A"}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div>
                <h3 className="text-lg font-semibold flex items-center mb-4">
                  <PieChart className="mr-2 h-5 w-5 text-primary" />
                  Platform
                </h3>
                <table className="w-full">
                  <tbody>
                    <tr className="border-b">
                      <td className="py-2 text-muted-foreground">Chipset</td>
                      <td className="py-2 font-medium">{product.specs.platform.chipset}</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2 text-muted-foreground">CPU</td>
                      <td className="py-2 font-medium">{product.specs.platform.cpu}</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2 text-muted-foreground">GPU</td>
                      <td className="py-2 font-medium">{product.specs.platform.gpu}</td>
                    </tr>
                    <tr>
                      <td className="py-2 text-muted-foreground">OS</td>
                      <td className="py-2 font-medium">{product.specs.os}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div>
                <h3 className="text-lg font-semibold flex items-center mb-4">
                  <Battery className="mr-2 h-5 w-5 text-primary" />
                  Battery & Memory
                </h3>
                <table className="w-full">
                  <tbody>
                    <tr className="border-b">
                      <td className="py-2 text-muted-foreground">Battery</td>
                      <td className="py-2 font-medium">{product.specs.battery.type}</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2 text-muted-foreground">Charging</td>
                      <td className="py-2 font-medium">{product.specs.battery.charging}</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2 text-muted-foreground">RAM</td>
                      <td className="py-2 font-medium">{product.specs.memory.ram}</td>
                    </tr>
                    <tr>
                      <td className="py-2 text-muted-foreground">Storage</td>
                      <td className="py-2 font-medium">{product.specs.memory.internal}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="detailed" className="rounded-lg border p-6">
            <div className="space-y-8">
              <div>
                <h3 className="text-lg font-semibold mb-4 border-b pb-2">Display</h3>
                <table className="w-full">
                  <tbody>
                    {Object.entries(product.specs.display).map(([key, value]) => (
                      <tr key={key} className="border-b last:border-b-0">
                        <td className="py-2 text-muted-foreground capitalize">{key}</td>
                        <td className="py-2 font-medium">{value as string}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-4 border-b pb-2">Platform</h3>
                <table className="w-full">
                  <tbody>
                    {Object.entries(product.specs.platform).map(([key, value]) => (
                      <tr key={key} className="border-b last:border-b-0">
                        <td className="py-2 text-muted-foreground capitalize">{key}</td>
                        <td className="py-2 font-medium">{value as string}</td>
                      </tr>
                    ))}
                    <tr className="border-b">
                      <td className="py-2 text-muted-foreground">OS</td>
                      <td className="py-2 font-medium">{product.specs.os}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-4 border-b pb-2">Memory</h3>
                <table className="w-full">
                  <tbody>
                    {Object.entries(product.specs.memory).map(([key, value]) => (
                      <tr key={key} className="border-b last:border-b-0">
                        <td className="py-2 text-muted-foreground capitalize">{key}</td>
                        <td className="py-2 font-medium">{value as string}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-4 border-b pb-2">Camera</h3>
                <table className="w-full">
                  <tbody>
                    {Object.entries(product.specs.camera).map(([key, value]) => (
                      <tr key={key} className="border-b last:border-b-0">
                        <td className="py-2 text-muted-foreground capitalize">{key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</td>
                        <td className="py-2 font-medium">{value as string}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-4 border-b pb-2">Battery</h3>
                <table className="w-full">
                  <tbody>
                    {Object.entries(product.specs.battery).map(([key, value]) => (
                      <tr key={key} className="border-b last:border-b-0">
                        <td className="py-2 text-muted-foreground capitalize">{key}</td>
                        <td className="py-2 font-medium">{value as string}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-4 border-b pb-2">Physical Specifications</h3>
                <table className="w-full">
                  <tbody>
                    <tr className="border-b">
                      <td className="py-2 text-muted-foreground">Dimensions</td>
                      <td className="py-2 font-medium">{product.specs.dimensions}</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2 text-muted-foreground">Weight</td>
                      <td className="py-2 font-medium">{product.specs.weight}</td>
                    </tr>
                    <tr>
                      <td className="py-2 text-muted-foreground">Colors</td>
                      <td className="py-2 font-medium">{product.specs.colors.join(", ")}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default ProductPage;
