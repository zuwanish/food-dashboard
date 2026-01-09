import { getPopularMenuItems } from '../actions/statsActions';
import { TrendingUp } from 'lucide-react';

export async function PopularItems() {
  const items = await getPopularMenuItems(5);

  return (
    <div className="space-y-4">
      {items.length === 0 ? (
        <p className="text-gray-500">No popular items yet</p>
      ) : (
        items.map((item, index) => (
          <div
            key={item.id}
            className="flex items-center justify-between border-b border-gray-100 pb-3 last:border-0"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-sm font-semibold text-blue-600">
                {index + 1}
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">{item.name}</p>
                <p className="text-xs text-gray-500">
                  {item.order_count} orders
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-gray-900">
                ${item.total_revenue?.toFixed(2) || '0.00'}
              </span>
              <TrendingUp className="h-4 w-4 text-green-600" />
            </div>
          </div>
        ))
      )}
    </div>
  );
}
