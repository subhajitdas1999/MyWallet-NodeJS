const dotenv = require('dotenv');
const pug = require('pug');
const nodemailer = require('nodemailer');
const htmlToText = require('html-to-text');

dotenv.config({ path: '../config.env' });

class Email {
  constructor(user) {
    this.to = user.email;
    this.form = process.env.EMAIL_FROM;
    this.userName = user.name;
    this.accountBalance = user.accountBalance;
  }

  //create and return a nodemailer transport
  newTransport() {
    return nodemailer.createTransport({
      service: 'SendGrid',
      auth: {
        user: process.env.SENDGRID_USERNAME,
        pass: process.env.SENDGRID_PASSWORD,
      },
    });
  }

  //send the email
  async send(template, subject,otherDetails={}) {
    // 1) Render HTML based on pug template
    const html = pug.renderFile(
      `${__dirname}/../emailTemplates/${template}.pug`,
      {
        name: this.userName,
        accountBalance:this.accountBalance,
        subject,
        otherDetails
        
      }
    );
    // define mail options
    const mailoptions = {
      from: `"MyWallet" <${this.form}>`,
      to: this.to,
      html,
      subject,
      // text:htmlToText.convert(html,{wordwrap:130})
    };

    //create a transport and send email
    await this.newTransport().sendMail(mailoptions);
    // console.log("sent")
  }

  //welcome message
  async sendWelcome() {
    await this.send('welcome', 'welcome to MyWallet');
  }

  //Txsuccess message
  async sendTxSuccess(recieverName){
    await this.send('txSuccess', 'Transaction is successful',{recieverName});
  }

  //Txfail message
  async sendfail(recieverName){
    await this.send('txfail', 'Transaction is Unsuccessful',{recieverName});
  }
}

module.exports = Email;
