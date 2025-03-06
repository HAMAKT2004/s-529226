
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import MainLayout from '@/components/layouts/MainLayout';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ExternalLink, ArrowUpDown, Loader2 } from 'lucide-react';
import SearchService from '@/services/SearchService';

// Price data for products with proper links to Indian e-commerce sites
const mockPricesData = {
  'iphone-14-pro': {
    prices: [
      { retailer: 'Amazon India', price: 119999, url: 'https://www.amazon.in/s?k=iphone+14+pro' },
      { retailer: 'Flipkart', price: 122999, url: 'https://www.flipkart.com/search?q=iphone+14+pro' },
      { retailer: 'Croma', price: 124999, url: 'https://www.croma.com/searchB?q=iphone+14+pro' }
    ]
  },
  'samsung-galaxy-s23-ultra': {
    prices: [
      { retailer: 'Amazon India', price: 124999, url: 'https://www.amazon.in/s?k=samsung+galaxy+s23+ultra' },
      { retailer: 'Flipkart', price: 129999, url: 'https://www.flipkart.com/search?q=samsung+galaxy+s23+ultra' },
      { retailer: 'Croma', price: 126999, url: 'https://www.croma.com/searchB?q=samsung+galaxy+s23+ultra' }
    ]
  },
  'google-pixel-7-pro': {
    prices: [
      { retailer: 'Amazon India', price: 79999, url: 'https://www.amazon.in/s?k=google+pixel+7+pro' },
      { retailer: 'Flipkart', price: 81999, url: 'https://www.flipkart.com/search?q=google+pixel+7+pro' },
      { retailer: 'Croma', price: 84999, url: 'https://www.croma.com/searchB?q=google+pixel+7+pro' }
    ]
  },
  'xiaomi-13-pro': {
    prices: [
      { retailer: 'Amazon India', price: 69999, url: 'https://www.amazon.in/s?k=xiaomi+13+pro' },
      { retailer: 'Flipkart', price: 72999, url: 'https://www.flipkart.com/search?q=xiaomi+13+pro' },
      { retailer: 'Croma', price: 74999, url: 'https://www.croma.com/searchB?q=xiaomi+13+pro' }
    ]
  },
  'oneplus-12': {
    prices: [
      { retailer: 'Amazon India', price: 64999, url: 'https://www.amazon.in/s?k=oneplus+12' },
      { retailer: 'Flipkart', price: 62999, url: 'https://www.flipkart.com/search?q=oneplus+12' },
      { retailer: 'Croma', price: 65999, url: 'https://www.croma.com/searchB?q=oneplus+12' }
    ]
  },
  'realme-gt-5-pro': {
    prices: [
      { retailer: 'Amazon India', price: 52999, url: 'https://www.amazon.in/s?k=realme+gt+5+pro' },
      { retailer: 'Flipkart', price: 51999, url: 'https://www.flipkart.com/search?q=realme+gt+5+pro' },
      { retailer: 'Croma', price: 53999, url: 'https://www.croma.com/searchB?q=realme+gt+5+pro' }
    ]
  },
  'samsung-galaxy-s22-ultra': {
    prices: [
      { retailer: 'Amazon India', price: 99999, url: 'https://www.amazon.in/s?k=samsung+galaxy+s22+ultra' },
      { retailer: 'Flipkart', price: 101999, url: 'https://www.flipkart.com/search?q=samsung+galaxy+s22+ultra' },
      { retailer: 'Croma', price: 104999, url: 'https://www.croma.com/searchB?q=samsung+galaxy+s22+ultra' }
    ]
  },
  'samsung-galaxy-s22-plus': {
    prices: [
      { retailer: 'Amazon India', price: 84999, url: 'https://www.amazon.in/s?k=samsung+galaxy+s22+plus' },
      { retailer: 'Flipkart', price: 85999, url: 'https://www.flipkart.com/search?q=samsung+galaxy+s22+plus' },
      { retailer: 'Croma', price: 87999, url: 'https://www.croma.com/searchB?q=samsung+galaxy+s22+plus' }
    ]
  },
  'samsung-galaxy-s22': {
    prices: [
      { retailer: 'Amazon India', price: 69999, url: 'https://www.amazon.in/s?k=samsung+galaxy+s22' },
      { retailer: 'Flipkart', price: 70999, url: 'https://www.flipkart.com/search?q=samsung+galaxy+s22' },
      { retailer: 'Croma', price: 71999, url: 'https://www.croma.com/searchB?q=samsung+galaxy+s22' }
    ]
  }
};

// Generate fallback price data for any phone
const generateFallbackPrices = (productId: string, productName: string) => {
  // Base price between 30,000 and 120,000
  const basePrice = Math.floor(Math.random() * (120000 - 30000) + 30000);
  
  // Format the product name for URLs
  const formattedName = productName.toLowerCase().replace(/\s+/g, '+');
  
  return {
    prices: [
      { 
        retailer: 'Amazon India', 
        price: basePrice, 
        url: `https://www.amazon.in/s?k=${formattedName}` 
      },
      { 
        retailer: 'Flipkart', 
        price: basePrice + Math.floor(Math.random() * 3000), 
        url: `https://www.flipkart.com/search?q=${formattedName}` 
      },
      { 
        retailer: 'Croma', 
        price: basePrice + Math.floor(Math.random() * 5000), 
        url: `https://www.croma.com/searchB?q=${formattedName}` 
      }
    ]
  };
};

const PricesPage = () => {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [productData, setProductData] = useState<any>(null);
  const [priceData, setPriceData] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch the product details
        if (id) {
          const productDetails = await SearchService.getSmartphoneById(id);
          
          if (productDetails) {
            setProductData(productDetails);
            
            // Get price data from our mock database or generate fallback
            const prices = mockPricesData[id as keyof typeof mockPricesData] || 
                          generateFallbackPrices(id, productDetails.name);
            
            setPriceData(prices);
          } else {
            toast({
              title: "Product not found",
              description: "We couldn't find information for this product.",
              variant: "destructive"
            });
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        toast({
          title: "Error",
          description: "Something went wrong while fetching the data.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, toast]);

  const toggleSortOrder = () => {
    setSortOrder(prevOrder => prevOrder === 'asc' ? 'desc' : 'asc');
  };

  const sortedPrices = priceData?.prices
    ? [...priceData.prices].sort((a, b) => {
        return sortOrder === 'asc' 
          ? a.price - b.price 
          : b.price - a.price;
      })
    : [];

  // Function to format price in Indian Rupees
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  };

  return (
    <MainLayout>
      <div className="container py-8">
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : !productData ? (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold">Product Not Found</h2>
            <p className="text-muted-foreground mt-2">
              We couldn't find price information for this product.
            </p>
          </div>
        ) : (
          <>
            <div className="flex flex-col md:flex-row gap-6 items-start mb-8">
              <div className="w-full md:w-1/3 flex-shrink-0">
                <Card>
                  <CardContent className="p-6">
                    <div className="aspect-square relative rounded-lg overflow-hidden bg-muted mb-4">
                      <img 
                        src={productData.image} 
                        alt={productData.name}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <h1 className="text-2xl font-bold">{productData.name}</h1>
                    <p className="text-muted-foreground">{productData.brand}</p>
                  </CardContent>
                </Card>
              </div>
              
              <div className="w-full md:w-2/3">
                <Card>
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <div>
                        <CardTitle>Price Comparison</CardTitle>
                        <CardDescription>Compare prices from different Indian retailers</CardDescription>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={toggleSortOrder}
                      >
                        <ArrowUpDown className="mr-2 h-4 w-4" />
                        {sortOrder === 'asc' ? 'Lowest First' : 'Highest First'}
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {sortedPrices.map((price, index) => (
                        <div key={index}>
                          {index > 0 && <Separator className="my-4" />}
                          <div className="flex justify-between items-center">
                            <div>
                              <div className="font-medium">{price.retailer}</div>
                              <div className="text-2xl font-bold">{formatPrice(price.price)}</div>
                              {index === 0 && sortOrder === 'asc' && (
                                <Badge variant="secondary" className="mt-1">Best Price</Badge>
                              )}
                            </div>
                            <Button asChild>
                              <a href={price.url} target="_blank" rel="noopener noreferrer">
                                Visit Store
                                <ExternalLink className="ml-2 h-4 w-4" />
                              </a>
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </>
        )}
      </div>
    </MainLayout>
  );
};

export default PricesPage;
