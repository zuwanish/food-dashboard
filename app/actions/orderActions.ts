'use server';

import { supabase } from '@/lib/supabase';
import { revalidatePath } from 'next/cache';

export interface Order {
  id: string;
  customer_name?: string;
  customer_phone?: string;
  total_amount: number;
  status: 'pending' | 'preparing' | 'ready' | 'delivered' | 'cancelled';
  order_type?: 'dine-in' | 'takeaway' | 'delivery';
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  menu_item_id: string;
  quantity: number;
  price: number;
  created_at: string;
}

// Get all orders with items
export async function getOrders() {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        order_items (
          *,
          menu_items (
            id,
            name,
            price
          )
        )
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching orders:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Unexpected error:', error);
    return [];
  }
}

// Get orders by status
export async function getOrdersByStatus(status: string) {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        order_items (
          *,
          menu_items (
            id,
            name,
            price
          )
        )
      `)
      .eq('status', status)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching orders:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Unexpected error:', error);
    return [];
  }
}

// Create new order
export async function createOrder(orderData: {
  customer_name?: string;
  customer_phone?: string;
  total_amount: number;
  status?: string;
  order_type?: string;
  items: Array<{
    menu_item_id: string;
    quantity: number;
    price: number;
  }>;
}) {
  try {
    // Create order
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        customer_name: orderData.customer_name,
        customer_phone: orderData.customer_phone,
        total_amount: orderData.total_amount,
        status: orderData.status || 'pending',
        order_type: orderData.order_type || 'dine-in',
      })
      .select()
      .single();

    if (orderError) {
      console.error('Error creating order:', orderError);
      return null;
    }

    // Create order items
    const orderItems = orderData.items.map((item) => ({
      order_id: order.id,
      menu_item_id: item.menu_item_id,
      quantity: item.quantity,
      price: item.price,
    }));

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems);

    if (itemsError) {
      console.error('Error creating order items:', itemsError);
      return null;
    }

    revalidatePath('/');
    revalidatePath('/orders');
    return order;
  } catch (error) {
    console.error('Unexpected error:', error);
    return null;
  }
}

// Update order status
export async function updateOrderStatus(id: string, status: string) {
  try {
    const { data, error } = await supabase
      .from('orders')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating order status:', error);
      return null;
    }

    revalidatePath('/');
    revalidatePath('/orders');
    return data;
  } catch (error) {
    console.error('Unexpected error:', error);
    return null;
  }
}

// Delete order
export async function deleteOrder(id: string) {
  try {
    const { error } = await supabase
      .from('orders')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting order:', error);
      return false;
    }

    revalidatePath('/');
    revalidatePath('/orders');
    return true;
  } catch (error) {
    console.error('Unexpected error:', error);
    return false;
  }
}
