import nodemailer from "nodemailer";

class MailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    });
  }

  async sendActivationMail(to, link) {
    await this.transporter.sendMail({
      from: process.env.SMTP_USER,
      to,
      subject: "Account activation on " + process.env.SERVER_URL,
      text: "",
      html: `
        <div>
          <h3>You have just requested confirmation of your email.</h3>
          <p>If it was not you ignore this message. Otherwise follow the link to confirm this email <a href="${link}">link</a>.</p>
        </div>`,
    });
  }

  async sendResetLinkMail(to, link) {
    await this.transporter.sendMail({
      from: process.env.SMTP_USER,
      to,
      subject: "Password resetting on " + process.env.SERVER_URL,
      text: "",
      html: `
        <div>
          <h3>You have just requested reseting password.</h3>
          <p>If it was not you ignore this message. Otherwise follow the link to reset password <a href="${link}">link</a>.</p>
        </div>`,
    });
  }

  async sendBidLost(to, lotName, lotId) {
    const link = `${process.env.CLIENT_URL}/lots/${lotId}`;

    await this.transporter.sendMail({
      from: process.env.SMTP_USER,
      to,
      subject: "Bid lost on " + process.env.SERVER_URL,
      text: "",
      html: `
        <div>
          <h3>Someone has put bigger bid on <a href="${link}">${lotName}</a> then you.</h3>
        </div>`,
    });
  }
}

const mailService = new MailService();
export default mailService;
