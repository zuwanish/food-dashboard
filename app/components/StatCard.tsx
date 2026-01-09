'use client';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: string;
}

export function StatCard({ title, value, icon, trend }: StatCardProps) {
  return (
    <div className="rounded-lg bg-white p-6 shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="mt-2 text-3xl font-semibold text-gray-900">{value}</p>
          {trend && (
            <p className="mt-2 text-sm text-gray-500">{trend}</p>
          )}
        </div>
        <div className="rounded-full bg-blue-100 p-3 text-blue-600">
          {icon}
        </div>
      </div>
    </div>
  );
}
