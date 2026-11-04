/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { FareInputs, HistoryItem } from './types/fare';
import { calculateFare } from './utils/fareMath';
import { Header } from './components/Header';
import { FareCalculator } from './components/FareCalculator';
import { CurrencyConverter } from './components/CurrencyConverter';
import { ReverseCalculator } from './components/ReverseCalculator';
import { CalculationHistory } from './components/CalculationHistory';
import { QuotationModal } from './components/QuotationModal';
import { MobileInstallModal } from './components/MobileInstallModal';
import { ShareModal } from './components/ShareModal';
import { parseDeepLink } from './utils/deepLink';
import {
  HelpCircle,
  Plane,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  Coins,
  Link as LinkIcon,
  X,
} from 'lucide-react';

const STORAGE_KEY_HISTORY = 'oman_airline_fare_calc_history_v2';

export default function App() {
  const [lang, setLang] = useState<'bn' | 'en'>('bn');
  const [activeTab, setActiveTab] = useState<'calculator' | 'currency' | 'history' | 'reverse'>('calculator');
  const [isQuotationOpen, setIsQuotationOpen] = useState(false);
  const [isInstallModalOpen, setIsInstallModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [deepLinkLoaded, setDeepLinkLoaded] = useState(false);
  const [faqOpen, setFaqOpen] = useState(false);

  // Core Inputs State initialized with user's exact scenario:
  // Published Fare: 190 OMR, Base Fare: 90 OMR, Commission: 7%, Service Charge: 1 OMR, Exchange Rate: 312 BDT/OMR
  const [inputs, setInputs] = useState<FareInputs>({
    inputCurrency: 'OMR',
    exchangeRate: 312,
    publishedFare: 190,
    baseFare: 90,
    commissionPercent: 7,
    serviceChargeOMR: 1,
    passengerCount: 1,
    airline: 'Oman Air',
    route: 'MCT ➔ DAC',
    passengerName: '',
    pnr: '',
    notes: '',
  });

  // History state
  const [history, setHistory] = useState<HistoryItem[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_HISTORY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // Save history to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_HISTORY, JSON.stringify(history));
    } catch {
      // Storage unavailable
    }
  }, [history]);

  // Restore state from deep link URL if parameters exist
  useEffect(() => {
    const parsed = parseDeepLink();
    if (parsed) {
      setInputs((prev) => ({
        ...prev,
        ...parsed,
      }));
      setDeepLinkLoaded(true);
    }
  }, []);

  // Dynamic calculations in real-time
  const result = calculateFare(inputs);

  const handleSaveToHistory = () => {
    const newItem: HistoryItem = {
      id: Date.now().toString() + Math.random().toString(36).substring(2, 6),
      timestamp: Date.now(),
      inputs: { ...inputs },
      result: { ...result },
    };
    setHistory((prev) => [newItem, ...prev.slice(0, 49)]); // keep up to 50
  };

  const handleLoadHistoryItem = (item: HistoryItem) => {
    setInputs(item.inputs);
    setActiveTab('calculator');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteHistoryItem = (id: string) => {
    setHistory((prev) => prev.filter((item) => item.id !== id));
  };

  const handleClearHistory = () => {
    if (
      window.confirm(
        lang === 'bn'
          ? 'আপনি কি সব সংরক্ষিত হিসাব মুছে ফেলতে চান?'
          : 'Are you sure you want to clear all history?'
      )
    ) {
      setHistory([]);
    }
  };

  const handleApplyReverse = (published: number, base: number) => {
    setInputs((prev) => ({
      ...prev,
      publishedFare: published,
      baseFare: base,
    }));
    setActiveTab('calculator');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      {/* 3-Zone Top Navigation Bar */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        lang={lang}
        setLang={setLang}
        onOpenQuotation={() => setIsQuotationOpen(true)}
        onOpenInstallModal={() => setIsInstallModalOpen(true)}
        onOpenShareModal={() => setIsShareModalOpen(true)}
      />

      {/* Main Viewport Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-8">
        {/* Deep Link Loaded Alert Banner */}
        {deepLinkLoaded && (
          <div className="bg-emerald-50 border border-emerald-300 rounded-2xl p-4 flex items-center justify-between gap-3 text-xs shadow-xs">
            <div className="flex items-center gap-2.5 text-emerald-900 font-semibold">
              <LinkIcon className="w-4 h-4 text-emerald-700 shrink-0" />
              <span>
                {lang === 'bn'
                  ? '🔗 শেয়ার করা লাইভ কোটেশন লিংক থেকে সমস্ত ফেয়ার তথ্য সফলভাবে লোড হয়েছে!'
                  : '🔗 Fare quotation successfully loaded from shared deep link!'}
              </span>
            </div>
            <button
              onClick={() => setDeepLinkLoaded(false)}
              className="p-1 rounded-lg text-emerald-700 hover:text-emerald-900 hover:bg-emerald-100 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Active Tab Views */}
        {activeTab === 'calculator' && (
          <FareCalculator
            inputs={inputs}
            setInputs={setInputs}
            result={result}
            lang={lang}
            onSaveHistory={handleSaveToHistory}
            onOpenQuotation={() => setIsQuotationOpen(true)}
            onOpenShareModal={() => setIsShareModalOpen(true)}
          />
        )}

        {activeTab === 'currency' && (
          <CurrencyConverter
            currentOmr={result.grandTotalSellingFareOMR}
            lang={lang}
            bdtRate={inputs.exchangeRate}
            setBdtRate={(rate) => setInputs((p) => ({ ...p, exchangeRate: rate }))}
          />
        )}

        {activeTab === 'reverse' && (
          <ReverseCalculator lang={lang} onApplyToMain={handleApplyReverse} />
        )}

        {activeTab === 'history' && (
          <CalculationHistory
            history={history}
            onLoadItem={handleLoadHistoryItem}
            onDeleteItem={handleDeleteHistoryItem}
            onClearAll={handleClearHistory}
            lang={lang}
            onGoToCalculator={() => setActiveTab('calculator')}
          />
        )}

        {/* Informational Guidance Accordion: Understanding the Math */}
        <section className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-xs space-y-4">
          <button
            onClick={() => setFaqOpen(!faqOpen)}
            className="w-full flex items-center justify-between text-left cursor-pointer group"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
                <HelpCircle className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-sm sm:text-base font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                  {lang === 'bn'
                    ? 'বাংলা টাকা ও ওমানি রিয়াল কনভার্সন ও কমিশন গণনার নিয়মাবলী'
                    : 'BDT & OMR Currency Conversion and Fare Calculation Guide'}
                </h4>
                <p className="text-xs text-slate-500">
                  {lang === 'bn'
                    ? 'বাংলা টাকায় ফেয়ার দিলে কীভাবে অটোমেটিক ওমান রিয়ালে কনভার্ট হয় এবং ১ ওমানি রিয়াল সার্ভিস চার্জ যোগ হয়।'
                    : 'How BDT fares convert automatically to OMR and add 1 OMR service charge.'}
                </p>
              </div>
            </div>
            <div className="p-1 rounded-lg text-slate-400 group-hover:text-slate-600">
              {faqOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            </div>
          </button>

          {faqOpen && (
            <div className="pt-4 border-t border-slate-100 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="space-y-1.5 p-3.5 bg-slate-50 rounded-xl">
                <div className="font-bold text-slate-900 flex items-center gap-1.5">
                  <Coins className="w-4 h-4 text-emerald-600" />
                  <span>
                    {lang === 'bn' ? '১. বাংলা টাকায় সরাসরি ইনপুট' : '1. Direct BDT Input'}
                  </span>
                </div>
                <p className="text-slate-600 leading-relaxed">
                  {lang === 'bn'
                    ? 'আপনি "বাংলা টাকা (BDT ৳)" মোড নির্বাচন করে সরাসরি টাকায় পাবলিশ ফেয়ার ও বেস ফেয়ার লিখতে পারেন। অ্যাপটি আপনার সেট করা এক্সচেঞ্জ রেট (যেমন ১ রিয়াল = ৩১২ টাকা) দিয়ে স্বয়ংক্রিয়ভাবে ওমানি রিয়ালেও সমপরিমাণ বের করবে।'
                    : 'Select "Bangladeshi Taka (BDT ৳)" mode to type fares directly in BDT. The app uses your custom exchange rate (e.g. 1 OMR = 312 BDT) to calculate equivalent OMR figures instantaneously.'}
                </p>
              </div>

              <div className="space-y-1.5 p-3.5 bg-slate-50 rounded-xl">
                <div className="font-bold text-slate-900 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>
                    {lang === 'bn' ? '২. ৭% কমিশন ও নেট ফেয়ার' : '2. 7% Commission & Net Fare'}
                  </span>
                </div>
                <p className="text-slate-600 leading-relaxed">
                  {lang === 'bn'
                    ? 'আইএটিএ ও এয়ারলাইন্স নিয়মে বেস ফেয়ারের উপর ৭% কমিশন পাওয়া যায়। পাবলিশ ফেয়ার থেকে এই ৭% কমিশন বাদ দিয়ে নেট ফেয়ার তৈরি হয় (টাকায় এবং রিয়ালে উভয়টিতেই)।'
                    : 'Per airline regulations, 7% commission is calculated on base fare. Deducting this from published fare yields the exact net airline payable fare in both BDT and OMR.'}
                </p>
              </div>

              <div className="space-y-1.5 p-3.5 bg-slate-50 rounded-xl">
                <div className="font-bold text-slate-900 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>
                    {lang === 'bn' ? '৩. ১ ওমানি রিয়াল সার্ভিস চার্জ' : '3. 1 OMR Service Charge in BDT'}
                  </span>
                </div>
                <p className="text-slate-600 leading-relaxed">
                  {lang === 'bn'
                    ? 'টাকায় নেট ফেয়ার বের হওয়ার পর আপনার নির্ধারিত ১ ওমানি রিয়াল (যেমন ৩১২ টাকা) সার্ভিস চার্জ হিসেবে স্বয়ংক্রিয়ভাবে যোগ হয়ে বাংলা টাকায় এবং ওমান রিয়ালে মোট চূড়ান্ত মূল্য প্রদর্শন করে।'
                    : 'After computing the net fare in BDT, 1 OMR service charge (converted at 312 BDT) is seamlessly added to yield the grand total customer payable fare.'}
                </p>
              </div>
            </div>
          )}
        </section>
      </main>

      {/* Quotation Slip Modal */}
      <QuotationModal
        isOpen={isQuotationOpen}
        onClose={() => setIsQuotationOpen(false)}
        inputs={inputs}
        result={result}
        lang={lang}
      />

      {/* Mobile Install & APK Guide Modal */}
      <MobileInstallModal
        isOpen={isInstallModalOpen}
        onClose={() => setIsInstallModalOpen(false)}
        lang={lang}
      />

      {/* Share & Deep Link Modal */}
      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        inputs={inputs}
        result={result}
        lang={lang}
      />

      {/* Clean Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 text-center text-xs text-slate-500 no-print">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 font-medium text-slate-700">
            <Plane className="w-4 h-4 text-emerald-600" />
            <span>Airline Fare & Commission Engine (OMR ⇄ BDT)</span>
          </div>
          <div className="text-slate-400">
            {lang === 'bn'
              ? 'বাংলা টাকা ও ওমান রিয়াল (OMR) এয়ারলাইন্স টিকেট ও ৭% কমিশন হিসাব'
              : 'Bangladeshi Taka (BDT) & Oman Rial (OMR) Airline Ticketing Tool'}
          </div>
        </div>
      </footer>
    </div>
  );
}
