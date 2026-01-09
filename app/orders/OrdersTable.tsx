'use client';

import { useState } from 'react';
import { updateOrderStatus, deleteOrder } from '../actions/orderActions';
import { format } from 'date-fns';
import { Trash2, Plus } from 'lucide-react';
import AddOrderForm from './AddOrderForm';

interface OrdersTableProps {
  orders: any[];
}

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800',
  preparing: 'bg-blue-100 text-blue-800',
  ready: 'bg-green-100 text-green-800',
  delivered: 'bg-gray-100 text-gray-800',
  cancelled: 'bg-red-100 text-red-800',
};

export default function OrdersTable({ orders }: OrdersTableProps) {
  const [loading, setLoading] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);

  async function handleStatusChange(id: string, status: string) {
    setLoading(id);
    await updateOrderStatus(id, status);
    setLoading(null);
  }

  async function handleDelete(id: string) {
    if (!confirm('Are you sure you want to delete this order?')) return;
    setLoading(id);
    await deleteOrder(id);
    setLoading(null);
  }

  return (
    <>
      {showAddForm && <AddOrderForm onClose={() => setShowAddForm(false)} />}

      <div className="mb-4 flex justify-end">
        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          <Plus className="h-5 w-5" />
          Create Order
        </button>
      </div>

      <div className="rounded-lg bg-white shadow">
        <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Order ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Customer
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Total
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {orders.map((order: any) => (
              <tr key={order.id}>
                <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                  #{order.id.slice(0, 8)}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                  <div>
                    <div>{order.customer_name || 'Guest'}</div>
                    {order.customer_phone && (
                      <div className="text-gray-500">{order.customer_phone}</div>
                    )}
                  </div>
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                  {order.order_type || 'N/A'}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                  ${Number(order.total_amount).toFixed(2)}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm">
                  <select
                    value={order.status}
                    onChange={(e) => handleStatusChange(order.id, e.target.value)}
                    disabled={loading === order.id}
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      statusColors[order.status as keyof typeof statusColors]
                    } disabled:opacity-50`}
                  >
                    <option value="pending">Pending</option>
                    <option value="preparing">Preparing</option>
                    <option value="ready">Ready</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                  {format(new Date(order.created_at), 'MMM dd, yyyy HH:mm')}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm font-medium">
                  <button
                    onClick={() => handleDelete(order.id)}
                    disabled={loading === order.id}
                    className="text-red-600 hover:text-red-900 disabled:opacity-50"
                    title="Delete"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {orders.length === 0 && (
          <div className="py-12 text-center text-gray-500">
            No orders found.
          </div>
        )}
        </div>
      </div>
    </>
  );
}
