
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useCompare } from '@/context/CompareContext';
import { Phone, Plus, Check, Heart } from 'lucide-react';
import { motion } from 'framer-motion';
import SearchService from '@/services/SearchService';

const TrendingPhones = () => {
  const { addToCompare, isInCompareList, addToFavorites, isInFavorites } = useCompare();
  const [trendingPhones, setTrendingPhones] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchTrendingPhones = async () => {
      try {
        // Get trending phones from the service
        const phones = SearchService.getTrendingSmartphones();
        setTrendingPhones(phones);
      } catch (error) {
        console.error("Error fetching trending phones:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchTrendingPhones();
  }, []);
  
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((placeholder) => (
          <div key={placeholder} className="bg-card border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow animate-pulse">
            <div className="h-64 bg-gray-200"></div>
            <div className="p-4">
              <div className="h-4 w-1/3 bg-gray-200 mb-2"></div>
              <div className="h-6 w-4/5 bg-gray-200 mb-2"></div>
              <div className="h-4 w-1/5 bg-gray-200 mb-4"></div>
              <div className="grid grid-cols-2 gap-2 mt-4">
                <div className="h-4 bg-gray-200"></div>
                <div className="h-4 bg-gray-200"></div>
                <div className="h-4 bg-gray-200"></div>
                <div className="h-4 bg-gray-200"></div>
              </div>
              <div className="flex gap-2 mt-4">
                <div className="h-8 bg-gray-200 flex-1"></div>
                <div className="h-8 bg-gray-200 flex-1"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Format price in Indian Rupees
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  };

  // Price mapping for trending phones (in ₹)
  const priceMap: Record<string, number> = {
    'samsung-galaxy-s23-ultra': 124999,
    'iphone-14-pro': 119999,
    'oneplus-12': 64999,
    'google-pixel-7-pro': 79999,
    'xiaomi-13-pro': 69999,
    'samsung-galaxy-s22-ultra': 99999,
    'samsung-galaxy-s22-plus': 84999,
    'samsung-galaxy-s22': 69999
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
            />
          </Link>
          <div className="p-4">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-muted-foreground">{phone.brand}</p>
                <Link to={`/product/${phone.id}`}>
                  <h3 className="font-medium text-lg hover:text-primary transition-colors">{phone.name}</h3>
                </Link>
                <p className="font-bold mt-1">{formatPrice(priceMap[phone.id] || 79999)}</p>
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  className={isInFavorites(phone.id) ? "text-red-500 hover:text-red-600" : ""}
                  onClick={() => addToFavorites({
                    id: phone.id,
                    name: phone.name,
                    image: phone.image,
                    brand: phone.brand
                  })}
                >
                  <Heart className={`h-4 w-4 ${isInFavorites(phone.id) ? "fill-current" : ""}`} />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => addToCompare({ 
                    id: phone.id, 
                    name: phone.name, 
                    image: phone.image,
                    brand: phone.brand 
                  })}
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
              <div className="text-xs">
                <span className="text-muted-foreground">Display:</span>
                <div>{phone.specs.display.split(',')[0]}</div>
              </div>
              <div className="text-xs">
                <span className="text-muted-foreground">Battery:</span>
                <div>{phone.specs.battery}</div>
              </div>
              <div className="text-xs">
                <span className="text-muted-foreground">RAM:</span>
                <div>{phone.specs.ram}</div>
              </div>
              <div className="text-xs">
                <span className="text-muted-foreground">Camera:</span>
                <div>{phone.specs.camera}</div>
              </div>
            </div>
            
            <div className="flex gap-2 mt-4">
              <Button asChild size="sm" className="flex-1">
                <Link to={`/product/${phone.id}`}>Details</Link>
              </Button>
              <Button asChild size="sm" variant="outline" className="flex-1">
                <Link to={`/prices/${phone.id}`}>
                  <Phone className="mr-1 h-4 w-4" />
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
