
import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import MainLayout from "@/components/layouts/MainLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Loader, Info } from "lucide-react";
import ProductCard from "@/components/ProductCard";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { searchSmartphones } from "@/services/SearchService";
import FavoriteProducts from "@/components/FavoriteProducts";
import type { Smartphone } from "@/services/SearchService";

const SearchPage: React.FC = () => {
  const { toast } = useToast();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get("q") || "";
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<Smartphone[]>([]);
  const [showFavorites, setShowFavorites] = useState(false);

  useEffect(() => {
    if (initialQuery) {
      handleSearch();
    }
  }, [initialQuery]);

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
    setShowFavorites(false);

    try {
      // Use our search service to find smartphones from GSMArena
      const searchResults = await searchSmartphones(searchQuery);
      console.log("Search results:", searchResults);
      setResults(searchResults);
      
      if (searchResults.length === 0) {
        toast({
          title: "No results found",
          description: "Try searching for another term or check the spelling.",
          variant: "destructive",
        });
      } else {
        toast({
          title: `Found ${searchResults.length} results`,
          description: "Showing search results from GSMArena.",
        });
      }
    } catch (error) {
      console.error("Search error:", error);
      toast({
        title: "Search failed",
        description: "An error occurred while searching GSMArena. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleFavorites = () => {
    setShowFavorites(!showFavorites);
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
                placeholder="Search for smartphones on GSMArena (e.g., iPhone 16, Samsung S24, Pixel 9)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-12"
              />
            </div>
            <Button type="submit" className="h-12" disabled={loading}>
              {loading ? <Loader className="mr-2 h-4 w-4 animate-spin" /> : <Search className="mr-2 h-4 w-4" />}
              Search GSMArena
            </Button>
          </form>
          <div className="flex items-center justify-between mt-2">
            <p className="text-sm text-muted-foreground">
              Search for any smartphone model, brand, or feature directly from GSMArena
            </p>
            <Button 
              variant="outline" 
              size="sm"
              onClick={toggleFavorites}
              className="ml-auto"
            >
              {showFavorites ? "Hide Favorites" : "Show Favorites"}
            </Button>
          </div>
        </div>

        {showFavorites ? (
          <FavoriteProducts />
        ) : loading ? (
          <div className="flex justify-center my-12">
            <Loader className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : results.length > 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <h2 className="text-xl font-semibold mb-6">Search Results ({results.length})</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
            </div>
          </motion.div>
        ) : initialQuery ? (
          <div className="text-center my-12 py-8 bg-muted rounded-lg">
            <p className="text-xl font-medium">No results found for "{initialQuery}"</p>
            <p className="text-muted-foreground mt-2">
              Try searching for another term or check the spelling.
            </p>
          </div>
        ) : (
          <div className="text-center my-12 py-8 bg-muted rounded-lg flex flex-col items-center">
            <Info className="h-12 w-12 text-muted-foreground mb-4" />
            <h2 className="text-xl font-medium">Search for Smartphones</h2>
            <p className="text-muted-foreground mt-2 max-w-lg">
              Enter a smartphone model, brand, or feature to get started. Try searching for "S24", "iPhone", "Samsung", "Snapdragon", or "50MP camera".
            </p>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default SearchPage;
