
import React from "react";
import MainLayout from "@/components/layouts/MainLayout";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import FavoriteProducts from "@/components/FavoriteProducts";
import { Heart, ShoppingBag } from "lucide-react";
import { motion } from "framer-motion";

const FavoritesPage = () => {
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Your Favorites</h1>
            <p className="text-muted-foreground">Products you've marked as favorites</p>
          </div>
          <Button asChild variant="outline">
            <Link to="/search">
              <ShoppingBag className="mr-2 h-4 w-4" />
              Browse Products
            </Link>
          </Button>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <FavoriteProducts />
        </motion.div>
      </div>
    </MainLayout>
  );
};

export default FavoritesPage;
