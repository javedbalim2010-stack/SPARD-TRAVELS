import React, { useState } from 'react';
import { Smartphone, Download, Check, Copy, ExternalLink, X, ShieldCheck, Zap, Globe } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

interface MobileInstallModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: 'bn' | 'en';
}

export const MobileInstallModal: React.FC<MobileInstallModalProps> = ({
  isOpen,
  onClose,
  lang,
}) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [copiedLink, setCopiedLink] = useState(false);

  if (!isOpen) return null;

  const appUrl = window.location.origin;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(appUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2200);
  };

  const handleInstallClick = async () => {
    if (isInstallable) {
      await install();
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative bg-white rounded-2xl max-w-xl w-full shadow-2xl border border-slate-200 overflow-hidden my-8">
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold">
                {lang === 'bn' ? 'মোবাইলে ইনস্টল ও APK তৈরির গাইড' : 'Install on Mobile & APK Guide'}
              </h3>
              <p className="text-xs text-slate-300">
                {lang === 'bn' ? 'অ্যান্ড্রয়েড ও আইফোনে আসল অ্যাপের মতো ব্যবহার করুন' : 'Run as standalone app on Android & iOS'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 text-slate-800 text-xs sm:text-sm">
          {/* Quick Direct Install Button if supported */}
          {isInstallable && (
            <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div>
                <span className="font-bold text-emerald-900 text-sm block">
                  {lang === 'bn' ? 'তাৎক্ষণিক ১-ক্লিকে ইনস্টল:' : 'Instant 1-Click Install:'}
                </span>
                <span className="text-xs text-emerald-700">
                  {lang === 'bn'
                    ? 'আপনার ব্রাউজার সরাসরি অ্যাপটি হোম স্ক্রিনে ইনস্টল করতে প্রস্তুত।'
                    : 'Your browser is ready to install directly to home screen.'}
                </span>
              </div>
              <button
                onClick={handleInstallClick}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg shadow-sm flex items-center gap-2 cursor-pointer shrink-0"
              >
                <Download className="w-4 h-4" />
                <span>{lang === 'bn' ? 'এখনই ইনস্টল করুন' : 'Install Now'}</span>
              </button>
            </div>
          )}

          {/* Method 1: WebAPK (Direct Home Screen Install) */}
          <div className="space-y-2.5 p-4 rounded-xl border border-slate-200 bg-slate-50">
            <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm">
              <Zap className="w-4 h-4 text-emerald-600" />
              <span>
                {lang === 'bn' ? 'পদ্ধতি ১: ব্রাউজার থেকে সরাসরি অ্যাপ ইনস্টল (সবচেয়ে সহজ)' : 'Method 1: Direct Install (Easiest)'}
              </span>
            </div>
            <p className="text-slate-600 leading-relaxed text-xs">
              {lang === 'bn'
                ? 'অ্যান্ড্রয়েডে আলাদা কোনো APK ফাইল ডাউনলোডের ঝামেলা ছাড়াই গুগল ক্রোম (Chrome) স্বয়ংক্রিয়ভাবে এটিকে একটি আসল অ্যাপ (WebAPK) হিসেবে মোবাইলে সেটআপ করে দেয়:'
                : 'Google Chrome automatically turns this PWA into a native Android WebAPK without manual file management:'}
            </p>
            <ol className="list-decimal list-inside space-y-1 text-slate-700 text-xs font-medium pl-1">
              <li>
                {lang === 'bn'
                  ? 'মোবাইলের গুগল ক্রোম (Google Chrome) ব্রাউজারে এই অ্যাপের লিংকটি ওপেন করুন।'
                  : 'Open this app link in Google Chrome on your mobile phone.'}
              </li>
              <li>
                {lang === 'bn'
                  ? 'উপরে থাকা "ইনস্টল করুন" বাটনে চাপুন অথবা ব্রাউজারের ৩-ডট মেনুতে ক্লিক করুন।'
                  : 'Tap the "Install App" button or the 3-dots browser menu in Chrome.'}
              </li>
              <li>
                {lang === 'bn'
                  ? '"Install App" অথবা "Add to Home screen" নির্বাচন করুন।'
                  : 'Select "Install app" or "Add to Home screen".'}
              </li>
              <li>
                {lang === 'bn'
                  ? 'সাথে সাথে আপনার মোবাইলের অ্যাপ ড্রয়ার ও হোম স্ক্রিনে সুন্দর আইকনসহ অ্যাপটি চলে আসবে!'
                  : 'The app icon is added to your app drawer and home screen instantly!'}
              </li>
            </ol>
          </div>

          {/* Method 2: Generate .APK file via PWABuilder */}
          <div className="space-y-2.5 p-4 rounded-xl border border-slate-200 bg-slate-50">
            <div className="flex items-center gap-2 text-blue-900 font-bold text-sm">
              <Download className="w-4 h-4 text-blue-600" />
              <span>
                {lang === 'bn' ? 'পদ্ধতি ২: সরাসরি .APK ফাইল ডাউনলোড করতে চাইলে' : 'Method 2: Generate Downloadable .APK File'}
              </span>
            </div>
            <p className="text-slate-600 leading-relaxed text-xs">
              {lang === 'bn'
                ? 'যদি আপনি অফলাইনে ইনস্টল করার জন্য বা হোয়াটসঅ্যাপে ফাইল আকারে কাউকে দেওয়ার জন্য আসল .APK ফাইল তৈরি করতে চান:'
                : 'If you want a standalone .APK installation file to share via WhatsApp or install offline:'}
            </p>
            <ol className="list-decimal list-inside space-y-1.5 text-slate-700 text-xs font-medium pl-1">
              <li>
                {lang === 'bn'
                  ? 'প্রথমে নিচের বাটনে ক্লিক করে অ্যাপের লিংকটি কপি করুন।'
                  : 'Copy the app link using the button below.'}
              </li>
              <li>
                {lang === 'bn'
                  ? 'মাইক্রোসফটের অফিশিয়াল ও ফ্রি সাইট '
                  : 'Go to Microsoft\'s free open-source portal '}
                <a
                  href="https://www.pwabuilder.com"
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-600 underline font-bold inline-flex items-center gap-0.5"
                >
                  PWABuilder.com <ExternalLink className="w-3 h-3" />
                </a>{' '}
                {lang === 'bn' ? 'ভিজিট করুন।' : '.'}
              </li>
              <li>
                {lang === 'bn'
                  ? 'কপি করা লিংকটি পেস্ট করে "Start" দিন।'
                  : 'Paste your copied link and click "Start".'}
              </li>
              <li>
                {lang === 'bn'
                  ? '"Package for Android" বাটনে ক্লিক করে "Download APK" সিলেক্ট করলেই আপনার ফোনে আসল .APK ডাউনলোড হয়ে যাবে!'
                  : 'Click "Package for Android" and download the ready-to-install signed .APK file!'}
              </li>
            </ol>
          </div>

          {/* Copy Link Action */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-100">
            <div className="text-xs text-slate-500 truncate max-w-xs font-mono bg-slate-100 px-3 py-1.5 rounded-lg w-full sm:w-auto">
              {appUrl}
            </div>

            <button
              onClick={handleCopyLink}
              className={`w-full sm:w-auto px-4 py-2 rounded-lg font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                copiedLink
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-900 hover:bg-slate-800 text-white'
              }`}
            >
              {copiedLink ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span>{copiedLink ? (lang === 'bn' ? 'লিংক কপি হয়েছে!' : 'Link Copied!') : lang === 'bn' ? 'অ্যাপ লিংক কপি করুন' : 'Copy App Link'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
