
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useCompare } from "@/context/CompareContext";
import { Phone, Plus, Check, Heart } from "lucide-react";
import type { Smartphone } from "@/services/SearchService";

interface ProductCardProps {
  product: Smartphone;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const { addToCompare, isInCompareList, addToFavorites, removeFromFavorites, isInFavorites } = useCompare();
  const { toast } = useToast();
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleAddToCompare = () => {
    addToCompare({
      id: product.id,
      name: product.name,
      image: product.image,
      brand: product.brand
    });
    
    toast({
      title: "Added to compare list",
      description: `${product.name} has been added to your compare list.`,
    });
  };

  const toggleFavorite = () => {
    if (isInFavorites(product.id)) {
      removeFromFavorites(product.id);
      toast({
        title: "Removed from favorites",
        description: `${product.name} has been removed from your favorites.`,
      });
    } else {
      addToFavorites({
        id: product.id,
        name: product.name,
        image: product.image,
        brand: product.brand
      });
      toast({
        title: "Added to favorites",
        description: `${product.name} has been added to your favorites.`,
      });
    }
  };

  return (
    <Card className="h-full overflow-hidden hover:shadow-md transition-shadow">
      <Link to={`/product/${product.id}`} className="block relative pt-[100%]">
        {!imageLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-muted">
            <div className="h-8 w-8 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
          </div>
        )}
        <img 
          src={product.image} 
          alt={product.name}
          className={`absolute inset-0 w-full h-full object-contain p-4 transition-opacity duration-300 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
          onLoad={() => setImageLoaded(true)}
        />
      </Link>
      
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm text-muted-foreground">{product.brand}</p>
            <Link to={`/product/${product.id}`}>
              <h3 className="font-medium text-lg hover:text-primary transition-colors">{product.name}</h3>
            </Link>
          </div>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              className={isInFavorites(product.id) ? "text-red-500 hover:text-red-600" : ""}
              onClick={toggleFavorite}
            >
              <Heart className={`h-4 w-4 ${isInFavorites(product.id) ? "fill-current" : ""}`} />
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={handleAddToCompare}
              disabled={isInCompareList(product.id)}
            >
              {isInCompareList(product.id) ? (
                <Check className="h-4 w-4" />
              ) : (
                <Plus className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-2 mt-4">
          {product.specs.display && (
            <div className="text-xs">
              <span className="text-muted-foreground">Display:</span>
              <div>{product.specs.display.split(',')[0]}</div>
            </div>
          )}
          {product.specs.battery && (
            <div className="text-xs">
              <span className="text-muted-foreground">Battery:</span>
              <div>{product.specs.battery}</div>
            </div>
          )}
          {product.specs.ram && (
            <div className="text-xs">
              <span className="text-muted-foreground">RAM:</span>
              <div>{product.specs.ram}</div>
            </div>
          )}
          {product.specs.camera && (
            <div className="text-xs">
              <span className="text-muted-foreground">Camera:</span>
              <div>{product.specs.camera}</div>
            </div>
          )}
        </div>
        
        <div className="flex gap-2 mt-4">
          <Button asChild size="sm" className="flex-1">
            <Link to={`/product/${product.id}`}>Details</Link>
          </Button>
          <Button asChild size="sm" variant="outline" className="flex-1">
            <Link to={`/prices/${product.id}`}>
              <Phone className="mr-1 h-4 w-4" />
              Prices
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
