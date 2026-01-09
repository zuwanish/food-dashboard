import { Suspense } from 'react';
import { getMenuItems } from '../actions/menuActions';
import { getCategories } from '../actions/categoryActions';
import MenuItemsTable from './MenuItemsTable';

async function MenuData() {
  const [menuItems, categories] = await Promise.all([
    getMenuItems(),
    getCategories(),
  ]);

  return <MenuItemsTable menuItems={menuItems} categories={categories} />;
}

export default function MenuPage() {
  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Menu Management</h1>
        <p className="mt-2 text-gray-600">
          Manage your menu items and their availability
        </p>
      </div>

      <Suspense
        fallback={
          <div className="rounded-lg bg-white p-6 shadow">
            <div className="h-96 animate-pulse bg-gray-200" />
          </div>
        }
      >
        <MenuData />
      </Suspense>
    </div>
  );
}
