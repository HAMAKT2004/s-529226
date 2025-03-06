
import React, { useState } from "react";
import { useSearchParams } from "react-router-dom";
import MainLayout from "@/components/layouts/MainLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Loader } from "lucide-react";
import ProductCard from "@/components/ProductCard";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";

// Temporary mock data - would be fetched from API in a real app
const mockSearchResults = {
  "iphone": [
    {
      id: "iphone-14-pro",
      name: "iPhone 14 Pro",
      image: "https://fdn2.gsmarena.com/vv/bigpic/apple-iphone-14-pro.jpg",
      brand: "Apple",
      specs: {
        display: "6.1 inches",
        battery: "3200 mAh",
        ram: "6 GB",
        camera: "48 MP"
      }
    },
    {
      id: "iphone-14",
      name: "iPhone 14",
      image: "https://fdn2.gsmarena.com/vv/bigpic/apple-iphone-14.jpg",
      brand: "Apple",
      specs: {
        display: "6.1 inches",
        battery: "3200 mAh",
        ram: "6 GB",
        camera: "12 MP"
      }
    },
    {
      id: "iphone-13-pro",
      name: "iPhone 13 Pro",
      image: "https://fdn2.gsmarena.com/vv/bigpic/apple-iphone-13-pro.jpg",
      brand: "Apple",
      specs: {
        display: "6.1 inches",
        battery: "3095 mAh",
        ram: "6 GB",
        camera: "12 MP"
      }
    }
  ],
  "samsung": [
    {
      id: "samsung-galaxy-s23-ultra",
      name: "Samsung Galaxy S23 Ultra",
      image: "https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-s23-ultra-5g.jpg",
      brand: "Samsung",
      specs: {
        display: "6.8 inches",
        battery: "5000 mAh",
        ram: "12 GB",
        camera: "200 MP"
      }
    },
    {
      id: "samsung-galaxy-s23",
      name: "Samsung Galaxy S23",
      image: "https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-s23-5g.jpg",
      brand: "Samsung",
      specs: {
        display: "6.1 inches",
        battery: "3900 mAh",
        ram: "8 GB",
        camera: "50 MP"
      }
    }
  ],
  "pixel": [
    {
      id: "google-pixel-7-pro",
      name: "Google Pixel 7 Pro",
      image: "https://fdn2.gsmarena.com/vv/bigpic/google-pixel7-pro-new.jpg",
      brand: "Google",
      specs: {
        display: "6.7 inches",
        battery: "5000 mAh",
        ram: "12 GB",
        camera: "50 MP"
      }
    },
    {
      id: "google-pixel-7",
      name: "Google Pixel 7",
      image: "https://fdn2.gsmarena.com/vv/bigpic/google-pixel7-new.jpg",
      brand: "Google",
      specs: {
        display: "6.3 inches",
        battery: "4355 mAh",
        ram: "8 GB",
        camera: "50 MP"
      }
    }
  ]
};

const SearchPage: React.FC = () => {
  const { toast } = useToast();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get("q") || "";
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any[]>([]);

  React.useEffect(() => {
    if (initialQuery) {
      handleSearch();
    }
  }, []);

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    if (!searchQuery.trim()) {
      toast({
        title: "Please enter a search term",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    setSearchParams({ q: searchQuery });

    // Simulate API call delay
    setTimeout(() => {
      let searchResults: any[] = [];
      
      // Check if the search term matches any of our mock data
      Object.keys(mockSearchResults).forEach(key => {
        if (searchQuery.toLowerCase().includes(key)) {
          searchResults = [
            ...searchResults,
            ...mockSearchResults[key as keyof typeof mockSearchResults]
          ];
        }
      });
      
      setResults(searchResults);
      setLoading(false);
      
      if (searchResults.length === 0) {
        toast({
          title: "No results found",
          description: "Try searching for 'iphone', 'samsung', or 'pixel'",
          variant: "destructive",
        });
      }
    }, 1000);
  };

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Find Products</h1>
        
        <div className="rounded-lg border bg-card shadow-sm p-6 mb-8">
          <form onSubmit={handleSearch} className="flex flex-col gap-4 md:flex-row">
            <div className="flex-1">
              <Input
                type="text"
                placeholder="Enter smartphone name (e.g., iPhone 14, Samsung Galaxy S23)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-12"
              />
            </div>
            <Button type="submit" className="h-12" disabled={loading}>
              {loading ? <Loader className="mr-2 h-4 w-4 animate-spin" /> : <Search className="mr-2 h-4 w-4" />}
              Search
            </Button>
          </form>
          <p className="text-sm text-muted-foreground mt-2">
            Try searching for "iphone", "samsung", or "pixel" to see results.
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center my-12">
            <Loader className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : results.length > 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            {results.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </motion.div>
        ) : initialQuery ? (
          <div className="text-center my-12 py-8 bg-muted rounded-lg">
            <p className="text-xl font-medium">No results found for "{initialQuery}"</p>
            <p className="text-muted-foreground mt-2">
              Try searching for another term or check the spelling.
            </p>
          </div>
        ) : null}
      </div>
    </MainLayout>
  );
};

export default SearchPage;
