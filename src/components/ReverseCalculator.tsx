import React, { useState } from 'react';
import { formatOMR } from '../utils/fareMath';
import { ArrowLeftRight, Check, HelpCircle, ArrowRight } from 'lucide-react';

interface ReverseCalculatorProps {
  lang: 'bn' | 'en';
  onApplyToMain: (published: number, base: number) => void;
}

export const ReverseCalculator: React.FC<ReverseCalculatorProps> = ({
  lang,
  onApplyToMain,
}) => {
  // Mode 1: Target Customer Price -> What should Net Fare be?
  const [targetSellingPrice, setTargetSellingPrice] = useState<number>(184.700);
  const [targetServiceCharge, setTargetServiceCharge] = useState<number>(1.000);

  // Mode 2: Known Published Fare & Known Net Fare -> What was the Base Fare? (at 7% commission)
  const [knownPublished, setKnownPublished] = useState<number>(190);
  const [knownNet, setKnownNet] = useState<number>(183.7);
  const [knownCommRate, setKnownCommRate] = useState<number>(7);

  // Calculations
  const calculatedNetFare = Math.max(0, targetSellingPrice - targetServiceCharge);

  // Commission Amount = Published - Net
  const diffCommission = Math.max(0, knownPublished - knownNet);
  // If Commission Amount = BaseFare * (commRate / 100), then:
  // BaseFare = Commission Amount / (commRate / 100)
  const calculatedBaseFare =
    knownCommRate > 0 ? (diffCommission / (knownCommRate / 100)) : 0;

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-6">
        <div>
          <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <ArrowLeftRight className="w-5 h-5 text-emerald-600" />
            <span>{lang === 'bn' ? 'রিভার্স ফেয়ার ক্যালকুলেটর (উল্টো হিসাব)' : 'Reverse Fare Calculator'}</span>
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            {lang === 'bn'
              ? 'কাঙ্ক্ষিত বিক্রয়মূল্য বা নেট ফেয়ার থেকে বেস ফেয়ার এবং লাভ নির্ণয় করার স্মার্ট টুল।'
              : 'Work backwards from target customer selling price or net fare to determine base fare and commission.'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card 1: Target Price to Required Net Fare */}
          <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                {lang === 'bn' ? 'কাস্টমার বাজেট ➔ প্রয়োজনীয় নেট ফেয়ার' : 'Target Price ➔ Required Net Fare'}
              </span>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  {lang === 'bn' ? 'কাস্টমারের কাছে কাঙ্ক্ষিত মোট মূল্য (OMR):' : 'Desired Customer Price (OMR):'}
                </label>
                <input
                  type="number"
                  step="0.001"
                  value={targetSellingPrice}
                  onChange={(e) => setTargetSellingPrice(parseFloat(e.target.value) || 0)}
                  className="w-full text-lg font-bold font-tabular text-slate-900 px-3 py-2 bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-emerald-600"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  {lang === 'bn' ? 'আপনার সার্ভিস চার্জ (OMR):' : 'Your Service Charge (OMR):'}
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={targetServiceCharge}
                  onChange={(e) => setTargetServiceCharge(parseFloat(e.target.value) || 0)}
                  className="w-full text-lg font-bold font-tabular text-slate-900 px-3 py-2 bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-emerald-600"
                />
              </div>

              <div className="bg-emerald-100/70 p-3.5 rounded-lg border border-emerald-200">
                <span className="text-xs text-emerald-800 block font-medium">
                  {lang === 'bn' ? 'সর্বোচ্চ যে নেট ফেয়ারে টিকেট ইস্যু করতে হবে:' : 'Maximum Airline Net Fare to Issue:'}
                </span>
                <span className="text-2xl font-black text-emerald-900 font-tabular">
                  {formatOMR(calculatedNetFare)} OMR
                </span>
                <span className="text-[11px] text-emerald-700 block mt-1">
                  ({formatOMR(targetSellingPrice)} - {formatOMR(targetServiceCharge)} = {formatOMR(calculatedNetFare)})
                </span>
              </div>
            </div>
          </div>

          {/* Card 2: Known Published & Net -> What was the Base Fare? */}
          <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                {lang === 'bn' ? 'নেট ও পাবলিশ ফেয়ার থেকে বেস ফেয়ার নির্ণয়' : 'Find Base Fare from Net & Published'}
              </span>
            </div>

            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    {lang === 'bn' ? 'পাবলিশ ফেয়ার:' : 'Published Fare:'}
                  </label>
                  <input
                    type="number"
                    step="0.001"
                    value={knownPublished}
                    onChange={(e) => setKnownPublished(parseFloat(e.target.value) || 0)}
                    className="w-full text-base font-bold font-tabular text-slate-900 px-3 py-2 bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-emerald-600"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    {lang === 'bn' ? 'নেট ফেয়ার:' : 'Net Fare:'}
                  </label>
                  <input
                    type="number"
                    step="0.001"
                    value={knownNet}
                    onChange={(e) => setKnownNet(parseFloat(e.target.value) || 0)}
                    className="w-full text-base font-bold font-tabular text-slate-900 px-3 py-2 bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-emerald-600"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  {lang === 'bn' ? 'কমিশন শতকরা হার (%):' : 'Commission Rate (%):'}
                </label>
                <input
                  type="number"
                  step="0.5"
                  value={knownCommRate}
                  onChange={(e) => setKnownCommRate(parseFloat(e.target.value) || 0)}
                  className="w-full text-base font-bold font-tabular text-slate-900 px-3 py-2 bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-emerald-600"
                />
              </div>

              <div className="bg-slate-900 text-white p-3.5 rounded-lg border border-slate-800 space-y-2">
                <div>
                  <span className="text-xs text-slate-300 block">
                    {lang === 'bn' ? 'বের হওয়া বেস ফেয়ার (Base Fare):' : 'Calculated Base Fare:'}
                  </span>
                  <span className="text-2xl font-black text-emerald-400 font-tabular">
                    {formatOMR(calculatedBaseFare)} OMR
                  </span>
                </div>

                <div className="text-[11px] text-slate-300 pt-1 border-t border-slate-700">
                  {lang === 'bn'
                    ? `কমিশন পরিমাণ: ${formatOMR(diffCommission)} OMR`
                    : `Commission Amount: ${formatOMR(diffCommission)} OMR`}
                </div>

                <button
                  onClick={() => onApplyToMain(knownPublished, Math.round(calculatedBaseFare * 1000) / 1000)}
                  className="w-full py-1.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-md flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>{lang === 'bn' ? 'মূল ক্যালকুলেটরে প্রয়োগ করুন' : 'Apply to Main Calculator'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
