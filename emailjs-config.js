// ============================================================
// EmailJS configuration — fill these in after setting up your
// free EmailJS account (emailjs.com). This is the ONLY file you
// need to edit to turn on booking confirmation emails.
//
// Where to find each value in the EmailJS dashboard:
//   publicKey  -> Account > General > Public Key
//   serviceId  -> Email Services > (your connected Gmail) > Service ID
//   templateId -> Email Templates > (your template) > Template ID
// ============================================================
const EMAILJS_CONFIG = {
    publicKey: 'Y6unG_VxIPzJfe-oN',
    serviceId: 'service_dfx94nb',
    templateId: 'template_y9v3p8g'
};

// Initializes EmailJS as soon as this file loads. Safe to leave in place
// even before you've filled in real keys — sendBookingConfirmationEmail()
// in script.js checks for placeholder values and simply skips sending
// (with a console note) rather than throwing an error, so booking still
// works normally while this is unconfigured.
if (typeof emailjs !== 'undefined') {
    emailjs.init({ publicKey: EMAILJS_CONFIG.publicKey });
}
