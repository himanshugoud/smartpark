import { describe, it, expect } from 'vitest';
const { getSlotPrice, calculateBookingCost, SLOT_PRICES } = require('../pricing.js');

describe('getSlotPrice', () => {
    it('returns the regular rate for a regular slot', () => {
        expect(getSlotPrice('regular')).toBe(2.50);
    });

    it('returns the discounted rate for an electric (EV) slot', () => {
        expect(getSlotPrice('electric')).toBe(2.25);
    });

    it('returns the discounted rate for a handicap slot', () => {
        expect(getSlotPrice('handicap')).toBe(2.00);
    });

    it('falls back to the regular rate for an unknown slot type', () => {
        expect(getSlotPrice('made-up-type')).toBe(SLOT_PRICES.regular);
    });
});

describe('calculateBookingCost', () => {
    it('matches the real 1-hour regular-slot example from the live app ($3.25 total)', () => {
        // This exact case is the one shown in the app's own screenshots/README:
        // 1 hour @ $2.50/hr => $2.50 subtotal, $0.50 service fee, $0.25 tax, $3.25 total.
        const result = calculateBookingCost(1, 2.50);
        expect(result.subtotal).toBeCloseTo(2.50, 2);
        expect(result.serviceFee).toBe(0.50);
        expect(result.tax).toBeCloseTo(0.25, 2);
        expect(result.total).toBeCloseTo(3.25, 2);
    });

    it('scales the subtotal and tax linearly with duration', () => {
        const oneHour = calculateBookingCost(1, 2.50);
        const fourHours = calculateBookingCost(4, 2.50);
        expect(fourHours.subtotal).toBeCloseTo(oneHour.subtotal * 4, 2);
        expect(fourHours.tax).toBeCloseTo(oneHour.tax * 4, 2);
        // Service fee is flat, not per-hour.
        expect(fourHours.serviceFee).toBe(oneHour.serviceFee);
    });

    it('returns zero subtotal/tax/total (but still charges the flat service fee) for a 0-hour booking', () => {
        const result = calculateBookingCost(0, 2.50);
        expect(result.subtotal).toBe(0);
        expect(result.tax).toBe(0);
        expect(result.total).toBe(0.50);
    });

    it('applies the correct rate for an EV slot over a longer booking', () => {
        const result = calculateBookingCost(3, getSlotPrice('electric'));
        expect(result.subtotal).toBeCloseTo(6.75, 2); // 3 * 2.25
        expect(result.total).toBeCloseTo(6.75 + 0.50 + 0.675, 2);
    });

    it('throws on negative duration instead of silently returning a negative price', () => {
        expect(() => calculateBookingCost(-1, 2.50)).toThrow();
    });

    it('throws on negative price-per-hour', () => {
        expect(() => calculateBookingCost(1, -2.50)).toThrow();
    });

    it('throws on non-numeric input rather than returning NaN', () => {
        expect(() => calculateBookingCost('two', 2.50)).toThrow();
    });
});
