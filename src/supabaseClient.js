import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseKey = process.env.REACT_APP_SUPABASE_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey);


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
