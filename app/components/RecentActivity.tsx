import { getRecentActivities } from '../actions/activityActions';
import { formatDistanceToNow } from 'date-fns';
import { ShoppingBag, Package, Folder } from 'lucide-react';

export async function RecentActivity() {
  const activities = await getRecentActivities(5);

  const getIcon = (type: string) => {
    switch (type) {
      case 'order':
        return <ShoppingBag className="h-5 w-5 text-blue-600" />;
      case 'menu':
        return <Package className="h-5 w-5 text-green-600" />;
      case 'category':
        return <Folder className="h-5 w-5 text-purple-600" />;
      default:
        return null;
    }
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case 'created':
        return 'text-green-600';
      case 'updated':
        return 'text-blue-600';
      case 'deleted':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className="space-y-4">
      {activities.length === 0 ? (
        <p className="text-gray-500">No recent activity</p>
      ) : (
        activities.map((activity) => (
          <div
            key={activity.id}
            className="flex items-start gap-3 border-b border-gray-100 pb-3 last:border-0"
          >
            <div className="mt-1">{getIcon(activity.type)}</div>
            <div className="flex-1">
              <p className="text-sm text-gray-900">{activity.description}</p>
              <p className="mt-1 text-xs text-gray-500">
                {formatDistanceToNow(new Date(activity.created_at), {
                  addSuffix: true,
                })}
              </p>
            </div>
            <span
              className={`text-xs font-medium capitalize ${getActionColor(
                activity.action
              )}`}
            >
              {activity.action}
            </span>
          </div>
        ))
      )}
    </div>
  );
}
