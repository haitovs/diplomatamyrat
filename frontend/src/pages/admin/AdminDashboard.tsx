import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import {
    ArrowUpRight,
    Clock,
    DollarSign,
    Package,
    ShoppingCart,
    TrendingUp,
    Users
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { getAdminStats } from '../../api/admin';
import { getImageUrl } from '../../utils/format';

const statCards = [
  { 
    key: 'totalProducts',
    label: 'Total Products', 
    icon: Package, 
    color: 'from-blue-500 to-blue-600',
    link: '/admin/products'
  },
  { 
    key: 'totalOrders',
    label: 'Total Orders', 
    icon: ShoppingCart, 
    color: 'from-emerald-500 to-emerald-600',
    link: '/admin/orders'
  },
  { 
    key: 'totalUsers',
    label: 'Customers', 
    icon: Users, 
    color: 'from-violet-500 to-violet-600',
    link: '/admin/users'
  },
  { 
    key: 'totalRevenue',
    label: 'Revenue', 
    icon: DollarSign, 
    color: 'from-amber-500 to-amber-600',
    format: (val: number) => `$${val.toLocaleString()}`
  },
];

const orderStatusColors: Record<string, string> = {
  PENDING: 'bg-yellow-100 text-yellow-700',
  PROCESSING: 'bg-blue-100 text-blue-700',
  SHIPPED: 'bg-purple-100 text-purple-700',
  DELIVERED: 'bg-green-100 text-green-700',
  CANCELLED: 'bg-red-100 text-red-700',
};

export default function AdminDashboard() {
  const { data: stats, isLoading, error } = useQuery({
    queryKey: ['admin', 'stats'],
    queryFn: getAdminStats
  });

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-32 bg-stone-200 rounded-xl" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="h-80 bg-stone-200 rounded-xl" />
          <div className="h-80 bg-stone-200 rounded-xl" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 text-red-600 p-6 rounded-xl">
        Failed to load dashboard stats. Please try again.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-heading font-semibold text-stone-900">Dashboard</h1>
        <p className="text-stone-600 mt-1">Welcome back! Here's what's happening with your store.</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          const value = stats?.[stat.key as keyof typeof stats] as number;
          const displayValue = stat.format ? stat.format(value) : value;

          return (
            <motion.div
              key={stat.key}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link
                to={stat.link || '#'}
                className="block bg-white rounded-xl p-5 shadow-sm border border-stone-100 hover:shadow-md hover:border-stone-200 transition-all group"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-stone-500">{stat.label}</p>
                    <p className="text-2xl font-semibold text-stone-900 mt-1">{displayValue}</p>
                  </div>
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-lg`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div className="flex items-center gap-1 mt-3 text-sm">
                  <TrendingUp className="w-4 h-4 text-green-500" />
                  <span className="text-green-600 font-medium">+12%</span>
                  <span className="text-stone-400">vs last month</span>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-xl shadow-sm border border-stone-100"
        >
          <div className="p-5 border-b border-stone-100 flex items-center justify-between">
            <h2 className="font-heading font-semibold text-stone-900">Recent Orders</h2>
            <Link 
              to="/admin/orders" 
              className="text-sm text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1"
            >
              View all <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="divide-y divide-stone-100">
            {stats?.recentOrders?.length === 0 ? (
              <div className="p-8 text-center text-stone-500">
                No orders yet
              </div>
            ) : (
              stats?.recentOrders?.map((order: any) => (
                <div key={order.id} className="p-4 hover:bg-stone-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-stone-900">#{order.orderNumber}</p>
                      <p className="text-sm text-stone-500">
                        {order.user?.firstName} {order.user?.lastName}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-stone-900">${order.total.toFixed(2)}</p>
                      <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${orderStatusColors[order.status] || 'bg-stone-100 text-stone-600'}`}>
                        {order.status}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 mt-2 text-xs text-stone-400">
                    <Clock className="w-3 h-3" />
                    {new Date(order.createdAt).toLocaleDateString()}
                  </div>
                </div>
              ))
            )}
          </div>
        </motion.div>

        {/* Top Products */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-xl shadow-sm border border-stone-100"
        >
          <div className="p-5 border-b border-stone-100 flex items-center justify-between">
            <h2 className="font-heading font-semibold text-stone-900">Top Products</h2>
            <Link 
              to="/admin/products" 
              className="text-sm text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1"
            >
              View all <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="divide-y divide-stone-100">
            {stats?.topProducts?.length === 0 ? (
              <div className="p-8 text-center text-stone-500">
                No sales data yet
              </div>
            ) : (
              stats?.topProducts?.map((product: any, index: number) => (
                <div key={product?.id || index} className="p-4 hover:bg-stone-50 transition-colors flex items-center gap-4">
                  <div className="w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center text-sm font-semibold text-stone-600">
                    {index + 1}
                  </div>
                  <div className="w-12 h-12 rounded-lg bg-stone-100 overflow-hidden flex-shrink-0">
                    {product?.images?.[0]?.url ? (
                      <img 
                        src={getImageUrl(product.images[0].url)} 
                        alt={product.name} 
                        className="w-full h-full object-cover" 
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Package className="w-5 h-5 text-stone-400" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-stone-900 truncate">{product?.name || 'Unknown'}</p>
                    <p className="text-sm text-stone-500">{product?.totalSold || 0} sold</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-stone-900">${product?.price?.toFixed(2) || '0.00'}</p>
                    <span className="inline-flex items-center gap-1 text-xs text-green-600">
                      <ArrowUpRight className="w-3 h-3" />
                      +5%
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-gradient-to-br from-stone-900 to-stone-800 rounded-xl p-6 text-white"
      >
        <h2 className="font-heading font-semibold text-lg">Quick Actions</h2>
        <p className="text-stone-400 text-sm mt-1">Common tasks you might want to do</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
          <Link
            to="/admin/products"
            className="bg-white/10 hover:bg-white/20 backdrop-blur rounded-lg p-4 text-center transition-colors"
          >
            <Package className="w-6 h-6 mx-auto mb-2" />
            <span className="text-sm font-medium">Add Product</span>
          </Link>
          <Link
            to="/admin/orders"
            className="bg-white/10 hover:bg-white/20 backdrop-blur rounded-lg p-4 text-center transition-colors"
          >
            <ShoppingCart className="w-6 h-6 mx-auto mb-2" />
            <span className="text-sm font-medium">View Orders</span>
          </Link>
          <Link
            to="/admin/categories"
            className="bg-white/10 hover:bg-white/20 backdrop-blur rounded-lg p-4 text-center transition-colors"
          >
            <Package className="w-6 h-6 mx-auto mb-2" />
            <span className="text-sm font-medium">Categories</span>
          </Link>
          <Link
            to="/admin/users"
            className="bg-white/10 hover:bg-white/20 backdrop-blur rounded-lg p-4 text-center transition-colors"
          >
            <Users className="w-6 h-6 mx-auto mb-2" />
            <span className="text-sm font-medium">Customers</span>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
