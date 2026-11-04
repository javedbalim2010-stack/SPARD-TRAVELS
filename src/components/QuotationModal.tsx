import React, { useState } from 'react';
import { FareInputs, FareCalculationResult } from '../types/fare';
import { formatOMR, formatBDT } from '../utils/fareMath';
import { X, Printer, Copy, Check, Plane, Phone, Calendar, FileText } from 'lucide-react';

interface QuotationModalProps {
  isOpen: boolean;
  onClose: () => void;
  inputs: FareInputs;
  result: FareCalculationResult;
  lang: 'bn' | 'en';
}

export const QuotationModal: React.FC<QuotationModalProps> = ({
  isOpen,
  onClose,
  inputs,
  result,
  lang,
}) => {
  const [agencyName, setAgencyName] = useState('Al-Amana Travel & Tourism (Muscat & Dhaka)');
  const [agencyPhone, setAgencyPhone] = useState('+968 9123 4567 / +880 1712 345678');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const todayStr = new Date().toLocaleDateString(lang === 'bn' ? 'bn-BD' : 'en-GB', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  const handlePrint = () => {
    window.print();
  };

  const handleCopySummary = () => {
    const text = `
---------------------------------------------
${agencyName}
${agencyPhone}
---------------------------------------------
TICKET QUOTATION SLIP / টিকেট ফেয়ার স্লিপ
Date: ${todayStr}
Airline: ${inputs.airline || 'Oman Air'}
Route: ${inputs.route || 'MCT ➔ DAC'}
Passenger(s): ${inputs.passengerName || 'Valued Passenger'} (${result.passengerCount} Pax)
${inputs.pnr ? `PNR: ${inputs.pnr}` : ''}
Exchange Rate: 1 OMR = BDT ${result.exchangeRate}

Published Fare: ৳ ${formatBDT(result.publishedFareBDT)} (${formatOMR(result.publishedFareOMR)} OMR)
Base Fare: ৳ ${formatBDT(result.baseFareBDT)} (${formatOMR(result.baseFareOMR)} OMR)
Airline Commission (${result.commissionRate}%): -৳ ${formatBDT(result.commissionAmountBDT)} (-${formatOMR(result.commissionAmountOMR)} OMR)
Net Fare (After Commission): ৳ ${formatBDT(result.netFareBDT)} (${formatOMR(result.netFareOMR)} OMR)
Service Charge (1 OMR): +৳ ${formatBDT(result.serviceChargeBDT)} (+${formatOMR(result.serviceChargeOMR)} OMR)
=============================================
TOTAL PAYABLE: ৳ ${formatBDT(result.grandTotalSellingFareBDT)} (${formatOMR(result.grandTotalSellingFareOMR)} OMR)
(${result.omrRials} Rials ${result.omrBaisa} Baisa)
=============================================
Thank you!
    `.trim();

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden my-8">
        {/* Top Control Bar (Hidden on print) */}
        <div className="no-print bg-slate-100 px-6 py-3.5 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2 text-slate-800 font-bold text-sm">
            <FileText className="w-4 h-4 text-emerald-600" />
            <span>{lang === 'bn' ? 'অফিসিয়াল টিকেট কোটেশন স্লিপ' : 'Ticket Quotation Slip'}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopySummary}
              className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 flex items-center gap-1.5 cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? (lang === 'bn' ? 'কপি হয়েছে!' : 'Copied!') : lang === 'bn' ? 'টেক্সট কপি' : 'Copy'}</span>
            </button>

            <button
              onClick={handlePrint}
              className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>{lang === 'bn' ? 'প্রিন্ট / PDF' : 'Print / PDF'}</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Area */}
        <div className="p-6 sm:p-8 space-y-6 printable-slip bg-white text-slate-900">
          {/* Slip Header: Agency Branding */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-6 border-b border-slate-200">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Plane className="w-6 h-6 text-emerald-600 -rotate-45" />
                <input
                  type="text"
                  value={agencyName}
                  onChange={(e) => setAgencyName(e.target.value)}
                  className="font-extrabold text-xl sm:text-2xl text-slate-900 focus:outline-none focus:border-b border-emerald-600 w-full"
                  title="এজেন্সির নাম এডিট করুন"
                />
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <Phone className="w-3.5 h-3.5 text-slate-400" />
                <input
                  type="text"
                  value={agencyPhone}
                  onChange={(e) => setAgencyPhone(e.target.value)}
                  className="focus:outline-none focus:border-b border-slate-400 w-full"
                  title="মোবাইল নম্বর এডিট করুন"
                />
              </div>
            </div>

            <div className="text-right shrink-0 space-y-1">
              <span className="inline-block px-2.5 py-1 text-xs font-bold bg-emerald-50 text-emerald-800 rounded-md uppercase tracking-wider">
                {lang === 'bn' ? 'ফেয়ার কোটেশন স্লিপ' : 'Fare Quotation Slip'}
              </span>
              <div className="flex items-center sm:justify-end gap-1.5 text-xs text-slate-500">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <span>{todayStr}</span>
              </div>
              <div className="text-[11px] text-slate-500 font-semibold">
                রেট: ১ OMR = ৳ {result.exchangeRate}
              </div>
            </div>
          </div>

          {/* Passenger & Flight Details */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs">
            <div>
              <span className="text-slate-500 block text-[11px]">{lang === 'bn' ? 'এয়ারলাইন:' : 'Airline:'}</span>
              <span className="font-bold text-slate-800">{inputs.airline || 'Oman Air'}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[11px]">{lang === 'bn' ? 'ফ্লাইট রুট:' : 'Flight Route:'}</span>
              <span className="font-bold text-slate-800">{inputs.route || 'MCT ➔ DAC'}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[11px]">{lang === 'bn' ? 'যাত্রী:' : 'Passenger:'}</span>
              <span className="font-bold text-slate-800">
                {inputs.passengerName || (lang === 'bn' ? 'সম্মানিত যাত্রী' : 'Valued Passenger')}
              </span>
            </div>
            <div>
              <span className="text-slate-500 block text-[11px]">{lang === 'bn' ? 'টিকেট সংখ্যা:' : 'Quantity:'}</span>
              <span className="font-bold text-slate-800">{result.passengerCount} Pax</span>
            </div>
          </div>

          {/* Itemized Table showing both BDT and OMR */}
          <div className="border border-slate-200 rounded-xl overflow-hidden">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-100 text-slate-700 font-bold uppercase tracking-wider text-[11px] border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-4">{lang === 'bn' ? 'বিবরণ' : 'Description'}</th>
                  <th className="py-2.5 px-4 text-right">{lang === 'bn' ? 'বাংলা টাকায় (BDT)' : 'In BDT (৳)'}</th>
                  <th className="py-2.5 px-4 text-right">{lang === 'bn' ? 'ওমান রিয়ালে (OMR)' : 'In OMR'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr>
                  <td className="py-2.5 px-4 font-medium text-slate-800">
                    {lang === 'bn' ? 'পাবলিশ ফেয়ার (Gross Fare)' : 'Airline Published Fare'}
                  </td>
                  <td className="py-2.5 px-4 text-right font-bold font-tabular text-slate-900">
                    ৳ {formatBDT(result.publishedFareBDT)}
                  </td>
                  <td className="py-2.5 px-4 text-right font-semibold font-tabular text-slate-700">
                    {formatOMR(result.publishedFareOMR)} OMR
                  </td>
                </tr>

                <tr>
                  <td className="py-2.5 px-4 text-slate-700">
                    {lang === 'bn' ? 'বেস ফেয়ার (Base Fare Portion)' : 'Base Fare Portion'}
                  </td>
                  <td className="py-2.5 px-4 text-right font-semibold font-tabular text-slate-800">
                    ৳ {formatBDT(result.baseFareBDT)}
                  </td>
                  <td className="py-2.5 px-4 text-right font-semibold font-tabular text-slate-700">
                    {formatOMR(result.baseFareOMR)} OMR
                  </td>
                </tr>

                <tr className="bg-emerald-50/50">
                  <td className="py-2.5 px-4 text-emerald-900 font-medium">
                    {lang === 'bn' ? `এয়ারলাইন কমিশন (${result.commissionRate}%)` : `Airline Commission (${result.commissionRate}%)`}
                  </td>
                  <td className="py-2.5 px-4 text-right font-bold font-tabular text-emerald-700">
                    -৳ {formatBDT(result.commissionAmountBDT, true)}
                  </td>
                  <td className="py-2.5 px-4 text-right font-bold font-tabular text-emerald-700">
                    -{formatOMR(result.commissionAmountOMR)} OMR
                  </td>
                </tr>

                <tr className="bg-slate-50">
                  <td className="py-2.5 px-4 font-bold text-slate-900">
                    {lang === 'bn' ? 'নেট ফেয়ার (কমিশন বাদ দিয়ে)' : 'Net Fare (After Commission)'}
                  </td>
                  <td className="py-2.5 px-4 text-right font-bold font-tabular text-slate-900">
                    ৳ {formatBDT(result.netFareBDT, true)}
                  </td>
                  <td className="py-2.5 px-4 text-right font-bold font-tabular text-slate-900">
                    {formatOMR(result.netFareOMR)} OMR
                  </td>
                </tr>

                <tr>
                  <td className="py-2.5 px-4 text-blue-900 font-medium">
                    {lang === 'bn' ? `সার্ভিস চার্জ (${formatOMR(result.serviceChargeOMR)} ওমানি রিয়াল)` : `Service Charge (${formatOMR(result.serviceChargeOMR)} OMR)`}
                  </td>
                  <td className="py-2.5 px-4 text-right font-bold font-tabular text-blue-700">
                    +৳ {formatBDT(result.serviceChargeBDT, true)}
                  </td>
                  <td className="py-2.5 px-4 text-right font-bold font-tabular text-blue-700">
                    +{formatOMR(result.serviceChargeOMR)} OMR
                  </td>
                </tr>
              </tbody>

              <tfoot className="bg-slate-900 text-white font-bold">
                <tr>
                  <td className="py-3 px-4 text-sm sm:text-base">
                    {lang === 'bn' ? 'সর্বমোট প্রদেয় মূল্য:' : 'GRAND TOTAL PAYABLE:'}
                  </td>
                  <td className="py-3 px-4 text-right text-base sm:text-xl font-tabular text-emerald-300">
                    ৳ {formatBDT(result.grandTotalSellingFareBDT, true)}
                  </td>
                  <td className="py-3 px-4 text-right text-sm sm:text-base font-tabular text-white">
                    {formatOMR(result.grandTotalSellingFareOMR)} OMR
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Amount In Words & Equivalents */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs space-y-1.5">
            <div className="text-slate-800">
              <span className="font-bold">{lang === 'bn' ? 'ওমান রিয়ালে:' : 'In Omani Currency:'}</span>{' '}
              {result.omrRials} ওমানি রিয়াল এবং {result.omrBaisa} বাইসা মাত্র।
            </div>
            <div className="text-slate-600">
              <span className="font-bold">{lang === 'bn' ? 'এক্সচেঞ্জ রেট নোট:' : 'Conversion Note:'}</span>{' '}
              ১ ওমানি রিয়াল = ৳ {result.exchangeRate} হিসেবে হিসাব সম্পন্ন হয়েছে।
            </div>
          </div>

          {/* Slip Footer Notes */}
          <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-slate-500">
            <span>{lang === 'bn' ? '• এটি একটি কম্পিউটার জেনারেটেড কোটেশন স্লিপ।' : '• Computer generated quotation slip.'}</span>
            <span>{lang === 'bn' ? 'আপনার যাত্রা শুভ হোক!' : 'Have a safe flight!'}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
