import { describe, it, expect } from 'vitest';
const { computeAuthoritativeSlotStatusPure } = require('../slotStatus.js');

// A fixed reference point in time for every test, so results don't depend
// on when the test suite happens to run.
const NOW = new Date('2026-06-15T12:00:00Z').getTime();
const HOUR = 60 * 60 * 1000;

function booking(overrides) {
    return {
        status: 'confirmed',
        floor: 'ground',
        slotId: 'A-01',
        startTime: new Date(NOW - HOUR).toISOString(),
        endTime: new Date(NOW + HOUR).toISOString(),
        isAdvanceBooking: false,
        ...overrides
    };
}

describe('computeAuthoritativeSlotStatusPure', () => {
    it('returns "available" when there are no bookings at all for the slot', () => {
        expect(computeAuthoritativeSlotStatusPure('ground', 'A-01', [], NOW)).toBe('available');
    });

    it('returns "available" when bookings exist but for a different slot', () => {
        const bookings = [booking({ slotId: 'A-02' })];
        expect(computeAuthoritativeSlotStatusPure('ground', 'A-01', bookings, NOW)).toBe('available');
    });

    it('returns "available" when bookings exist but for a different floor', () => {
        const bookings = [booking({ floor: 'first' })];
        expect(computeAuthoritativeSlotStatusPure('ground', 'A-01', bookings, NOW)).toBe('available');
    });

    it('ignores cancelled bookings and reports the slot as available', () => {
        const bookings = [booking({ status: 'cancelled' })];
        expect(computeAuthoritativeSlotStatusPure('ground', 'A-01', bookings, NOW)).toBe('available');
    });

    it('returns "occupied" when the current time falls inside an active booking window', () => {
        const bookings = [booking()]; // NOW-1h to NOW+1h — currently active
        expect(computeAuthoritativeSlotStatusPure('ground', 'A-01', bookings, NOW)).toBe('occupied');
    });

    it('returns "booked" for a normal upcoming reservation that has not started yet', () => {
        const bookings = [booking({
            startTime: new Date(NOW + HOUR).toISOString(),
            endTime: new Date(NOW + 2 * HOUR).toISOString(),
            isAdvanceBooking: false
        })];
        expect(computeAuthoritativeSlotStatusPure('ground', 'A-01', bookings, NOW)).toBe('booked');
    });

    it('returns "reserved" for an upcoming advance booking specifically', () => {
        const bookings = [booking({
            startTime: new Date(NOW + HOUR).toISOString(),
            endTime: new Date(NOW + 2 * HOUR).toISOString(),
            isAdvanceBooking: true
        })];
        expect(computeAuthoritativeSlotStatusPure('ground', 'A-01', bookings, NOW)).toBe('reserved');
    });

    it('returns "available" once a booking has fully ended in the past', () => {
        const bookings = [booking({
            startTime: new Date(NOW - 3 * HOUR).toISOString(),
            endTime: new Date(NOW - 2 * HOUR).toISOString()
        })];
        expect(computeAuthoritativeSlotStatusPure('ground', 'A-01', bookings, NOW)).toBe('available');
    });

    it('picks the soonest upcoming booking when a slot has several future reservations', () => {
        const soon = booking({
            startTime: new Date(NOW + HOUR).toISOString(),
            endTime: new Date(NOW + 2 * HOUR).toISOString(),
            isAdvanceBooking: true
        });
        const later = booking({
            startTime: new Date(NOW + 5 * HOUR).toISOString(),
            endTime: new Date(NOW + 6 * HOUR).toISOString(),
            isAdvanceBooking: false
        });
        // Order shouldn't matter — the function must sort by start time itself.
        const result = computeAuthoritativeSlotStatusPure('ground', 'A-01', [later, soon], NOW);
        expect(result).toBe('reserved'); // matches `soon`, which is an advance booking
    });

    it('treats a booking with malformed/unparseable dates as not affecting availability', () => {
        const bookings = [booking({ startTime: 'not-a-date', endTime: 'also-not-a-date' })];
        expect(computeAuthoritativeSlotStatusPure('ground', 'A-01', bookings, NOW)).toBe('available');
    });
});
