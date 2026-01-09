'use server';

import { supabase } from '@/lib/supabase';
import { revalidatePath } from 'next/cache';

export interface MenuItem {
  id: string;
  category_id: string;
  name: string;
  description?: string;
  price: number;
  image_url?: string;
  is_available: boolean;
  created_at: string;
  updated_at: string;
}

// Get all menu items with category details
export async function getMenuItems() {
  try {
    const { data, error } = await supabase
      .from('menu_items')
      .select(`
        *,
        categories (
          id,
          name
        )
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching menu items:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Unexpected error:', error);
    return [];
  }
}

// Add new menu item
export async function addMenuItem(itemData: {
  category_id: string;
  name: string;
  description?: string;
  price: number;
  image_url?: string;
  is_available?: boolean;
}) {
  try {
    const { data, error } = await supabase
      .from('menu_items')
      .insert({
        ...itemData,
        is_available: itemData.is_available ?? true,
      })
      .select()
      .single();

    if (error) {
      console.error('Error adding menu item:', error);
      return null;
    }

    revalidatePath('/');
    revalidatePath('/menu');
    return data;
  } catch (error) {
    console.error('Unexpected error:', error);
    return null;
  }
}

// Update menu item
export async function updateMenuItem(
  id: string,
  updates: {
    name?: string;
    description?: string;
    price?: number;
    category_id?: string;
    image_url?: string;
    is_available?: boolean;
  }
) {
  try {
    const { data, error } = await supabase
      .from('menu_items')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating menu item:', error);
      return null;
    }

    revalidatePath('/');
    revalidatePath('/menu');
    return data;
  } catch (error) {
    console.error('Unexpected error:', error);
    return null;
  }
}

// Delete menu item
export async function deleteMenuItem(id: string) {
  try {
    const { error } = await supabase
      .from('menu_items')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting menu item:', error);
      return false;
    }

    revalidatePath('/');
    revalidatePath('/menu');
    return true;
  } catch (error) {
    console.error('Unexpected error:', error);
    return false;
  }
}

// Toggle availability
export async function toggleAvailability(id: string, is_available: boolean) {
  try {
    const { data, error } = await supabase
      .from('menu_items')
      .update({ is_available, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error toggling availability:', error);
      return null;
    }

    revalidatePath('/');
    revalidatePath('/menu');
    return data;
  } catch (error) {
    console.error('Unexpected error:', error);
    return null;
  }
}
