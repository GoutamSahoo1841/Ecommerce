'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import {
  ChevronRight,
  CreditCard,
  Truck,
  Check,
  Lock,
  ShoppingBag,
  ArrowLeft,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { Checkbox } from '@/components/ui/checkbox'
import { useStore } from '@/lib/store'
import { fadeInUp, staggerContainer, staggerItem } from '@/lib/animations'
import { toast } from 'sonner'

type Step = 'shipping' | 'payment' | 'review'

const steps: { id: Step; label: string; icon: React.ElementType }[] = [
  { id: 'shipping', label: 'Shipping', icon: Truck },
  { id: 'payment', label: 'Payment', icon: CreditCard },
  { id: 'review', label: 'Review', icon: Check },
]

export function CheckoutContent() {
  const router = useRouter()
  const { state, dispatch, cartTotal, cartCount } = useStore()
  const [currentStep, setCurrentStep] = useState<Step>('shipping')
  const [isProcessing, setIsProcessing] = useState(false)
  const [shippingData, setShippingData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    country: 'United States',
  })
  const [paymentData, setPaymentData] = useState({
    cardNumber: '',
    expiry: '',
    cvc: '',
    cardName: '',
  })
  const [saveInfo, setSaveInfo] = useState(true)

  const shipping = cartTotal > 100 ? 0 : 9.99
  const tax = cartTotal * 0.08
  const total = cartTotal + shipping + tax

  const currentStepIndex = steps.findIndex((s) => s.id === currentStep)

  const handleNext = () => {
    if (currentStep === 'shipping') {
      setCurrentStep('payment')
    } else if (currentStep === 'payment') {
      setCurrentStep('review')
    }
  }

  const handleBack = () => {
    if (currentStep === 'payment') {
      setCurrentStep('shipping')
    } else if (currentStep === 'review') {
      setCurrentStep('payment')
    }
  }

  const handlePlaceOrder = async () => {
    setIsProcessing(true)
    
    // Simulate order processing
    await new Promise((resolve) => setTimeout(resolve, 2000))
    
    // Create order
    const order = {
      id: `ORD-${Date.now()}`,
      items: state.cart,
      total,
      status: 'pending' as const,
      date: new Date().toISOString(),
      shippingAddress: {
        name: `${shippingData.firstName} ${shippingData.lastName}`,
        address: shippingData.address,
        city: shippingData.city,
        zip: shippingData.zip,
      },
    }
    
    dispatch({ type: 'ADD_ORDER', payload: order })
    dispatch({ type: 'CLEAR_CART' })
    
    toast.success('Order placed successfully!')
    router.push(`/account/orders?orderId=${order.id}`)
  }

  if (state.cart.length === 0) {
    return (
      <div className="min-h-screen pt-20">
        <div className="mx-auto max-w-7xl px-4 py-16 text-center sm:px-6 lg:px-8">
          <div className="flex h-24 w-24 mx-auto items-center justify-center rounded-full bg-muted">
            <ShoppingBag className="h-12 w-12 text-muted-foreground" />
          </div>
          <h2 className="mt-6 text-xl font-semibold">Your cart is empty</h2>
          <p className="mt-2 text-muted-foreground">
            Add some items to your cart before checkout.
          </p>
          <Button asChild className="mt-6" size="lg">
            <Link href="/products">Browse Products</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-20">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <motion.nav
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          className="mb-8 flex items-center gap-2 text-sm text-muted-foreground"
        >
          <Link href="/" className="hover:text-foreground">
            Home
          </Link>
          <ChevronRight className="h-4 w-4" />
          <Link href="/cart" className="hover:text-foreground">
            Cart
          </Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-foreground">Checkout</span>
        </motion.nav>

        {/* Steps */}
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          className="mb-8"
        >
          <div className="flex items-center justify-center">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div
                  className={`flex items-center gap-2 ${
                    index <= currentStepIndex
                      ? 'text-primary'
                      : 'text-muted-foreground'
                  }`}
                >
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-full ${
                      index < currentStepIndex
                        ? 'bg-primary text-primary-foreground'
                        : index === currentStepIndex
                        ? 'bg-primary/10 text-primary'
                        : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    {index < currentStepIndex ? (
                      <Check className="h-5 w-5" />
                    ) : (
                      <step.icon className="h-5 w-5" />
                    )}
                  </div>
                  <span className="hidden font-medium sm:block">{step.label}</span>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`mx-4 h-0.5 w-12 sm:w-24 ${
                      index < currentStepIndex ? 'bg-primary' : 'bg-muted'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </motion.div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Form */}
          <div className="lg:col-span-2">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="rounded-2xl bg-card p-6 shadow-sm"
            >
              {currentStep === 'shipping' && (
                <>
                  <h2 className="mb-6 text-xl font-semibold">Shipping Information</h2>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="mb-2 block text-sm font-medium">
                        First Name
                      </label>
                      <Input
                        value={shippingData.firstName}
                        onChange={(e) =>
                          setShippingData({ ...shippingData, firstName: e.target.value })
                        }
                        placeholder="John"
                      />
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-medium">
                        Last Name
                      </label>
                      <Input
                        value={shippingData.lastName}
                        onChange={(e) =>
                          setShippingData({ ...shippingData, lastName: e.target.value })
                        }
                        placeholder="Doe"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="mb-2 block text-sm font-medium">Email</label>
                      <Input
                        type="email"
                        value={shippingData.email}
                        onChange={(e) =>
                          setShippingData({ ...shippingData, email: e.target.value })
                        }
                        placeholder="john@example.com"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="mb-2 block text-sm font-medium">Phone</label>
                      <Input
                        type="tel"
                        value={shippingData.phone}
                        onChange={(e) =>
                          setShippingData({ ...shippingData, phone: e.target.value })
                        }
                        placeholder="+1 (555) 000-0000"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="mb-2 block text-sm font-medium">
                        Street Address
                      </label>
                      <Input
                        value={shippingData.address}
                        onChange={(e) =>
                          setShippingData({ ...shippingData, address: e.target.value })
                        }
                        placeholder="123 Main St"
                      />
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-medium">City</label>
                      <Input
                        value={shippingData.city}
                        onChange={(e) =>
                          setShippingData({ ...shippingData, city: e.target.value })
                        }
                        placeholder="San Francisco"
                      />
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-medium">State</label>
                      <Input
                        value={shippingData.state}
                        onChange={(e) =>
                          setShippingData({ ...shippingData, state: e.target.value })
                        }
                        placeholder="California"
                      />
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-medium">
                        ZIP Code
                      </label>
                      <Input
                        value={shippingData.zip}
                        onChange={(e) =>
                          setShippingData({ ...shippingData, zip: e.target.value })
                        }
                        placeholder="94103"
                      />
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-medium">Country</label>
                      <Input
                        value={shippingData.country}
                        onChange={(e) =>
                          setShippingData({ ...shippingData, country: e.target.value })
                        }
                        placeholder="United States"
                      />
                    </div>
                  </div>
                </>
              )}

              {currentStep === 'payment' && (
                <>
                  <h2 className="mb-6 text-xl font-semibold">Payment Method</h2>
                  <div className="grid gap-4">
                    <div>
                      <label className="mb-2 block text-sm font-medium">
                        Card Number
                      </label>
                      <Input
                        value={paymentData.cardNumber}
                        onChange={(e) =>
                          setPaymentData({ ...paymentData, cardNumber: e.target.value })
                        }
                        placeholder="4242 4242 4242 4242"
                      />
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-medium">
                        Name on Card
                      </label>
                      <Input
                        value={paymentData.cardName}
                        onChange={(e) =>
                          setPaymentData({ ...paymentData, cardName: e.target.value })
                        }
                        placeholder="John Doe"
                      />
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <label className="mb-2 block text-sm font-medium">
                          Expiry Date
                        </label>
                        <Input
                          value={paymentData.expiry}
                          onChange={(e) =>
                            setPaymentData({ ...paymentData, expiry: e.target.value })
                          }
                          placeholder="MM/YY"
                        />
                      </div>
                      <div>
                        <label className="mb-2 block text-sm font-medium">CVC</label>
                        <Input
                          value={paymentData.cvc}
                          onChange={(e) =>
                            setPaymentData({ ...paymentData, cvc: e.target.value })
                          }
                          placeholder="123"
                        />
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Checkbox
                        checked={saveInfo}
                        onCheckedChange={(checked) => setSaveInfo(checked as boolean)}
                      />
                      <label className="text-sm">
                        Save this card for future purchases
                      </label>
                    </div>
                  </div>
                  <div className="mt-6 flex items-center gap-2 text-sm text-muted-foreground">
                    <Lock className="h-4 w-4" />
                    <span>Your payment information is secure and encrypted</span>
                  </div>
                </>
              )}

              {currentStep === 'review' && (
                <>
                  <h2 className="mb-6 text-xl font-semibold">Review Your Order</h2>
                  
                  <div className="space-y-6">
                    <div className="rounded-xl bg-muted/50 p-4">
                      <h3 className="font-medium">Shipping Address</h3>
                      <p className="mt-2 text-sm text-muted-foreground">
                        {shippingData.firstName} {shippingData.lastName}
                        <br />
                        {shippingData.address}
                        <br />
                        {shippingData.city}, {shippingData.state} {shippingData.zip}
                        <br />
                        {shippingData.country}
                      </p>
                    </div>

                    <div className="rounded-xl bg-muted/50 p-4">
                      <h3 className="font-medium">Payment Method</h3>
                      <p className="mt-2 text-sm text-muted-foreground">
                        Card ending in {paymentData.cardNumber.slice(-4) || '****'}
                      </p>
                    </div>

                    <div className="rounded-xl bg-muted/50 p-4">
                      <h3 className="mb-4 font-medium">Order Items</h3>
                      <div className="space-y-3">
                        {state.cart.map((item) => (
                          <div
                            key={item.id}
                            className="flex items-center justify-between text-sm"
                          >
                            <span>
                              {item.name} x {item.quantity}
                            </span>
                            <span className="font-medium">
                              ${(item.price * item.quantity).toFixed(2)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* Navigation */}
              <div className="mt-8 flex justify-between">
                {currentStep !== 'shipping' ? (
                  <Button variant="outline" onClick={handleBack}>
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back
                  </Button>
                ) : (
                  <Button variant="outline" asChild>
                    <Link href="/cart">
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Back to Cart
                    </Link>
                  </Button>
                )}

                {currentStep !== 'review' ? (
                  <Button onClick={handleNext}>
                    Continue
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                ) : (
                  <Button onClick={handlePlaceOrder} disabled={isProcessing}>
                    {isProcessing ? (
                      <>
                        <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <Lock className="mr-2 h-4 w-4" />
                        Place Order
                      </>
                    )}
                  </Button>
                )}
              </div>
            </motion.div>
          </div>

          {/* Order Summary */}
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
          >
            <div className="sticky top-24 rounded-2xl bg-card p-6 shadow-sm">
              <h2 className="text-lg font-semibold">Order Summary</h2>

              <div className="mt-6 space-y-4">
                {state.cart.map((item) => (
                  <div key={item.id} className="flex gap-3">
                    <div className="h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-muted">
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center">
                          <ShoppingBag className="h-6 w-6 text-muted-foreground/30" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="line-clamp-1 text-sm font-medium">{item.name}</p>
                      <p className="text-sm text-muted-foreground">
                        Qty: {item.quantity}
                      </p>
                    </div>
                    <p className="font-medium">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>

              <Separator className="my-6" />

              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>${cartTotal.toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Shipping</span>
                  {shipping === 0 ? (
                    <span className="text-success">Free</span>
                  ) : (
                    <span>${shipping.toFixed(2)}</span>
                  )}
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Tax</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <Separator />
                <div className="flex items-center justify-between font-semibold">
                  <span>Total</span>
                  <span className="text-xl">${total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
