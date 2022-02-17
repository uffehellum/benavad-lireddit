import nodemailer from "nodemailer";

export async function sendEmail(to: string, subject: string, html: string) {
  // Generate test SMTP service account from ethereal.email
  // Only needed if you don't have a real mail account for testing
//   let testAccount = await nodemailer.createTestAccount();
//   console.log("testAccount", testAccount);
    /*
    testAccount {
    user: 'swtbjfvsri6scr7a@ethereal.email',
    pass: 'QcQtyq5Cw1q72cWQmZ',
    smtp: { host: 'smtp.ethereal.email', port: 587, secure: false },
    imap: { host: 'imap.ethereal.email', port: 993, secure: true },
    pop3: { host: 'pop3.ethereal.email', port: 995, secure: true },
    web: 'https://ethereal.email'
    }
    */

  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: "swtbjfvsri6scr7a@ethereal.email", // generated ethereal user
      pass: "QcQtyq5Cw1q72cWQmZ", // generated ethereal password
    },
  });

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: '"Fred Foo 👻" <foo@example.com>', // sender address
    to, // list of receivers
    subject,
    html,
  });

  console.log("Message sent: %s", info.messageId);
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
}
