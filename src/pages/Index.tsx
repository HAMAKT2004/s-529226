
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import TrendingPhones from "@/components/TrendingPhones";
import MainLayout from "@/components/layouts/MainLayout";

const HomePage = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = React.useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center justify-center gap-8 py-12"
        >
          <h1 className="text-4xl md:text-6xl font-bold text-center bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
            Find the Best Smartphone Prices
          </h1>
          <p className="text-xl text-center text-muted-foreground max-w-3xl">
            Compare specifications and prices from top retailers to make the smartest purchase decision.
          </p>
          
          <form onSubmit={handleSearch} className="w-full max-w-2xl mt-8">
            <div className="flex gap-2">
              <Input 
                type="text"
                placeholder="Search for smartphones (e.g., iPhone 14, Samsung Galaxy S23...)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-12 text-base"
              />
              <Button type="submit" size="lg">
                Search
              </Button>
            </div>
          </form>
        </motion.div>
        
        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-6">Trending Smartphones</h2>
          <TrendingPhones />
        </div>
      </div>
    </MainLayout>
  );
};

export default HomePage;
