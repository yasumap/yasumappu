// src/components/map/BenchReportModal.tsx
import React from 'react';

type Props = {
    isOpen: boolean;
    onClose: () => void;
    targetType: 'new' | 'existing' | null; // 新規か既存か
    onConfirm: () => void; // 実行ボタンが押された時
};

export default function BenchReportModal({
    isOpen, onClose, targetType, onConfirm
}: Props) {
    if (!isOpen || !targetType) return null;

    return (
        // Tailwind CSS v4記法
        <div className= "fixed inset-0 z-50 flex items-center justify-center bg-black/50" >
        <div className="bg-white p-6 rounded-xl shadow-xl w-80 max-w-full m-4" >
            <h3 className="text-lg font-bold mb-2 text-gray-800" >
                { targetType === 'new' ? '新しいベンチ' : 'ベンチの報告'
}
</h3>

    < p className = "mb-6 text-gray-600 text-sm" >
        { targetType === 'new'
        ? 'この場所にベンチがありますか？'
        : 'このベンチはもうありませんか？'}
</p>

    < div className = "flex flex-col gap-3" >
        <button 
            onClick={ onConfirm }
className = {`w-full py-2.5 px-4 rounded-lg font-medium text-white transition-colors
              ${targetType === 'new'
        ? 'bg-blue-600 hover:bg-blue-700'
        : 'bg-red-600 hover:bg-red-700'}`}
          >
    { targetType === 'new' ? 'ベンチを登録する' : '削除を報告する'}
</button>

    < button
onClick = { onClose }
className = "w-full py-2 px-4 text-gray-500 hover:text-gray-700 text-sm"
    >
    キャンセル
    </button>
    </div>
    </div>
    </div>
  );
}