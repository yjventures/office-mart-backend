const path = require("path");
const fs = require("fs");
const { SendEmailUtils } = require('../utils/send_email_utils');

const sendEmailwithTextOnly = async (req, res) => {
  try {
    const email = req?.body?.email;
    const emailText = req?.body?.email_text;
    const emailSubject = req?.body?.email_subject;
    const emailStatus = await SendEmailUtils(
      email,
      emailText,
      emailSubject
    );
    const emailSent = emailStatus.accepted.find((item) => {
      return item === email;
    });
    if (emailSent) {
      res.status(200).json({ message: 'Email sent successfully' });
    } else {
      res.status(400).json({ message: 'Email cannot be sent' });
    }
  } catch(err) {
    res.status(500).json({ message: "something went wrong" });
  }
};

const readFile = async (filePath) => {
  try {
    const buffer = await fs.promises.readFile(filePath);
    return buffer;
  } catch (err) {
    console.error('Error reading file:', err);
    return null; // Handle error appropriately
  }
};

const sendEmailwithTextAndFile = async (req, res) => {
  try {
    const email = req?.body?.email;
    const emailText = req?.body?.email_text;
    const emailSubject = req?.body?.email_subject;
    const fullPath = path.join(
      process.env.BULK_PRODUCT_FILE_LOCATION,
      req.file.filename
    );
    const productExtension = req.file.filename.split('.')[1];
    const contentType = `application/${productExtension}`;
    const fileContent = await readFile(fullPath);
    const attachments = [
      {
        filename: req.file.originalname,
        content: fileContent,
        contentType
      }
    ];
    const emailStatus = await SendEmailUtils(
      email,
      emailText,
      emailSubject,
      attachments
    );
    fs.unlinkSync(fullPath);
    const emailSent = emailStatus.accepted.find((item) => {
      return item === email;
    });
    if (emailSent) {
      res.status(200).json({ message: 'Email sent successfully' });
    } else {
      res.status(400).json({ message: 'Email cannot be sent' });
    }
  } catch(err) {
    res.status(500).json({ message: "something went wrong" });
  }
};

const sendEmailToMultipleUsers = async (req, res) => {
  try {
    const emails = req?.body?.emails;
    const emailText = req?.body?.email_text;
    const emailSubject = req?.body?.email_subject;
    const error = [];
    for (let email of emails) {
      const emailStatus = await SendEmailUtils(
        email,
        emailText,
        emailSubject
      );
      const emailSent = emailStatus.accepted.find((item) => {
        return item === email;
      });
      if (!emailSent) {
        error.push('email');
      }
    }
    if (error.length === emails.length) {
      res.status(400).json({ message: "No email is sent" });
    } else if(error.length === 0) {
      res.status(200).json({ message: "All email sent successfully" });
    } else {
      res.status(200).json({ message: "Some email sent successfully" });
    }
  } catch(err) {
    res.status(500).json({ message: "something went wrong" });
  }
};

module.exports = {
  sendEmailwithTextOnly,
  sendEmailwithTextAndFile,
  sendEmailToMultipleUsers,
};