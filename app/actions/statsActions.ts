'use server';

import { supabase } from '@/lib/supabase';

export interface DashboardStats {
  totalOrders: number;
  totalRevenue: number;
  pendingOrders: number;
  totalMenuItems: number;
  todayOrders: number;
  todayRevenue: number;
}

// Get dashboard statistics
export async function getDashboardStats(): Promise<DashboardStats> {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Get total orders
    const { count: totalOrders } = await supabase
      .from('orders')
      .select('*', { count: 'exact', head: true });

    // Get total revenue
    const { data: revenueData } = await supabase
      .from('orders')
      .select('total_amount');

    const totalRevenue = revenueData?.reduce(
      (sum, order) => sum + Number(order.total_amount),
      0
    ) || 0;

    // Get pending orders
    const { count: pendingOrders } = await supabase
      .from('orders')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'pending');

    // Get total menu items
    const { count: totalMenuItems } = await supabase
      .from('menu_items')
      .select('*', { count: 'exact', head: true });

    // Get today's orders
    const { count: todayOrders } = await supabase
      .from('orders')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', today.toISOString());

    // Get today's revenue
    const { data: todayRevenueData } = await supabase
      .from('orders')
      .select('total_amount')
      .gte('created_at', today.toISOString());

    const todayRevenue = todayRevenueData?.reduce(
      (sum, order) => sum + Number(order.total_amount),
      0
    ) || 0;

    return {
      totalOrders: totalOrders || 0,
      totalRevenue,
      pendingOrders: pendingOrders || 0,
      totalMenuItems: totalMenuItems || 0,
      todayOrders: todayOrders || 0,
      todayRevenue,
    };
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return {
      totalOrders: 0,
      totalRevenue: 0,
      pendingOrders: 0,
      totalMenuItems: 0,
      todayOrders: 0,
      todayRevenue: 0,
    };
  }
}

// Get revenue by date range
export async function getRevenueByDateRange(
  startDate: string,
  endDate: string
) {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select('created_at, total_amount')
      .gte('created_at', startDate)
      .lte('created_at', endDate)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error fetching revenue data:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Unexpected error:', error);
    return [];
  }
}

// Get popular menu items
export async function getPopularMenuItems(limit = 5) {
  try {
    const { data, error } = await supabase
      .from('order_items')
      .select(`
        menu_item_id,
        quantity,
        menu_items (
          id,
          name,
          price
        )
      `);

    if (error) {
      console.error('Error fetching popular items:', error);
      return [];
    }

    // Aggregate quantities by menu item
    const itemMap = new Map();
    data?.forEach((item: any) => {
      const id = item.menu_item_id;
      if (!itemMap.has(id)) {
        itemMap.set(id, {
          ...item.menu_items,
          totalQuantity: 0,
        });
      }
      itemMap.get(id).totalQuantity += item.quantity;
    });

    // Convert to array and sort by quantity
    const popularItems = Array.from(itemMap.values())
      .sort((a, b) => b.totalQuantity - a.totalQuantity)
      .slice(0, limit);

    return popularItems;
  } catch (error) {
    console.error('Unexpected error:', error);
    return [];
  }
}
