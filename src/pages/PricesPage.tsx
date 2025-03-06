
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import MainLayout from '@/components/layouts/MainLayout';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ExternalLink, ArrowUpDown, Loader2 } from 'lucide-react';

// Mock data for now - Updated for Indian retailers and prices in ₹
const mockPricesData = {
  'iphone-14-pro': {
    name: 'iPhone 14 Pro',
    image: 'https://fdn2.gsmarena.com/vv/bigpic/apple-iphone-14-pro.jpg',
    prices: [
      { retailer: 'Amazon India', price: 119999, url: 'https://www.amazon.in' },
      { retailer: 'Flipkart', price: 122999, url: 'https://www.flipkart.com' },
      { retailer: 'Croma', price: 124999, url: 'https://www.croma.com' }
    ]
  },
  'samsung-galaxy-s23-ultra': {
    name: 'Samsung Galaxy S23 Ultra',
    image: 'https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-s23-ultra-5g.jpg',
    prices: [
      { retailer: 'Amazon India', price: 124999, url: 'https://www.amazon.in' },
      { retailer: 'Flipkart', price: 129999, url: 'https://www.flipkart.com' },
      { retailer: 'Croma', price: 126999, url: 'https://www.croma.com' }
    ]
  },
  'google-pixel-7-pro': {
    name: 'Google Pixel 7 Pro',
    image: 'https://fdn2.gsmarena.com/vv/bigpic/google-pixel7-pro-new.jpg',
    prices: [
      { retailer: 'Amazon India', price: 79999, url: 'https://www.amazon.in' },
      { retailer: 'Flipkart', price: 81999, url: 'https://www.flipkart.com' },
      { retailer: 'Croma', price: 84999, url: 'https://www.croma.com' }
    ]
  },
  'xiaomi-13-pro': {
    name: 'Xiaomi 13 Pro',
    image: 'https://fdn2.gsmarena.com/vv/bigpic/xiaomi-13-pro.jpg',
    prices: [
      { retailer: 'Amazon India', price: 69999, url: 'https://www.amazon.in' },
      { retailer: 'Flipkart', price: 72999, url: 'https://www.flipkart.com' },
      { retailer: 'Croma', price: 74999, url: 'https://www.croma.com' }
    ]
  }
};

const PricesPage = () => {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [productData, setProductData] = useState<any>(null);

  useEffect(() => {
    // Simulate API fetch
    setTimeout(() => {
      if (id && mockPricesData[id as keyof typeof mockPricesData]) {
        setProductData(mockPricesData[id as keyof typeof mockPricesData]);
      } else {
        toast({
          title: "Product not found",
          description: "We couldn't find price information for this product.",
          variant: "destructive"
        });
      }
      setLoading(false);
    }, 1000);
  }, [id, toast]);

  const toggleSortOrder = () => {
    setSortOrder(prevOrder => prevOrder === 'asc' ? 'desc' : 'asc');
  };

  const sortedPrices = productData?.prices
    ? [...productData.prices].sort((a, b) => {
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
