import React, { useState } from "react";
import { supabase } from "../../../supabaseClient";

export default function PhoneLogin({ onSwitch, onSuccess }) {
    const [phone, setPhone] = useState("");
    const [otpSent, setOtpSent] = useState(false);
    const [otp, setOtp] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    const formatPhone = () => {
        const cleaned = phone.replace(/\s+/g, "");
        return cleaned.startsWith("+") ? cleaned : "+91" + cleaned;
    };

    const sendOtp = async () => {
        setLoading(true);
        setMessage("");

        const formattedPhone = formatPhone();

        const { error } = await supabase.auth.signInWithOtp({
            phone: formattedPhone,
        });

        if (error) {
            setMessage(error.message);
        } else {
            setOtpSent(true);
            setMessage("OTP sent to " + formattedPhone);
        }
        setLoading(false);
    };

    const verifyOtp = async () => {
        setLoading(true);
        setMessage("");

        const formattedPhone = formatPhone();

        const { data, error } = await supabase.auth.verifyOtp({
            phone: formattedPhone,
            token: otp,
            type: "sms",
        });

        if (error) {
            setMessage(error.message);
        } else {
            setMessage("Logged in successfully!");

            if (onSuccess) onSuccess(data.user);

            // redirect if needed
            // window.location.href = "/";
        }

        setLoading(false);
    };

    return (
        <section aria-label="Phone Login">
            {!otpSent ? (
                <>
                    <h2>Login with Phone</h2>
                    <input
                        type="tel"
                        placeholder="+91 9876543210"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                    />
                    <button onClick={sendOtp} disabled={loading}>
                        {loading ? "Sending..." : "Send OTP"}
                    </button>
                    {message && <p>{message}</p>}
                    {onSwitch && <button onClick={onSwitch}>Back to Email Login</button>}
                </>
            ) : (
                <>
                    <h2>Enter OTP</h2>
                    <input
                        type="text"
                        placeholder="Enter OTP"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                    />
                    <button onClick={verifyOtp} disabled={loading}>
                        {loading ? "Verifying..." : "Verify OTP"}
                    </button>
                    {message && <p>{message}</p>}
                </>
            )}
        </section>
    );
}