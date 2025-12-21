import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseKey = process.env.REACT_APP_SUPABASE_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey, {
   auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true, //  imp. for oAuth
   }
});


/**
  SUPABASE SETUP — COMPLETE EXPLANATION
  -------------------------------------

  1) INSTALL SUPABASE LIBRARY
     -----------------------------------
     Command used:
         npm install @supabase/supabase-js

     Why we installed it:
     - React cannot talk to Supabase without this library.
     - This library gives us functions such as:
           supabase.from("notes").select()
           supabase.from("notes").insert()
     - It works like a bridge between React and the Supabase database.

     Simple meaning:
     Supabase library = the tool that allows frontend to communicate with the database.



  2) CREATE .env FILE
     -----------------------------------
     Purpose of .env:
     - Store the Supabase URL and ANON key safely.
     - Keep keys outside of components.
     - Prevent accidentally pushing keys to GitHub.

     Why React requires REACT_APP_ prefix:
     - CRA (Create React App) only exposes env values that start with REACT_APP_.

     Example we added:
         REACT_APP_SUPABASE_URL=your-project-url
         REACT_APP_SUPABASE_ANON_KEY=your-publishable-key

     Meaning of these values:
     - The URL tells React where your Supabase project is hosted.
     - The ANON key allows the browser to access the database under RLS (Row Level Security).



  3) CREATE supabaseClient.js
     -----------------------------------
     Purpose of this file:
     - Create one single Supabase connection for the entire app.
     - Avoid creating multiple connections inside components.

     Location:
         src/supabaseClient.js

     Content:
         import { createClient } from "@supabase/supabase-js";

         const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
         const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

         export const supabase = createClient(supabaseUrl, supabaseKey);

     What this file does:
     - Reads URL and key from .env
     - Creates the Supabase client once
     - Makes it reusable in any component
     - Now we can do:
           supabase.from("notes").select()



  COMPLETE WORKFLOW
  -----------------------------------
  - Step 1 installed the necessary tool to talk to Supabase.
  - Step 2 added environment variables to store the credentials safely.
  - Step 3 created a client file so the entire project uses one connection.

  After these 3 steps, the React app is fully ready to:
  - Fetch Notes
  - Insert Notes
  - Update Notes
  - Delete Notes

React Component
   |
   | (asks)
   v
Supabase Client (supabase.js)
   |
   | (sends request)
   v
Supabase Database
   |
   | (returns data)
   v
React UI updates

*/




/*
OAUTH INTEGRATION NOTES — GOOGLE CLOUD + SUPABASE (REACT APP)

1. WHY OAUTH
- OAuth allows users to log in using an external identity provider (Google)
- User never shares their Google password with our app
- Our app receives a verified identity + session
- Safer than handling passwords ourselves

2. WHY GOOGLE CLOUD IS REQUIRED
- Google OAuth is managed via Google APIs
- Google Cloud Console is where we:
  - Register our app
  - Define who can use it
  - Control allowed redirect URLs
- Prevents malicious apps from stealing login tokens

3. GOOGLE CLOUD PROJECT
- Each OAuth app must belong to a Google Cloud project
- Project acts as a security & usage boundary
- OAuth credentials (Client ID / Secret) are scoped to the project

4. OAUTH CONSENT SCREEN
- Mandatory Google requirement
- Defines:
  - App name shown to users
  - Support & developer email
  - Requested scopes (email, profile)
- Ensures user knows who is requesting access

5. OAUTH CLIENT ID (WEB APPLICATION)
- Identifies Supabase as a trusted OAuth client
- Generates:
  - Client ID (public identifier)
  - Client Secret (private, used only by Supabase)
- Never expose Client Secret in frontend

6. REDIRECT URI (MOST CRITICAL STEP)
- Google must know where to send auth result
- Redirect URI used:
  https://<PROJECT_REF>.supabase.co/auth/v1/callback
- Google sends authorization code here
- Supabase listens and completes OAuth flow
- Local + production URLs must both be registered

7. WHY SUPABASE HANDLES OAUTH (INSTEAD OF US)
- OAuth flow includes:
  - Authorization code exchange
  - Token verification
  - Secure storage
  - Refresh token handling
- Supabase abstracts all of this securely
- Our app never touches Google tokens directly

8. SUPABASE GOOGLE PROVIDER CONFIG
- Google Client ID & Secret are stored in Supabase
- Supabase becomes the OAuth middleman
- Supabase verifies Google tokens with Google servers

9. FRONTEND LOGIN FLOW (REACT)
- supabase.auth.signInWithOAuth({ provider: "google" })
- Browser redirects to Google
- User logs in & consents
- Google redirects to Supabase callback
- Supabase sets session in browser storage
- App receives session automatically

10. SESSION HANDLING IN REACT
- supabase.auth.getSession() checks existing login
- supabase.auth.onAuthStateChange() listens for login/logout
- Session persists across refresh
- User object used for app logic & CRUD

11. WHY detectSessionInUrl = true
- OAuth redirects back with session info in URL
- Supabase reads and stores session automatically
- Required for OAuth to work in SPA apps

12. DEPLOYMENT (VERCEL)
- Production domain must be added:
  - Google OAuth redirect settings
  - Supabase Site URL
- Environment variables must be set in Vercel
- HTTPS is mandatory for Google OAuth

13. WHY WE DON’T USE NPM OAUTH LIBRARY HERE
- Supabase already acts as an OAuth framework
- Handles verification, session, refresh, DB integration
- Less code, fewer security risks

14. IF USING NPM OAUTH LIBRARY (ALTERNATIVE FLOW)
- Library returns Google ID token (JWT)
- Token must be verified:
  - Either by Supabase (signInWithIdToken)
  - Or by custom backend using Google SDK
- Never trust frontend token directly

15. FINAL RESULT
- Secure Google login
- Supabase-managed session
- User-based Notes CRUD
- No manual OAuth or token handling
*/
