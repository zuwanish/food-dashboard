'use client';

import { useState, useEffect } from 'react';
import { createOrder } from '../actions/orderActions';
import { getMenuItems } from '../actions/menuActions';
import { X } from 'lucide-react';

interface AddOrderFormProps {
  onClose: () => void;
}

export default function AddOrderForm({ onClose }: AddOrderFormProps) {
  const [menuItems, setMenuItems] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    customer_name: '',
    customer_phone: '',
    order_type: 'dine-in',
  });
  const [orderItems, setOrderItems] = useState<Array<{ menu_item_id: string; quantity: number }>>([
    { menu_item_id: '', quantity: 1 },
  ]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function loadMenuItems() {
      const items = await getMenuItems();
      setMenuItems(items.filter((item: any) => item.is_available));
    }
    loadMenuItems();
  }, []);

  function addItem() {
    setOrderItems([...orderItems, { menu_item_id: '', quantity: 1 }]);
  }

  function removeItem(index: number) {
    setOrderItems(orderItems.filter((_, i) => i !== index));
  }

  function updateItem(index: number, field: string, value: any) {
    const updated = [...orderItems];
    updated[index] = { ...updated[index], [field]: value };
    setOrderItems(updated);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);

    const items = orderItems
      .filter((item) => item.menu_item_id)
      .map((item) => {
        const menuItem = menuItems.find((m) => m.id === item.menu_item_id);
        return {
          menu_item_id: item.menu_item_id,
          quantity: item.quantity,
          price: menuItem?.price || 0,
        };
      });

    const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    await createOrder({
      customer_name: formData.customer_name || undefined,
      customer_phone: formData.customer_phone || undefined,
      order_type: formData.order_type,
      total_amount: total,
      items,
    });

    setIsLoading(false);
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-lg bg-white p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">Create New Order</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Customer Name
              </label>
              <input
                type="text"
                value={formData.customer_name}
                onChange={(e) => setFormData({ ...formData, customer_name: e.target.value })}
                className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Customer Phone
              </label>
              <input
                type="tel"
                value={formData.customer_phone}
                onChange={(e) => setFormData({ ...formData, customer_phone: e.target.value })}
                className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Order Type *
            </label>
            <select
              required
              value={formData.order_type}
              onChange={(e) => setFormData({ ...formData, order_type: e.target.value })}
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900"
            >
              <option value="dine-in">Dine In</option>
              <option value="takeaway">Takeaway</option>
              <option value="delivery">Delivery</option>
            </select>
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between">
              <label className="block text-sm font-medium text-gray-700">
                Order Items *
              </label>
              <button
                type="button"
                onClick={addItem}
                className="text-sm text-blue-600 hover:text-blue-700"
              >
                + Add Item
              </button>
            </div>

            <div className="space-y-2">
              {orderItems.map((item, index) => (
                <div key={index} className="flex gap-2">
                  <select
                    required
                    value={item.menu_item_id}
                    onChange={(e) => updateItem(index, 'menu_item_id', e.target.value)}
                    className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-gray-900"
                  >
                    <option value="">Select item</option>
                    {menuItems.map((menuItem) => (
                      <option key={menuItem.id} value={menuItem.id}>
                        {menuItem.name} - ${Number(menuItem.price).toFixed(2)}
                      </option>
                    ))}
                  </select>
                  <input
                    type="number"
                    min="1"
                    required
                    value={item.quantity}
                    onChange={(e) => updateItem(index, 'quantity', parseInt(e.target.value))}
                    className="w-20 rounded-md border border-gray-300 px-3 py-2 text-gray-900"
                    placeholder="Qty"
                  />
                  {orderItems.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeItem(index)}
                      className="rounded-md border border-red-300 px-3 text-red-600 hover:bg-red-50"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-2">
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
            >
              {isLoading ? 'Creating...' : 'Create Order'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="rounded-md border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
