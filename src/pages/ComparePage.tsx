import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import MainLayout from "@/components/layouts/MainLayout";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useCompare } from "@/context/CompareContext";
import { motion } from "framer-motion";
import { ChevronRight, X, ShoppingCart, AlertCircle, ChevronDown, ChevronUp, Scale, ArrowRight } from "lucide-react";
import { getSmartphoneById } from "@/services/SearchService";
import { Skeleton } from "@/components/ui/skeleton";

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
  dimensions: [
    { key: 'dimensions', label: 'Dimensions' },
    { key: 'weight', label: 'Weight' },
    { key: 'build', label: 'Build' },
    { key: 'colors', label: 'Colors' }
  ],
  display: [
    { key: 'displayType', label: 'Display Type' },
    { key: 'displaySize', label: 'Display Size' },
    { key: 'displayResolution', label: 'Resolution' },
    { key: 'displayProtection', label: 'Protection' },
    { key: 'displayFeatures', label: 'Display Features' }
  ],
  platform: [
    { key: 'os', label: 'Operating System' },
    { key: 'chipset', label: 'Chipset' },
    { key: 'cpu', label: 'CPU' },
    { key: 'gpu', label: 'GPU' }
  ],
  memory: [
    { key: 'cardSlot', label: 'Card Slot' },
    { key: 'internalStorage', label: 'Internal Storage' },
    { key: 'ram', label: 'RAM' }
  ],
  camera: [
    { key: 'mainCamera', label: 'Main Camera' },
    { key: 'mainCameraFeatures', label: 'Camera Features' },
    { key: 'mainCameraVideo', label: 'Video' },
    { key: 'selfieCamera', label: 'Selfie Camera' },
    { key: 'selfieCameraFeatures', label: 'Selfie Features' },
    { key: 'selfieCameraVideo', label: 'Selfie Video' }
  ],
  sound: [
    { key: 'loudspeaker', label: 'Loudspeaker' },
    { key: 'audioJack', label: 'Audio Jack' }
  ],
  connectivity: [
    { key: 'wlan', label: 'Wi-Fi' },
    { key: 'bluetooth', label: 'Bluetooth' },
    { key: 'gps', label: 'GPS' },
    { key: 'nfc', label: 'NFC' },
    { key: 'radio', label: 'Radio' },
    { key: 'usb', label: 'USB' }
  ],
  features: [
    { key: 'sensors', label: 'Sensors' },
    { key: 'other', label: 'Other Features' }
  ],
  battery: [
    { key: 'batteryType', label: 'Battery Type' },
    { key: 'batteryCharging', label: 'Charging' }
  ],
  misc: [
    { key: 'models', label: 'Models' },
    { key: 'sar', label: 'SAR' },
    { key: 'sarEu', label: 'SAR EU' },
    { key: 'price', label: 'Price' }
  ],
  tests: [
    { key: 'performance', label: 'Performance' },
    { key: 'displayTest', label: 'Display' },
    { key: 'cameraTest', label: 'Camera' },
    { key: 'loudspeakerTest', label: 'Loudspeaker' },
    { key: 'batteryLifeTest', label: 'Battery Life' }
  ]
};

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(price);
};

const ComparePage = () => {
  const { compareList, removeFromCompare, clearCompareList } = useCompare();
  const [expandedGroups, setExpandedGroups] = useState<string[]>(['essential']);
  const [detailedSpecs, setDetailedSpecs] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetailedSpecs = async () => {
      if (compareList.length === 0) {
        setLoading(false);
        return;
      }

      setLoading(true);
      const specsPromises = compareList.map(product => 
        getSmartphoneById(product.id)
      );

      try {
        const results = await Promise.all(specsPromises);
        const specsMap: Record<string, any> = {};
        
        results.forEach((result, index) => {
          if (result) {
            specsMap[compareList[index].id] = result;
          }
        });
        
        setDetailedSpecs(specsMap);
      } catch (error) {
        console.error("Error fetching detailed specs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDetailedSpecs();
  }, [compareList]);

  const toggleGroup = (group: string) => {
    setExpandedGroups(prev => 
      prev.includes(group) 
        ? prev.filter(g => g !== group) 
        : [...prev, group]
    );
  };

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
            <Scale className="h-12 w-12 text-muted-foreground mb-4" />
            <h1 className="text-2xl font-bold mb-4">Your Compare List is Empty</h1>
            <p className="text-muted-foreground mb-6">
              Add products to compare their specifications and make better buying decisions.
            </p>
            <Button asChild>
              <Link to="/search">
                Find Products to Compare
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </MainLayout>
    );
  }

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
        
        {loading ? (
          <div className="flex flex-col gap-4">
            <div className="h-96 w-full bg-muted animate-pulse rounded-lg" />
            <div className="h-64 w-full bg-muted animate-pulse rounded-lg" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[200px]">Specification</TableHead>
                  {compareList.map((product) => {
                    const productSpec = detailedSpecs[product.id];
                    
                    return (
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
                                src={product.image || productSpec?.image} 
                                alt={product.name} 
                                className="h-full w-full object-contain"
                              />
                            </div>
                            <div className="text-center">
                              <p className="font-medium">{product.name}</p>
                              {productSpec?.releaseDate && (
                                <p className="text-xs text-muted-foreground mt-1">
                                  {productSpec.releaseDate}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      </TableHead>
                    );
                  })}
                </TableRow>
              </TableHeader>
              <TableBody>
                {comparisonGroups.essential.map((field) => (
                  <TableRow key={field.key}>
                    <TableCell className="font-medium">{field.label}</TableCell>
                    {compareList.map((product) => {
                      const productSpec = detailedSpecs[product.id];
                      const value = productSpec?.specs?.[field.key] || 'N/A';
                      
                      return (
                        <TableCell key={`${product.id}-${field.key}`}>
                          {value}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                ))}
                
                {Object.entries(comparisonGroups)
                  .filter(([key]) => key !== 'essential')
                  .map(([groupKey, fields]) => {
                    const isExpanded = expandedGroups.includes(groupKey);
                    
                    return (
                      <React.Fragment key={groupKey}>
                        <TableRow 
                          className="cursor-pointer hover:bg-muted" 
                          onClick={() => toggleGroup(groupKey)}
                        >
                          <TableCell colSpan={compareList.length + 1} className="py-3">
                            <div className="flex items-center font-semibold">
                              {isExpanded ? (
                                <ChevronUp className="mr-2 h-4 w-4 text-primary" />
                              ) : (
                                <ChevronDown className="mr-2 h-4 w-4 text-primary" />
                              )}
                              {groupKey.charAt(0).toUpperCase() + groupKey.slice(1)}
                            </div>
                          </TableCell>
                        </TableRow>
                        
                        {isExpanded && fields.map((field) => (
                          <TableRow key={field.key}>
                            <TableCell className="font-medium pl-6">
                              {field.label}
                            </TableCell>
                            {compareList.map((product) => {
                              const productSpec = detailedSpecs[product.id];
                              const value = productSpec?.specs?.[field.key] || 'N/A';
                              
                              return (
                                <TableCell key={`${product.id}-${field.key}`}>
                                  {value}
                                </TableCell>
                              );
                            })}
                          </TableRow>
                        ))}
                      </React.Fragment>
                    );
                  })}
                
                <TableRow>
                  <TableCell>Actions</TableCell>
                  {compareList.map((product) => (
                    <TableCell key={`${product.id}-actions`}>
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
        )}
      </div>
    </MainLayout>
  );
};

export default ComparePage;
