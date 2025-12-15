import React, { useEffect, useState } from "react";
import { supabase } from "../../supabaseClient";
import "./Notes.css";
import NotesApp from "./NotesApp/NotesApp";
import Register from "./AccountAccess/Register";
import Login from "./AccountAccess/Login";

export default function Notes() {
    const [user, setUser] = useState(null);
    const [showRegister, setShowRegister] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkSession = async () => {
            const { data } = await supabase.auth.getSession();
            setUser(data?.session?.user ?? null);
            setLoading(false);
        };

        checkSession();

        const { data: authListener } = supabase.auth.onAuthStateChange(
            (_event, session) => {
                setUser(session?.user ?? null);
            }
        );

        return () => {
            authListener.subscription.unsubscribe();
        };
    }, []);

    if (loading) return <p>Loading...</p>;

    if (!user) {
        return (
            <main className="auth-container">
                {showRegister ? (
                    <Register onSwitch={() => setShowRegister(false)} />
                ) : (
                    <Login onSwitch={() => setShowRegister(true)} />
                )}
            </main>
        );
    }

    return (
        <main aria-label="Notes Section">
            <NotesApp user={user} />
        </main>
    );
}
