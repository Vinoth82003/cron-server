const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAILKEY,
  },
});

const sendReminderEmail = async (user, eventDetails) => {
  const { name, email } = user;
  const { title, tagline, fromDate } = eventDetails;

  // Convert fromDate to desired format
  const eventDate = new Date(fromDate);
  const formattedDate = eventDate.toISOString().split("T")[0];
  const monthNames = [
    "JAN",
    "FEB",
    "MAR",
    "APR",
    "MAY",
    "JUN",
    "JUL",
    "AUG",
    "SEP",
    "OCT",
    "NOV",
    "DEC",
  ];
  const month = monthNames[eventDate.getUTCMonth()];
  const day = eventDate.getUTCDate();
  const year = eventDate.getUTCFullYear();

  const mailOptions = {
    from: process.env.EMAIL,
    to: email,
    subject: `Reminder: ${title} on ${formattedDate}`,
    text: `Hello ${name},\n\nThis is a friendly reminder about your upcoming event:\n\n📅 Date: ${formattedDate}\n\nPlease be on time and let us know if you have any questions.\n\nBest regards,\nMTMHSS Team\nmothertheresa-support@gmail.com`,
    html: `
      <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
        <table style="max-width: 600px; width: 100%; background: #ffffff; padding: 20px; border-radius: 8px; box-shadow: 0 0 10px rgba(0,0,0,0.1); margin: 0 auto;">
          <!-- LOGO -->
          <tr>
            <td
              style="
                text-align: center;
                padding: 20px;
                background-color: #f4f4f4;
                border-radius: 0 0 8px 8px;
              "
            >
              <img
                src="https://mothertheresa.vercel.app/logo.png"
                alt="MTMHSS Logo"
                style="max-width: 100px; display: block; margin: 0 auto"
              />
              <h1 style="margin-top: 10px; color: #333">MTMHSS</h1>
            </td>
          </tr>
          <!-- Header Section -->
          <tr>
            <td style="text-align: center; padding: 20px; background-color: #007bff; color: #ffffff; border-radius: 8px 8px 0 0; margin: 10px 0;">
              <h2 style="margin: 0;">${month} <span style="font-size: 24px; font-weight: bold;">${day}</span> ${year}</h2>
            </td>
          </tr>
          <!-- Event Title -->
          <tr>
            <td style="padding: 20px; text-align: center; font-size: 20px; font-weight: bold; color: #007bff;">
              ${title}
            </td>
          </tr>
          <!-- Event Details -->
          <tr>
            <td style="padding: 20px; text-align: left; font-size: 16px; color: #333;">
              <p>Dear ${name},</p>
              <p>${tagline}</p>
              <p><strong>📅 Date:</strong> ${formattedDate}</p>
              <p style="font-size: 14px; color: #555; margin-top: 10px;">
                Please be on time and let us know if you have any questions.
              </p>
            </td>
          </tr>
          <!-- Footer Section -->
          <tr>
            <td style="text-align: center; padding: 20px; background-color: #f4f4f4; border-radius: 0 0 8px 8px;">
              <p style="font-size: 14px; color: #666;">Mother Theresa Matriculation Higher Secondary School</p>
              <p style="font-size: 12px; color: #999;">Providing quality education for a better future.</p>
              <p style="font-size: 12px; color: #999;">If you have any issues, please contact our support team.</p>
            </td>
          </tr>
        </table>
      </body>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Reminder email sent to ${email}`);
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

module.exports = sendReminderEmail;
