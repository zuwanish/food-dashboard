'use client';

import { useState } from 'react';
import { deleteMenuItem, toggleAvailability } from '../actions/menuActions';
import { Trash2, Edit, ToggleLeft, ToggleRight, Plus } from 'lucide-react';
import AddMenuItemForm from './AddMenuItemForm';

interface MenuItem {
  id: string;
  name: string;
  description?: string;
  price: number;
  is_available: boolean;
  categories?: { name: string };
}

interface MenuItemsTableProps {
  menuItems: any[];
  categories: any[];
}

export default function MenuItemsTable({ menuItems, categories }: MenuItemsTableProps) {
  const [loading, setLoading] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);

  async function handleDelete(id: string) {
    if (!confirm('Are you sure you want to delete this item?')) return;
    setLoading(id);
    await deleteMenuItem(id);
    setLoading(null);
  }

  async function handleToggleAvailability(id: string, currentStatus: boolean) {
    setLoading(id);
    await toggleAvailability(id, !currentStatus);
    setLoading(null);
  }

  return (
    <>
      {showAddForm && (
        <AddMenuItemForm
          categories={categories}
          onClose={() => setShowAddForm(false)}
        />
      )}

      <div className="mb-4 flex justify-end">
        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center gap-2 rounded-md bg-blue-600 px-3 py-2 text-sm text-white hover:bg-blue-700 sm:px-4 sm:text-base"
        >
          <Plus className="h-4 w-4 sm:h-5 sm:w-5" />
          <span className="hidden sm:inline">Add Menu Item</span>
          <span className="sm:hidden">Add Item</span>
        </button>
      </div>

      <div className="rounded-lg bg-white shadow">
        <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Category
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Price
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {menuItems.map((item: any) => (
              <tr key={item.id}>
                <td className="whitespace-nowrap px-6 py-4">
                  <div>
                    <div className="font-medium text-gray-900">{item.name}</div>
                    {item.description && (
                      <div className="text-sm text-gray-500">{item.description}</div>
                    )}
                  </div>
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                  {item.categories?.name || 'N/A'}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                  ${Number(item.price).toFixed(2)}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm">
                  <span
                    className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                      item.is_available
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {item.is_available ? 'Available' : 'Unavailable'}
                  </span>
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm font-medium">
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleToggleAvailability(item.id, item.is_available)}
                      disabled={loading === item.id}
                      className="text-blue-600 hover:text-blue-900 disabled:opacity-50"
                      title="Toggle availability"
                    >
                      {item.is_available ? (
                        <ToggleRight className="h-5 w-5" />
                      ) : (
                        <ToggleLeft className="h-5 w-5" />
                      )}
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      disabled={loading === item.id}
                      className="text-red-600 hover:text-red-900 disabled:opacity-50"
                      title="Delete"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {menuItems.length === 0 && (
          <div className="py-12 text-center text-gray-500">
            No menu items found. Add your first item to get started.
          </div>
        )}
        </div>
      </div>
    </>
  );
}
