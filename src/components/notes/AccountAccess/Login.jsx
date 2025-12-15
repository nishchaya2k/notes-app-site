import React, { useState } from "react";
import { supabase } from "../../../supabaseClient";
import "./AccountAccess.css";

export default function Login({ onSwitch }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const { error: loginError } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (loginError) {
            setError(loginError.message);
        }

        setLoading(false);
    };

    return (
        <section aria-label="Login Section">
            <h2>Login</h2>
            <form onSubmit={handleLogin} aria-label="Login Form">
                <div className="form-group">
                    <label htmlFor="login-email">Email</label>
                    <input
                        id="login-email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="login-password">Password</label>
                    <input
                        id="login-password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>

                <button type="submit" disabled={loading}>
                    {loading ? "Logging in..." : "Login"}
                </button>

                {error && <p className="error">{error}</p>}
            </form>

            <footer>
                <p>
                    Don’t have an account?{" "}
                    <button type="button" onClick={onSwitch}>
                        Register
                    </button>
                </p>
            </footer>
        </section>
    );
}
