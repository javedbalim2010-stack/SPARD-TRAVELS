import React from 'react';
import { Plane, Calculator, Coins, History, ArrowLeftRight, FileText, Smartphone, Share2 } from 'lucide-react';

interface HeaderProps {
  activeTab: 'calculator' | 'currency' | 'history' | 'reverse';
  setActiveTab: (tab: 'calculator' | 'currency' | 'history' | 'reverse') => void;
  lang: 'bn' | 'en';
  setLang: (lang: 'bn' | 'en') => void;
  onOpenQuotation: () => void;
  onOpenInstallModal: () => void;
  onOpenShareModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  lang,
  setLang,
  onOpenQuotation,
  onOpenInstallModal,
  onOpenShareModal,
}) => {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-6 h-16">
          {/* Zone 1: Single text wordmark */}
          <div className="flex items-center gap-2.5 shrink-0">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-sm">
              <Plane className="w-5 h-5 -rotate-45" />
            </div>
            <button
              onClick={() => setActiveTab('calculator')}
              className="text-left group cursor-pointer"
            >
              <div className="text-base sm:text-lg font-bold tracking-tight text-slate-900 group-hover:text-emerald-700 transition-colors whitespace-nowrap">
                {lang === 'bn' ? 'ওমান ফেয়ার ক্যালকুলেটর' : 'Oman Fare Calculator'}
              </div>
              <div className="text-[11px] text-slate-500 hidden sm:block whitespace-nowrap">
                {lang === 'bn' ? 'এয়ারলাইন্স টিকেট ও ৭% কমিশন হিসাব' : 'Airline Ticket & 7% Commission Tool'}
              </div>
            </button>
          </div>

          {/* Zone 2: Clean single-line text navigation links */}
          <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-600">
            <button
              onClick={() => setActiveTab('calculator')}
              className={`flex items-center gap-2 transition-colors whitespace-nowrap shrink-0 pb-1 border-b-2 cursor-pointer ${
                activeTab === 'calculator'
                  ? 'border-emerald-600 text-emerald-700 font-semibold'
                  : 'border-transparent hover:text-slate-900'
              }`}
            >
              <Calculator className="w-4 h-4" />
              <span>{lang === 'bn' ? 'তাৎক্ষণিক ক্যালকুলেটর' : 'Instant Calculator'}</span>
            </button>

            <button
              onClick={() => setActiveTab('currency')}
              className={`flex items-center gap-2 transition-colors whitespace-nowrap shrink-0 pb-1 border-b-2 cursor-pointer ${
                activeTab === 'currency'
                  ? 'border-emerald-600 text-emerald-700 font-semibold'
                  : 'border-transparent hover:text-slate-900'
              }`}
            >
              <Coins className="w-4 h-4" />
              <span>{lang === 'bn' ? 'মুদ্রা রূপান্তর (BDT)' : 'Currency (BDT)'}</span>
            </button>

            <button
              onClick={() => setActiveTab('reverse')}
              className={`flex items-center gap-2 transition-colors whitespace-nowrap shrink-0 pb-1 border-b-2 cursor-pointer ${
                activeTab === 'reverse'
                  ? 'border-emerald-600 text-emerald-700 font-semibold'
                  : 'border-transparent hover:text-slate-900'
              }`}
            >
              <ArrowLeftRight className="w-4 h-4" />
              <span>{lang === 'bn' ? 'রিভার্স হিসাব' : 'Reverse Calc'}</span>
            </button>

            <button
              onClick={() => setActiveTab('history')}
              className={`flex items-center gap-2 transition-colors whitespace-nowrap shrink-0 pb-1 border-b-2 cursor-pointer ${
                activeTab === 'history'
                  ? 'border-emerald-600 text-emerald-700 font-semibold'
                  : 'border-transparent hover:text-slate-900'
              }`}
            >
              <History className="w-4 h-4" />
              <span>{lang === 'bn' ? 'পূর্ববর্তী হিসাব' : 'History'}</span>
            </button>
          </nav>

          {/* Zone 3: Primary action & Mobile Install Button & Share & language toggle */}
          <div className="flex items-center gap-2.5 shrink-0">
            <button
              onClick={onOpenShareModal}
              className="px-2.5 sm:px-3 py-1.5 sm:py-2 text-xs font-semibold rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-300 flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              title="ডিপ লিংক ও ছবি স্ন্যাপশট শেয়ার করুন"
            >
              <Share2 className="w-3.5 h-3.5 text-emerald-700" />
              <span className="hidden sm:inline">{lang === 'bn' ? 'শেয়ার ও লিংক' : 'Share & Link'}</span>
              <span className="sm:hidden">{lang === 'bn' ? 'শেয়ার' : 'Share'}</span>
            </button>

            <button
              onClick={onOpenInstallModal}
              className="px-2.5 sm:px-3 py-1.5 sm:py-2 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              title="মোবাইলে অ্যাপ ইনস্টল ও APK গাইড"
            >
              <Smartphone className="w-3.5 h-3.5 text-slate-600" />
              <span className="hidden sm:inline">{lang === 'bn' ? 'মোবাইলে ইনস্টল / APK' : 'Install App / APK'}</span>
              <span className="sm:hidden">{lang === 'bn' ? 'অ্যাপ' : 'App'}</span>
            </button>

            <button
              onClick={onOpenQuotation}
              className="px-3 py-1.5 sm:py-2 text-xs font-semibold text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 shadow-xs transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer"
            >
              <FileText className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{lang === 'bn' ? 'কোটেশন স্লিপ' : 'Quotation Slip'}</span>
              <span className="sm:hidden">{lang === 'bn' ? 'স্লিপ' : 'Slip'}</span>
            </button>

            <button
              onClick={() => setLang(lang === 'bn' ? 'en' : 'bn')}
              className="px-2 py-1.5 text-xs font-semibold rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              title="ভাষা পরিবর্তন করুন / Switch Language"
            >
              {lang === 'bn' ? 'English' : 'বাংলা'}
            </button>
          </div>
        </div>

        {/* Mobile Navigation bar */}
        <div className="lg:hidden flex items-center justify-around py-2 border-t border-slate-100 text-xs">
          <button
            onClick={() => setActiveTab('calculator')}
            className={`flex items-center gap-1 py-1 px-2 rounded-md ${
              activeTab === 'calculator' ? 'bg-emerald-50 text-emerald-700 font-semibold' : 'text-slate-600'
            }`}
          >
            <Calculator className="w-3.5 h-3.5" />
            <span>{lang === 'bn' ? 'ক্যালকুলেটর' : 'Calculator'}</span>
          </button>
          <button
            onClick={() => setActiveTab('currency')}
            className={`flex items-center gap-1 py-1 px-2 rounded-md ${
              activeTab === 'currency' ? 'bg-emerald-50 text-emerald-700 font-semibold' : 'text-slate-600'
            }`}
          >
            <Coins className="w-3.5 h-3.5" />
            <span>{lang === 'bn' ? 'টাকা' : 'BDT'}</span>
          </button>
          <button
            onClick={() => setActiveTab('reverse')}
            className={`flex items-center gap-1 py-1 px-2 rounded-md ${
              activeTab === 'reverse' ? 'bg-emerald-50 text-emerald-700 font-semibold' : 'text-slate-600'
            }`}
          >
            <ArrowLeftRight className="w-3.5 h-3.5" />
            <span>{lang === 'bn' ? 'রিভার্স' : 'Reverse'}</span>
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`flex items-center gap-1 py-1 px-2 rounded-md ${
              activeTab === 'history' ? 'bg-emerald-50 text-emerald-700 font-semibold' : 'text-slate-600'
            }`}
          >
            <History className="w-3.5 h-3.5" />
            <span>{lang === 'bn' ? 'হিস্ট্রি' : 'History'}</span>
          </button>
          <button
            onClick={onOpenInstallModal}
            className="flex items-center gap-1 py-1 px-2 rounded-md text-emerald-700 font-bold bg-emerald-50"
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>{lang === 'bn' ? 'ইনস্টল' : 'Install'}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
