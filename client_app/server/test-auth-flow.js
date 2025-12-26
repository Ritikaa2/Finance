const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api/auth';
const TEST_EMAIL = `test_${Date.now()}@example.com`;
const TEST_PASSWORD = 'password123';

const runTest = async () => {
    console.log(`Starting Auth Flow Test with email: ${TEST_EMAIL}`);

    try {
        // 1. Register
        console.log('\n1. Registering User...');
        const regRes = await axios.post(`${BASE_URL}/register`, {
            name: 'Test User',
            email: TEST_EMAIL,
            password: TEST_PASSWORD,
            role: 'investor'
        });

        console.log('Register Response Status:', regRes.status);
        console.log('OTP Sent:', regRes.data.otpSent);

        const otp = regRes.data.debug?.otp;
        console.log('Captured DEV OTP:', otp);

        if (!otp) {
            console.error('❌ Failed to capture OTP. logic broken?');
            return;
        }

        // 2. Verify OTP (Registration)
        console.log('\n2. Verifying Registration OTP...');
        const verifyRes = await axios.post(`${BASE_URL}/register/verify`, {
            email: TEST_EMAIL,
            otp: otp
        });

        if (verifyRes.data.success) {
            console.log('✅ Registration Verified Successfully!');
            console.log('Token received:', !!verifyRes.data.token);
        } else {
            console.error('❌ Verification Failed:', verifyRes.data.message);
        }

        // 3. Forgot Password Flow
        console.log('\n3. Testing Forgot Password Flow...');
        const dwRes = await axios.post(`${BASE_URL}/forgotpassword`, {
            email: TEST_EMAIL
        });

        const fpOtp = dwRes.data.debug?.otp;
        console.log('Captured Forgot Password DEV OTP:', fpOtp);

        if (!fpOtp) {
            console.error('❌ Failed to capture FP OTP.');
            return;
        }

        // 4. Verify FP OTP
        console.log('\n4. Verifying Forgot Password OTP...');
        const verifyFpRes = await axios.post(`${BASE_URL}/verifyotp`, {
            email: TEST_EMAIL,
            otp: fpOtp
        });

        if (verifyFpRes.data.success) {
            console.log('✅ Forgot Password OTP Verified Successfully!');
            console.log('Reset Token received:', !!verifyFpRes.data.resetToken);
        } else {
            console.error('❌ FP Verification Failed:', verifyFpRes.data.message);
        }

    } catch (err) {
        console.error('❌ Test Failed:', err.response?.data || err.message);
    }
};

runTest();
