import { Suspense } from 'react';
import { getOrders } from '../actions/orderActions';
import OrdersTable from './OrdersTable';

async function OrdersData() {
  const orders = await getOrders();
  return <OrdersTable orders={orders} />;
}

export default function OrdersPage() {
  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Orders Management</h1>
        <p className="mt-2 text-gray-600">
          View and manage all orders
        </p>
      </div>

      <Suspense
        fallback={
          <div className="rounded-lg bg-white p-6 shadow">
            <div className="h-96 animate-pulse bg-gray-200" />
          </div>
        }
      >
        <OrdersData />
      </Suspense>
    </div>
  );
}
