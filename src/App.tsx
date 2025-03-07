
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ThemeProvider } from '@/components/theme-provider'
import { CompareProvider } from '@/context/CompareContext'
import { AuthProvider } from '@/context/AuthContext'
import { Toaster } from '@/components/ui/toaster'
import { Toaster as Sonner } from '@/components/ui/sonner'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import HomePage from '@/pages/Index'
import SearchPage from '@/pages/SearchPage'
import ProductPage from '@/pages/ProductPage'
import ComparePage from '@/pages/ComparePage'
import PricesPage from '@/pages/PricesPage'
import FavoritesPage from '@/pages/FavoritesPage'
import LoginPage from '@/pages/LoginPage'
import NotFound from '@/pages/NotFound'

const queryClient = new QueryClient()

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light" storageKey="ui-theme">
        <AuthProvider>
          <CompareProvider>
            <Router>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/search" element={<SearchPage />} />
                <Route path="/product/:id" element={<ProductPage />} />
                <Route path="/compare" element={<ComparePage />} />
                <Route path="/prices/:id" element={<PricesPage />} />
                <Route path="/favorites" element={<FavoritesPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Router>
            <Toaster />
            <Sonner />
          </CompareProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  )
}

export default App
