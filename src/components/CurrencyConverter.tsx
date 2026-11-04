import React, { useState } from 'react';
import { formatOMR } from '../utils/fareMath';
import { Coins, RefreshCw, ArrowRightLeft, DollarSign } from 'lucide-react';

interface CurrencyConverterProps {
  currentOmr: number;
  lang: 'bn' | 'en';
  bdtRate: number;
  setBdtRate: (rate: number) => void;
}

interface CurrencyRow {
  code: string;
  nameBn: string;
  nameEn: string;
  symbol: string;
  defaultRate: number;
}

const CURRENCIES: CurrencyRow[] = [
  { code: 'BDT', nameBn: 'বাংলাদেশি টাকা', nameEn: 'Bangladeshi Taka', symbol: '৳', defaultRate: 312 },
  { code: 'USD', nameBn: 'মার্কিন ডলার', nameEn: 'US Dollar', symbol: '$', defaultRate: 2.60 },
  { code: 'AED', nameBn: 'ইউএই দিরহাম', nameEn: 'UAE Dirham', symbol: 'AED', defaultRate: 9.54 },
  { code: 'SAR', nameBn: 'সৌদি রিয়াল', nameEn: 'Saudi Riyal', symbol: 'SAR', defaultRate: 9.74 },
  { code: 'INR', nameBn: 'ভারতীয় রুপি', nameEn: 'Indian Rupee', symbol: '₹', defaultRate: 217.5 },
  { code: 'PKR', nameBn: 'পাকিস্তানি রুপি', nameEn: 'Pakistani Rupee', symbol: '₨', defaultRate: 725 },
];

export const CurrencyConverter: React.FC<CurrencyConverterProps> = ({
  currentOmr,
  lang,
  bdtRate,
  setBdtRate,
}) => {
  const [inputOmr, setInputOmr] = useState<number>(currentOmr);
  const [rates, setRates] = useState<Record<string, number>>({
    BDT: bdtRate,
    USD: 2.60,
    AED: 9.54,
    SAR: 9.74,
    INR: 217.5,
    PKR: 725,
  });

  const handleRateChange = (code: string, newRate: number) => {
    setRates((prev) => ({ ...prev, [code]: newRate }));
    if (code === 'BDT') {
      setBdtRate(newRate);
    }
  };

  const handleUseCurrentCalc = () => {
    setInputOmr(currentOmr);
  };

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Coins className="w-5 h-5 text-emerald-600" />
            <span>{lang === 'bn' ? 'ওমান রিয়াল (OMR) মুদ্রা রূপান্তরকারী' : 'OMR Currency Converter'}</span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            {lang === 'bn'
              ? 'টিকেট মূল্যের ওমানি রিয়াল অন্যান্য দেশের মুদ্রায় রূপান্তর করুন।'
              : 'Convert your ticket fare in Omani Rials to foreign currencies.'}
          </p>
        </div>

        <button
          onClick={handleUseCurrentCalc}
          className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1.5 transition-colors cursor-pointer self-start sm:self-auto"
        >
          <ArrowRightLeft className="w-3.5 h-3.5" />
          <span>{lang === 'bn' ? 'বর্তমান হিসাব লোড করুন' : 'Load Current Total'} ({formatOMR(currentOmr)} OMR)</span>
        </button>
      </div>

      {/* Main OMR Input */}
      <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 space-y-2">
        <label htmlFor="omrAmountInput" className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
          {lang === 'bn' ? 'রূপান্তর করতে ইচ্ছুক ওমান রিয়াল (OMR)' : 'Omani Rial Amount to Convert (OMR)'}
        </label>
        <div className="relative">
          <input
            id="omrAmountInput"
            type="number"
            step="0.001"
            min="0"
            value={inputOmr === 0 ? '' : inputOmr}
            onChange={(e) => setInputOmr(parseFloat(e.target.value) || 0)}
            className="w-full text-2xl font-bold font-tabular text-slate-900 pl-4 pr-16 py-3 bg-white border border-slate-300 rounded-xl focus:outline-none focus:border-emerald-600 shadow-2xs"
            placeholder="184.700"
          />
          <span className="absolute right-4 top-1/2 -translate-y-1/2 font-bold text-slate-400 text-sm">
            OMR
          </span>
        </div>
      </div>

      {/* Conversion Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {CURRENCIES.map((cur) => {
          const rate = rates[cur.code] || cur.defaultRate;
          const converted = Math.round(inputOmr * rate * 100) / 100;
          const formatted = new Intl.NumberFormat('en-IN', {
            maximumFractionDigits: cur.code === 'USD' ? 2 : 0,
          }).format(converted);

          const isBdt = cur.code === 'BDT';

          return (
            <div
              key={cur.code}
              className={`p-4 rounded-xl border transition-all ${
                isBdt
                  ? 'bg-emerald-50/70 border-emerald-300 shadow-2xs'
                  : 'bg-white border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <span className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
                  <span className="w-6 h-6 rounded bg-slate-100 text-slate-800 flex items-center justify-center text-xs font-extrabold">
                    {cur.symbol}
                  </span>
                  <span>{cur.code}</span>
                </span>
                <span className="text-xs text-slate-500">
                  {lang === 'bn' ? cur.nameBn : cur.nameEn}
                </span>
              </div>

              {/* Converted Amount */}
              <div className="py-3">
                <span className="text-2xl font-extrabold text-slate-900 font-tabular">
                  {cur.symbol} {formatted}
                </span>
              </div>

              {/* Exchange Rate modifier */}
              <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-100">
                <span className="text-slate-500">
                  1 OMR = {cur.symbol}
                </span>
                <input
                  type="number"
                  step="0.01"
                  value={rate}
                  onChange={(e) => handleRateChange(cur.code, parseFloat(e.target.value) || 0)}
                  className="w-20 text-right py-0.5 px-1.5 border border-slate-300 rounded text-xs font-bold font-tabular bg-white focus:outline-none focus:border-emerald-600"
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
