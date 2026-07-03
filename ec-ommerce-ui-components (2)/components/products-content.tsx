'use client'

import { useState, useMemo } from 'react'
import { useSearchParams } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Filter,
  SlidersHorizontal,
  Grid3X3,
  LayoutGrid,
  ChevronDown,
  X,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { Slider } from '@/components/ui/slider'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ProductCard, ProductCardSkeleton } from '@/components/product-card'
import { products, categories } from '@/lib/products'
import { staggerContainer, fadeInUp } from '@/lib/animations'

const sortOptions = [
  { label: 'Featured', value: 'featured' },
  { label: 'Newest', value: 'newest' },
  { label: 'Price: Low to High', value: 'price-asc' },
  { label: 'Price: High to Low', value: 'price-desc' },
  { label: 'Rating', value: 'rating' },
]

export function ProductsContent() {
  const searchParams = useSearchParams()
  const categoryParam = searchParams.get('category')

  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    categoryParam && categoryParam !== 'all' ? [categoryParam] : []
  )
  const [priceRange, setPriceRange] = useState([0, 600])
  const [sortBy, setSortBy] = useState('featured')
  const [viewMode, setViewMode] = useState<'grid' | 'compact'>('grid')
  const [isLoading, setIsLoading] = useState(false)

  const filteredProducts = useMemo(() => {
    let result = [...products]

    // Filter by category
    if (selectedCategories.length > 0) {
      result = result.filter((product) =>
        selectedCategories.some(
          (cat) => product.category.toLowerCase() === cat.toLowerCase()
        )
      )
    }

    // Filter by price
    result = result.filter(
      (product) =>
        product.price >= priceRange[0] && product.price <= priceRange[1]
    )

    // Sort
    switch (sortBy) {
      case 'newest':
        result = result.reverse()
        break
      case 'price-asc':
        result = result.sort((a, b) => a.price - b.price)
        break
      case 'price-desc':
        result = result.sort((a, b) => b.price - a.price)
        break
      case 'rating':
        result = result.sort((a, b) => b.rating - a.rating)
        break
    }

    return result
  }, [selectedCategories, priceRange, sortBy])

  const toggleCategory = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    )
  }

  const clearFilters = () => {
    setSelectedCategories([])
    setPriceRange([0, 600])
  }

  const hasActiveFilters = selectedCategories.length > 0 || priceRange[0] > 0 || priceRange[1] < 600

  const FilterContent = () => (
    <div className="space-y-6">
      {/* Categories */}
      <div>
        <h3 className="mb-4 font-semibold">Categories</h3>
        <div className="space-y-3">
          {categories.slice(1).map((category) => (
            <label
              key={category.slug}
              className="flex cursor-pointer items-center gap-3"
            >
              <Checkbox
                checked={selectedCategories.includes(category.slug)}
                onCheckedChange={() => toggleCategory(category.slug)}
              />
              <span className="flex-1 text-sm">{category.name}</span>
              <span className="text-xs text-muted-foreground">
                {category.count}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <h3 className="mb-4 font-semibold">Price Range</h3>
        <Slider
          value={priceRange}
          onValueChange={setPriceRange}
          min={0}
          max={600}
          step={10}
          className="mb-2"
        />
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>${priceRange[0]}</span>
          <span>${priceRange[1]}</span>
        </div>
      </div>

      {/* Clear Filters */}
      {hasActiveFilters && (
        <Button variant="outline" onClick={clearFilters} className="w-full">
          Clear Filters
        </Button>
      )}
    </div>
  )

  return (
    <div className="min-h-screen pt-20">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          className="mb-8"
        >
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            All Products
          </h1>
          <p className="mt-2 text-muted-foreground">
            {filteredProducts.length} products
          </p>
        </motion.div>

        <div className="flex gap-8">
          {/* Desktop Sidebar */}
          <motion.aside
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            className="hidden w-64 shrink-0 lg:block"
          >
            <div className="sticky top-24 rounded-2xl bg-card p-6 shadow-sm">
              <h2 className="mb-6 flex items-center gap-2 font-semibold">
                <SlidersHorizontal className="h-4 w-4" />
                Filters
              </h2>
              <FilterContent />
            </div>
          </motion.aside>

          {/* Main Content */}
          <div className="flex-1">
            {/* Toolbar */}
            <motion.div
              variants={fadeInUp}
              initial="hidden"
              animate="visible"
              className="mb-6 flex flex-wrap items-center justify-between gap-4"
            >
              <div className="flex items-center gap-2">
                {/* Mobile Filter */}
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="outline" size="sm" className="lg:hidden">
                      <Filter className="mr-2 h-4 w-4" />
                      Filters
                      {hasActiveFilters && (
                        <Badge variant="secondary" className="ml-2">
                          {selectedCategories.length + (priceRange[0] > 0 || priceRange[1] < 600 ? 1 : 0)}
                        </Badge>
                      )}
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left">
                    <SheetHeader>
                      <SheetTitle>Filters</SheetTitle>
                    </SheetHeader>
                    <div className="mt-6">
                      <FilterContent />
                    </div>
                  </SheetContent>
                </Sheet>

                {/* Active Filters */}
                <AnimatePresence>
                  {selectedCategories.map((category) => (
                    <motion.div
                      key={category}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                    >
                      <Badge
                        variant="secondary"
                        className="cursor-pointer gap-1 pr-1"
                        onClick={() => toggleCategory(category)}
                      >
                        {categories.find((c) => c.slug === category)?.name}
                        <X className="h-3 w-3" />
                      </Badge>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              <div className="flex items-center gap-2">
                {/* View Mode */}
                <div className="hidden items-center gap-1 rounded-lg bg-muted p-1 sm:flex">
                  <Button
                    variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => setViewMode('grid')}
                  >
                    <LayoutGrid className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === 'compact' ? 'secondary' : 'ghost'}
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => setViewMode('compact')}
                  >
                    <Grid3X3 className="h-4 w-4" />
                  </Button>
                </div>

                {/* Sort */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm">
                      Sort
                      <ChevronDown className="ml-2 h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {sortOptions.map((option) => (
                      <DropdownMenuItem
                        key={option.value}
                        onClick={() => setSortBy(option.value)}
                        className={sortBy === option.value ? 'bg-accent' : ''}
                      >
                        {option.label}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </motion.div>

            {/* Products Grid */}
            {isLoading ? (
              <div
                className={`grid gap-6 ${
                  viewMode === 'grid'
                    ? 'sm:grid-cols-2 xl:grid-cols-3'
                    : 'sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4'
                }`}
              >
                {Array.from({ length: 8 }).map((_, i) => (
                  <ProductCardSkeleton key={i} />
                ))}
              </div>
            ) : filteredProducts.length === 0 ? (
              <motion.div
                variants={fadeInUp}
                initial="hidden"
                animate="visible"
                className="flex flex-col items-center justify-center py-16 text-center"
              >
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
                  <Filter className="h-10 w-10 text-muted-foreground" />
                </div>
                <h3 className="mt-4 text-lg font-semibold">No products found</h3>
                <p className="mt-2 text-muted-foreground">
                  Try adjusting your filters
                </p>
                <Button variant="outline" onClick={clearFilters} className="mt-4">
                  Clear Filters
                </Button>
              </motion.div>
            ) : (
              <motion.div
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
                className={`grid gap-6 ${
                  viewMode === 'grid'
                    ? 'sm:grid-cols-2 xl:grid-cols-3'
                    : 'sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4'
                }`}
              >
                {filteredProducts.map((product, index) => (
                  <ProductCard key={product.id} product={product} index={index} />
                ))}
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
