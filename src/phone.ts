import GoogleLibPhoneNumber from 'google-libphonenumber';

import { COUNTRY_CODES } from './country-codes.js';

export class PhoneUtils {
  static readonly COUNTRY_CODES = COUNTRY_CODES;

  static readonly MOBILE_TYPES = [
    GoogleLibPhoneNumber.PhoneNumberType.FIXED_LINE_OR_MOBILE,
    GoogleLibPhoneNumber.PhoneNumberType.MOBILE,
    GoogleLibPhoneNumber.PhoneNumberType.PERSONAL_NUMBER,
  ];

  /**
   * Format a phone number to a preferred country code
   * formatPhone('+33612345678', 'FR') => 06 12 34 56 78
   * formatPhone('+33612345678', 'US') => +33 612345678
   */
  static formatPhone(
    phoneNumber: string,
    preferredCountryCode: string,
  ): string {
    if (preferredCountryCode === 'UK') preferredCountryCode = 'GB';
    try {
      const phoneUtil = GoogleLibPhoneNumber.PhoneNumberUtil.getInstance();
      const number = phoneUtil.parse(phoneNumber.replace(/\s/g, ''));
      const cc1 = number.getCountryCode();
      const cc2 = phoneUtil.getCountryCodeForRegion(preferredCountryCode);
      if (phoneUtil.isValidNumber(number) && cc1) {
        if (cc1 === cc2) {
          return phoneUtil.format(
            number,
            GoogleLibPhoneNumber.PhoneNumberFormat.NATIONAL,
          );
        } else {
          const formatted = phoneUtil.format(
            number,
            GoogleLibPhoneNumber.PhoneNumberFormat.E164,
          );
          return `+${cc1} ${formatted.slice(String(cc1).length + 1)}`;
        }
      }
    } catch {}
    throw new Error('Invalid');
  }

  static isMobile(phoneNumber: string) {
    try {
      const phoneUtil = GoogleLibPhoneNumber.PhoneNumberUtil.getInstance();
      const number = phoneUtil.parse(phoneNumber.replace(/\s/g, ''));
      return (
        phoneUtil.getNumberType(number) ===
        GoogleLibPhoneNumber.PhoneNumberType.MOBILE
      );
    } catch {}
    return false;
  }

  static standardizeToInternational(phone: string) {
    const phoneUtil = GoogleLibPhoneNumber.PhoneNumberUtil.getInstance();
    const number = phoneUtil.parse(phone.replace(/\s/g, ''), 'FR');
    const formatted = phoneUtil.format(
      number,
      GoogleLibPhoneNumber.PhoneNumberFormat.E164,
    );
    return formatted;
  }

  /**
   * Try to make it work, by different ways, with a possible suggested country code
   * validatePhone('12025550134', 'FR') => +1 2025550134
   */
  static validatePhone(
    phoneNumber: string,
    suggestedCountryCode: string,
    allowedPhoneTypes = PhoneUtils.MOBILE_TYPES,
  ): string {
    if (suggestedCountryCode === 'UK') suggestedCountryCode = 'GB';
    try {
      const phoneUtil = GoogleLibPhoneNumber.PhoneNumberUtil.getInstance();

      // Clean whitespace
      const cleanedNumber = phoneNumber.replace(/\s/g, '');

      let number: GoogleLibPhoneNumber.PhoneNumber;
      if (cleanedNumber.startsWith('+')) {
        // Already has + prefix, parse as-is
        number = phoneUtil.parse(cleanedNumber);
      } else if (cleanedNumber.startsWith('00')) {
        // Convert 00 to + and parse
        number = phoneUtil.parse(`+${cleanedNumber.slice(2)}`);
      } else {
        // The number is not international, we use the suggested country code
        number = phoneUtil.parse(cleanedNumber, suggestedCountryCode);
        if (!phoneUtil.isValidNumber(number)) {
          // It was parsed but it could be invalid, last attempt
          number = phoneUtil.parse(`+${cleanedNumber}`);
        }
      }

      if (phoneUtil.isValidNumber(number)) {
        const phoneType = phoneUtil.getNumberType(number);
        const cc = String(number.getCountryCode());
        const formatted = phoneUtil.format(
          number,
          GoogleLibPhoneNumber.PhoneNumberFormat.E164,
        );
        const result = `+${cc} ${formatted.slice(cc.length + 1)}`;
        if (allowedPhoneTypes.includes(phoneType)) {
          return result;
        }
        throw new Error(`Not mobile: ${result}`);
      }
    } catch {}
    throw new Error('Invalid');
  }
}
