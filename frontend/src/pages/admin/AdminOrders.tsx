import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { AnimatePresence, motion } from 'framer-motion';
import {
    Ban,
    Check,
    ChevronLeft,
    ChevronRight,
    Clock,
    Eye,
    Package,
    ShoppingCart,
    Truck,
    X
} from 'lucide-react';
import { useState } from 'react';
import { getAdminOrders, updateOrderStatus, type AdminOrder } from '../../api/admin';
import { getImageUrl } from '../../utils/format';

const statusConfig: Record<string, { color: string; bg: string; icon: any }> = {
  PENDING: { color: 'text-yellow-700', bg: 'bg-yellow-100', icon: Clock },
  PROCESSING: { color: 'text-blue-700', bg: 'bg-blue-100', icon: Package },
  SHIPPED: { color: 'text-purple-700', bg: 'bg-purple-100', icon: Truck },
  DELIVERED: { color: 'text-green-700', bg: 'bg-green-100', icon: Check },
  CANCELLED: { color: 'text-red-700', bg: 'bg-red-100', icon: Ban },
};

const statusOptions = ['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'];

export default function AdminOrders() {
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<AdminOrder | null>(null);

  const queryClient = useQueryClient();
  const limit = 10;

  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'orders', page, statusFilter],
    queryFn: () => getAdminOrders({ page, status: statusFilter })
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) => updateOrderStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'orders'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'stats'] });
    }
  });

  const totalPages = Math.ceil((data?.total || 0) / limit);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-heading font-semibold text-stone-900">Orders</h1>
          <p className="text-stone-600 mt-1">Manage customer orders</p>
        </div>
      </div>

      {/* Status Filters */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => { setStatusFilter(''); setPage(1); }}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            !statusFilter 
              ? 'bg-stone-900 text-white' 
              : 'bg-white text-stone-600 hover:bg-stone-50 border border-stone-200'
          }`}
        >
          All Orders
        </button>
        {statusOptions.map((status) => {
          const config = statusConfig[status];
          return (
            <button
              key={status}
              onClick={() => { setStatusFilter(status); setPage(1); }}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                statusFilter === status
                  ? `${config.bg} ${config.color}`
                  : 'bg-white text-stone-600 hover:bg-stone-50 border border-stone-200'
              }`}
            >
              {status.charAt(0) + status.slice(1).toLowerCase()}
            </button>
          );
        })}
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-xl shadow-sm border border-stone-100 overflow-hidden">
        {isLoading ? (
          <div className="p-8 space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-20 bg-stone-100 rounded animate-pulse" />
            ))}
          </div>
        ) : data?.orders?.length === 0 ? (
          <div className="p-12 text-center">
            <ShoppingCart className="w-12 h-12 text-stone-300 mx-auto mb-4" />
            <p className="text-stone-500">No orders found</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-stone-50 border-b border-stone-100">
                  <tr>
                    <th className="text-left px-4 py-3 text-sm font-semibold text-stone-600">Order</th>
                    <th className="text-left px-4 py-3 text-sm font-semibold text-stone-600">Customer</th>
                    <th className="text-left px-4 py-3 text-sm font-semibold text-stone-600">Items</th>
                    <th className="text-left px-4 py-3 text-sm font-semibold text-stone-600">Total</th>
                    <th className="text-left px-4 py-3 text-sm font-semibold text-stone-600">Status</th>
                    <th className="text-left px-4 py-3 text-sm font-semibold text-stone-600">Date</th>
                    <th className="text-right px-4 py-3 text-sm font-semibold text-stone-600">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {data?.orders?.map((order: AdminOrder) => {
                    return (
                      <motion.tr 
                        key={order.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="hover:bg-stone-50 transition-colors"
                      >
                        <td className="px-4 py-3">
                          <span className="font-mono font-medium text-stone-900">
                            #{order.orderNumber}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent-500 to-accent-600 flex items-center justify-center text-white text-xs font-semibold">
                              {order.user?.firstName?.charAt(0)}{order.user?.lastName?.charAt(0)}
                            </div>
                            <div>
                              <p className="text-sm font-medium text-stone-900">
                                {order.user?.firstName} {order.user?.lastName}
                              </p>
                              <p className="text-xs text-stone-500">{order.user?.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1">
                            {order.items?.slice(0, 3).map((item: any, i: number) => (
                              <div 
                                key={i}
                                className="w-8 h-8 rounded border border-stone-200 bg-stone-50 overflow-hidden"
                                style={{ marginLeft: i > 0 ? '-8px' : '0' }}
                              >
                                {item.product?.images?.[0]?.url ? (
                                  <img 
                                    src={getImageUrl(item.product.images[0].url)} 
                                    alt="" 
                                    className="w-full h-full object-cover" 
                                  />
                                ) : (
                                  <Package className="w-4 h-4 m-2 text-stone-400" />
                                )}
                              </div>
                            ))}
                            {order.items?.length > 3 && (
                              <span className="text-xs text-stone-500 ml-1">
                                +{order.items.length - 3}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className="font-semibold text-stone-900">
                            ${order.total.toFixed(2)}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <select
                            value={order.status}
                            onChange={(e) => updateStatusMutation.mutate({ id: order.id, status: e.target.value })}
                            className={`px-3 py-1.5 rounded-lg text-xs font-medium border-0 cursor-pointer ${statusConfig[order.status]?.bg} ${statusConfig[order.status]?.color}`}
                          >
                            {statusOptions.map((status) => (
                              <option key={status} value={status}>
                                {status.charAt(0) + status.slice(1).toLowerCase()}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1 text-sm text-stone-500">
                            <Clock className="w-4 h-4" />
                            {new Date(order.createdAt).toLocaleDateString()}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <button
                            onClick={() => setSelectedOrder(order)}
                            className="p-2 text-stone-400 hover:text-stone-600 hover:bg-stone-100 rounded-lg transition-colors"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        </td>
                      </motion.tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between p-4 border-t border-stone-100">
                <p className="text-sm text-stone-600">
                  Showing {((page - 1) * limit) + 1} - {Math.min(page * limit, data?.total || 0)} of {data?.total} orders
                </p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setPage(Math.max(1, page - 1))}
                    disabled={page === 1}
                    className="p-2 rounded-lg border border-stone-200 text-stone-600 hover:bg-stone-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <span className="px-3 text-sm text-stone-600">
                    Page {page} of {totalPages}
                  </span>
                  <button
                    onClick={() => setPage(Math.min(totalPages, page + 1))}
                    disabled={page >= totalPages}
                    className="p-2 rounded-lg border border-stone-200 text-stone-600 hover:bg-stone-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Order Details Modal */}
      <AnimatePresence>
        {selectedOrder && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedOrder(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b border-stone-100 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-stone-900">
                    Order #{selectedOrder.orderNumber}
                  </h3>
                  <p className="text-sm text-stone-500">
                    {new Date(selectedOrder.createdAt).toLocaleString()}
                  </p>
                </div>
                <button onClick={() => setSelectedOrder(null)} className="p-2 hover:bg-stone-100 rounded-lg">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 space-y-6">
                {/* Customer Info */}
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-accent-500 to-accent-600 flex items-center justify-center text-white font-semibold">
                    {selectedOrder.user?.firstName?.charAt(0)}{selectedOrder.user?.lastName?.charAt(0)}
                  </div>
                  <div>
                    <p className="font-medium text-stone-900">
                      {selectedOrder.user?.firstName} {selectedOrder.user?.lastName}
                    </p>
                    <p className="text-sm text-stone-500">{selectedOrder.user?.email}</p>
                  </div>
                </div>

                {/* Items */}
                <div>
                  <h4 className="font-medium text-stone-900 mb-3">Order Items</h4>
                  <div className="border border-stone-200 rounded-lg divide-y divide-stone-100">
                    {selectedOrder.items?.map((item: any) => (
                      <div key={item.id} className="p-3 flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg bg-stone-100 overflow-hidden">
                          {item.product?.images?.[0]?.url ? (
                            <img 
                              src={getImageUrl(item.product.images[0].url)} 
                              alt={item.product?.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <Package className="w-full h-full p-3 text-stone-400" />
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-stone-900">{item.product?.name}</p>
                          <p className="text-sm text-stone-500">Qty: {item.quantity}</p>
                        </div>
                        <p className="font-medium text-stone-900">
                          ${(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Totals */}
                <div className="border-t border-stone-200 pt-4">
                  <div className="flex justify-between text-lg font-semibold text-stone-900">
                    <span>Total</span>
                    <span>${selectedOrder.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
