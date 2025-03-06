
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Button } from "@/components/ui/button";
import { Menu, X, ShoppingBag, Phone, Users, Heart } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { useCompare } from "@/context/CompareContext";

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  const location = useLocation();
  const [isNavOpen, setIsNavOpen] = useState(false);
  const { compareList } = useCompare();

  const routes = [
    { path: "/", label: "Home" },
    { path: "/search", label: "Find Products" },
    { path: "/compare", label: "Compare" },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <header className="border-b sticky top-0 z-40 bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <ShoppingBag className="h-6 w-6 text-primary" />
            <span className="font-bold text-xl">Pricely</span>
          </Link>

          {/* Desktop navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {routes.map((route) => (
              <Link
                key={route.path}
                to={route.path}
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  location.pathname === route.path ? "text-primary" : "text-muted-foreground"
                }`}
              >
                {route.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            {compareList.length > 0 && (
              <Link to="/compare">
                <Button size="sm" variant="outline" className="hidden md:flex">
                  <Phone className="mr-2 h-4 w-4" />
                  Compare ({compareList.length})
                </Button>
              </Link>
            )}
            <ThemeToggle />

            {/* Mobile menu button */}
            <Sheet open={isNavOpen} onOpenChange={setIsNavOpen}>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left">
                <div className="flex flex-col space-y-4 mt-8">
                  {routes.map((route) => (
                    <SheetClose key={route.path} asChild>
                      <Link
                        to={route.path}
                        className={`text-lg flex items-center p-2 rounded-md ${
                          location.pathname === route.path
                            ? "bg-primary/10 text-primary"
                            : "hover:bg-muted"
                        }`}
                        onClick={() => setIsNavOpen(false)}
                      >
                        {route.label}
                      </Link>
                    </SheetClose>
                  ))}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      <main className="flex-1">{children}</main>

      <footer className="border-t py-6 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="font-bold mb-4 flex items-center gap-2">
                <ShoppingBag className="h-5 w-5" /> Pricely
              </h3>
              <p className="text-muted-foreground">
                Find the best smartphone at the best price. Compare specifications and
                prices from top retailers.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                {routes.map((route) => (
                  <li key={route.path}>
                    <Link
                      to={route.path}
                      className="text-muted-foreground hover:text-primary transition-colors"
                    >
                      {route.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Contact</h4>
              <p className="text-muted-foreground">
                Have questions or suggestions? Get in touch with us.
              </p>
              <Button variant="link" className="p-0 h-auto mt-2">
                contact@pricely.example
              </Button>
            </div>
          </div>
          <div className="mt-8 pt-4 border-t text-center text-muted-foreground text-sm">
            © {new Date().getFullYear()} Pricely. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;
