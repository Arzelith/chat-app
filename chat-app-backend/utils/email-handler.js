const nodemailer = require('nodemailer');

const sendMail = async (to, subject, url, userName) => {
  let transport = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: process.env.MAILER_USER,
      pass: process.env.MAILER_PASSWORD,
    },
  });

  const mailOptions = {
    from: `"Mern chat app" <${process.env.MAILER_USER}>`,
    to,
    subject,
    html: `<p>Saludos ${userName}</p>
    <p>Finalize el registro en Mern chat app haciendo clic en el siguiente enlace:</p>
    <a href=${url}>${url}</a>`,
  };
  try {
    return await transport.sendMail(mailOptions);
  } catch (error) {
    console.log(error);
  }
};

module.exports = sendMail;
