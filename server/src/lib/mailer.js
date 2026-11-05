'use strict';

// Email delivery is not wired up yet (SendGrid is planned). Until then, messages are written
// to the server log in development so flows like "forgot password" can be exercised locally.
// In production nothing is logged, so temporary credentials never end up in log files.
async function sendMail({ to, subject, text }) {
  if (process.env.NODE_ENV === 'production') {
    console.warn(`[mailer] Email delivery not configured — dropped "${subject}" to ${to}`);
    return { delivered: false };
  }
  console.log(`\n[mailer] (dev) To: ${to}\n[mailer] Subject: ${subject}\n${text}\n`);
  return { delivered: false };
}

module.exports = { sendMail };
