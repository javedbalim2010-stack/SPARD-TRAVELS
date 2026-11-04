export interface AirlineOption {
  code: string;
  name: string;
  nameBn: string;
  defaultCommission: number;
}

export const POPULAR_AIRLINES: AirlineOption[] = [
  { code: 'WY', name: 'Oman Air', nameBn: 'ওমান এয়ার (Oman Air)', defaultCommission: 7 },
  { code: 'OV', name: 'SalamAir', nameBn: 'সালামএয়ার (SalamAir)', defaultCommission: 5 },
  { code: 'BG', name: 'Biman Bangladesh Airlines', nameBn: 'বিমান বাংলাদেশ (Biman)', defaultCommission: 7 },
  { code: 'BS', name: 'US-Bangla Airlines', nameBn: 'ইউএস-বাংলা (US-Bangla)', defaultCommission: 7 },
  { code: 'G9', name: 'Air Arabia', nameBn: 'এয়ার এরাবিয়া (Air Arabia)', defaultCommission: 3 },
  { code: 'FZ', name: 'Flydubai', nameBn: 'ফ্লাইদুবাই (Flydubai)', defaultCommission: 5 },
  { code: 'EK', name: 'Emirates', nameBn: 'এমিরেটস (Emirates)', defaultCommission: 7 },
  { code: 'QR', name: 'Qatar Airways', nameBn: 'কাতার এয়ারওয়েজ (Qatar Airways)', defaultCommission: 7 },
  { code: 'GF', name: 'Gulf Air', nameBn: 'গালফ এয়ার (Gulf Air)', defaultCommission: 7 },
  { code: 'J9', name: 'Jazeera Airways', nameBn: 'জাজিরা এয়ারওয়েজ (Jazeera)', defaultCommission: 5 },
];

export const POPULAR_ROUTES = [
  { label: 'Muscat ➔ Dhaka (MCT - DAC)', value: 'MCT ➔ DAC' },
  { label: 'Muscat ➔ Chittagong (MCT - CGP)', value: 'MCT ➔ CGP' },
  { label: 'Muscat ➔ Sylhet (MCT - ZYL)', value: 'MCT ➔ ZYL' },
  { label: 'Salalah ➔ Dhaka (SLL - DAC)', value: 'SLL ➔ DAC' },
  { label: 'Muscat ➔ Kozhikode (MCT - CCJ)', value: 'MCT ➔ CCJ' },
  { label: 'Muscat ➔ Kochi (MCT - COK)', value: 'MCT ➔ COK' },
  { label: 'Muscat ➔ Delhi (MCT - DEL)', value: 'MCT ➔ DEL' },
  { label: 'Muscat ➔ Kathmandu (MCT - KTM)', value: 'MCT ➔ KTM' },
  { label: 'Muscat ➔ Dubai (MCT - DXB)', value: 'MCT ➔ DXB' },
  { label: 'Muscat ➔ Doha (MCT - DOH)', value: 'MCT ➔ DOH' },
];

export const DEFAULT_COMMISSION_PRESETS = [7, 5, 9, 3, 0];
export const DEFAULT_SERVICE_CHARGE_PRESETS = [1, 2, 3, 5, 0];
