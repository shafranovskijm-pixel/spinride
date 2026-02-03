import { useState, useCallback } from 'react';

// Format phone number as +7 (XXX) XXX-XX-XX
export function formatPhone(value: string): string {
  // Remove all non-digit characters except +
  const digits = value.replace(/\D/g, '');
  
  // Always start with 7 for Russian numbers
  let phone = digits;
  if (phone.startsWith('8')) {
    phone = '7' + phone.slice(1);
  }
  if (!phone.startsWith('7') && phone.length > 0) {
    phone = '7' + phone;
  }
  
  // Limit to 11 digits (7 + 10 digit number)
  phone = phone.slice(0, 11);
  
  // Format based on length
  if (phone.length === 0) return '';
  if (phone.length <= 1) return '+7';
  if (phone.length <= 4) return `+7 (${phone.slice(1)}`;
  if (phone.length <= 7) return `+7 (${phone.slice(1, 4)}) ${phone.slice(4)}`;
  if (phone.length <= 9) return `+7 (${phone.slice(1, 4)}) ${phone.slice(4, 7)}-${phone.slice(7)}`;
  return `+7 (${phone.slice(1, 4)}) ${phone.slice(4, 7)}-${phone.slice(7, 9)}-${phone.slice(9)}`;
}

// Validate phone number format
export function isValidPhone(value: string): boolean {
  const digits = value.replace(/\D/g, '');
  return digits.length === 11 && (digits.startsWith('7') || digits.startsWith('8'));
}

// Extract raw digits for storage
export function getPhoneDigits(value: string): string {
  return value.replace(/\D/g, '');
}

export function usePhoneMask(initialValue = '') {
  const [value, setValue] = useState(() => formatPhone(initialValue));
  
  const handleChange = useCallback((input: string) => {
    setValue(formatPhone(input));
  }, []);
  
  const isValid = isValidPhone(value);
  const rawDigits = getPhoneDigits(value);
  
  return {
    value,
    onChange: handleChange,
    isValid,
    rawDigits,
    formatted: value,
  };
}
