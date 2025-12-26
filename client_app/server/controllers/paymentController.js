const Razorpay = require('razorpay');
const crypto = require('crypto');
const User = require('../models/User');
const Startup = require('../models/Startup');
const Investment = require('../models/Investment');

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
});

// @desc    Create Razorpay Order
// @route   POST /api/payments/create-order
// @access  Private (Investor)
exports.createOrder = async (req, res) => {
    try {
        console.log("createOrder called with body:", req.body); // Debug log
        const { amount, startupId } = req.body;

        // Populate user to get keys
        const startup = await Startup.findById(startupId).populate('user');

        if (!startup) {
            console.log("Startup not found for ID:", startupId);
            return res.status(404).json({ success: false, message: 'Startup not found' });
        }

        let instanceKeyId = process.env.RAZORPAY_KEY_ID;
        let instanceKeySecret = process.env.RAZORPAY_KEY_SECRET;

        console.log("Default Env Keys present:", !!instanceKeyId, !!instanceKeySecret);

        // Check for BYOK
        if (startup.user && startup.user.razorpayKeyId && startup.user.razorpayKeySecret) {
            console.log("Using Startup specific keys");
            instanceKeyId = startup.user.razorpayKeyId;
            instanceKeySecret = startup.user.razorpayKeySecret;
        } else {
            console.log("Using Platform default keys");
        }

        if (!instanceKeyId || !instanceKeySecret) {
            console.error("Missing Razorpay Keys!");
            return res.status(500).json({ success: false, message: 'Server Payment Configuration Error: Missing Keys' });
        }

        const instance = new Razorpay({
            key_id: instanceKeyId,
            key_secret: instanceKeySecret
        });

        const options = {
            amount: amount * 100, // amount in the smallest currency unit (paise)
            currency: "INR",
            receipt: `rcpt_${Date.now().toString().slice(-10)}_${req.user.id.slice(-4)}`, // Short receipt ID to fit 40 char limit
            notes: {
                investorId: req.user.id,
                startupId: startupId,
            }
        };

        console.log("Creating Razorpay order with options:", JSON.stringify(options));

        const order = await instance.orders.create(options);
        console.log("Order created successfully:", order.id);

        res.status(200).json({
            success: true,
            order,
            keyId: instanceKeyId // Send back the key used so frontend uses the matching one
        });
    } catch (err) {
        console.error("Razorpay Create Order Error Detailed:", err);
        res.status(500).json({ success: false, message: err.message, error: err.toString() });
    }
};

// @desc    Verify Razorpay Payment
// @route   POST /api/payments/verify-payment
// @access  Private
exports.verifyPayment = async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature, startupId, amount } = req.body;

        // We need to re-fetch the secrets to verify signature
        const startup = await Startup.findById(startupId).populate('user');
        if (!startup) {
            return res.status(404).json({ success: false, message: 'Startup not found' });
        }

        let instanceKeySecret = process.env.RAZORPAY_KEY_SECRET;
        // Check for BYOK
        if (startup.user && startup.user.razorpayKeyId && startup.user.razorpayKeySecret) {
            instanceKeySecret = startup.user.razorpayKeySecret;
        }

        const generated_signature = crypto
            .createHmac('sha256', instanceKeySecret)
            .update(razorpay_order_id + "|" + razorpay_payment_id)
            .digest('hex');

        if (generated_signature === razorpay_signature) {
            // Payment success
            const investment = await Investment.create({
                investor: req.user.id,
                startup: startupId,
                amount: amount,
                status: 'completed',
                stripePaymentId: razorpay_payment_id // Storing Razorpay ID in existing field for compatibility
            });

            await Startup.findByIdAndUpdate(startupId, {
                $inc: { raisedAmount: amount }
            });

            res.status(200).json({ success: true, message: "Payment verified successfully" });
        } else {
            res.status(400).json({ success: false, message: "Invalid signature" });
        }
    } catch (err) {
        console.error("Verification Error:", err);
        res.status(500).json({ success: false, message: err.message });
    }
};
