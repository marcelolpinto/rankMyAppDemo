const nodemailer = require('nodemailer');

class EmailSender {

	constructor() {
		this.senderMail = 'rmappdemo@gmail.com';
		this.senderMailPassword = 'rma123!@';

		this.sendTextMail = this.sendTextMail.bind(this);
		this.sendHtmlMail = this.sendHtmlMail.bind(this);
	}

	init() {
		this.transporter = nodemailer.createTransport({
			host: 'smtp.gmail.com',
			port: 465,
			secure: true,
			auth: {
				user: this.senderMail,
				pass: this.senderMailPassword
			}
		});
	}

	sendTextMail(to, subject, text) {
		const mailOptions = {
			from: this.senderMail,
			to, subject, text
		};

		return this.transporter.sendMail(mailOptions);
	}

	sendHtmlMail(to, subject, html) {
		const mailOptions = {
			from: this.senderMail,
			to, subject, html
		};

		return this.transporter.sendMail(mailOptions);
	}
}

module.exports = EmailSender;