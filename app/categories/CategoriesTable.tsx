'use client';

import { useState } from 'react';
import { deleteCategory } from '../actions/categoryActions';
import { Trash2, Plus } from 'lucide-react';
import AddCategoryForm from './AddCategoryForm';

interface CategoriesTableProps {
  categories: any[];
}

export default function CategoriesTable({ categories }: CategoriesTableProps) {
  const [loading, setLoading] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);

  async function handleDelete(id: string) {
    if (!confirm('Are you sure? This will affect menu items in this category.')) return;
    setLoading(id);
    await deleteCategory(id);
    setLoading(null);
  }

  return (
    <>
      {showAddForm && <AddCategoryForm onClose={() => setShowAddForm(false)} />}

      <div className="mb-4 flex justify-end">
        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          <Plus className="h-5 w-5" />
          Add Category
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
                  Description
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {categories.map((category: any) => (
                <tr key={category.id}>
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="font-medium text-gray-900">{category.name}</div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {category.description || 'No description'}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm font-medium">
                    <button
                      onClick={() => handleDelete(category.id)}
                      disabled={loading === category.id}
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
          {categories.length === 0 && (
            <div className="py-12 text-center text-gray-500">
              No categories found. Add your first category to get started.
            </div>
          )}
        </div>
      </div>
    </>
  );
}
