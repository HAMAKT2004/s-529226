
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { useCompare } from "@/context/CompareContext";
import { Phone, Plus, Check } from "lucide-react";

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    image: string;
    brand: string;
    specs: {
      display: string;
      battery: string;
      ram: string;
      camera: string;
    };
  };
}

const ProductCard = ({ product }: ProductCardProps) => {
  const { addToCompare, isInCompareList } = useCompare();
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleAddToCompare = () => {
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
        
        <div className="grid grid-cols-2 gap-2 mt-4">
          <div className="text-xs">
            <span className="text-muted-foreground">Display:</span>
            <div>{product.specs.display}</div>
          </div>
          <div className="text-xs">
            <span className="text-muted-foreground">Battery:</span>
            <div>{product.specs.battery}</div>
          </div>
          <div className="text-xs">
            <span className="text-muted-foreground">RAM:</span>
            <div>{product.specs.ram}</div>
          </div>
          <div className="text-xs">
            <span className="text-muted-foreground">Camera:</span>
            <div>{product.specs.camera}</div>
          </div>
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
