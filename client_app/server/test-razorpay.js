const Razorpay = require('razorpay');
require('dotenv').config({ path: '../.env' }); // Adjust path if needed

const testRazorpay = async () => {
    console.log("Testing Razorpay Connection...");

    const key_id = process.env.RAZORPAY_KEY_ID;
    const key_secret = process.env.RAZORPAY_KEY_SECRET;

    console.log("Key ID present:", !!key_id);
    console.log("Key Secret present:", !!key_secret);

    if (!key_id || !key_secret) {
        console.error("❌ Error: Missing Razorpay environment variables.");
        return;
    }

    try {
        const instance = new Razorpay({
            key_id: key_id,
            key_secret: key_secret
        });

        const options = {
            amount: 50000, // 500 INR
            currency: "INR",
            receipt: "test_receipt_001",
            notes: {
                purpose: "test connection"
            }
        };

        console.log("Attempting to create order...");
        const order = await instance.orders.create(options);
        console.log("✅ Success! Order created:", order.id);
    } catch (error) {
        console.error("❌ Razorpay API Error:", error);
    }
};

testRazorpay();
