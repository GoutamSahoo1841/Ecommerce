import nodemailer from 'nodemailer';

const sendEmail = async (options) => {
  let transporter;
  let isEthereal = false;

  if (process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD) {
    // Use Gmail SMTP
    console.log(`[Email Service] Using Gmail SMTP (${process.env.GMAIL_USER}) to send to: ${options.email}`);
    transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });
  } else if (process.env.SMTP_HOST) {
    // Use Custom SMTP Server
    console.log(`[Email Service] Using SMTP Host (${process.env.SMTP_HOST}) to send to: ${options.email}`);
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT || 587,
      secure: process.env.SMTP_PORT == 465,
      auth: {
        user: process.env.SMTP_EMAIL,
        pass: process.env.SMTP_PASSWORD,
      },
    });
  } else {
    // Fallback: Generate test SMTP service account from ethereal.email for local dev
    isEthereal = true;
    console.log(`[Email Service] No Gmail credentials found. Using Ethereal Email test account for: ${options.email}`);
    const testAccount = await nodemailer.createTestAccount();
    transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });
  }

  const senderEmail = process.env.GMAIL_USER || process.env.FROM_EMAIL || 'noreply@ecommerce.com';
  const senderName = process.env.FROM_NAME || 'Ecommerce App';

  const message = {
    from: `"${senderName}" <${senderEmail}>`,
    to: options.email,
    subject: options.subject,
    text: options.message,
    html: options.html,
  };

  const info = await transporter.sendMail(message);

  console.log('[Email Service] Message sent successfully to %s! ID: %s', options.email, info.messageId);
  if (isEthereal) {
    console.log('[Email Service] Preview URL: %s', nodemailer.getTestMessageUrl(info));
  }
};

export default sendEmail;


