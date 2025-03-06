
import React from "react";
import { Link } from "react-router-dom";
import MainLayout from "@/components/layouts/MainLayout";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useCompare } from "@/context/CompareContext";
import { motion } from "framer-motion";
import { ChevronRight, X, ShoppingCart, AlertCircle } from "lucide-react";

// Sample specs data for comparison
const productSpecs = {
  "iphone-14-pro": {
    display: "6.1 inches, 1179 x 2556 pixels, LTPO Super Retina XDR OLED",
    processor: "Apple A16 Bionic",
    ram: "6 GB",
    storage: "128GB/256GB/512GB/1TB",
    mainCamera: "48 MP, f/1.8, 24mm (wide)",
    battery: "3200 mAh",
    os: "iOS 16",
    weight: "206 g",
    price: 999
  },
  "samsung-galaxy-s23-ultra": {
    display: "6.8 inches, 1440 x 3088 pixels, Dynamic AMOLED 2X",
    processor: "Qualcomm Snapdragon 8 Gen 2",
    ram: "8GB/12GB",
    storage: "256GB/512GB/1TB",
    mainCamera: "200 MP, f/1.7, 23mm (wide)",
    battery: "5000 mAh",
    os: "Android 13, One UI 5.1",
    weight: "234 g",
    price: 1199
  },
  "google-pixel-7-pro": {
    display: "6.7 inches, 1440 x 3120 pixels, LTPO AMOLED",
    processor: "Google Tensor G2",
    ram: "12 GB",
    storage: "128GB/256GB/512GB",
    mainCamera: "50 MP, f/1.9, 25mm (wide)",
    battery: "5000 mAh",
    os: "Android 13",
    weight: "212 g",
    price: 899
  },
  "iphone-14": {
    display: "6.1 inches, 1170 x 2532 pixels, Super Retina XDR OLED",
    processor: "Apple A15 Bionic",
    ram: "6 GB",
    storage: "128GB/256GB/512GB",
    mainCamera: "12 MP, f/1.5, 26mm (wide)",
    battery: "3279 mAh",
    os: "iOS 16",
    weight: "172 g",
    price: 799
  },
  "samsung-galaxy-s23": {
    display: "6.1 inches, 1080 x 2340 pixels, Dynamic AMOLED 2X",
    processor: "Qualcomm Snapdragon 8 Gen 2",
    ram: "8 GB",
    storage: "128GB/256GB",
    mainCamera: "50 MP, f/1.8, 24mm (wide)",
    battery: "3900 mAh",
    os: "Android 13, One UI 5.1",
    weight: "168 g",
    price: 799
  },
  "google-pixel-7": {
    display: "6.3 inches, 1080 x 2400 pixels, AMOLED",
    processor: "Google Tensor G2",
    ram: "8 GB",
    storage: "128GB/256GB",
    mainCamera: "50 MP, f/1.9, 25mm (wide)",
    battery: "4355 mAh",
    os: "Android 13",
    weight: "197 g",
    price: 599
  },
};

// Helper to highlight higher/lower values
const getBetterValue = (field: string, values: any[]) => {
  const numericValues = values.filter(v => !isNaN(parseFloat(String(v))));
  if (numericValues.length < 2) return null;
  
  let better;
  if (field === 'weight') {
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

const ComparePage: React.FC = () => {
  const { compareList, removeFromCompare, clearCompareList } = useCompare();

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

  // Generate comparison data
  const comparisonFields = [
    { key: 'display', label: 'Display' },
    { key: 'processor', label: 'Processor' },
    { key: 'ram', label: 'RAM' },
    { key: 'storage', label: 'Storage' },
    { key: 'mainCamera', label: 'Main Camera' },
    { key: 'battery', label: 'Battery' },
    { key: 'os', label: 'Operating System' },
    { key: 'weight', label: 'Weight' },
    { key: 'price', label: 'Price' }
  ];

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
                            <p className="text-primary font-bold mt-1">${product.specs.price}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {comparisonFields.map((field) => {
                const values = specs.map(p => p.specs?.[field.key as keyof typeof p.specs]);
                const betterValue = getBetterValue(field.key, values);
                
                return (
                  <TableRow key={field.key}>
                    <TableCell className="font-medium">{field.label}</TableCell>
                    {specs.map((product, index) => {
                      const value = product.specs?.[field.key as keyof typeof product.specs];
                      let valueDisplay = value;
                      
                      // Format price with dollar sign
                      if (field.key === 'price') {
                        valueDisplay = value ? `$${value}` : 'N/A';
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
