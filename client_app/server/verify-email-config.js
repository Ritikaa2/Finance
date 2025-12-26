const nodemailer = require('nodemailer');
require('dotenv').config();

const verifyConfig = async () => {
    console.log('--- Checking Email Configuration ---');
    console.log(`SMTP_HOST: ${process.env.SMTP_HOST}`);
    console.log(`SMTP_PORT: ${process.env.SMTP_PORT}`);
    console.log(`SMTP_USER: ${process.env.SMTP_USER ? 'Set' : 'Not Set'}`);
    console.log(`SMTP_PASS: ${process.env.SMTP_PASS ? 'Set' : 'Not Set'}`);
    console.log(`FROM_EMAIL: ${process.env.FROM_EMAIL}`);

    if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
        console.error('ERROR: Missing required environment variables.');
        return;
    }

    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        secure: false,
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
        },
    });

    try {
        console.log('Verifying SMTP connection...');
        await transporter.verify();
        console.log('SUCCESS: SMTP connection verified!');
    } catch (error) {
        console.error('FAILURE: Could not connect to SMTP server.');
        console.error(error);
    }
};

verifyConfig();
