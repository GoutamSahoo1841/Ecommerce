import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingCart, Eye, Check, X, Loader2, Calendar } from 'lucide-react';
import { useGetOrdersQuery } from '../../slices/ordersApiSlice';
import { Card, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';

const OrderListScreen = () => {
  const { data: orders, isLoading, error } = useGetOrdersQuery();

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
          <ShoppingCart className="h-8 w-8 text-primary" />
          Orders Management
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          Monitor customer transactions, payment statuses, and fulfillment tracking
        </p>
      </div>

      {isLoading ? (
        <div className="flex flex-col justify-center items-center py-24 gap-4">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="text-muted-foreground animate-pulse text-sm">Loading orders list...</p>
        </div>
      ) : error ? (
        <Card className="border-destructive/30 bg-destructive/10">
          <CardContent className="flex items-center gap-3 p-6 text-destructive-foreground">
            <span className="font-semibold text-sm">Error:</span>
            <span className="text-sm">{error?.data?.message || error.error}</span>
          </CardContent>
        </Card>
      ) : (
        <Card className="border-border/50 bg-card/30 backdrop-blur-md overflow-hidden">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-border/50 bg-muted/20 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    <th scope="col" className="px-6 py-4">ID</th>
                    <th scope="col" className="px-6 py-4">User</th>
                    <th scope="col" className="px-6 py-4">Date</th>
                    <th scope="col" className="px-6 py-4">Total</th>
                    <th scope="col" className="px-6 py-4">Paid</th>
                    <th scope="col" className="px-6 py-4">Delivered</th>
                    <th scope="col" className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/30 text-sm">
                  {orders.map((order, idx) => (
                    <motion.tr
                      key={order._id}
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.03 }}
                      className="hover:bg-muted/10 transition-colors group"
                    >
                      <td className="px-6 py-4 font-mono text-xs text-muted-foreground">
                        {order._id}
                      </td>
                      <td className="px-6 py-4 font-medium text-foreground">
                        {order.user ? order.user.name : <span className="text-muted-foreground italic">Guest / Deleted</span>}
                      </td>
                      <td className="px-6 py-4 text-muted-foreground">
                        <span className="flex items-center gap-1.5 text-xs">
                          <Calendar className="h-3.5 w-3.5" />
                          {order.createdAt.substring(0, 10)}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-semibold text-foreground">
                        ${order.totalPrice?.toFixed(2)}
                      </td>
                      <td className="px-6 py-4">
                        {order.isPaid ? (
                          <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 hover:bg-emerald-500/20 gap-1 font-medium">
                            <Check className="h-3 w-3" />
                            {order.paidAt?.substring(0, 10)}
                          </Badge>
                        ) : (
                          <Badge variant="destructive" className="bg-destructive/10 text-destructive border-destructive/20 hover:bg-destructive/20 gap-1 font-medium">
                            <X className="h-3 w-3" />
                            Unpaid
                          </Badge>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        {order.isDelivered ? (
                          <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 hover:bg-emerald-500/20 gap-1 font-medium">
                            <Check className="h-3 w-3" />
                            {order.deliveredAt?.substring(0, 10)}
                          </Badge>
                        ) : (
                          <Badge variant="destructive" className="bg-destructive/10 text-destructive border-destructive/20 hover:bg-destructive/20 gap-1 font-medium">
                            <X className="h-3 w-3" />
                            Pending
                          </Badge>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          asChild
                          className="gap-1 text-xs hover:bg-primary/10 hover:text-primary transition-all"
                        >
                          <Link to={`/order/${order._id}`}>
                            <Eye className="h-3.5 w-3.5" />
                            Details
                          </Link>
                        </Button>
                      </td>
                    </motion.tr>
                  ))}
                  {orders.length === 0 && (
                    <tr>
                      <td colSpan="7" className="px-6 py-12 text-center text-muted-foreground">
                        No orders recorded yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </motion.div>
  );
};

export default OrderListScreen;
