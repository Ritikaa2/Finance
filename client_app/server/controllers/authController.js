const User = require('../models/User');
const PasswordResetToken = require('../models/PasswordResetToken');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const sendEmail = require('../utils/emailService');

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res, next) => {
    try {
        const { name, email, password, role } = req.body;

        // Check if user exists
        let user = await User.findOne({ email });

        if (user) {
            if (user.isVerified) {
                return res.status(400).json({ success: false, message: 'User already exists' });
            }

            // User exists but is NOT verified.
            // Update details and resend OTP.
            // Hash password
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            user.name = name;
            user.password = hashedPassword;
            user.role = role;
            // user.isVerified remains false
            await user.save();

        } else {
            // New user
            // Hash password
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            // Create user
            user = await User.create({
                name,
                email,
                password: hashedPassword,
                role,
                isVerified: false
            });
        }

        // Generate 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        // Check if token exists for user, delete it (cleanup any old reset/verify tokens)
        await PasswordResetToken.deleteMany({ user: user._id });

        // Create new OTP token (Reusing PasswordResetToken model for verification OTP as well for simplicity)
        await PasswordResetToken.create({
            user: user._id,
            token: otp,
            createdAt: Date.now()
        });

        const message = `Your email verification OTP is: ${otp}`;

        try {
            await sendEmail({
                email: user.email,
                subject: 'Email Verification OTP',
                message,
            });

            res.status(200).json({
                success: true,
                data: 'OTP sent to email',
                otpSent: true,
                email: user.email
            });
        } catch (err) {
            console.error('Email send failed:', err);

            // In DEVELOPMENT, return OTP
            if (process.env.NODE_ENV === 'development' || !process.env.NODE_ENV) {
                return res.status(200).json({
                    success: true,
                    data: 'Email could not be sent (Dev Mode)',
                    otpSent: true,
                    email: user.email,
                    debug: {
                        otp: otp
                    }
                });
            }

            // Clean up user if email fails? No, let them retry.
            return res.status(500).json({ success: false, message: 'Email could not be sent' });
        }

    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        // Validate email & password
        if (!email || !password) {
            return res.status(400).json({ success: false, message: 'Please provide an email and password' });
        }

        // Check for user
        const user = await User.findOne({ email }).select('+password');
        if (!user) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        // Check if user is verified
        if (!user.isVerified) {
            return res.status(401).json({ success: false, message: 'Please verify your email first' });
        }

        // Check if password matches
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        sendTokenResponse(user, 200, res);
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);
        res.status(200).json({ success: true, data: user });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// @desc    Forgot Password (OTP)
// @route   POST /api/auth/forgotpassword
// @access  Public
exports.forgotPassword = async (req, res, next) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user) {
            return res.status(404).json({ success: false, message: 'There is no user with that email' });
        }

        // Generate 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        // Check if token exists for user, delete it
        await PasswordResetToken.deleteMany({ user: user._id });

        // Create new OTP token
        await PasswordResetToken.create({
            user: user._id,
            token: otp,
            createdAt: Date.now() // Reset expiry countdown
        });

        const message = `Your password reset OTP is: ${otp}`;

        try {
            await sendEmail({
                email: user.email,
                subject: 'Password Reset OTP',
                message,
            });

            res.status(200).json({ success: true, data: 'OTP sent to email (Check spam folder)' });
        } catch (err) {
            console.error('Email send failed:', err);

            // In DEVELOPMENT, return OTP
            if (process.env.NODE_ENV === 'development' || !process.env.NODE_ENV) {
                return res.status(200).json({
                    success: true,
                    data: 'Email could not be sent (Dev Mode)',
                    debug: {
                        otp: otp
                    }
                });
            }

            return res.status(500).json({ success: false, message: 'Email could not be sent' });
        }
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// @desc    Verify OTP for Registration
// @route   POST /api/auth/register/verify
// @access  Public
exports.verifyRegistrationOtp = async (req, res, next) => {
    try {
        const { email, otp } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        if (user.isVerified) {
            return res.status(400).json({ success: false, message: 'User already verified. Please login.' });
        }

        const resetTokenDoc = await PasswordResetToken.findOne({
            user: user._id,
            token: otp
        });

        if (!resetTokenDoc) {
            return res.status(400).json({ success: false, message: 'Invalid OTP' });
        }

        // OTP is valid
        user.isVerified = true;
        await user.save();

        // Delete OTP
        await PasswordResetToken.deleteMany({ user: user._id });

        // Log user in
        sendTokenResponse(user, 200, res);

    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// @desc    Verify OTP (Generic/Password Reset)
// @route   POST /api/auth/verifyotp
// @access  Public
exports.verifyOtp = async (req, res, next) => {
    try {
        const { email, otp } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        const resetTokenDoc = await PasswordResetToken.findOne({
            user: user._id,
            token: otp
        });

        if (!resetTokenDoc) {
            return res.status(400).json({ success: false, message: 'Invalid OTP' });
        }

        // OTP is valid. Generate a temporary JWT specifically for resetting password
        // This token should be short-lived (e.g., 5 mins)
        const resetToken = jwt.sign({ id: user._id, purpose: 'password_reset' }, process.env.JWT_SECRET, {
            expiresIn: '10m',
        });

        // Optional: Delete OTP immediately or let it expire? 
        // Better to delete to prevent reuse
        await PasswordResetToken.deleteMany({ user: user._id });

        res.status(200).json({
            success: true,
            resetToken, // Send this to client to send back with new password
            message: 'OTP Verified'
        });

    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// @desc    Reset Password
// @route   PUT /api/auth/resetpassword
// @access  Public (Protected by Reset Token)
exports.resetPassword = async (req, res, next) => {
    try {
        const { resetToken, password } = req.body;

        if (!resetToken || !password) {
            return res.status(400).json({ success: false, message: 'Please provide token and new password' });
        }

        // Verify the reset token
        let decoded;
        try {
            decoded = jwt.verify(resetToken, process.env.JWT_SECRET);
        } catch (err) {
            return res.status(401).json({ success: false, message: 'Invalid or expired reset token' });
        }

        if (decoded.purpose !== 'password_reset') {
            return res.status(401).json({ success: false, message: 'Invalid token purpose' });
        }

        const user = await User.findById(decoded.id);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        // Hash new password
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);
        await user.save();

        sendTokenResponse(user, 200, res); // Log user in immediately

    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// @desc    Update user details
// @route   PUT /api/auth/profile/:id
// @access  Private
exports.updateDetails = async (req, res, next) => {
    try {
        const fieldsToUpdate = {
            name: req.body.name,
            bio: req.body.bio,
            location: req.body.location,
            phone: req.body.phone,
            stripePublishableKey: req.body.stripePublishableKey,
            stripeSecretKey: req.body.stripeSecretKey,
            razorpayKeyId: req.body.razorpayKeyId,
            razorpayKeySecret: req.body.razorpayKeySecret
        };

        const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
            new: true,
            runValidators: true
        });

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        res.status(200).json({
            success: true,
            data: user
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// Helper function to get token from model, create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
    // Create token
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });

    const options = {
        expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        httpOnly: true,
    };

    if (process.env.NODE_ENV === 'production') {
        options.secure = true;
    }

    res
        .status(statusCode)
        .cookie('token', token, options)
        .json({
            success: true,
            token,
            user,
        });
};
