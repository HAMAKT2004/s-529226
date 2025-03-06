
import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import MainLayout from "@/components/layouts/MainLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader, ShoppingCart, ArrowUpDown, Check, ChevronLeft, Star } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useCompare } from "@/context/CompareContext";
import { motion } from "framer-motion";
import { getSmartphoneById } from "@/services/SearchService";

interface PriceData {
  store: string;
  price: number;
  discount?: number;
  rating?: number;
  reviews?: number;
  inStock: boolean;
  link: string;
  logoUrl: string;
}

const PricesPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const { addToCompare, isInCompareList } = useCompare();
  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState<any>(null);
  const [sortBy, setSortBy] = useState<'price' | 'rating'>('price');

  // Get product details
  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      
      setLoading(true);
      try {
        const fetchedProduct = await getSmartphoneById(id);
        if (fetchedProduct) {
          setProduct(fetchedProduct);
        } else {
          toast({
            title: "Product not found",
            description: "We couldn't find the requested product.",
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error("Error fetching product:", error);
        toast({
          title: "Failed to load product",
          description: "Please try again later.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchProduct();
  }, [id, toast]);

  // Generate prices for the specific product model
  const generatePrices = (productId: string): PriceData[] => {
    // Base price derived from product ID to ensure consistent pricing
    const productCode = productId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const basePrice = 30000 + (productCode % 120000); // Between ₹30,000 and ₹150,000
    
    // Identify high-end models for higher pricing
    const isHighEnd = productId.includes('pro') || 
                      productId.includes('ultra') || 
                      productId.includes('fold') || 
                      productId.includes('max');
                      
    const isPremium = productId.includes('iphone') || 
                      productId.includes('samsung') && (productId.includes('s23') || productId.includes('s24'));
    
    const priceMultiplier = isHighEnd ? 1.4 : (isPremium ? 1.2 : 1);
    const adjustedBasePrice = basePrice * priceMultiplier;
    
    // Create store-specific pricing with intentional variations
    return [
      {
        store: "Amazon",
        price: Math.round((adjustedBasePrice - 1500) / 100) * 100, // Slightly cheaper
        discount: Math.round(5 + (Math.random() * 10)),
        rating: 4.1 + (Math.random() * 0.8),
        reviews: Math.round(1000 + (Math.random() * 9000)),
        inStock: true,
        link: `https://www.amazon.in/s?k=${encodeURIComponent(product?.name || productId)}`,
        logoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Amazon_logo.svg/1024px-Amazon_logo.svg.png"
      },
      {
        store: "Flipkart",
        price: Math.round(adjustedBasePrice / 100) * 100,
        discount: Math.round(6 + (Math.random() * 12)),
        rating: 4.0 + (Math.random() * 0.9),
        reviews: Math.round(800 + (Math.random() * 8000)),
        inStock: true,
        link: `https://www.flipkart.com/search?q=${encodeURIComponent(product?.name || productId)}`,
        logoUrl: "https://static-assets-web.flixcart.com/fk-p-linchpin-web/fk-cp-zion/img/flipkart-plus_8d85f4.png"
      },
      {
        store: "Croma",
        price: Math.round((adjustedBasePrice + 1000) / 100) * 100, // Slightly more expensive
        discount: Math.round(4 + (Math.random() * 8)),
        rating: 3.9 + (Math.random() * 0.9),
        reviews: Math.round(200 + (Math.random() * 2000)),
        inStock: Math.random() > 0.2, // Sometimes out of stock
        link: `https://www.croma.com/searchB?q=${encodeURIComponent(product?.name || productId)}`,
        logoUrl: "https://media.croma.com/image/upload/v1637759004/Croma%20Assets/CMS/Category%20icon/croma-logo-dark-bg_wstk6j.png"
      },
      {
        store: "Reliance Digital",
        price: Math.round((adjustedBasePrice - 800) / 100) * 100,
        discount: Math.round(5 + (Math.random() * 9)),
        rating: 4.0 + (Math.random() * 0.7),
        reviews: Math.round(300 + (Math.random() * 3000)),
        inStock: Math.random() > 0.1,
        link: `https://www.reliancedigital.in/search?q=${encodeURIComponent(product?.name || productId)}`,
        logoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0c/Reliance_Digital_Logo.svg/1200px-Reliance_Digital_Logo.svg.png"
      },
      {
        store: "Vijay Sales",
        price: Math.round((adjustedBasePrice + 1500) / 100) * 100,
        discount: Math.round(3 + (Math.random() * 7)),
        rating: 3.8 + (Math.random() * 0.8),
        reviews: Math.round(100 + (Math.random() * 1000)),
        inStock: Math.random() > 0.3,
        link: `https://www.vijaysales.com/search/${encodeURIComponent(product?.name || productId)}`,
        logoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/10/Vijay_Sales_Logo.webp/120px-Vijay_Sales_Logo.webp.png"
      }
    ];
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  };

  const handleCompareClick = () => {
    if (product && !isInCompareList(product.id)) {
      addToCompare({
        id: product.id,
        name: product.name,
        image: product.image,
        brand: product.brand
      });
    }
  };

  let prices: PriceData[] = [];
  
  if (product) {
    prices = generatePrices(product.id);
    
    // Sort prices based on user preference
    if (sortBy === 'price') {
      prices.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'rating') {
      prices.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    }
  }

  if (loading) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-12 flex justify-center items-center">
          <div className="text-center">
            <Loader className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
            <p className="text-lg">Loading price comparison...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (!product) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-12">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
            <p className="mb-6">We couldn't find the product you're looking for.</p>
            <Button asChild>
              <Link to="/search">
                <ChevronLeft className="mr-2 h-4 w-4" />
                Back to Search
              </Link>
            </Button>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Product info sidebar */}
          <div className="md:w-1/3 lg:w-1/4">
            <Card>
              <CardContent className="p-6">
                <div className="bg-white rounded-md overflow-hidden p-4 mb-4 flex justify-center">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="h-48 object-contain"
                  />
                </div>
                <h1 className="text-xl font-bold mb-1">{product.name}</h1>
                <p className="text-muted-foreground mb-4">{product.brand}</p>
                
                <div className="space-y-4 mb-6">
                  <div>
                    <h3 className="font-medium mb-2">Key Specifications</h3>
                    <ul className="space-y-2 text-sm">
                      {product.specs.display && (
                        <li className="flex justify-between">
                          <span className="text-muted-foreground">Display:</span>
                          <span className="font-medium">{product.specs.display.split(',')[0]}</span>
                        </li>
                      )}
                      {product.specs.processor && (
                        <li className="flex justify-between">
                          <span className="text-muted-foreground">Processor:</span>
                          <span className="font-medium">{product.specs.processor}</span>
                        </li>
                      )}
                      {product.specs.ram && (
                        <li className="flex justify-between">
                          <span className="text-muted-foreground">RAM:</span>
                          <span className="font-medium">{product.specs.ram}</span>
                        </li>
                      )}
                      {product.specs.storage && (
                        <li className="flex justify-between">
                          <span className="text-muted-foreground">Storage:</span>
                          <span className="font-medium">{product.specs.storage}</span>
                        </li>
                      )}
                      {product.specs.camera && (
                        <li className="flex justify-between">
                          <span className="text-muted-foreground">Camera:</span>
                          <span className="font-medium">{product.specs.camera}</span>
                        </li>
                      )}
                      {product.specs.battery && (
                        <li className="flex justify-between">
                          <span className="text-muted-foreground">Battery:</span>
                          <span className="font-medium">{product.specs.battery}</span>
                        </li>
                      )}
                    </ul>
                  </div>
                </div>
                
                <div className="flex flex-col gap-3">
                  <Button asChild variant="outline">
                    <Link to={`/product/${product.id}`}>
                      View Full Specifications
                    </Link>
                  </Button>
                  <Button 
                    onClick={handleCompareClick}
                    disabled={isInCompareList(product.id)}
                  >
                    {isInCompareList(product.id) ? (
                      <>
                        <Check className="mr-2 h-4 w-4" />
                        Added to Compare
                      </>
                    ) : "Add to Compare"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Price comparison section */}
          <div className="md:w-2/3 lg:w-3/4">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Price Comparison</h2>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setSortBy(sortBy === 'price' ? 'rating' : 'price')}
              >
                <ArrowUpDown className="mr-2 h-4 w-4" />
                Sort by {sortBy === 'price' ? 'Rating' : 'Price'}
              </Button>
            </div>
            
            <Tabs defaultValue="all" className="mb-8">
              <TabsList className="mb-4">
                <TabsTrigger value="all">All Stores</TabsTrigger>
                <TabsTrigger value="instock">In Stock Only</TabsTrigger>
              </TabsList>
              
              <TabsContent value="all">
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-4"
                >
                  {prices.map((price, index) => (
                    <motion.div
                      key={price.store}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Card className={`overflow-hidden ${price.inStock ? '' : 'opacity-70'}`}>
                        <CardContent className="p-0">
                          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div className="p-4 md:p-6 flex items-center justify-center md:justify-start">
                              <div className="w-24 h-12 relative">
                                <img
                                  src={price.logoUrl}
                                  alt={price.store}
                                  className="absolute inset-0 w-full h-full object-contain"
                                />
                              </div>
                            </div>
                            
                            <div className="p-4 md:pt-6 md:pb-6 md:px-0 border-t md:border-t-0 md:border-l border-gray-200 dark:border-gray-800 flex flex-col justify-center">
                              <div className="text-center md:text-left">
                                <div className="text-2xl font-bold text-primary">
                                  {formatPrice(price.price)}
                                </div>
                                {price.discount && (
                                  <div className="text-sm text-green-600 dark:text-green-500">
                                    {price.discount}% off
                                  </div>
                                )}
                              </div>
                            </div>
                            
                            <div className="p-4 md:py-6 md:px-0 border-t md:border-t-0 md:border-l border-gray-200 dark:border-gray-800 flex items-center justify-center md:justify-start">
                              {price.rating && (
                                <div className="flex flex-col items-center md:items-start">
                                  <div className="flex items-center">
                                    <div className="text-lg font-bold mr-1">
                                      {price.rating.toFixed(1)}
                                    </div>
                                    <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                                  </div>
                                  <div className="text-xs text-muted-foreground">
                                    {price.reviews?.toLocaleString()} reviews
                                  </div>
                                </div>
                              )}
                            </div>
                            
                            <div className="p-4 md:p-6 border-t md:border-t-0 md:border-l border-gray-200 dark:border-gray-800 flex items-center justify-center">
                              <div className="w-full">
                                <Button 
                                  asChild 
                                  className="w-full"
                                  disabled={!price.inStock}
                                >
                                  <a href={price.link} target="_blank" rel="noopener noreferrer">
                                    {price.inStock ? (
                                      <>
                                        <ShoppingCart className="mr-2 h-4 w-4" />
                                        Buy Now
                                      </>
                                    ) : "Out of Stock"}
                                  </a>
                                </Button>
                                {!price.inStock && (
                                  <div className="text-xs text-center mt-2 text-muted-foreground">
                                    Check website for availability
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </motion.div>
              </TabsContent>
              
              <TabsContent value="instock">
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-4"
                >
                  {prices.filter(price => price.inStock).map((price, index) => (
                    <motion.div
                      key={price.store}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Card className="overflow-hidden">
                        <CardContent className="p-0">
                          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div className="p-4 md:p-6 flex items-center justify-center md:justify-start">
                              <div className="w-24 h-12 relative">
                                <img
                                  src={price.logoUrl}
                                  alt={price.store}
                                  className="absolute inset-0 w-full h-full object-contain"
                                />
                              </div>
                            </div>
                            
                            <div className="p-4 md:pt-6 md:pb-6 md:px-0 border-t md:border-t-0 md:border-l border-gray-200 dark:border-gray-800 flex flex-col justify-center">
                              <div className="text-center md:text-left">
                                <div className="text-2xl font-bold text-primary">
                                  {formatPrice(price.price)}
                                </div>
                                {price.discount && (
                                  <div className="text-sm text-green-600 dark:text-green-500">
                                    {price.discount}% off
                                  </div>
                                )}
                              </div>
                            </div>
                            
                            <div className="p-4 md:py-6 md:px-0 border-t md:border-t-0 md:border-l border-gray-200 dark:border-gray-800 flex items-center justify-center md:justify-start">
                              {price.rating && (
                                <div className="flex flex-col items-center md:items-start">
                                  <div className="flex items-center">
                                    <div className="text-lg font-bold mr-1">
                                      {price.rating.toFixed(1)}
                                    </div>
                                    <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                                  </div>
                                  <div className="text-xs text-muted-foreground">
                                    {price.reviews?.toLocaleString()} reviews
                                  </div>
                                </div>
                              )}
                            </div>
                            
                            <div className="p-4 md:p-6 border-t md:border-t-0 md:border-l border-gray-200 dark:border-gray-800 flex items-center justify-center">
                              <Button 
                                asChild 
                                className="w-full"
                              >
                                <a href={price.link} target="_blank" rel="noopener noreferrer">
                                  <ShoppingCart className="mr-2 h-4 w-4" />
                                  Buy Now
                                </a>
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </motion.div>
              </TabsContent>
            </Tabs>
            
            <div className="bg-muted p-4 rounded-lg">
              <p className="text-sm text-muted-foreground">
                Note: Prices listed are approximate and may vary. Always check the retailer's website for the most current pricing. Links will take you to the search results page on each retailer's website.
              </p>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default PricesPage;
