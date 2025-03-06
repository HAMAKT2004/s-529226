
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useCompare } from "@/context/CompareContext";
import ProductCard from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { Trash2, Heart, Loader } from "lucide-react";
import SearchService from "@/services/SearchService";

const FavoriteProducts = () => {
  const { favorites, removeFromFavorites } = useCompare();
  const [expandedProducts, setExpandedProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadProductDetails = async () => {
      if (favorites.length === 0) return;
      
      setLoading(true);
      try {
        const detailedProducts = await Promise.all(
          favorites.map(async (fav) => {
            const product = await SearchService.getSmartphoneById(fav.id);
            return product;
          })
        );
        
        setExpandedProducts(detailedProducts.filter(p => p !== null));
      } catch (error) {
        console.error("Error loading favorite products:", error);
      } finally {
        setLoading(false);
      }
    };

    loadProductDetails();
  }, [favorites]);

  const clearAllFavorites = () => {
    favorites.forEach(fav => removeFromFavorites(fav.id));
  };

  if (favorites.length === 0) {
    return (
      <div className="text-center my-12 py-8 bg-muted rounded-lg">
        <Heart className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
        <h2 className="text-xl font-medium">No Favorite Products</h2>
        <p className="text-muted-foreground mt-2">
          Add products to your favorites to see them here.
        </p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Your Favorite Products ({favorites.length})</h2>
        <Button 
          variant="outline" 
          size="sm"
          onClick={clearAllFavorites}
          className="text-destructive"
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Clear All
        </Button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {favorites.map((_, index) => (
            <div key={index} className="animate-pulse">
              <div className="bg-muted rounded-lg h-[300px]"></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {expandedProducts.length > 0 ? (
            expandedProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))
          ) : (
            favorites.map((fav, index) => (
              <motion.div
                key={fav.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-card rounded-lg border overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="p-4 text-center">
                  <img 
                    src={fav.image} 
                    alt={fav.name}
                    className="w-28 h-28 object-contain mx-auto mb-4"
                  />
                  <h3 className="font-medium">{fav.name}</h3>
                  <p className="text-sm text-muted-foreground">{fav.brand}</p>
                  <div className="mt-4 flex justify-center">
                    <Button asChild size="sm">
                      <a href={`/product/${fav.id}`}>View Details</a>
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      )}
    </motion.div>
  );
};

export default FavoriteProducts;
