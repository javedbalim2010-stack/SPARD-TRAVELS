import React from 'react';
import { HistoryItem } from '../types/fare';
import { formatOMR, formatBDT } from '../utils/fareMath';
import { History, Trash2, ArrowUpRight, Download, Calendar, Users, Plane } from 'lucide-react';

interface CalculationHistoryProps {
  history: HistoryItem[];
  onLoadItem: (item: HistoryItem) => void;
  onDeleteItem: (id: string) => void;
  onClearAll: () => void;
  lang: 'bn' | 'en';
  onGoToCalculator: () => void;
}

export const CalculationHistory: React.FC<CalculationHistoryProps> = ({
  history,
  onLoadItem,
  onDeleteItem,
  onClearAll,
  lang,
  onGoToCalculator,
}) => {
  const handleExportCSV = () => {
    if (history.length === 0) return;

    const headers = [
      'Date',
      'Input Currency',
      'Exchange Rate (BDT/OMR)',
      'Airline',
      'Route',
      'Passenger',
      'Pax Count',
      'Published Fare (BDT)',
      'Published Fare (OMR)',
      'Base Fare (BDT)',
      'Base Fare (OMR)',
      'Commission %',
      'Commission Amount (BDT)',
      'Commission Amount (OMR)',
      'Net Fare (BDT)',
      'Net Fare (OMR)',
      'Service Charge (BDT)',
      'Service Charge (OMR)',
      'Grand Total (BDT)',
      'Grand Total (OMR)',
    ];

    const rows = history.map((item) => [
      new Date(item.timestamp).toISOString(),
      item.inputs.inputCurrency || 'OMR',
      item.result.exchangeRate,
      `"${item.inputs.airline || 'Airline'}"`,
      `"${item.inputs.route || ''}"`,
      `"${item.inputs.passengerName || ''}"`,
      item.result.passengerCount,
      item.result.publishedFareBDT.toFixed(2),
      item.result.publishedFareOMR.toFixed(3),
      item.result.baseFareBDT.toFixed(2),
      item.result.baseFareOMR.toFixed(3),
      item.result.commissionRate,
      item.result.commissionAmountBDT.toFixed(2),
      item.result.commissionAmountOMR.toFixed(3),
      item.result.netFareBDT.toFixed(2),
      item.result.netFareOMR.toFixed(3),
      item.result.serviceChargeBDT.toFixed(2),
      item.result.serviceChargeOMR.toFixed(3),
      item.result.grandTotalSellingFareBDT.toFixed(2),
      item.result.grandTotalSellingFareOMR.toFixed(3),
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `ticket_fare_calculation_history_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <History className="w-5 h-5 text-emerald-600" />
            <span>{lang === 'bn' ? 'সংরক্ষিত হিসাবের তালিকা' : 'Saved Calculation History'}</span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            {lang === 'bn'
              ? 'বাংলা টাকা ও ওমানি রিয়ালে সংরক্ষিত টিকিটের হিসাবের বিস্তারিত রেকর্ড।'
              : 'Detailed records of ticket fare calculations in BDT & OMR.'}
          </p>
        </div>

        {history.length > 0 && (
          <div className="flex items-center gap-2">
            <button
              onClick={handleExportCSV}
              className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{lang === 'bn' ? 'CSV ডাউনলোড' : 'Export CSV'}</span>
            </button>
            <button
              onClick={onClearAll}
              className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>{lang === 'bn' ? 'সব মুছুন' : 'Clear All'}</span>
            </button>
          </div>
        )}
      </div>

      {/* History Items or Empty State */}
      {history.length === 0 ? (
        <div className="text-center py-12 px-4 space-y-3">
          <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
            <History className="w-6 h-6" />
          </div>
          <h4 className="text-sm font-bold text-slate-700">
            {lang === 'bn' ? 'এখনও কোনো হিসাব সংরক্ষিত নেই' : 'No calculations saved yet'}
          </h4>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            {lang === 'bn'
              ? 'ক্যালকুলেটরে হিসাব করার পর "সংরক্ষণ" বাটনে ক্লিক করলে তা এখানে স্থায়ীভাবে সংরক্ষিত থাকবে।'
              : 'Calculate any fare and click the "Save" button to keep it here for quick reference.'}
          </p>
          <button
            onClick={onGoToCalculator}
            className="mt-2 inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow-xs cursor-pointer"
          >
            <span>{lang === 'bn' ? 'ক্যালকুলেটরে যান' : 'Go to Calculator'}</span>
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {history.map((item) => {
            const dateStr = new Date(item.timestamp).toLocaleString(
              lang === 'bn' ? 'bn-BD' : 'en-GB',
              {
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              }
            );

            return (
              <div
                key={item.id}
                className="p-4 rounded-xl border border-slate-200 hover:border-slate-300 bg-white transition-all hover:shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 flex-wrap text-xs">
                    <span className="font-bold text-slate-900 flex items-center gap-1">
                      <Plane className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{item.inputs.airline || 'Oman Air'}</span>
                    </span>
                    <span className="text-slate-400">·</span>
                    <span className="font-semibold text-slate-700">{item.inputs.route || 'MCT ➔ DAC'}</span>
                    <span className="text-slate-400">·</span>
                    <span className="text-slate-500 flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      <span>{item.result.passengerCount} {lang === 'bn' ? 'জন' : 'pax'}</span>
                    </span>
                    <span className="text-slate-400">·</span>
                    <span className="text-slate-400 text-[11px] flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      <span>{dateStr}</span>
                    </span>
                    <span className="text-slate-400">·</span>
                    <span className="text-[11px] font-semibold text-emerald-700">
                      ১ OMR = ৳ {item.result.exchangeRate}
                    </span>
                  </div>

                  {item.inputs.passengerName && (
                    <div className="text-xs text-slate-600">
                      <span className="text-slate-400">{lang === 'bn' ? 'যাত্রী:' : 'Passenger:'}</span>{' '}
                      <span className="font-medium text-slate-800">{item.inputs.passengerName}</span>
                    </div>
                  )}

                  {/* Dual currency breakdown badges */}
                  <div className="flex items-center gap-2 text-xs flex-wrap pt-1 text-slate-600">
                    <span>
                      {lang === 'bn' ? 'পাবলিশ:' : 'Gross:'}{' '}
                      <strong className="text-slate-900 font-tabular">৳ {formatBDT(item.result.publishedFareBDT)}</strong>{' '}
                      <span className="text-[11px] text-slate-500">({formatOMR(item.result.publishedFareOMR)} OMR)</span>
                    </span>
                    <span className="text-slate-300">|</span>
                    <span>
                      {lang === 'bn' ? 'বেস:' : 'Base:'}{' '}
                      <strong className="text-slate-900 font-tabular">৳ {formatBDT(item.result.baseFareBDT)}</strong>
                    </span>
                    <span className="text-slate-300">|</span>
                    <span className="text-emerald-700 font-medium">
                      {lang === 'bn' ? '৭% কমিশন:' : 'Comm:'} -৳ {formatBDT(item.result.commissionAmountBDT)}
                    </span>
                    <span className="text-slate-300">|</span>
                    <span>
                      {lang === 'bn' ? 'নেট:' : 'Net:'}{' '}
                      <strong className="text-slate-900 font-tabular">৳ {formatBDT(item.result.netFareBDT)}</strong>
                    </span>
                    <span className="text-slate-300">|</span>
                    <span className="text-blue-700">
                      +৳ {formatBDT(item.result.serviceChargeBDT)} ({formatOMR(item.result.serviceChargeOMR)} OMR)
                    </span>
                  </div>
                </div>

                {/* Right side: Grand total & actions */}
                <div className="flex items-center justify-between md:justify-end gap-3 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-slate-100">
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 block uppercase font-bold tracking-wider">
                      {lang === 'bn' ? 'মোট বিক্রয়মূল্য' : 'Total Price'}
                    </span>
                    <span className="text-xl font-black text-emerald-700 font-tabular block">
                      ৳ {formatBDT(item.result.grandTotalSellingFareBDT)}
                    </span>
                    <span className="text-xs font-semibold text-slate-600 font-tabular">
                      {formatOMR(item.result.grandTotalSellingFareOMR)} OMR
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => onLoadItem(item)}
                      className="px-2.5 py-1.5 text-xs font-semibold rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1 transition-colors cursor-pointer"
                      title={lang === 'bn' ? 'ক্যালকুলেটরে লোড করুন' : 'Load in calculator'}
                    >
                      <ArrowUpRight className="w-3.5 h-3.5" />
                      <span>{lang === 'bn' ? 'লোড' : 'Load'}</span>
                    </button>

                    <button
                      onClick={() => onDeleteItem(item.id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                      title={lang === 'bn' ? 'মুছে ফেলুন' : 'Delete'}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
