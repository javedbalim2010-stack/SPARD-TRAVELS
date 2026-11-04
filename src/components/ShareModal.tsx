import React, { useState, useRef, useEffect } from 'react';
import { FareInputs, FareCalculationResult } from '../types/fare';
import { generateDeepLink, generateDeepLinkShareMessage } from '../utils/deepLink';
import { formatOMR, formatBDT } from '../utils/fareMath';
import {
  Share2,
  Copy,
  Check,
  Download,
  Image as ImageIcon,
  Link as LinkIcon,
  X,
  ExternalLink,
  Plane,
  Sparkles,
} from 'lucide-react';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  inputs: FareInputs;
  result: FareCalculationResult;
  lang: 'bn' | 'en';
}

export const ShareModal: React.FC<ShareModalProps> = ({
  isOpen,
  onClose,
  inputs,
  result,
  lang,
}) => {
  const [activeTab, setActiveTab] = useState<'link' | 'image'>('link');
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedText, setCopiedText] = useState(false);
  const [copiedImage, setCopiedImage] = useState(false);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const deepLinkUrl = typeof window !== 'undefined' ? generateDeepLink(inputs) : '';
  const shareMessage = generateDeepLinkShareMessage(inputs, result, deepLinkUrl, lang);

  // Generate visual ticket snapshot card on canvas
  const renderSnapshotCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = 800;
    const height = 980;
    canvas.width = width;
    canvas.height = height;

    // Background
    ctx.fillStyle = '#0f172a'; // slate-900
    ctx.fillRect(0, 0, width, height);

    // Header gradient banner
    const grad = ctx.createLinearGradient(0, 0, width, 220);
    grad.addColorStop(0, '#047857'); // emerald-700
    grad.addColorStop(1, '#065f46'); // emerald-800
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, 220);

    // Decorative circle
    ctx.beginPath();
    ctx.arc(width - 50, 40, 120, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.fill();

    // App/Service Wordmark
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 30px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('✈️ AIRLINE TICKET FARE QUOTATION', 40, 60);

    ctx.fillStyle = '#a7f3d0'; // emerald-200
    ctx.font = '16px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('Verified Fare & 7% Commission Calculation', 40, 95);

    // Route & Airline Banner
    ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
    ctx.beginPath();
    ctx.roundRect(40, 120, width - 80, 75, 14);
    ctx.fill();

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 24px "Plus Jakarta Sans", sans-serif';
    ctx.fillText(inputs.airline || 'Oman Air', 60, 165);

    ctx.fillStyle = '#34d399'; // emerald-400
    ctx.font = 'bold 22px "Plus Jakarta Sans", sans-serif';
    ctx.textAlign = 'right';
    ctx.fillText(inputs.route || 'MCT ➔ DAC', width - 60, 165);
    ctx.textAlign = 'left';

    // White Card Container for Details
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.roundRect(40, 240, width - 80, 560, 18);
    ctx.fill();

    // Meta row (Passenger, Pax, Rate, Date)
    const today = new Date().toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });

    ctx.fillStyle = '#64748b'; // slate-500
    ctx.font = '13px "Plus Jakarta Sans", sans-serif';
    ctx.fillText(`PASSENGER: ${inputs.passengerName || 'Valued Client'}`, 65, 280);
    ctx.fillText(`PAX: ${result.passengerCount} Pax`, 340, 280);
    ctx.fillText(`RATE: 1 OMR = ৳ ${result.exchangeRate}`, 470, 280);
    ctx.fillText(`DATE: ${today}`, 630, 280);

    // Divider line
    ctx.strokeStyle = '#e2e8f0'; // slate-200
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(65, 305);
    ctx.lineTo(width - 65, 305);
    ctx.stroke();

    // Table Rows
    interface TableRow {
      label: string;
      bdt: string;
      omr: string;
      highlight?: 'emerald' | 'blue' | 'dark';
    }

    const rows: TableRow[] = [
      {
        label: 'Published Fare (Gross)',
        bdt: `৳ ${formatBDT(result.publishedFareBDT)}`,
        omr: `${formatOMR(result.publishedFareOMR)} OMR`,
      },
      {
        label: 'Base Fare (Commission Basis)',
        bdt: `৳ ${formatBDT(result.baseFareBDT)}`,
        omr: `${formatOMR(result.baseFareOMR)} OMR`,
      },
      {
        label: 'Taxes & Airline Surcharges',
        bdt: `৳ ${formatBDT(result.taxesAndFeesBDT)}`,
        omr: `${formatOMR(result.taxesAndFeesOMR)} OMR`,
      },
      {
        label: `Airline Commission (${result.commissionRate}%)`,
        bdt: `-৳ ${formatBDT(result.commissionAmountBDT, true)}`,
        omr: `-${formatOMR(result.commissionAmountOMR)} OMR`,
        highlight: 'emerald',
      },
      {
        label: 'Net Airline Fare (Published - Commission)',
        bdt: `৳ ${formatBDT(result.netFareBDT, true)}`,
        omr: `${formatOMR(result.netFareOMR)} OMR`,
      },
      {
        label: `Service Charge (${formatOMR(result.serviceChargeOMR)} OMR)`,
        bdt: `+৳ ${formatBDT(result.serviceChargeBDT, true)}`,
        omr: `+${formatOMR(result.serviceChargeOMR)} OMR`,
        highlight: 'blue',
      },
    ];

    let startY = 345;
    const rowHeight = 46;

    rows.forEach((r, idx) => {
      // Row background for highlights
      if (r.highlight === 'emerald') {
        ctx.fillStyle = '#ecfdf5'; // emerald-50
        ctx.fillRect(60, startY - 26, width - 120, 36);
      } else if (r.highlight === 'blue') {
        ctx.fillStyle = '#eff6ff'; // blue-50
        ctx.fillRect(60, startY - 26, width - 120, 36);
      }

      // Label
      ctx.fillStyle =
        r.highlight === 'emerald'
          ? '#065f46'
          : r.highlight === 'blue'
          ? '#1e40af'
          : '#334155';
      ctx.font = r.highlight ? 'bold 15px "Plus Jakarta Sans", sans-serif' : '15px "Plus Jakarta Sans", sans-serif';
      ctx.fillText(r.label, 70, startY - 3);

      // BDT
      ctx.fillStyle =
        r.highlight === 'emerald'
          ? '#047857'
          : r.highlight === 'blue'
          ? '#1d4ed8'
          : '#0f172a';
      ctx.font = 'bold 16px "JetBrains Mono", monospace';
      ctx.textAlign = 'right';
      ctx.fillText(r.bdt, width - 230, startY - 3);

      // OMR
      ctx.fillStyle = '#64748b';
      ctx.font = '14px "JetBrains Mono", monospace';
      ctx.fillText(r.omr, width - 70, startY - 3);
      ctx.textAlign = 'left';

      startY += rowHeight;
    });

    // Grand Total Box inside the card
    const totalBoxY = 625;
    ctx.fillStyle = '#064e3b'; // emerald-900
    ctx.beginPath();
    ctx.roundRect(60, totalBoxY, width - 120, 140, 14);
    ctx.fill();

    ctx.fillStyle = '#a7f3d0';
    ctx.font = 'bold 13px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('GRAND TOTAL PAYABLE (FINAL SELLING PRICE)', 85, totalBoxY + 36);

    // Big Total in BDT
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 36px "JetBrains Mono", monospace';
    ctx.fillText(`৳ ${formatBDT(result.grandTotalSellingFareBDT, true)}`, 85, totalBoxY + 84);

    // In OMR
    ctx.fillStyle = '#34d399';
    ctx.font = 'bold 22px "JetBrains Mono", monospace';
    ctx.textAlign = 'right';
    ctx.fillText(
      `${formatOMR(result.grandTotalSellingFareOMR)} OMR`,
      width - 85,
      totalBoxY + 70
    );

    ctx.fillStyle = '#d1fae5';
    ctx.font = '13px "Plus Jakarta Sans", sans-serif';
    ctx.fillText(
      `(${result.omrRials} Rials ${result.omrBaisa} Baisa)`,
      width - 85,
      totalBoxY + 95
    );
    ctx.textAlign = 'left';

    // Sub-note in total box
    ctx.fillStyle = '#6ee7b7';
    ctx.font = '12px "Plus Jakarta Sans", sans-serif';
    ctx.fillText(
      `Net Fare (${formatOMR(result.netFareOMR)}) + 1 OMR Service Charge (${formatOMR(result.serviceChargeOMR)})`,
      85,
      totalBoxY + 120
    );

    // Footer of Snapshot
    ctx.fillStyle = '#94a3b8'; // slate-400
    ctx.font = '13px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('Live Verified Calculation Powered by Oman Airline Fare Engine', 65, 845);

    ctx.fillStyle = '#38bdf8'; // sky-400
    ctx.font = 'bold 12px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('🔗 Click shared link to view live interactive breakdown in browser', 65, 870);

    // Convert to data URL for preview
    setImagePreviewUrl(canvas.toDataURL('image/png'));
  };

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        renderSnapshotCanvas();
      }, 80);
    }
  }, [isOpen, inputs, result]);

  if (!isOpen) return null;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(deepLinkUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2200);
  };

  const handleCopyText = () => {
    navigator.clipboard.writeText(shareMessage);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2200);
  };

  const handleDownloadImage = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const link = document.createElement('a');
    link.download = `ticket_quote_${inputs.airline || 'fare'}_${Date.now()}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  const handleCopyImageToClipboard = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    try {
      setIsGeneratingImage(true);
      canvas.toBlob(async (blob) => {
        if (!blob) return;
        try {
          await navigator.clipboard.write([
            new ClipboardItem({
              'image/png': blob,
            }),
          ]);
          setCopiedImage(true);
          setTimeout(() => setCopiedImage(false), 2200);
        } catch {
          // Fallback if browser doesn't allow image clipboard
          handleDownloadImage();
        } finally {
          setIsGeneratingImage(false);
        }
      }, 'image/png');
    } catch {
      handleDownloadImage();
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Airline Fare Quotation',
          text: shareMessage,
          url: deepLinkUrl,
        });
      } catch {
        // Dismissed or unsupported
      }
    } else {
      handleCopyText();
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden my-8">
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-sm">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold">
                {lang === 'bn' ? 'ফেয়ার কোটেশন শেয়ার ও ডিপ লিংক' : 'Share Fare Quotation & Deep Link'}
              </h3>
              <p className="text-xs text-slate-300">
                {lang === 'bn'
                  ? 'হোয়াটসঅ্যাপ, মেসেঞ্জার বা এসএমএসে লাইভ লিংক ও ছবি স্ন্যাপশট পাঠান'
                  : 'Send live interactive link or snapshot image via WhatsApp & Messaging'}
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

        {/* Tab Switcher */}
        <div className="flex border-b border-slate-200 bg-slate-50 p-2 gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('link')}
            className={`flex-1 py-2 px-3 text-xs sm:text-sm font-bold rounded-lg transition-all flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === 'link'
                ? 'bg-white text-emerald-800 shadow-xs border border-slate-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <LinkIcon className="w-4 h-4 text-emerald-600" />
            <span>{lang === 'bn' ? 'ডিপ লিংক ও মেসেজ (Live Link)' : 'Deep Link & WhatsApp Text'}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('image')}
            className={`flex-1 py-2 px-3 text-xs sm:text-sm font-bold rounded-lg transition-all flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === 'image'
                ? 'bg-white text-emerald-800 shadow-xs border border-slate-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <ImageIcon className="w-4 h-4 text-emerald-600" />
            <span>{lang === 'bn' ? 'ছবি স্ন্যাপশট কার্ড (Image Card)' : 'Image Snapshot Card'}</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-5">
          {/* TAB 1: Live Deep Link & Text Format */}
          {activeTab === 'link' && (
            <div className="space-y-4">
              {/* Deep Link URL Box */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                  {lang === 'bn' ? '১. এই হিসাবের লাইভ ডিপ লিংক (Interactive Deep Link):' : '1. Interactive Deep Link URL:'}
                </label>
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono text-slate-700 truncate">
                    {deepLinkUrl}
                  </div>
                  <button
                    onClick={handleCopyLink}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shrink-0 ${
                      copiedLink
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-900 hover:bg-slate-800 text-white'
                    }`}
                  >
                    {copiedLink ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    <span>{copiedLink ? (lang === 'bn' ? 'লিংক কপি হয়েছে!' : 'Copied!') : lang === 'bn' ? 'লিংক কপি' : 'Copy Link'}</span>
                  </button>
                </div>
                <span className="text-[11px] text-slate-500 block">
                  {lang === 'bn'
                    ? '✓ এই লিংকে ক্লিক করলে যে কেউ আপনার ঠিক এই হিসাবটি (পাবলিশ, বেস ফেয়ার, কমিশন ও সার্ভিস চার্জ) সরাসরি দেখতে পাবে।'
                    : '✓ Anyone opening this link will see your exact fare inputs, commission, and net calculation instantly.'}
                </span>
              </div>

              {/* Formatted Text Preview */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    {lang === 'bn' ? '২. হোয়াটসঅ্যাপ মেসেজ ড্রাফট (লিংকসহ):' : '2. WhatsApp Message Draft (with Link):'}
                  </label>
                  <button
                    onClick={handleCopyText}
                    className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 cursor-pointer"
                  >
                    {copiedText ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedText ? (lang === 'bn' ? 'কপি হয়েছে!' : 'Copied!') : lang === 'bn' ? 'মেসেজ কপি' : 'Copy Text'}</span>
                  </button>
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-xs font-mono text-slate-800 max-h-48 overflow-y-auto whitespace-pre-wrap leading-relaxed">
                  {shareMessage}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <button
                  onClick={() => {
                    window.open(`https://wa.me/?text=${encodeURIComponent(shareMessage)}`, '_blank');
                  }}
                  className="py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <Share2 className="w-4 h-4" />
                  <span>{lang === 'bn' ? 'সরাসরি WhatsApp-এ পাঠান' : 'Send via WhatsApp'}</span>
                </button>

                <button
                  onClick={handleNativeShare}
                  className="py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl shadow-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>{lang === 'bn' ? 'অন্যান্য অ্যাপে শেয়ার করুন' : 'Share to Other Apps'}</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: Visual Snapshot Image Card */}
          {activeTab === 'image' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    {lang === 'bn' ? 'টিকিট ফেয়ার স্ন্যাপশট কার্ড (PNG)' : 'Ticket Fare Snapshot Image'}
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    {lang === 'bn'
                      ? 'এইচডি কোয়ালিটি কার্ড যা যেকোনো সোশ্যাল মিডিয়া বা হোয়াটসঅ্যাপে ইমেজ হিসেবে পাঠাতে পারবেন।'
                      : 'High resolution graphic card ready to send as an image on WhatsApp or Messenger.'}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopyImageToClipboard}
                    disabled={isGeneratingImage}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 border transition-all cursor-pointer ${
                      copiedImage
                        ? 'bg-emerald-600 text-white border-emerald-600'
                        : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-300'
                    }`}
                    title="হোয়াটসঅ্যাপ ওয়েবে পেস্ট করার জন্য ক্লিপবোর্ডে কপি করুন"
                  >
                    {copiedImage ? <Check className="w-3.5 h-3.5 text-white" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedImage ? (lang === 'bn' ? 'কপি হয়েছে!' : 'Copied!') : lang === 'bn' ? 'ছবি কপি' : 'Copy Image'}</span>
                  </button>

                  <button
                    onClick={handleDownloadImage}
                    className="px-3 py-1.5 rounded-lg text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>{lang === 'bn' ? 'ডাউনলোড PNG' : 'Download PNG'}</span>
                  </button>
                </div>
              </div>

              {/* Live Canvas Preview */}
              <div className="relative rounded-xl border border-slate-200 overflow-hidden bg-slate-900 shadow-inner flex justify-center p-2 max-h-[380px] overflow-y-auto">
                {imagePreviewUrl ? (
                  <img
                    src={imagePreviewUrl}
                    alt="Ticket Fare Snapshot"
                    className="max-w-full h-auto rounded-lg shadow-md"
                  />
                ) : (
                  <div className="text-white text-xs py-12 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-emerald-400 animate-spin" />
                    <span>{lang === 'bn' ? 'স্ন্যাপশট তৈরি হচ্ছে...' : 'Generating snapshot card...'}</span>
                  </div>
                )}
              </div>

              {/* Instructions */}
              <div className="text-xs text-slate-500 bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-1">
                <span className="font-bold text-slate-700 block">
                  {lang === 'bn' ? '💡 ছবি পাঠানোর নিয়ম:' : '💡 How to send image:'}
                </span>
                <span>
                  {lang === 'bn'
                    ? '• মোবাইলে "ডাউনলোড PNG" বাটন চাপলে ছবি আপনার ফোনে সেভ হবে, যা সরাসরি হোয়াটসঅ্যাপে পাঠাতে পারেন।'
                    : '• On mobile, tap "Download PNG" to save the card directly to your gallery.'}
                </span>
                <br />
                <span>
                  {lang === 'bn'
                    ? '• কম্পিউটারে "ছবি কপি" বাটনে ক্লিক করে WhatsApp Web বা Messenger চ্যাটে গিয়ে সরাসরি Ctrl+V পেস্ট করলেই চলে যাবে!'
                    : '• On desktop, click "Copy Image" and simply press Ctrl+V in WhatsApp Web!'}
                </span>
              </div>
            </div>
          )}

          {/* Hidden Canvas used for high-res generation */}
          <canvas ref={canvasRef} style={{ display: 'none' }} />
        </div>
      </div>
    </div>
  );
};
