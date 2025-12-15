import React, { useState } from "react";
import { supabase } from "../../../supabaseClient";
import "./AccountAccess.css";

export default function Register({ onSwitch }) {
    const [form, setForm] = useState({ email: "", password: "" });
    const [message, setMessage] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setMessage("");

        const { email, password } = form;
        const { data, error } = await supabase.auth.signUp({ email, password });

        if (error) {
            setMessage(error.message);
            return;
        }

        setMessage("Registration successful! Check your email for verification.");
        setForm({ email: "", password: "" });
    };

    return (
        <section aria-label="Register Section">
            <h2>Create Account</h2>
            <form onSubmit={handleRegister} aria-label="Register Form">
                <input
                    type="email"
                    name="email"
                    placeholder="Enter Email"
                    value={form.email}
                    onChange={handleChange}
                    required
                />
                <input
                    type="password"
                    name="password"
                    placeholder="Enter Password"
                    value={form.password}
                    onChange={handleChange}
                    required
                />
                <button type="submit">Register</button>
                {message && <p className="message">{message}</p>}
            </form>

            {onSwitch && (
                <footer>
                    <p>
                        Already have an account?{" "}
                        <button type="button" onClick={onSwitch}>
                            Login
                        </button>
                    </p>
                </footer>
            )}
        </section>
    );
}
