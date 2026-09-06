// pricing.js
// Pure pricing logic, extracted from script.js so it can be unit-tested
// without a DOM. No document/window references — safe to run in Node
// (Vitest) or in the browser as a plain <script> include.

// Per-slot-type hourly rate. Matches buildSlotLayout() in script.js.
const SLOT_PRICES = {
    regular: 2.50,
    electric: 2.25,
    handicap: 2.00
};

const SERVICE_FEE = 0.50;
const TAX_RATE = 0.10;

function getSlotPrice(type) {
    return SLOT_PRICES[type] ?? SLOT_PRICES.regular;
}

// duration: hours (number, > 0 expected)
// pricePerHour: dollars/hour for the booked slot
// Returns the same shape used throughout the booking/receipt UI.
function calculateBookingCost(duration, pricePerHour) {
    if (typeof duration !== 'number' || typeof pricePerHour !== 'number' || duration < 0 || pricePerHour < 0) {
        throw new Error('calculateBookingCost: duration and pricePerHour must be non-negative numbers');
    }
    const subtotal = duration * pricePerHour;
    const serviceFee = SERVICE_FEE;
    const tax = subtotal * TAX_RATE;
    const total = subtotal + serviceFee + tax;
    return { subtotal, serviceFee, tax, total };
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { getSlotPrice, calculateBookingCost, SLOT_PRICES, SERVICE_FEE, TAX_RATE };
}
