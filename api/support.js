const nodemailer = require("nodemailer");

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const { name, email, description } = req.body || {};

  if (!name || !email || !description) {
    res.status(400).json({ error: "Missing fields" });
    return;
  }

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: process.env.SMTP_SECURE === "true",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  try {
    await transporter.sendMail({
      from: process.env.SUPPORT_FROM || process.env.SMTP_USER,
      to: "insanitybjones@gmail.com",
      subject: "Customer Support Request",
      text: `Name: ${name}\nEmail: ${email}\n\n${description}`,
    });

    res.status(200).json({ ok: true });
  } catch (error) {
    res.status(500).json({ error: "Failed to send email" });
  }
};
