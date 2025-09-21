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
}
