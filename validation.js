// validation.js
// Pure validation logic, extracted from script.js so it can be unit-tested
// without a DOM. No document/window references.

function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function validateCardNumber(number) {
    const re = /^[0-9]{13,19}$/;
    return re.test(number.replace(/\s/g, ''));
}

// `now` is injectable (defaults to the real current date) specifically so
// expiry-date tests aren't hostage to whatever day they happen to run on.
function validateCardExpiry(expiry, now = new Date()) {
    const re = /^(0[1-9]|1[0-2])\/([0-9]{2})$/;
    if (!re.test(expiry)) return false;

    const [month, year] = expiry.split('/');
    const currentYear = now.getFullYear() % 100;
    const currentMonth = now.getMonth() + 1;

    if (parseInt(year) < currentYear) return false;
    if (parseInt(year) === currentYear && parseInt(month) < currentMonth) return false;

    return true;
}

function validateCVV(cvv) {
    const re = /^[0-9]{3,4}$/;
    return re.test(cvv);
}

// Same scoring rules as the original inline logic in setupPasswordStrength(),
// just separated from the DOM code that displays it.
function getPasswordStrength(password) {
    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    let label = 'Weak';
    if (score >= 4) label = 'Strong';
    else if (score >= 3) label = 'Good';
    else if (score >= 2) label = 'Fair';

    return { score, label, widthPercent: score * 25 };
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { validateEmail, validateCardNumber, validateCardExpiry, validateCVV, getPasswordStrength };
}
