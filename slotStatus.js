// slotStatus.js
// Pure slot-status logic, extracted from script.js so it can be unit-tested
// without a DOM or a live appState. The original version read
// `appState.bookings` directly out of global state, which made it
// impossible to test in isolation — this version takes bookings and the
// current time as explicit parameters instead.

function computeAuthoritativeSlotStatusPure(floor, slotId, bookings, now = Date.now()) {
    const relevantBookings = bookings.filter(
        b => b.status === 'confirmed' && b.floor === floor && b.slotId === slotId
    );

    if (relevantBookings.length === 0) return 'available';

    const isActiveNow = relevantBookings.some(b => {
        const start = new Date(b.startTime).getTime();
        const end = new Date(b.endTime).getTime();
        return isFinite(start) && isFinite(end) && now >= start && now <= end;
    });
    if (isActiveNow) return 'occupied';

    const upcoming = relevantBookings
        .filter(b => {
            const start = new Date(b.startTime).getTime();
            const end = new Date(b.endTime).getTime();
            return isFinite(start) && isFinite(end) && now < start && now <= end;
        })
        .sort((a, b) => new Date(a.startTime) - new Date(b.startTime));

    if (upcoming.length === 0) return 'available';

    return upcoming[0].isAdvanceBooking ? 'reserved' : 'booked';
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { computeAuthoritativeSlotStatusPure };
}
