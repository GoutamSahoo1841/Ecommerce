/**
 * Formats a numeric value into the Indian currency system (INR / ₹)
 * Follows Indian numbering system (e.g. ₹1,00,000 for 1 Lakh, ₹1,00,00,000 for 1 Crore)
 */
export const formatPrice = (amount, decimals = 2) => {
  const num = Number(amount) || 0;
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(num);
};

/**
 * Formats compact without trailing decimals if not required
 */
export const formatPriceCompact = (amount) => {
  const num = Number(amount) || 0;
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(num);
};

/**
 * Validates 10-digit Indian mobile phone numbers (starting with 6, 7, 8, 9 with optional +91, 91, or 0)
 */
export const isValidIndianPhone = (phone) => {
  if (!phone || !phone.trim()) return true;
  const cleaned = phone.replace(/[\s\-()]/g, '');
  return /^(?:\+91|91|0)?[6-9]\d{9}$/.test(cleaned);
};

/**
 * Formats phone number into standard Indian display: +91 XXXXX XXXXX
 */
export const formatIndianPhone = (phone) => {
  if (!phone) return '';
  const digits = phone.replace(/\D/g, '');
  if (digits.length === 10) {
    return `+91 ${digits.slice(0, 5)} ${digits.slice(5)}`;
  } else if (digits.length === 12 && digits.startsWith('91')) {
    return `+91 ${digits.slice(2, 7)} ${digits.slice(7)}`;
  }
  return phone;
};
