/**
 * Formats a numeric price into Indian Rupee format (₹)
 * @param {number|string} amount
 * @returns {string}
 */
export function formatPrice(amount) {
  if (amount === null || amount === undefined || isNaN(amount)) {
    return '₹0.00';
  }
  return `₹${Number(amount).toFixed(2)}`;
}

export const CURRENCY_SYMBOL = '₹';
