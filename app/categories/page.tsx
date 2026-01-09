import { Suspense } from 'react';
import { getCategories } from '../actions/categoryActions';
import CategoriesTable from './CategoriesTable';

async function CategoriesData() {
  const categories = await getCategories();
  return <CategoriesTable categories={categories} />;
}

export default function CategoriesPage() {
  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Categories</h1>
        <p className="mt-2 text-gray-600">
          Manage your menu categories
        </p>
      </div>

      <Suspense
        fallback={
          <div className="rounded-lg bg-white p-6 shadow">
            <div className="h-96 animate-pulse bg-gray-200" />
          </div>
        }
      >
        <CategoriesData />
      </Suspense>
    </div>
  );
}
