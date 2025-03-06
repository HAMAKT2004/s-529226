
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useCompare } from '@/context/CompareContext';
import { Phone, Plus, Check } from 'lucide-react';
import { motion } from 'framer-motion';

// Fake trending phones data (hardcoded for now)
const trendingPhonesData = [
  {
    id: 'iphone-14-pro',
    name: 'iPhone 14 Pro',
    image: 'https://fdn2.gsmarena.com/vv/bigpic/apple-iphone-14-pro.jpg',
    brand: 'Apple',
    price: 999,
    specs: {
      display: '6.1 inches',
      battery: '3200 mAh',
      ram: '6 GB',
      camera: '48 MP'
    }
  },
  {
    id: 'samsung-galaxy-s23-ultra',
    name: 'Samsung Galaxy S23 Ultra',
    image: 'https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-s23-ultra-5g.jpg',
    brand: 'Samsung',
    price: 1199,
    specs: {
      display: '6.8 inches',
      battery: '5000 mAh',
      ram: '12 GB',
      camera: '200 MP'
    }
  },
  {
    id: 'google-pixel-7-pro',
    name: 'Google Pixel 7 Pro',
    image: 'https://fdn2.gsmarena.com/vv/bigpic/google-pixel7-pro-new.jpg',
    brand: 'Google',
    price: 899,
    specs: {
      display: '6.7 inches',
      battery: '5000 mAh',
      ram: '12 GB',
      camera: '50 MP'
    }
  },
  {
    id: 'xiaomi-13-pro',
    name: 'Xiaomi 13 Pro',
    image: 'https://fdn2.gsmarena.com/vv/bigpic/xiaomi-13-pro.jpg',
    brand: 'Xiaomi',
    price: 799,
    specs: {
      display: '6.73 inches',
      battery: '4820 mAh',
      ram: '12 GB',
      camera: '50 MP'
    }
  }
];

const TrendingPhones = () => {
  const { addToCompare, isInCompareList } = useCompare();
  
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

  return (
    <motion.div 
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      variants={container}
      initial="hidden"
      animate="show"
    >
      {trendingPhonesData.map((phone) => (
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
                <p className="font-bold mt-1">${phone.price}</p>
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={() => addToCompare({ id: phone.id, name: phone.name, image: phone.image })}
                disabled={isInCompareList(phone.id)}
              >
                {isInCompareList(phone.id) ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <Plus className="h-4 w-4" />
                )}
              </Button>
            </div>
            
            <div className="grid grid-cols-2 gap-2 mt-4">
              <div className="text-xs">
                <span className="text-muted-foreground">Display:</span>
                <div>{phone.specs.display}</div>
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
