'use client';

import { useMemo } from 'react';

interface AmountSliderProps {
  value: number;
  onChange: (amount: number) => void;
  min?: number;
  max?: number;
  className?: string;
}

// 金額ステップの配列を生成
const generateAmountSteps = () => {
  // 0～100円: 10円刻み (0, 10, 20, ..., 100)
  const lowRange = Array.from({ length: 11 }, (_, i) => i * 10);

  // 200～10000円: 100円刻み (200, 300, ..., 10000)
  const highRange = Array.from({ length: 99 }, (_, i) => (i + 2) * 100);

  return [...lowRange, ...highRange];
};

const AMOUNT_STEPS = generateAmountSteps();

export default function AmountSlider({
  value,
  onChange,
  min = 0,
  max = 10000,
  className = '',
}: AmountSliderProps) {
  // 現在の金額に最も近いステップのインデックスを取得
  const currentIndex = useMemo(() => {
    const validSteps = AMOUNT_STEPS.filter((step) => step >= min && step <= max);
    const closestStep = validSteps.reduce((prev, curr) => {
      return Math.abs(curr - value) < Math.abs(prev - value) ? curr : prev;
    });
    return AMOUNT_STEPS.indexOf(closestStep);
  }, [value, min, max]);

  // フィルタリングされたステップの範囲
  const minIndex = AMOUNT_STEPS.findIndex((step) => step >= min);
  const maxIndex = AMOUNT_STEPS.findIndex((step) => step > max) - 1;
  const validMaxIndex = maxIndex === -2 ? AMOUNT_STEPS.length - 1 : maxIndex;

  const handleChange = (index: number) => {
    const amount = AMOUNT_STEPS[index];
    if (amount >= min && amount <= max) {
      onChange(amount);
    }
  };

  // 刻みの区切りを表示するマークを計算
  const marks = useMemo(() => {
    const marksArray: { value: number; label: string }[] = [];
    
    // 0円
    marksArray.push({ value: 0, label: '¥0' });
    
    // 100円（10円刻みと100円刻みの境界）
    const hundredIndex = AMOUNT_STEPS.indexOf(100);
    if (hundredIndex !== -1 && hundredIndex <= validMaxIndex) {
      marksArray.push({ value: hundredIndex, label: '¥100' });
    }
    
    // 主要なマーク（1000円, 5000円, 10000円）
    [1000, 5000, 10000].forEach((amount) => {
      const index = AMOUNT_STEPS.indexOf(amount);
      if (index !== -1 && index >= minIndex && index <= validMaxIndex) {
        marksArray.push({
          value: index,
          label: `¥${(amount / 1000).toFixed(0)}k`,
        });
      }
    });
    
    return marksArray;
  }, [minIndex, validMaxIndex]);

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex justify-between items-center">
        <span className="text-xs font-bold text-gray-700">金額</span>
        <span className="text-lg font-bold text-gray-900">
          ¥{value.toLocaleString()}
        </span>
      </div>

      <div className="relative pt-2 pb-6">
        {/* スライダー本体 */}
        <input
          type="range"
          min={minIndex}
          max={validMaxIndex}
          step={1}
          value={currentIndex}
          onChange={(e) => handleChange(Number(e.target.value))}
          className="slider-input w-full h-2 rounded-lg appearance-none cursor-pointer bg-gray-200"
          style={{
            background: `linear-gradient(90deg, #06b6d4 0%, #6366f1 ${
              ((currentIndex - minIndex) / (validMaxIndex - minIndex)) * 100
            }%, #e6e9ee ${
              ((currentIndex - minIndex) / (validMaxIndex - minIndex)) * 100
            }%, #e6e9ee 100%)`,
          }}
        />

        {/* マーク表示 */}
        <div className="relative mt-2">
          {marks.map((mark) => (
            <div
              key={mark.value}
              className="absolute transform -translate-x-1/2"
              style={{
                left: `${
                  ((mark.value - minIndex) / (validMaxIndex - minIndex)) * 100
                }%`,
              }}
            >
              <div className="w-px h-2 bg-gray-300 mx-auto" />
              <span className="text-xs text-gray-500 whitespace-nowrap mt-1 block">
                {mark.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 刻み情報の表示 */}
      <div className="text-xs text-gray-500 space-y-0.5">
        <div>0～100円: 10円刻み</div>
        <div>100～10,000円: 100円刻み</div>
      </div>

      <style jsx>{`
        .slider-input::-webkit-slider-thumb {
          appearance: none;
          width: 22px;
          height: 22px;
          border-radius: 9999px;
          background: #ffffff;
          border: 3px solid #6366f1;
          cursor: pointer;
          box-shadow: 0 6px 16px rgba(99,102,241,0.18);
          transition: transform 0.15s ease, box-shadow 0.15s ease;
        }

        .slider-input::-webkit-slider-thumb:hover {
          transform: scale(1.05);
          box-shadow: 0 8px 20px rgba(99,102,241,0.22);
        }

        .slider-input::-webkit-slider-thumb:active {
          transform: scale(0.98);
        }

        .slider-input::-moz-range-thumb {
          width: 22px;
          height: 22px;
          border-radius: 9999px;
          background: #ffffff;
          border: 3px solid #6366f1;
          cursor: pointer;
          box-shadow: 0 6px 16px rgba(99,102,241,0.18);
          transition: transform 0.15s ease, box-shadow 0.15s ease;
        }

        .slider-input::-moz-range-thumb:hover {
          transform: scale(1.05);
          box-shadow: 0 8px 20px rgba(99,102,241,0.22);
        }

        .slider-input::-moz-range-thumb:active {
          transform: scale(0.98);
        }
      `}</style>
    </div>
  );
}
