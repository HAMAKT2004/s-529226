
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { ShoppingBag, LogIn } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";

const LoginPage = () => {
  const { signInWithGoogle } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleSignInWithGoogle = async () => {
    try {
      setIsLoading(true);
      await signInWithGoogle();
      // No need to navigate here as the redirect will happen automatically
    } catch (error: any) {
      console.error("Google sign-in error:", error);
      toast({
        title: "Login failed",
        description: "Could not sign in with Google. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleContinueWithoutLogin = () => {
    navigate("/");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-background">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="flex items-center justify-center mb-8">
          <ShoppingBag className="h-10 w-10 text-primary mr-2" />
          <h1 className="text-3xl font-bold">Pricely</h1>
        </div>

        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Welcome to Pricely</CardTitle>
            <CardDescription>
              Find the best smartphone at the best price
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <Button
              className="w-full flex items-center justify-center gap-2"
              size="lg"
              onClick={handleSignInWithGoogle}
              disabled={isLoading}
            >
              <LogIn className="h-5 w-5" />
              {isLoading ? "Connecting..." : "Continue with Google"}
            </Button>

            <div className="flex items-center gap-2">
              <Separator className="flex-1" />
              <span className="text-sm text-muted-foreground">OR</span>
              <Separator className="flex-1" />
            </div>

            <Button
              variant="outline"
              className="w-full"
              size="lg"
              onClick={handleContinueWithoutLogin}
              disabled={isLoading}
            >
              Continue without Login
            </Button>
          </CardContent>
          <CardFooter className="text-xs text-center text-muted-foreground">
            By continuing, you agree to Pricely's Terms of Service and Privacy Policy.
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
};

export default LoginPage;
