
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useCompare } from '@/context/CompareContext';
import { Phone, Plus, Check, Heart, Loader, ShoppingCart } from 'lucide-react';
import { motion } from 'framer-motion';
import { getTrendingSmartphones } from '@/services/SearchService';
import { useToast } from '@/hooks/use-toast';
import type { Smartphone } from '@/services/SearchService';

const TrendingPhones = () => {
  const { addToCompare, isInCompareList, addToFavorites, isInFavorites, removeFromFavorites } = useCompare();
  const { toast } = useToast();
  const [trendingPhones, setTrendingPhones] = useState<Smartphone[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchTrendingPhones = async () => {
      try {
        // Get trending phones from GSMArena via our service
        const phones = await getTrendingSmartphones();
        setTrendingPhones(phones);
      } catch (error) {
        console.error("Error fetching trending phones:", error);
        toast({
          title: "Failed to load trending phones",
          description: "Could not retrieve trending phones from GSMArena.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchTrendingPhones();
  }, [toast]);
  
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <Loader className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
        <p>Loading trending smartphones from GSMArena...</p>
      </div>
    );
  }

  if (trendingPhones.length === 0) {
    return (
      <div className="text-center py-12 bg-muted rounded-lg">
        <p className="text-xl font-medium">No trending phones available</p>
        <p className="text-muted-foreground mt-2">
          Unable to retrieve trending phones from GSMArena at the moment.
        </p>
      </div>
    );
  }

  // Format price in Indian Rupees
  const formatPrice = (id: string) => {
    // Generate different prices based on the product ID hash
    const idHash = id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const priceBase = (idHash % 50000) + 10000; // Different range for each product
    
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(priceBase);
  };

  const toggleFavorite = (phone: Smartphone, event: React.MouseEvent) => {
    event.preventDefault(); // Prevent navigation when clicking the button
    event.stopPropagation(); // Stop event propagation
    
    if (isInFavorites(phone.id)) {
      removeFromFavorites(phone.id);
      toast({
        title: "Removed from favorites",
        description: `${phone.name} has been removed from your favorites.`,
      });
    } else {
      addToFavorites({
        id: phone.id,
        name: phone.name,
        image: phone.image,
        brand: phone.brand
      });
      toast({
        title: "Added to favorites",
        description: `${phone.name} has been added to your favorites.`,
      });
    }
  };

  const handleAddToCompare = (phone: Smartphone, event: React.MouseEvent) => {
    event.preventDefault(); // Prevent navigation when clicking the button
    event.stopPropagation(); // Stop event propagation
    
    if (!isInCompareList(phone.id)) {
      addToCompare({
        id: phone.id,
        name: phone.name,
        image: phone.image,
        brand: phone.brand
      });
      toast({
        title: "Added to compare list",
        description: `${phone.name} has been added to your compare list.`,
      });
    }
  };

  return (
    <motion.div 
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      variants={container}
      initial="hidden"
      animate="show"
    >
      {trendingPhones.map((phone) => (
        <motion.div
          key={phone.id}
          variants={item}
          className="bg-card border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
        >
          <Link to={`/product/${phone.id}`} className="block relative pt-[100%]">
            <img 
              src={phone.image} 
              alt={phone.name}
              className="absolute inset-0 w-full h-full object-contain p-4"
              loading="lazy"
            />
          </Link>
          <div className="p-4">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-muted-foreground">{phone.brand}</p>
                <Link to={`/product/${phone.id}`}>
                  <h3 className="font-medium text-lg hover:text-primary transition-colors">{phone.name}</h3>
                </Link>
                <p className="font-bold mt-1">{formatPrice(phone.id)}</p>
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  className={isInFavorites(phone.id) ? "text-red-500 hover:text-red-600" : ""}
                  onClick={(e) => toggleFavorite(phone, e)}
                >
                  <Heart className={`h-4 w-4 ${isInFavorites(phone.id) ? "fill-current" : ""}`} />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={(e) => handleAddToCompare(phone, e)}
                  disabled={isInCompareList(phone.id)}
                >
                  {isInCompareList(phone.id) ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <Plus className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-2 mt-4">
              {phone.specs?.display && (
                <div className="text-xs">
                  <span className="text-muted-foreground">Display:</span>
                  <div>{phone.specs.display.split(',')[0]}</div>
                </div>
              )}
              {phone.specs?.battery && (
                <div className="text-xs">
                  <span className="text-muted-foreground">Battery:</span>
                  <div>{phone.specs.battery}</div>
                </div>
              )}
              {phone.specs?.ram && (
                <div className="text-xs">
                  <span className="text-muted-foreground">RAM:</span>
                  <div>{phone.specs.ram}</div>
                </div>
              )}
              {phone.specs?.camera && (
                <div className="text-xs">
                  <span className="text-muted-foreground">Camera:</span>
                  <div>{phone.specs.camera}</div>
                </div>
              )}
            </div>
            
            <div className="flex gap-2 mt-4">
              <Button asChild size="sm" className="flex-1">
                <Link to={`/product/${phone.id}`}>Details</Link>
              </Button>
              <Button asChild size="sm" variant="outline" className="flex-1">
                <Link to={`/prices/${phone.id}`}>
                  <ShoppingCart className="mr-1 h-4 w-4" />
                  Prices
                </Link>
              </Button>
            </div>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
};

export default TrendingPhones;
