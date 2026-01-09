'use server';

import { supabase } from '@/lib/supabase';
import { revalidatePath } from 'next/cache';

export interface Activity {
  id: string;
  type: 'order' | 'menu' | 'category';
  action: 'created' | 'updated' | 'deleted';
  description: string;
  created_at: string;
}

export async function getRecentActivities(limit = 10) {
  const { data: orders } = await supabase
    .from('orders')
    .select('id, customer_name, total_amount, status, created_at, updated_at')
    .order('updated_at', { ascending: false })
    .limit(limit);

  const { data: menuItems } = await supabase
    .from('menu_items')
    .select('id, name, created_at, updated_at')
    .order('updated_at', { ascending: false })
    .limit(limit);

  const { data: categories } = await supabase
    .from('categories')
    .select('id, name, created_at, updated_at')
    .order('updated_at', { ascending: false })
    .limit(limit);

  const activities: Activity[] = [];

  // Process orders
  orders?.forEach((order) => {
    const isNew = new Date(order.created_at).getTime() === new Date(order.updated_at).getTime();
    activities.push({
      id: `order-${order.id}`,
      type: 'order',
      action: isNew ? 'created' : 'updated',
      description: isNew
        ? `New order from ${order.customer_name} - $${order.total_amount}`
        : `Order from ${order.customer_name} updated to ${order.status}`,
      created_at: order.updated_at,
    });
  });

  // Process menu items
  menuItems?.forEach((item) => {
    const isNew = new Date(item.created_at).getTime() === new Date(item.updated_at).getTime();
    activities.push({
      id: `menu-${item.id}`,
      type: 'menu',
      action: isNew ? 'created' : 'updated',
      description: isNew
        ? `New menu item added: ${item.name}`
        : `Menu item updated: ${item.name}`,
      created_at: item.updated_at,
    });
  });

  // Process categories
  categories?.forEach((category) => {
    const isNew = new Date(category.created_at).getTime() === new Date(category.updated_at).getTime();
    activities.push({
      id: `category-${category.id}`,
      type: 'category',
      action: isNew ? 'created' : 'updated',
      description: isNew
        ? `New category added: ${category.name}`
        : `Category updated: ${category.name}`,
      created_at: category.updated_at,
    });
  });

  // Sort all activities by date and limit
  return activities
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, limit);
}
