import { Suspense } from 'react';
import { getDashboardStats } from './actions/statsActions';
import { StatCard } from './components/StatCard';
import { RecentActivity } from './components/RecentActivity';
import { PopularItems } from './components/PopularItems';
import { DollarSign, ShoppingBag, Package, Clock } from 'lucide-react';

async function DashboardStats() {
  const stats = await getDashboardStats();

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      <StatCard
        title="Total Revenue"
        value={`$${stats.totalRevenue.toFixed(2)}`}
        icon={<DollarSign className="h-6 w-6" />}
        trend={`Today: $${stats.todayRevenue.toFixed(2)}`}
      />
      <StatCard
        title="Total Orders"
        value={stats.totalOrders}
        icon={<ShoppingBag className="h-6 w-6" />}
        trend={`Today: ${stats.todayOrders}`}
      />
      <StatCard
        title="Menu Items"
        value={stats.totalMenuItems}
        icon={<Package className="h-6 w-6" />}
      />
      <StatCard
        title="Pending Orders"
        value={stats.pendingOrders}
        icon={<Clock className="h-6 w-6" />}
      />
    </div>
  );
}

export default function Home() {
  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-2 text-gray-600">
          Welcome to your food chain management dashboard
        </p>
      </div>

      <Suspense
        fallback={
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="h-32 animate-pulse rounded-lg bg-gray-200"
              />
            ))}
          </div>
        }
      >
        <DashboardStats />
      </Suspense>

      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-lg bg-white p-6 shadow">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">
            Recent Activity
          </h2>
          <Suspense
            fallback={
              <div className="space-y-3">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="h-12 animate-pulse rounded bg-gray-100" />
                ))}
              </div>
            }
          >
            <RecentActivity />
          </Suspense>
        </div>

        <div className="rounded-lg bg-white p-6 shadow">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">
            Popular Items
          </h2>
          <Suspense
            fallback={
              <div className="space-y-3">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="h-12 animate-pulse rounded bg-gray-100" />
                ))}
              </div>
            }
          >
            <PopularItems />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
