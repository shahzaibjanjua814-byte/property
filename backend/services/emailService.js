import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: process.env.EMAIL_PORT || 465,
    secure: true, // SSL
    auth: {
        user: process.env.EMAIL_USER || 'adeelgwa@gmail.com',
        pass: process.env.EMAIL_PASS || 'mgologwwfxcexwdc'
    }
});

// Verify SMTP connection
transporter.verify(function (error, success) {
    if (error) {
        console.error('✗ SMTP connection failed:', error);
    } else {
        console.log('✓ SMTP server ready via EmailService');
    }
});

export const sendVerificationEmail = async (email, name, code) => {
    try {
        const mailOptions = {
            from: '"Aura Home" <adeelgwa@gmail.com>',
            to: email,
            subject: 'Aura Home - Email Verification Code',
            html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Welcome to Aura Home, ${name}!</h2>
          <p>Thank you for registering with Aura Home Real Estate Platform.</p>
          <p style="margin-top: 20px;">Your email verification code is:</p>
          <div style="background-color: #f0f0f0; padding: 20px; text-align: center; border-radius: 5px; margin: 20px 0;">
            <h1 style="letter-spacing: 5px; color: #333; margin: 0;">${code}</h1>
          </div>
          <p>This code will expire in 15 minutes.</p>
          <p style="color: #666; font-size: 14px;">If you did not sign up for this account, please ignore this email.</p>
          <br>
          <p>Regards,<br><strong>Aura Home Team</strong></p>
        </div>
      `
        };

        await transporter.sendMail(mailOptions);
        console.log(`✓ Verification email sent to ${email}`);
        return true;
    } catch (error) {
        console.error('Error sending verification email:', error);
        return false;
    }
};

export const sendPasswordResetEmail = async (email, name, resetCode) => {
    try {
        const mailOptions = {
            from: '"Aura Home" <adeelgwa@gmail.com>',
            to: email,
            subject: 'Aura Home - Password Reset Code',
            html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Password Reset Request</h2>
          <p>Dear ${name},</p>
          <p>You requested a password reset for your Aura Home account.</p>
          <p style="margin-top: 20px;">Your password reset verification code is:</p>
          <div style="background-color: #f0f0f0; padding: 20px; text-align: center; border-radius: 5px; margin: 20px 0;">
            <h1 style="letter-spacing: 5px; color: #333; margin: 0;">${resetCode}</h1>
          </div>
          <p><strong>Security Note:</strong> This code will expire in 15 minutes.</p>
          <p style="color: #666; font-size: 14px;">If you did not request this password reset, please ignore this email and your password will remain unchanged.</p>
          <br>
          <p>Regards,<br><strong>Aura Home Team</strong></p>
        </div>
      `
        };

        await transporter.sendMail(mailOptions);
        console.log(`✓ Password reset email sent to ${email}`);
        return true;
    } catch (error) {
        console.error('✗ Error sending password reset email:', error);
        return false;
    }
};
