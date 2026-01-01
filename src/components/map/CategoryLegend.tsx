'use client';

import { categoryLabels, categoryColors } from '@/lib/categoryIcons';

export default function CategoryLegend() {
  return (
    <div className="fixed top-20 left-4 z-30 animate-fade-in rounded-xl shadow-lg p-3 bg-white/95 backdrop-blur-md border border-gray-200 max-w-[140px]">
      <h3 className="text-xs font-bold mb-2 text-gray-900">
        カテゴリー
      </h3>
      <div className="space-y-1">
        {Object.entries(categoryLabels).map(([key, label]) => (
          <div
            key={key}
            className="flex items-center space-x-2 text-xs py-1.5 px-2 rounded-lg"
          >
            <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{
              backgroundColor: categoryColors[key]
            }} />
            <span className="font-medium text-gray-700 truncate">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
