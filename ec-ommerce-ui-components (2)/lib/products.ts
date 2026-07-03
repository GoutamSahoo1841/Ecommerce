import type { Product } from './store'

export const products: Product[] = [
  {
    id: '1',
    name: 'Nova Pro Wireless Headphones',
    description: 'Premium wireless headphones with active noise cancellation, spatial audio, and 40-hour battery life. Experience sound like never before.',
    price: 349,
    originalPrice: 449,
    image: '/images/product-headphones.png',
    images: ['/images/product-headphones.png', '/images/product-earbuds.png', '/images/product-speaker.png'],
    category: 'Audio',
    rating: 4.9,
    reviews: 2847,
    inStock: true,
    badge: 'Best Seller',
    colors: ['Midnight Black', 'Silver', 'Space Gray'],
  },
  {
    id: '2',
    name: 'Ultra Smart Watch Series X',
    description: 'Advanced health monitoring, always-on display, and seamless connectivity. Your personal health companion on your wrist.',
    price: 499,
    originalPrice: 599,
    image: '/images/product-smartwatch.png',
    images: ['/images/product-smartwatch.png', '/images/product-fitness-band.png'],
    category: 'Wearables',
    rating: 4.8,
    reviews: 1923,
    inStock: true,
    badge: 'New',
    colors: ['Graphite', 'Gold', 'Silver'],
    sizes: ['41mm', '45mm'],
  },
  {
    id: '3',
    name: 'Pro Laptop Stand Aluminum',
    description: 'Ergonomic aluminum laptop stand with adjustable height and angle. Perfect for your home office setup.',
    price: 129,
    image: '/images/product-laptop-stand.png',
    category: 'Accessories',
    rating: 4.7,
    reviews: 856,
    inStock: true,
    colors: ['Silver', 'Space Gray'],
  },
  {
    id: '4',
    name: 'Wireless Charging Pad Pro',
    description: '15W fast wireless charging with MagSafe compatibility. Charges your devices effortlessly.',
    price: 79,
    originalPrice: 99,
    image: '/images/product-usb-hub.png',
    category: 'Accessories',
    rating: 4.6,
    reviews: 1245,
    inStock: true,
    badge: 'Sale',
    colors: ['White', 'Black'],
  },
  {
    id: '5',
    name: 'Studio Monitor Speakers',
    description: 'Professional-grade studio monitors with crystal-clear audio reproduction. Perfect for creators and audiophiles.',
    price: 599,
    image: '/images/product-speaker.png',
    category: 'Audio',
    rating: 4.9,
    reviews: 423,
    inStock: true,
    colors: ['Matte Black', 'White'],
  },
  {
    id: '6',
    name: 'Mechanical Keyboard Pro',
    description: 'Premium mechanical keyboard with hot-swappable switches, RGB backlighting, and wireless connectivity.',
    price: 199,
    originalPrice: 249,
    image: '/images/product-keyboard.png',
    category: 'Accessories',
    rating: 4.8,
    reviews: 1567,
    inStock: true,
    badge: 'Popular',
    colors: ['Black', 'White'],
  },
  {
    id: '7',
    name: 'Ultra HD Webcam 4K',
    description: 'Professional 4K webcam with auto-focus, low-light correction, and built-in privacy shutter.',
    price: 179,
    image: '/images/product-webcam.png',
    category: 'Accessories',
    rating: 4.5,
    reviews: 892,
    inStock: true,
  },
  {
    id: '8',
    name: 'Portable SSD 2TB',
    description: 'Ultra-fast portable SSD with 2TB storage. Transfer speeds up to 2000MB/s.',
    price: 249,
    originalPrice: 299,
    image: '/images/product-ssd.png',
    category: 'Storage',
    rating: 4.9,
    reviews: 2134,
    inStock: true,
    badge: 'Top Rated',
  },
  {
    id: '9',
    name: 'Noise Cancelling Earbuds',
    description: 'True wireless earbuds with active noise cancellation and transparency mode. 8 hours of listening.',
    price: 199,
    image: '/images/product-earbuds.png',
    category: 'Audio',
    rating: 4.7,
    reviews: 3421,
    inStock: true,
    colors: ['White', 'Black', 'Navy'],
  },
  {
    id: '10',
    name: 'Smart Home Hub',
    description: 'Central hub for all your smart home devices. Control lights, thermostat, security, and more.',
    price: 149,
    image: '/images/product-smart-speaker.png',
    category: 'Smart Home',
    rating: 4.6,
    reviews: 1876,
    inStock: false,
    badge: 'Coming Soon',
  },
  {
    id: '11',
    name: 'Gaming Mouse Pro',
    description: 'High-precision gaming mouse with 25,000 DPI sensor, customizable buttons, and RGB lighting.',
    price: 89,
    originalPrice: 119,
    image: '/images/product-gaming-mouse.png',
    category: 'Gaming',
    rating: 4.8,
    reviews: 2567,
    inStock: true,
    colors: ['Black', 'White'],
  },
  {
    id: '12',
    name: 'USB-C Hub 10-in-1',
    description: 'Complete connectivity solution with HDMI, USB-A, SD card reader, Ethernet, and more.',
    price: 79,
    image: '/images/product-usb-hub.png',
    category: 'Accessories',
    rating: 4.5,
    reviews: 1234,
    inStock: true,
  },
]

export const categories = [
  { name: 'All', slug: 'all', count: products.length },
  { name: 'Audio', slug: 'audio', count: products.filter(p => p.category === 'Audio').length },
  { name: 'Wearables', slug: 'wearables', count: products.filter(p => p.category === 'Wearables').length },
  { name: 'Accessories', slug: 'accessories', count: products.filter(p => p.category === 'Accessories').length },
  { name: 'Storage', slug: 'storage', count: products.filter(p => p.category === 'Storage').length },
  { name: 'Smart Home', slug: 'smart-home', count: products.filter(p => p.category === 'Smart Home').length },
  { name: 'Gaming', slug: 'gaming', count: products.filter(p => p.category === 'Gaming').length },
]

export function getProductById(id: string): Product | undefined {
  return products.find(p => p.id === id)
}

export function getProductsByCategory(category: string): Product[] {
  if (category === 'all') return products
  return products.filter(p => p.category.toLowerCase() === category.toLowerCase())
}

export function searchProducts(query: string): Product[] {
  const lowercaseQuery = query.toLowerCase()
  return products.filter(
    p =>
      p.name.toLowerCase().includes(lowercaseQuery) ||
      p.description.toLowerCase().includes(lowercaseQuery) ||
      p.category.toLowerCase().includes(lowercaseQuery)
  )
}

export function getFeaturedProducts(): Product[] {
  return products.filter(p => p.badge === 'Best Seller' || p.badge === 'Top Rated' || p.badge === 'New')
}

export function getOnSaleProducts(): Product[] {
  return products.filter(p => p.originalPrice && p.originalPrice > p.price)
}
