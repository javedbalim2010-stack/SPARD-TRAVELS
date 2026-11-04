import React, { useState } from 'react';
import { FareInputs, FareCalculationResult, InputCurrency } from '../types/fare';
import {
  formatOMR,
  formatBDT,
  generateWhatsAppMessageBn,
  generateWhatsAppMessageEn,
} from '../utils/fareMath';
import {
  POPULAR_AIRLINES,
  POPULAR_ROUTES,
  DEFAULT_COMMISSION_PRESETS,
  DEFAULT_SERVICE_CHARGE_PRESETS,
} from '../data/airlinePresets';
import {
  Sparkles,
  Copy,
  Check,
  Share2,
  Printer,
  RotateCcw,
  BookmarkPlus,
  Users,
  Plane,
  ArrowRight,
  Calculator,
  Info,
  DollarSign,
  TrendingDown,
  Percent,
  Coins,
  ArrowRightLeft,
} from 'lucide-react';

interface FareCalculatorProps {
  inputs: FareInputs;
  setInputs: React.Dispatch<React.SetStateAction<FareInputs>>;
  result: FareCalculationResult;
  lang: 'bn' | 'en';
  onSaveHistory: () => void;
  onOpenQuotation: () => void;
  onOpenShareModal: () => void;
}

export const FareCalculator: React.FC<FareCalculatorProps> = ({
  inputs,
  setInputs,
  result,
  lang,
  onSaveHistory,
  onOpenQuotation,
  onOpenShareModal,
}) => {
  const [copied, setCopied] = useState(false);
  const [savedBadge, setSavedBadge] = useState(false);

  // Switch between OMR and BDT input modes with smart value conversion
  const handleCurrencyModeChange = (newCurrency: InputCurrency) => {
    if (newCurrency === inputs.inputCurrency) return;

    const rate = inputs.exchangeRate || 312;

    if (newCurrency === 'BDT') {
      // Switching from OMR to BDT -> convert current OMR figures to BDT
      setInputs((prev) => ({
        ...prev,
        inputCurrency: 'BDT',
        publishedFare: prev.publishedFare > 0 ? Math.round(prev.publishedFare * rate * 100) / 100 : 0,
        baseFare: prev.baseFare > 0 ? Math.round(prev.baseFare * rate * 100) / 100 : 0,
      }));
    } else {
      // Switching from BDT to OMR -> convert current BDT figures to OMR
      setInputs((prev) => ({
        ...prev,
        inputCurrency: 'OMR',
        publishedFare: prev.publishedFare > 0 ? Math.round((prev.publishedFare / rate) * 1000) / 1000 : 0,
        baseFare: prev.baseFare > 0 ? Math.round((prev.baseFare / rate) * 1000) / 1000 : 0,
      }));
    }
  };

  // Reset to original benchmark scenario (190 OMR / 90 OMR / 7% / 1 OMR)
  const handleResetBenchmark = () => {
    if (inputs.inputCurrency === 'BDT') {
      const rate = inputs.exchangeRate || 312;
      setInputs((prev) => ({
        ...prev,
        publishedFare: 190 * rate,
        baseFare: 90 * rate,
        commissionPercent: 7,
        serviceChargeOMR: 1,
        passengerCount: 1,
        airline: 'Oman Air',
        route: 'MCT ➔ DAC',
      }));
    } else {
      setInputs((prev) => ({
        ...prev,
        publishedFare: 190,
        baseFare: 90,
        commissionPercent: 7,
        serviceChargeOMR: 1,
        passengerCount: 1,
        airline: 'Oman Air',
        route: 'MCT ➔ DAC',
      }));
    }
  };

  const handleCopyWhatsApp = () => {
    const text =
      lang === 'bn'
        ? generateWhatsAppMessageBn(inputs, result)
        : generateWhatsAppMessageEn(inputs, result);

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  const handleSave = () => {
    onSaveHistory();
    setSavedBadge(true);
    setTimeout(() => setSavedBadge(false), 2000);
  };

  const isBdt = inputs.inputCurrency === 'BDT';

  return (
    <div className="space-y-6">
      {/* Top Banner Context & Currency Switcher */}
      <div className="bg-slate-900 text-white rounded-2xl p-4 sm:p-6 shadow-sm border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs text-emerald-400 font-semibold tracking-wide">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400"></span>
            <span>
              {isBdt
                ? lang === 'bn' ? 'বাংলাদেশি টাকা (BDT) মোডে সক্রিয়' : 'Bangladeshi Taka (BDT) Mode Active'
                : lang === 'bn' ? 'ওমান রিয়াল (OMR) মোডে সক্রিয়' : 'Omani Rial (OMR) Mode Active'}
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
            {lang === 'bn'
              ? isBdt
                ? 'বাংলা টাকায় ফেয়ার ইনপুট ও ওমানি ১ রিয়াল সার্ভিস চার্জ হিসাব'
                : 'পাবলিশ ফেয়ার থেকে ৭% কমিশন বাদ ও সার্ভিস চার্জ হিসাব'
              : 'Airline Net Fare & 7% Commission Calculator'}
          </h2>
          <p className="text-sm text-slate-300 max-w-2xl">
            {lang === 'bn'
              ? isBdt
                ? 'বাংলা টাকায় পাবলিশ ও বেস ফেয়ার বসান; ৭% কমিশন বাদ দিয়ে নেট ফেয়ার বের হবে এবং সেট করা রেটে ১ ওমানি রিয়াল সার্ভিস চার্জ টাকায় যোগ হয়ে মোট প্রদেয় বের হবে।'
                : 'ওমান রিয়ালে পাবলিশ ও বেস ফেয়ার বসানোর সাথে সাথে স্বয়ংক্রিয়ভাবে ৭% কমিশন বাদ দিয়ে নেট ফেয়ার এবং ১ ওমানি রিয়াল সার্ভিস চার্জ যোগ হয়ে মোট মূল্য দেখাবে।'
              : 'Enter fares in BDT or OMR. It automatically deducts 7% commission from base fare, calculates net fare, and adds 1 OMR service charge.'}
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => handleCurrencyModeChange(isBdt ? 'OMR' : 'BDT')}
            className="px-3 py-2 text-xs font-bold rounded-xl bg-emerald-600/30 hover:bg-emerald-600/50 text-emerald-300 border border-emerald-500/40 transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
            title="মুদ্রা পরিবর্তন করুন (তথ্য অক্ষুণ্ণ থাকবে)"
          >
            <ArrowRightLeft className="w-3.5 h-3.5" />
            <span>{isBdt ? '🇴🇲 OMR মোড' : '🇧🇩 BDT মোড'}</span>
          </button>

          <button
            onClick={handleResetBenchmark}
            className="px-3.5 py-2 text-xs font-semibold rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
            title="১৯০ ও ৯০ রিয়ালের মূল মানে সেট করুন"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{lang === 'bn' ? 'রিসেট' : 'Reset'}</span>
          </button>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Input Form (6/12) */}
        <div className="lg:col-span-6 bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-xs space-y-5">
          {/* Currency Mode Selection with Interactive Toggle Switch */}
          <div className="space-y-3 pb-4 border-b border-slate-200">
            {/* Modern Toggle Switch Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 bg-slate-50 border border-slate-200 rounded-xl">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <Coins className="w-4 h-4 text-emerald-600" />
                  <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                    {lang === 'bn' ? 'কারেন্সি টগল সুইচ (OMR ⇄ BDT)' : 'Currency Toggle Switch'}
                  </span>
                  <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-100/70 border border-emerald-300 px-1.5 py-0.2 rounded-full">
                    {lang === 'bn' ? 'তথ্য সংরক্ষিত থাকে' : 'Data Preserved'}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500">
                  {lang === 'bn'
                    ? `সুইচ অন/অফ করে সহজেই ওমান রিয়াল ও টাকার ইনপুট পরিবর্তন করুন (কোনো ডাটা মুছবে না)।`
                    : `Toggle to switch between OMR and BDT inputs instantly without losing your entered figures.`}
                </p>
              </div>

              {/* Interactive Toggle Switch */}
              <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto bg-white p-1 rounded-xl border border-slate-200 shadow-2xs">
                <button
                  type="button"
                  onClick={() => handleCurrencyModeChange('OMR')}
                  className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                    !isBdt
                      ? 'bg-emerald-600 text-white shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  🇴🇲 OMR
                </button>

                {/* Toggle Slide Track */}
                <button
                  type="button"
                  role="switch"
                  aria-checked={isBdt}
                  onClick={() => handleCurrencyModeChange(isBdt ? 'OMR' : 'BDT')}
                  className={`relative inline-flex h-6 w-12 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:ring-offset-1 ${
                    isBdt ? 'bg-emerald-600' : 'bg-slate-300'
                  }`}
                  title={isBdt ? 'ওমান রিয়ালে স্যুইচ করুন' : 'বাংলা টাকায় স্যুইচ করুন'}
                >
                  <span className="sr-only">Toggle between OMR and BDT</span>
                  <span
                    aria-hidden="true"
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md transition duration-200 ease-in-out flex items-center justify-center text-[10px] font-bold ${
                      isBdt ? 'translate-x-6 text-emerald-700' : 'translate-x-0 text-slate-700'
                    }`}
                  >
                    {isBdt ? '৳' : '﷼'}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => handleCurrencyModeChange('BDT')}
                  className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                    isBdt
                      ? 'bg-emerald-600 text-white shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  🇧🇩 BDT (৳)
                </button>
              </div>
            </div>

            {/* Exchange Rate Setting Bar (Crucial for user request: "যেমন আমি সেট করে দেবো এক ওমানি রিয়াল কত") */}
            <div className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-emerald-900 flex items-center gap-1">
                  <ArrowRightLeft className="w-3.5 h-3.5 text-emerald-700" />
                  <span>{lang === 'bn' ? '১ ওমানি রিয়াল (OMR) =' : '1 Omani Rial (OMR) ='}</span>
                </span>
                <div className="relative">
                  <span className="absolute left-2.5 top-1/2 -translate-y-1/2 font-bold text-slate-500 text-xs">
                    ৳
                  </span>
                  <input
                    type="number"
                    step="0.5"
                    min="1"
                    value={inputs.exchangeRate}
                    onChange={(e) =>
                      setInputs((prev) => ({
                        ...prev,
                        exchangeRate: parseFloat(e.target.value) || 1,
                      }))
                    }
                    className="w-24 pl-6 pr-2 py-1 text-sm font-bold font-tabular bg-white border border-emerald-300 rounded-lg focus:outline-none focus:border-emerald-600 text-slate-900 text-right shadow-2xs"
                  />
                </div>
                <span className="text-xs font-semibold text-emerald-900">টাকা (BDT)</span>
              </div>

              {/* Quick rate presets */}
              <div className="flex items-center gap-1 text-[11px]">
                <span className="text-emerald-700">{lang === 'bn' ? 'রেট:' : 'Rate:'}</span>
                {[310, 312, 315, 320].map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setInputs((p) => ({ ...p, exchangeRate: r }))}
                    className={`px-1.5 py-0.5 rounded border text-[11px] font-semibold cursor-pointer transition-colors ${
                      inputs.exchangeRate === r
                        ? 'bg-emerald-700 text-white border-emerald-700'
                        : 'bg-white text-emerald-900 border-emerald-200 hover:bg-emerald-100'
                    }`}
                  >
                    {r}৳
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* 1. Published Fare Input */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label
                htmlFor="publishedFareInput"
                className="text-sm font-semibold text-slate-800 flex items-center gap-1.5"
              >
                <span>{lang === 'bn' ? '১. পাবলিশ ফেয়ার (Published Fare)' : '1. Published Fare (Gross)'}</span>
                <span className="text-emerald-700 font-bold">*</span>
              </label>
              <span className="text-xs text-slate-500">
                {isBdt ? 'বাংলা টাকায় মোট ফেয়ার' : 'ওমান রিয়ালে মূল ফেয়ার'}
              </span>
            </div>

            <div className="relative">
              {isBdt && (
                <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-slate-500 text-lg">
                  ৳
                </span>
              )}
              <input
                id="publishedFareInput"
                type="number"
                step={isBdt ? '1' : '0.001'}
                min="0"
                value={inputs.publishedFare === 0 ? '' : inputs.publishedFare}
                onChange={(e) =>
                  setInputs((prev) => ({
                    ...prev,
                    publishedFare: e.target.value === '' ? 0 : parseFloat(e.target.value) || 0,
                  }))
                }
                placeholder={isBdt ? '59280' : '190.000'}
                className={`w-full text-2xl font-bold font-tabular text-slate-900 pr-16 py-3.5 bg-slate-50 focus:bg-white border-2 border-slate-200 focus:border-emerald-600 focus:outline-none rounded-xl transition-all ${
                  isBdt ? 'pl-9' : 'pl-4'
                }`}
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 font-bold text-slate-400 text-sm">
                {isBdt ? 'BDT' : 'OMR'}
              </span>
            </div>

            {/* Live Dual Currency Equivalent */}
            <div className="text-xs text-slate-500 flex items-center justify-between px-1">
              <span>
                {isBdt ? (
                  <>
                    {lang === 'bn' ? 'ওমান রিয়ালে রূপান্তর:' : 'In Omani Rials:'}{' '}
                    <strong className="text-slate-800 font-tabular">{formatOMR(result.publishedFareOMR)} OMR</strong>
                  </>
                ) : (
                  <>
                    {lang === 'bn' ? 'বাংলা টাকায় রূপান্তর:' : 'In BDT:'}{' '}
                    <strong className="text-slate-800 font-tabular">৳ {formatBDT(result.publishedFareBDT)}</strong>
                  </>
                )}
              </span>

              {/* Quick presets for published fare */}
              <div className="flex items-center gap-1 text-[11px]">
                {isBdt
                  ? [45000, 50000, 59280, 65000].map((v) => (
                      <button
                        key={v}
                        type="button"
                        onClick={() => setInputs((p) => ({ ...p, publishedFare: v }))}
                        className="px-1.5 py-0.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded border border-slate-200 cursor-pointer"
                      >
                        {formatBDT(v)}৳
                      </button>
                    ))
                  : [150, 180, 190, 210].map((v) => (
                      <button
                        key={v}
                        type="button"
                        onClick={() => setInputs((p) => ({ ...p, publishedFare: v }))}
                        className="px-1.5 py-0.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded border border-slate-200 cursor-pointer"
                      >
                        {v} OMR
                      </button>
                    ))}
              </div>
            </div>
          </div>

          {/* 2. Base Fare Input */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label
                htmlFor="baseFareInput"
                className="text-sm font-semibold text-slate-800 flex items-center gap-1.5"
              >
                <span>{lang === 'bn' ? '২. বেস ফেয়ার (Base Fare)' : '2. Base Fare'}</span>
                <span className="text-emerald-700 font-bold">*</span>
              </label>
              <span className="text-xs text-emerald-700 font-medium">
                {lang === 'bn' ? 'যার উপর ৭% কমিশন হিসাব হবে' : '7% commission applies to this'}
              </span>
            </div>

            <div className="relative">
              {isBdt && (
                <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-slate-500 text-lg">
                  ৳
                </span>
              )}
              <input
                id="baseFareInput"
                type="number"
                step={isBdt ? '1' : '0.001'}
                min="0"
                value={inputs.baseFare === 0 ? '' : inputs.baseFare}
                onChange={(e) =>
                  setInputs((prev) => ({
                    ...prev,
                    baseFare: e.target.value === '' ? 0 : parseFloat(e.target.value) || 0,
                  }))
                }
                placeholder={isBdt ? '28080' : '90.000'}
                className={`w-full text-2xl font-bold font-tabular text-slate-900 pr-16 py-3.5 bg-slate-50 focus:bg-white border-2 border-slate-200 focus:border-emerald-600 focus:outline-none rounded-xl transition-all ${
                  isBdt ? 'pl-9' : 'pl-4'
                }`}
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 font-bold text-slate-400 text-sm">
                {isBdt ? 'BDT' : 'OMR'}
              </span>
            </div>

            {/* Live Dual Currency Equivalent */}
            <div className="text-xs text-slate-500 flex items-center justify-between px-1">
              <span>
                {isBdt ? (
                  <>
                    {lang === 'bn' ? 'ওমান রিয়ালে রূপান্তর:' : 'In OMR:'}{' '}
                    <strong className="text-slate-800 font-tabular">{formatOMR(result.baseFareOMR)} OMR</strong>
                  </>
                ) : (
                  <>
                    {lang === 'bn' ? 'বাংলা টাকায় রূপান্তর:' : 'In BDT:'}{' '}
                    <strong className="text-slate-800 font-tabular">৳ {formatBDT(result.baseFareBDT)}</strong>
                  </>
                )}
              </span>

              {/* Quick presets for base fare */}
              <div className="flex items-center gap-1 text-[11px]">
                {isBdt
                  ? [20000, 25000, 28080, 35000].map((v) => (
                      <button
                        key={v}
                        type="button"
                        onClick={() => setInputs((p) => ({ ...p, baseFare: v }))}
                        className="px-1.5 py-0.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded border border-slate-200 cursor-pointer"
                      >
                        {formatBDT(v)}৳
                      </button>
                    ))
                  : [60, 75, 90, 110].map((v) => (
                      <button
                        key={v}
                        type="button"
                        onClick={() => setInputs((p) => ({ ...p, baseFare: v }))}
                        className="px-1.5 py-0.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded border border-slate-200 cursor-pointer"
                      >
                        {v} OMR
                      </button>
                    ))}
              </div>
            </div>
          </div>

          {/* Two-Column split: Commission % & Service Charge (1 OMR in BDT) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Commission % */}
            <div className="space-y-2 p-3.5 bg-slate-50 rounded-xl border border-slate-200">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="commissionPercentInput"
                  className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1"
                >
                  <Percent className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{lang === 'bn' ? '৩. কমিশন হার (%)' : '3. Commission (%)'}</span>
                </label>
              </div>

              <div className="relative">
                <input
                  id="commissionPercentInput"
                  type="number"
                  step="0.1"
                  min="0"
                  max="100"
                  value={inputs.commissionPercent}
                  onChange={(e) =>
                    setInputs((prev) => ({
                      ...prev,
                      commissionPercent: parseFloat(e.target.value) || 0,
                    }))
                  }
                  className="w-full text-lg font-bold font-tabular text-slate-900 pl-3 pr-10 py-2 bg-white border border-slate-300 focus:border-emerald-600 focus:outline-none rounded-lg"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 font-bold text-slate-400 text-xs">
                  %
                </span>
              </div>

              <div className="flex items-center gap-1 flex-wrap pt-1">
                {DEFAULT_COMMISSION_PRESETS.map((pct) => (
                  <button
                    key={pct}
                    type="button"
                    onClick={() => setInputs((p) => ({ ...p, commissionPercent: pct }))}
                    className={`px-2 py-1 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                      inputs.commissionPercent === pct
                        ? 'bg-emerald-700 text-white shadow-xs'
                        : 'bg-white hover:bg-slate-200 text-slate-700 border border-slate-200'
                    }`}
                  >
                    {pct}%
                  </button>
                ))}
              </div>
            </div>

            {/* Service Charge (1 Omani Rial) */}
            <div className="space-y-2 p-3.5 bg-slate-50 rounded-xl border border-slate-200">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="serviceChargeInput"
                  className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1"
                >
                  <DollarSign className="w-3.5 h-3.5 text-blue-600" />
                  <span>{lang === 'bn' ? '৪. ওমানি সার্ভিস চার্জ' : '4. Service Charge (OMR)'}</span>
                </label>
              </div>

              <div className="relative">
                <input
                  id="serviceChargeInput"
                  type="number"
                  step="0.1"
                  min="0"
                  value={inputs.serviceChargeOMR}
                  onChange={(e) =>
                    setInputs((prev) => ({
                      ...prev,
                      serviceChargeOMR: parseFloat(e.target.value) || 0,
                    }))
                  }
                  className="w-full text-lg font-bold font-tabular text-slate-900 pl-3 pr-14 py-2 bg-white border border-slate-300 focus:border-blue-600 focus:outline-none rounded-lg"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 font-bold text-slate-400 text-xs">
                  OMR
                </span>
              </div>

              {/* Converted in BDT tag */}
              <div className="text-[11px] font-semibold text-blue-800 flex items-center justify-between">
                <span>{lang === 'bn' ? 'বাংলা টাকায় মান:' : 'In BDT:'}</span>
                <span className="font-tabular font-bold">
                  +৳ {formatBDT(result.serviceChargeBDT, true)}
                </span>
              </div>

              <div className="flex items-center gap-1 flex-wrap pt-0.5">
                {DEFAULT_SERVICE_CHARGE_PRESETS.map((chg) => (
                  <button
                    key={chg}
                    type="button"
                    onClick={() => setInputs((p) => ({ ...p, serviceChargeOMR: chg }))}
                    className={`px-2 py-0.5 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                      inputs.serviceChargeOMR === chg
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'bg-white hover:bg-slate-200 text-slate-700 border border-slate-200'
                    }`}
                  >
                    {chg === 0 ? '০ OMR' : `+${chg} OMR`}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Passenger count and Airline details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
            {/* Passenger Count */}
            <div className="space-y-1.5">
              <label
                htmlFor="passengerCountSelect"
                className="text-xs font-semibold text-slate-700 flex items-center gap-1.5"
              >
                <Users className="w-3.5 h-3.5 text-slate-500" />
                <span>{lang === 'bn' ? 'যাত্রী সংখ্যা (Pax):' : 'Passenger Count:'}</span>
              </label>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4].map((count) => (
                  <button
                    key={count}
                    type="button"
                    onClick={() => setInputs((p) => ({ ...p, passengerCount: count }))}
                    className={`flex-1 py-1.5 text-xs font-semibold rounded-lg border transition-colors cursor-pointer ${
                      inputs.passengerCount === count
                        ? 'bg-slate-900 text-white border-slate-900'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    {count} {lang === 'bn' ? 'জন' : 'pax'}
                  </button>
                ))}
                <input
                  id="passengerCountSelect"
                  type="number"
                  min="1"
                  max="100"
                  value={inputs.passengerCount}
                  onChange={(e) =>
                    setInputs((p) => ({ ...p, passengerCount: parseInt(e.target.value) || 1 }))
                  }
                  className="w-14 py-1.5 px-2 text-center text-xs font-bold border border-slate-200 rounded-lg focus:outline-none focus:border-slate-800"
                  title="কাস্টম যাত্রী সংখ্যা"
                />
              </div>
            </div>

            {/* Airline Selector */}
            <div className="space-y-1.5">
              <label
                htmlFor="airlineSelect"
                className="text-xs font-semibold text-slate-700 flex items-center gap-1.5"
              >
                <Plane className="w-3.5 h-3.5 text-slate-500" />
                <span>{lang === 'bn' ? 'এয়ারলাইন:' : 'Airline:'}</span>
              </label>
              <select
                id="airlineSelect"
                value={inputs.airline}
                onChange={(e) => {
                  const selected = POPULAR_AIRLINES.find((a) => a.name === e.target.value);
                  setInputs((p) => ({
                    ...p,
                    airline: e.target.value,
                    commissionPercent: selected ? selected.defaultCommission : p.commissionPercent,
                  }));
                }}
                className="w-full text-xs font-medium py-2 px-3 bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-emerald-600"
              >
                {POPULAR_AIRLINES.map((airline) => (
                  <option key={airline.code} value={airline.name}>
                    {lang === 'bn' ? airline.nameBn : airline.name} ({airline.defaultCommission}%)
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Route & Passenger Name */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div>
              <label
                htmlFor="routeInput"
                className="text-[11px] font-semibold text-slate-600 block mb-1"
              >
                {lang === 'bn' ? 'ফ্লাইট রুট:' : 'Flight Route:'}
              </label>
              <input
                id="routeInput"
                type="text"
                value={inputs.route}
                onChange={(e) => setInputs((p) => ({ ...p, route: e.target.value }))}
                placeholder="MCT ➔ DAC"
                list="popular-routes-list-calc"
                className="w-full text-xs px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:border-slate-400"
              />
              <datalist id="popular-routes-list-calc">
                {POPULAR_ROUTES.map((r) => (
                  <option key={r.value} value={r.value} />
                ))}
              </datalist>
            </div>

            <div>
              <label
                htmlFor="passengerNameInput"
                className="text-[11px] font-semibold text-slate-600 block mb-1"
              >
                {lang === 'bn' ? 'যাত্রীর নাম (ঐচ্ছিক):' : 'Passenger Name:'}
              </label>
              <input
                id="passengerNameInput"
                type="text"
                value={inputs.passengerName || ''}
                onChange={(e) => setInputs((p) => ({ ...p, passengerName: e.target.value }))}
                placeholder={lang === 'bn' ? 'যেমন: মোহাম্মদ আরিফ' : 'e.g. Mohammad Arif'}
                className="w-full text-xs px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:border-slate-400"
              />
            </div>
          </div>
        </div>

        {/* Right Column: Instant Calculation & Real-Time Breakdown (6/12) */}
        <div className="lg:col-span-6 space-y-4">
          {/* Hero Result Card: Dual Currency Display */}
          <div className="bg-gradient-to-br from-emerald-700 via-emerald-800 to-teal-900 text-white rounded-2xl p-6 shadow-md relative overflow-hidden">
            <div className="absolute top-0 right-0 -mt-6 -mr-6 w-32 h-32 bg-white/10 rounded-full blur-2xl pointer-events-none" />

            <div className="flex items-center justify-between text-xs text-emerald-200 pb-3 border-b border-emerald-600/60">
              <span className="font-semibold tracking-wide uppercase">
                {lang === 'bn'
                  ? isBdt
                    ? 'সর্বমোট প্রদেয় মূল্য (বাংলা টাকায়)'
                    : 'সর্বমোট প্রদেয় মূল্য (ওমান রিয়ালে)'
                  : 'Final Customer Selling Fare'}
              </span>
              <span className="bg-emerald-600/60 px-2 py-0.5 rounded text-[11px] font-medium">
                {inputs.passengerCount > 1
                  ? `${inputs.passengerCount} ${lang === 'bn' ? 'জন যাত্রী' : 'Pax'}`
                  : lang === 'bn' ? '১ জন যাত্রী' : '1 Pax'}
              </span>
            </div>

            {/* Giant Instant Number in Chosen Currency */}
            <div className="mt-4 mb-1 flex items-baseline gap-2 flex-wrap">
              {isBdt ? (
                <>
                  <span className="text-4xl sm:text-5xl font-extrabold tracking-tight font-tabular">
                    ৳ {formatBDT(result.grandTotalSellingFareBDT)}
                  </span>
                  <span className="text-xl sm:text-2xl font-bold text-emerald-200">BDT</span>
                </>
              ) : (
                <>
                  <span className="text-4xl sm:text-5xl font-extrabold tracking-tight font-tabular">
                    {formatOMR(result.grandTotalSellingFareOMR)}
                  </span>
                  <span className="text-xl sm:text-2xl font-bold text-emerald-200">OMR</span>
                </>
              )}
            </div>

            {/* Dual Currency Sub-Display (The other currency right underneath) */}
            <div className="p-3 bg-emerald-950/40 rounded-xl border border-emerald-600/40 mt-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <span className="text-[11px] text-emerald-300 block">
                  {isBdt
                    ? lang === 'bn' ? 'সমপরিমাণ ওমানি রিয়াল ও বাইসা:' : 'Equivalent in OMR:'
                    : lang === 'bn' ? 'সমপরিমাণ বাংলাদেশি টাকা:' : 'Equivalent in BDT:'}
                </span>
                <span className="text-lg font-bold font-tabular text-white">
                  {isBdt
                    ? `${formatOMR(result.grandTotalSellingFareOMR)} OMR (${result.omrRials} রিয়াল ${result.omrBaisa} বাইসা)`
                    : `৳ ${formatBDT(result.grandTotalSellingFareBDT)}`}
                </span>
              </div>

              <div className="text-right sm:text-right text-[11px] text-emerald-200">
                <span>১ OMR = ৳ {inputs.exchangeRate}</span>
              </div>
            </div>

            {/* Formula verification tag */}
            <div className="mt-2 text-[11px] text-emerald-200/90 bg-emerald-950/20 rounded-lg p-2 flex items-center gap-2">
              <Info className="w-3.5 h-3.5 text-emerald-300 shrink-0" />
              <span>
                {isBdt
                  ? `নেট ফেয়ার (৳ ${formatBDT(result.netFareBDT)}) + ১ ওমানি রিয়াল সার্ভিস চার্জ (৳ ${formatBDT(result.serviceChargeBDT)}) = ৳ ${formatBDT(result.finalSellingFareBDT)}`
                  : `নেট ফেয়ার (${formatOMR(result.netFareOMR)}) + ১ রিয়াল সার্ভিস চার্জ (${formatOMR(result.serviceChargeOMR)}) = ${formatOMR(result.finalSellingFareOMR)} OMR`}
              </span>
            </div>
          </div>

          {/* Detailed Dual-Currency Audit Breakdown Card */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h4 className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                {lang === 'bn' ? 'ধাপে ধাপে হিসাবের পূর্ণ বিবরণ' : 'Itemized Calculation Audit'}
              </h4>
              <div className="text-[11px] font-bold flex items-center gap-3 text-slate-500">
                <span>টাকায় (BDT)</span>
                <span>রিয়ালে (OMR)</span>
              </div>
            </div>

            <div className="divide-y divide-slate-100 text-xs sm:text-sm">
              {/* Row 1: Published Fare */}
              <div className="py-2.5 flex items-center justify-between">
                <span className="text-slate-700 flex items-center gap-2">
                  <span className="w-5 h-5 rounded-md bg-slate-100 text-slate-700 flex items-center justify-center text-[10px] font-bold">1</span>
                  <span>{lang === 'bn' ? 'পাবলিশ ফেয়ার (Gross)' : 'Published Fare'}</span>
                </span>
                <div className="text-right flex items-center gap-3">
                  <span className="font-bold text-slate-900 font-tabular">
                    ৳ {formatBDT(result.publishedFareBDT)}
                  </span>
                  <span className="font-medium text-slate-500 font-tabular text-xs w-20 text-right">
                    {formatOMR(result.publishedFareOMR)} OMR
                  </span>
                </div>
              </div>

              {/* Row 2: Base Fare */}
              <div className="py-2.5 flex items-center justify-between">
                <span className="text-slate-700 flex items-center gap-2">
                  <span className="w-5 h-5 rounded-md bg-slate-100 text-slate-700 flex items-center justify-center text-[10px] font-bold">2</span>
                  <span>{lang === 'bn' ? 'বেস ফেয়ার (Base Fare)' : 'Base Fare'}</span>
                </span>
                <div className="text-right flex items-center gap-3">
                  <span className="font-semibold text-slate-800 font-tabular">
                    ৳ {formatBDT(result.baseFareBDT)}
                  </span>
                  <span className="font-medium text-slate-500 font-tabular text-xs w-20 text-right">
                    {formatOMR(result.baseFareOMR)} OMR
                  </span>
                </div>
              </div>

              {/* Row 3: 7% Commission */}
              <div className="py-2.5 flex items-center justify-between bg-emerald-50/60 -mx-2 px-2 rounded-lg">
                <span className="text-emerald-900 flex items-center gap-2 font-medium">
                  <span className="w-5 h-5 rounded-md bg-emerald-100 text-emerald-800 flex items-center justify-center text-[10px] font-bold">3</span>
                  <span>{lang === 'bn' ? `এয়ারলাইন কমিশন (${result.commissionRate}%)` : `Commission (${result.commissionRate}%)`}</span>
                </span>
                <div className="text-right flex items-center gap-3">
                  <span className="font-bold text-emerald-700 font-tabular">
                    -৳ {formatBDT(result.commissionAmountBDT, true)}
                  </span>
                  <span className="font-bold text-emerald-600 font-tabular text-xs w-20 text-right">
                    -{formatOMR(result.commissionAmountOMR)} OMR
                  </span>
                </div>
              </div>

              {/* Row 4: Net Fare */}
              <div className="py-2.5 flex items-center justify-between bg-slate-50 -mx-2 px-2 rounded-lg">
                <span className="text-slate-900 flex items-center gap-2 font-bold">
                  <span className="w-5 h-5 rounded-md bg-slate-200 text-slate-800 flex items-center justify-center text-[10px] font-bold">4</span>
                  <span>{lang === 'bn' ? 'নেট ফেয়ার (কমিশন বাদ দিয়ে)' : 'Net Fare (After Commission)'}</span>
                </span>
                <div className="text-right flex items-center gap-3">
                  <span className="font-bold text-slate-900 font-tabular">
                    ৳ {formatBDT(result.netFareBDT, true)}
                  </span>
                  <span className="font-bold text-slate-700 font-tabular text-xs w-20 text-right">
                    {formatOMR(result.netFareOMR)} OMR
                  </span>
                </div>
              </div>

              {/* Row 5: 1 OMR Service Charge in BDT */}
              <div className="py-2.5 flex items-center justify-between">
                <span className="text-blue-900 flex items-center gap-2 font-medium">
                  <span className="w-5 h-5 rounded-md bg-blue-100 text-blue-800 flex items-center justify-center text-[10px] font-bold">5</span>
                  <span>
                    {lang === 'bn'
                      ? `সার্ভিস চার্জ (${formatOMR(result.serviceChargeOMR)} ওমানি রিয়াল)`
                      : `Service Charge (${formatOMR(result.serviceChargeOMR)} OMR)`}
                  </span>
                </span>
                <div className="text-right flex items-center gap-3">
                  <span className="font-bold text-blue-700 font-tabular">
                    +৳ {formatBDT(result.serviceChargeBDT, true)}
                  </span>
                  <span className="font-bold text-blue-600 font-tabular text-xs w-20 text-right">
                    +{formatOMR(result.serviceChargeOMR)} OMR
                  </span>
                </div>
              </div>

              {/* Row 6: Grand Total */}
              <div className="pt-3 pb-1 flex items-center justify-between">
                <span className="text-slate-900 font-extrabold flex items-center gap-2">
                  <ArrowRight className="w-4 h-4 text-emerald-600" />
                  <span>{lang === 'bn' ? 'সর্বমোট বিক্রয়মূল্য:' : 'Final Selling Price:'}</span>
                </span>
                <div className="text-right flex items-center gap-3">
                  <span className="font-black text-emerald-700 font-tabular text-lg">
                    ৳ {formatBDT(result.finalSellingFareBDT, true)}
                  </span>
                  <span className="font-extrabold text-emerald-800 font-tabular text-sm w-20 text-right">
                    {formatOMR(result.finalSellingFareOMR)} OMR
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Stats: Tax & Customer Savings */}
            <div className="mt-3 pt-3 border-t border-slate-100 grid grid-cols-2 gap-3 text-xs">
              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                <span className="text-slate-500 block text-[11px]">
                  {lang === 'bn' ? 'ট্যাক্স ও ফি (পাবলিশ - বেস):' : 'Taxes & Airline Surcharges:'}
                </span>
                <span className="font-bold text-slate-800 font-tabular text-sm">
                  ৳ {formatBDT(result.taxesAndFeesBDT)}
                </span>
                <span className="text-[10px] text-slate-500 block">
                  ({formatOMR(result.taxesAndFeesOMR)} OMR)
                </span>
              </div>

              <div className="bg-emerald-50/60 p-2.5 rounded-xl border border-emerald-100">
                <span className="text-emerald-800 block text-[11px] font-medium">
                  {lang === 'bn' ? 'কাস্টমার ডিসকাউন্ট পাচ্ছেন:' : 'Customer Discount:'}
                </span>
                <span className="font-bold text-emerald-700 font-tabular text-sm">
                  ৳ {formatBDT(result.customerSavingsBDT)}
                </span>
                <span className="text-[10px] text-emerald-700 block">
                  ({formatOMR(result.customerSavingsOMR)} OMR)
                </span>
              </div>
            </div>
          </div>

          {/* Action Toolbar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
            <button
              onClick={onOpenShareModal}
              className="px-3 py-2.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center gap-1.5 shadow-xs transition-colors cursor-pointer"
              title="ডিপ লিংক ও ছবি স্ন্যাপশট শেয়ার করুন"
            >
              <Share2 className="w-4 h-4 text-emerald-100" />
              <span>{lang === 'bn' ? 'শেয়ার ও লিংক' : 'Share & Link'}</span>
            </button>

            <button
              onClick={handleCopyWhatsApp}
              className={`px-3 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                copied
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200'
              }`}
              title="হোয়াটসঅ্যাপের জন্য টেক্সট কপি করুন"
            >
              {copied ? <Check className="w-4 h-4 text-white" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? (lang === 'bn' ? 'কপি হয়েছে!' : 'Copied!') : lang === 'bn' ? 'কপি টেক্সট' : 'Copy Text'}</span>
            </button>

            <button
              onClick={onOpenQuotation}
              className="px-3 py-2.5 rounded-xl text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-white flex items-center justify-center gap-1.5 shadow-xs transition-colors cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>{lang === 'bn' ? 'প্রিন্ট স্লিপ' : 'Print Slip'}</span>
            </button>

            <button
              onClick={handleSave}
              className={`px-3 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                savedBadge
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200'
              }`}
            >
              <BookmarkPlus className="w-4 h-4" />
              <span>{savedBadge ? (lang === 'bn' ? 'সংরক্ষিত!' : 'Saved!') : lang === 'bn' ? 'সংরক্ষণ' : 'Save'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
