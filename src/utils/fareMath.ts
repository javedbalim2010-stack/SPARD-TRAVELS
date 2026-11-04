import { FareInputs, FareCalculationResult } from '../types/fare';

/**
 * Format number to 3 decimal places standard for OMR (Omani Rial)
 */
export function formatOMR(amount: number): string {
  if (isNaN(amount) || amount === null || amount === undefined) {
    return '0.000';
  }
  return Number(amount).toFixed(3);
}

/**
 * Format number for Bangladeshi Taka (BDT) with commas and optional decimals
 */
export function formatBDT(amount: number, includeDecimals = false): string {
  if (isNaN(amount) || amount === null || amount === undefined) {
    return '0';
  }
  return new Intl.NumberFormat('en-IN', {
    maximumFractionDigits: includeDecimals ? 2 : 0,
    minimumFractionDigits: includeDecimals ? 2 : 0,
  }).format(amount);
}

/**
 * Split an OMR amount into Rials and Baisa (1 OMR = 1000 Baisa)
 */
export function getRialAndBaisa(amount: number): { rials: number; baisa: number } {
  const rounded = Math.round((Number(amount) || 0) * 1000) / 1000;
  const rials = Math.floor(rounded);
  const baisa = Math.round((rounded - rials) * 1000);
  return { rials, baisa };
}

/**
 * Core calculation supporting both OMR and BDT inputs:
 * When BDT is inputted:
 * 1. Base Fare (BDT) * Commission% = Commission (BDT)
 * 2. Published Fare (BDT) - Commission (BDT) = Net Fare (BDT)
 * 3. 1 OMR Service Charge in BDT = 1 * exchangeRate (BDT)
 * 4. Final Fare (BDT) = Net Fare (BDT) + Service Charge (BDT)
 * 5. Corresponding OMR values are derived and shown side-by-side.
 */
export function calculateFare(inputs: FareInputs): FareCalculationResult {
  const inputCurrency = inputs.inputCurrency || 'OMR';
  const exchangeRate = Math.max(0.0001, Number(inputs.exchangeRate) || 312);
  const passengerCount = Math.max(1, Math.floor(Number(inputs.passengerCount) || 1));
  const commissionRate = Math.max(0, Number(inputs.commissionPercent) || 0);
  const serviceChargeOMR = Math.max(0, Number(inputs.serviceChargeOMR) || 0);

  let publishedFareOMR = 0;
  let baseFareOMR = 0;
  let publishedFareBDT = 0;
  let baseFareBDT = 0;

  if (inputCurrency === 'BDT') {
    // User typed figures in Bangladeshi Taka
    publishedFareBDT = Math.max(0, Number(inputs.publishedFare) || 0);
    baseFareBDT = Math.max(0, Number(inputs.baseFare) || 0);

    publishedFareOMR = Math.round((publishedFareBDT / exchangeRate) * 1000) / 1000;
    baseFareOMR = Math.round((baseFareBDT / exchangeRate) * 1000) / 1000;
  } else {
    // User typed figures in Omani Rials
    publishedFareOMR = Math.max(0, Number(inputs.publishedFare) || 0);
    baseFareOMR = Math.max(0, Number(inputs.baseFare) || 0);

    publishedFareBDT = Math.round(publishedFareOMR * exchangeRate * 100) / 100;
    baseFareBDT = Math.round(baseFareOMR * exchangeRate * 100) / 100;
  }

  // Taxes and Fees
  const taxesAndFeesOMR = Math.max(0, Math.round((publishedFareOMR - baseFareOMR) * 1000) / 1000);
  const taxesAndFeesBDT = Math.max(0, Math.round((publishedFareBDT - baseFareBDT) * 100) / 100);

  // Commission (calculated on Base Fare)
  const commissionAmountOMR = Math.round(baseFareOMR * (commissionRate / 100) * 1000) / 1000;
  const commissionAmountBDT = Math.round(baseFareBDT * (commissionRate / 100) * 100) / 100;

  // Net Fare = Published Fare - Commission
  const netFareOMR = Math.max(0, Math.round((publishedFareOMR - commissionAmountOMR) * 1000) / 1000);
  const netFareBDT = Math.max(0, Math.round((publishedFareBDT - commissionAmountBDT) * 100) / 100);

  // Service Charge (Specified in OMR, e.g. 1 OMR, and converted to BDT using exchange rate)
  const serviceChargeBDT = Math.round(serviceChargeOMR * exchangeRate * 100) / 100;

  // Final Selling Fare per passenger = Net Fare + Service Charge
  const finalSellingFareOMR = Math.round((netFareOMR + serviceChargeOMR) * 1000) / 1000;
  const finalSellingFareBDT = Math.round((netFareBDT + serviceChargeBDT) * 100) / 100;

  // Agency Profit (Commission + Service Charge)
  const agencyProfitOMR = Math.round((commissionAmountOMR + serviceChargeOMR) * 1000) / 1000;
  const agencyProfitBDT = Math.round((commissionAmountBDT + serviceChargeBDT) * 100) / 100;

  // Customer Savings from Published Fare
  const customerSavingsOMR = Math.round((publishedFareOMR - finalSellingFareOMR) * 1000) / 1000;
  const customerSavingsBDT = Math.round((publishedFareBDT - finalSellingFareBDT) * 100) / 100;

  // Grand Totals for all passengers
  const grandTotalSellingFareOMR = Math.round(finalSellingFareOMR * passengerCount * 1000) / 1000;
  const grandTotalSellingFareBDT = Math.round(finalSellingFareBDT * passengerCount * 100) / 100;

  const { rials, baisa } = getRialAndBaisa(finalSellingFareOMR);

  return {
    inputCurrency,
    exchangeRate,
    passengerCount,
    commissionRate,

    // OMR
    publishedFareOMR,
    baseFareOMR,
    taxesAndFeesOMR,
    commissionAmountOMR,
    netFareOMR,
    serviceChargeOMR,
    finalSellingFareOMR,
    grandTotalSellingFareOMR,
    agencyProfitOMR,
    customerSavingsOMR,
    omrRials: rials,
    omrBaisa: baisa,

    // BDT
    publishedFareBDT,
    baseFareBDT,
    taxesAndFeesBDT,
    commissionAmountBDT,
    netFareBDT,
    serviceChargeBDT,
    finalSellingFareBDT,
    grandTotalSellingFareBDT,
    agencyProfitBDT,
    customerSavingsBDT,
  };
}

/**
 * Generate formatted WhatsApp message text in Bengali
 */
export function generateWhatsAppMessageBn(
  inputs: FareInputs,
  result: FareCalculationResult
): string {
  const isBdtMode = result.inputCurrency === 'BDT';

  return `✈️ *এয়ারলাইন্স টিকেট ফেয়ার কোটেশন*
───────────────────────
🔹 *এয়ারলাইন:* ${inputs.airline || 'এয়ারলাইন'}
🔹 *রুট:* ${inputs.route || 'সাধারণ রুট'}
${inputs.passengerName ? `👤 *যাত্রীর নাম:* ${inputs.passengerName}\n` : ''}${inputs.pnr ? `🎫 *PNR:* ${inputs.pnr}\n` : ''}👥 *যাত্রী সংখ্যা:* ${result.passengerCount} জন
💱 *মুদ্রা রেট:* ১ ওমানি রিয়াল (OMR) = ৳ ${result.exchangeRate}

📊 *ফেয়ার ব্রেকডাউন (প্রতি টিকেট):*
• পাবলিশ ফেয়ার: ৳ ${formatBDT(result.publishedFareBDT)} (${formatOMR(result.publishedFareOMR)} OMR)
• বেস ফেয়ার: ৳ ${formatBDT(result.baseFareBDT)} (${formatOMR(result.baseFareOMR)} OMR)
• ট্যাক্স ও ফি: ৳ ${formatBDT(result.taxesAndFeesBDT)} (${formatOMR(result.taxesAndFeesOMR)} OMR)
• এয়ারলাইন কমিশন (${result.commissionRate}%): -৳ ${formatBDT(result.commissionAmountBDT)} (-${formatOMR(result.commissionAmountOMR)} OMR)
• নেট ফেয়ার (কমিশন বাদে): ৳ ${formatBDT(result.netFareBDT)} (${formatOMR(result.netFareOMR)} OMR)
• সার্ভিস চার্জ (১ ওমানি রিয়াল): +৳ ${formatBDT(result.serviceChargeBDT)} (+${formatOMR(result.serviceChargeOMR)} OMR)

═══════════════════════
★ *মোট প্রদেয় মূল্য:* *৳ ${formatBDT(result.grandTotalSellingFareBDT)}*
👉 *ওমান রিয়ালে:* *${formatOMR(result.grandTotalSellingFareOMR)} OMR* (${result.omrRials} রিয়াল ${result.omrBaisa} বাইসা)
═══════════════════════
✓ তাৎক্ষণিক ও নির্ভুল হিসাব।
ধন্যবাদ! আপনার বিশ্বস্ত ট্রাভেল পার্টনার।`;
}

/**
 * Generate formatted WhatsApp message text in English
 */
export function generateWhatsAppMessageEn(
  inputs: FareInputs,
  result: FareCalculationResult
): string {
  return `✈️ *AIRLINE TICKET QUOTATION*
───────────────────────
• *Airline:* ${inputs.airline || 'Airline'}
• *Route:* ${inputs.route || 'Route'}
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
Thank you for choosing our travel service!`;
}
