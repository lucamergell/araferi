/**
 * Phone Number Normalization and Formatting Utilities for Padely
 */

/**
 * Normalizes phone numbers to a consistent internal representation.
 * Examples:
 * "+995 555 123 456" -> "995555123456"
 * "+995555123456"    -> "995555123456"
 * "555 123 456"      -> "995555123456" (Adds 995 country code for 9-digit Georgian mobile numbers)
 */
export function normalizePhoneNumber(rawPhone: string): string {
  if (!rawPhone) return '';
  
  // Strip all non-digit characters
  const digitsOnly = rawPhone.replace(/\D/g, '');
  if (!digitsOnly) return '';

  // If 9 digits starting with 5 (standard Georgian mobile length without country code e.g. 555123456)
  if (digitsOnly.length === 9 && digitsOnly.startsWith('5')) {
    return `995${digitsOnly}`;
  }

  // If 12 digits starting with 995 (e.g. 995555123456)
  if (digitsOnly.length === 12 && digitsOnly.startsWith('995')) {
    return digitsOnly;
  }

  // Fallback for non-georgian or varied length numbers
  return digitsOnly;
}

/**
 * Formats a raw or normalized phone number into readable format.
 * e.g., "995555123456" -> "+995 555 12 34 56"
 */
export function formatPhoneNumber(rawPhone: string): string {
  const normalized = normalizePhoneNumber(rawPhone);
  if (!normalized) return rawPhone || '';

  if (normalized.length === 12 && normalized.startsWith('995')) {
    const mobile = normalized.substring(3); // e.g. 555123456
    return `+995 ${mobile.substring(0, 3)} ${mobile.substring(3, 5)} ${mobile.substring(5, 7)} ${mobile.substring(7)}`;
  }

  if (normalized.length === 9) {
    return `+995 ${normalized.substring(0, 3)} ${normalized.substring(3, 5)} ${normalized.substring(5, 7)} ${normalized.substring(7)}`;
  }

  return `+${normalized}`;
}

/**
 * Validates whether a phone number is plausible (at least 8 digits).
 */
export function isValidPhoneNumber(rawPhone: string): boolean {
  const normalized = normalizePhoneNumber(rawPhone);
  return normalized.length >= 8 && normalized.length <= 15;
}
