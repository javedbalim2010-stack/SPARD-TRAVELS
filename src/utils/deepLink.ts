import { FareInputs, FareCalculationResult } from '../types/fare';
import { formatOMR, formatBDT } from './fareMath';

/**
 * Generates an absolute deep link URL encoding all current calculation parameters
 */
export function generateDeepLink(inputs: FareInputs): string {
  const params = new URLSearchParams();

  params.set('pub', String(inputs.publishedFare));
  params.set('base', String(inputs.baseFare));
  params.set('comm', String(inputs.commissionPercent));
  params.set('svc', String(inputs.serviceChargeOMR));
  params.set('pax', String(inputs.passengerCount));
  params.set('curr', inputs.inputCurrency || 'OMR');
  params.set('rate', String(inputs.exchangeRate || 312));

  if (inputs.airline) params.set('air', inputs.airline);
  if (inputs.route) params.set('rt', inputs.route);
  if (inputs.passengerName) params.set('name', inputs.passengerName);
  if (inputs.pnr) params.set('pnr', inputs.pnr);

  const baseUrl = window.location.origin + window.location.pathname;
  return `${baseUrl}?${params.toString()}`;
}

/**
 * Parses query parameters from current window location to restore calculation state
 */
export function parseDeepLink(): Partial<FareInputs> | null {
  if (typeof window === 'undefined') return null;

  const search = window.location.search;
  if (!search) return null;

  const params = new URLSearchParams(search);

  // Check if at least published fare is specified
  if (!params.has('pub') && !params.has('base')) {
    return null;
  }

  const result: Partial<FareInputs> = {};

  if (params.has('pub')) {
    const val = parseFloat(params.get('pub') || '');
    if (!isNaN(val)) result.publishedFare = val;
  }

  if (params.has('base')) {
    const val = parseFloat(params.get('base') || '');
    if (!isNaN(val)) result.baseFare = val;
  }

  if (params.has('comm')) {
    const val = parseFloat(params.get('comm') || '');
    if (!isNaN(val)) result.commissionPercent = val;
  }

  if (params.has('svc')) {
    const val = parseFloat(params.get('svc') || '');
    if (!isNaN(val)) result.serviceChargeOMR = val;
  }

  if (params.has('pax')) {
    const val = parseInt(params.get('pax') || '');
    if (!isNaN(val)) result.passengerCount = Math.max(1, val);
  }

  if (params.has('curr')) {
    const curr = params.get('curr');
    if (curr === 'BDT' || curr === 'OMR') {
      result.inputCurrency = curr;
    }
  }

  if (params.has('rate')) {
    const val = parseFloat(params.get('rate') || '');
    if (!isNaN(val) && val > 0) result.exchangeRate = val;
  }

  if (params.has('air')) result.airline = params.get('air') || '';
  if (params.has('rt')) result.route = params.get('rt') || '';
  if (params.has('name')) result.passengerName = params.get('name') || '';
  if (params.has('pnr')) result.pnr = params.get('pnr') || '';

  return result;
}

/**
 * Generates an enriched message including the live deep link for WhatsApp and messaging apps
 */
export function generateDeepLinkShareMessage(
  inputs: FareInputs,
  result: FareCalculationResult,
  deepLinkUrl: string,
  lang: 'bn' | 'en'
): string {
  if (lang === 'bn') {
    return `✈️ *এয়ারলাইন্স টিকেট ফেয়ার কোটেশন*
───────────────────────
🔹 *এয়ারলাইন:* ${inputs.airline || 'Oman Air'}
🔹 *রুট:* ${inputs.route || 'MCT ➔ DAC'}
${inputs.passengerName ? `👤 *যাত্রী:* ${inputs.passengerName}\n` : ''}${inputs.pnr ? `🎫 *PNR:* ${inputs.pnr}\n` : ''}👥 *যাত্রী সংখ্যা:* ${result.passengerCount} জন
💱 *মুদ্রা রেট:* ১ OMR = ৳ ${result.exchangeRate}

📊 *ফেয়ার বিবরণী (প্রতি টিকেট):*
• পাবলিশ ফেয়ার: ৳ ${formatBDT(result.publishedFareBDT)} (${formatOMR(result.publishedFareOMR)} OMR)
• বেস ফেয়ার: ৳ ${formatBDT(result.baseFareBDT)} (${formatOMR(result.baseFareOMR)} OMR)
• এয়ারলাইন কমিশন (${result.commissionRate}%): -৳ ${formatBDT(result.commissionAmountBDT)} (-${formatOMR(result.commissionAmountOMR)} OMR)
• নেট ফেয়ার: ৳ ${formatBDT(result.netFareBDT)} (${formatOMR(result.netFareOMR)} OMR)
• সার্ভিস চার্জ (১ ওমানি রিয়াল): +৳ ${formatBDT(result.serviceChargeBDT)} (+${formatOMR(result.serviceChargeOMR)} OMR)

═══════════════════════
★ *মোট প্রদেয় মূল্য:* *৳ ${formatBDT(result.grandTotalSellingFareBDT)}*
👉 *ওমান রিয়ালে:* *${formatOMR(result.grandTotalSellingFareOMR)} OMR* (${result.omrRials} রিয়াল ${result.omrBaisa} বাইসা)
═══════════════════════
🔗 *লাইভ কোটেশন দেখতে এই লিংকে ক্লিক করুন:*
${deepLinkUrl}
───────────────────────
ধন্যবাদ! আপনার বিশ্বস্ত ট্রাভেল পার্টনার।`;
  }

  return `✈️ *AIRLINE TICKET QUOTATION*
───────────────────────
• *Airline:* ${inputs.airline || 'Oman Air'}
• *Route:* ${inputs.route || 'MCT ➔ DAC'}
${inputs.passengerName ? `• *Passenger:* ${inputs.passengerName}\n` : ''}${inputs.pnr ? `• *PNR:* ${inputs.pnr}\n` : ''}• *Passengers:* ${result.passengerCount} Pax
• *Exchange Rate:* 1 OMR = BDT ${result.exchangeRate}

📊 *Fare Breakdown (Per Ticket):*
• Published Fare: BDT ${formatBDT(result.publishedFareBDT)} (${formatOMR(result.publishedFareOMR)} OMR)
• Base Fare: BDT ${formatBDT(result.baseFareBDT)} (${formatOMR(result.baseFareOMR)} OMR)
• Airline Commission (${result.commissionRate}%): -BDT ${formatBDT(result.commissionAmountBDT)} (-${formatOMR(result.commissionAmountOMR)} OMR)
• Net Fare (Cost): BDT ${formatBDT(result.netFareBDT)} (${formatOMR(result.netFareOMR)} OMR)
• Service Charge (1 OMR): +BDT ${formatBDT(result.serviceChargeBDT)} (+${formatOMR(result.serviceChargeOMR)} OMR)

═══════════════════════
★ *Total Customer Payable:* *BDT ${formatBDT(result.grandTotalSellingFareBDT)}*
👉 *In OMR:* *${formatOMR(result.grandTotalSellingFareOMR)} OMR* (${result.omrRials} Rials ${result.omrBaisa} Baisa)
═══════════════════════
🔗 *View live verified quotation online:*
${deepLinkUrl}
───────────────────────
Thank you for booking with us!`;
}
