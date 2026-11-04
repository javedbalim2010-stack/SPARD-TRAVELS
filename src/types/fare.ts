export type InputCurrency = 'OMR' | 'BDT';

export interface FareInputs {
  inputCurrency: InputCurrency; // 'OMR' or 'BDT'
  exchangeRate: number; // 1 OMR = X BDT (e.g. 312)
  publishedFare: number; // amount in inputCurrency
  baseFare: number; // amount in inputCurrency
  commissionPercent: number; // e.g. 7%
  serviceChargeOMR: number; // e.g. 1 OMR (service charge in OMR)
  passengerCount: number; // default 1
  airline: string; // e.g. 'Oman Air'
  route: string; // e.g. 'MCT ➔ DAC'
  passengerName?: string;
  pnr?: string;
  notes?: string;
}

export interface FareCalculationResult {
  inputCurrency: InputCurrency;
  exchangeRate: number;
  passengerCount: number;
  commissionRate: number;

  // In OMR
  publishedFareOMR: number;
  baseFareOMR: number;
  taxesAndFeesOMR: number;
  commissionAmountOMR: number;
  netFareOMR: number;
  serviceChargeOMR: number;
  finalSellingFareOMR: number;
  grandTotalSellingFareOMR: number;
  agencyProfitOMR: number;
  customerSavingsOMR: number;
  omrRials: number;
  omrBaisa: number;

  // In BDT
  publishedFareBDT: number;
  baseFareBDT: number;
  taxesAndFeesBDT: number;
  commissionAmountBDT: number;
  netFareBDT: number;
  serviceChargeBDT: number;
  finalSellingFareBDT: number;
  grandTotalSellingFareBDT: number;
  agencyProfitBDT: number;
  customerSavingsBDT: number;
}

export interface HistoryItem {
  id: string;
  timestamp: number;
  inputs: FareInputs;
  result: FareCalculationResult;
}

export interface CurrencyRate {
  code: string;
  nameBn: string;
  nameEn: string;
  symbol: string;
  ratePerOmr: number;
}
