import { describe, it, expect } from 'vitest';
const {
    validateEmail,
    validateCardNumber,
    validateCardExpiry,
    validateCVV,
    getPasswordStrength
} = require('../validation.js');

describe('validateEmail', () => {
    it('accepts a normal, valid email', () => {
        expect(validateEmail('himanshugoud638@gmail.com')).toBe(true);
    });

    it('rejects an email with no @', () => {
        expect(validateEmail('himanshugoud638gmail.com')).toBe(false);
    });

    it('rejects an email with no domain', () => {
        expect(validateEmail('himanshugoud638@')).toBe(false);
    });

    it('rejects an email containing a space', () => {
        expect(validateEmail('himanshu goud@gmail.com')).toBe(false);
    });

    it('rejects an empty string', () => {
        expect(validateEmail('')).toBe(false);
    });
});

describe('validateCardNumber', () => {
    it('accepts a standard 16-digit card number', () => {
        expect(validateCardNumber('4111111111111111')).toBe(true);
    });

    it('accepts a 16-digit number with spaces (as typed in a form)', () => {
        expect(validateCardNumber('4111 1111 1111 1111')).toBe(true);
    });

    it('rejects a card number that is too short', () => {
        expect(validateCardNumber('123456')).toBe(false);
    });

    it('rejects a card number containing letters', () => {
        expect(validateCardNumber('4111-abcd-1111-1111')).toBe(false);
    });
});

describe('validateCardExpiry', () => {
    // Fix "now" to a known date so this test is not hostage to whatever
    // day it happens to run on.
    const FIXED_NOW = new Date('2026-06-15');

    it('accepts a future expiry date', () => {
        expect(validateCardExpiry('12/27', FIXED_NOW)).toBe(true);
    });

    it('accepts the current month/year as still valid', () => {
        expect(validateCardExpiry('06/26', FIXED_NOW)).toBe(true);
    });

    it('rejects a date from an earlier month in the current year', () => {
        expect(validateCardExpiry('01/26', FIXED_NOW)).toBe(false);
    });

    it('rejects a date from a past year', () => {
        expect(validateCardExpiry('12/24', FIXED_NOW)).toBe(false);
    });

    it('rejects a malformed expiry string', () => {
        expect(validateCardExpiry('2026-06', FIXED_NOW)).toBe(false);
    });

    it('rejects an invalid month like 13', () => {
        expect(validateCardExpiry('13/27', FIXED_NOW)).toBe(false);
    });
});

describe('validateCVV', () => {
    it('accepts a 3-digit CVV', () => {
        expect(validateCVV('123')).toBe(true);
    });

    it('accepts a 4-digit CVV (Amex-style)', () => {
        expect(validateCVV('1234')).toBe(true);
    });

    it('rejects a 2-digit CVV', () => {
        expect(validateCVV('12')).toBe(false);
    });

    it('rejects a CVV containing letters', () => {
        expect(validateCVV('12a')).toBe(false);
    });
});

describe('getPasswordStrength', () => {
    it('scores a short, all-lowercase password as Weak', () => {
        expect(getPasswordStrength('abc').label).toBe('Weak');
    });

    it('scores a long password with a number as Fair', () => {
        // length>=8 + has-number = 2 criteria met
        expect(getPasswordStrength('abcdefgh1').label).toBe('Fair');
    });

    it('scores a long password with uppercase and a number as Good', () => {
        expect(getPasswordStrength('Abcdefgh1').label).toBe('Good');
    });

    it('scores a long password meeting all four criteria as Strong', () => {
        expect(getPasswordStrength('Abcdefgh1!').label).toBe('Strong');
    });

    it('reports a 0-25-50-75-100 width matching the score, for the strength bar UI', () => {
        expect(getPasswordStrength('Abcdefgh1!').widthPercent).toBe(100);
        expect(getPasswordStrength('abc').widthPercent).toBe(0);
    });
});
