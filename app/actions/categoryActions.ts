'use server';

import { supabase } from '@/lib/supabase';
import { revalidatePath } from 'next/cache';

export interface Category {
  id: string;
  name: string;
  description?: string;
  created_at: string;
}

// Get all categories
export async function getCategories() {
  try {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name', { ascending: true });

    if (error) {
      console.error('Error fetching categories:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Unexpected error:', error);
    return [];
  }
}

// Add new category
export async function addCategory(categoryData: {
  name: string;
  description?: string;
}) {
  try {
    const { data, error } = await supabase
      .from('categories')
      .insert(categoryData)
      .select()
      .single();

    if (error) {
      console.error('Error adding category:', error);
      return null;
    }

    revalidatePath('/');
    revalidatePath('/categories');
    return data;
  } catch (error) {
    console.error('Unexpected error:', error);
    return null;
  }
}

// Update category
export async function updateCategory(
  id: string,
  updates: { name?: string; description?: string }
) {
  try {
    const { data, error } = await supabase
      .from('categories')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating category:', error);
      return null;
    }

    revalidatePath('/');
    revalidatePath('/categories');
    return data;
  } catch (error) {
    console.error('Unexpected error:', error);
    return null;
  }
}

// Delete category
export async function deleteCategory(id: string) {
  try {
    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting category:', error);
      return false;
    }

    revalidatePath('/');
    revalidatePath('/categories');
    return true;
  } catch (error) {
    console.error('Unexpected error:', error);
    return false;
  }
}
