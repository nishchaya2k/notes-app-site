import React, { useEffect, useState } from "react";
import { supabase } from "../../../supabaseClient";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import "./NotesApp.css";

// const {
//   data: { session },
// } = await supabase.auth.getSession();

// const userId = session.user.id;

const NotesApp = ({ user }) => {
  const [notes, setNotes] = useState({ title: "", description: "" });
  const [notesData, setNotesData] = useState([]);
  const [editingNote, setEditingNote] = useState(null);
  const [isPaid, setIsPaid] = useState(false);
  const [notesCount, setNotesCount] = useState(0);

  const fetchAllNotes = async () => {

    const { data, error } = await supabase
      .from("notes")
      .select("*")
      .eq("user_id", user.id);


    if (error) console.error("Fetch Error:", error);
    setNotesData(data || []);
    setNotesCount(data?.length || 0);

    const { data: profile } = await supabase
      .from("profiles")
      .select("is_paid, free_notes_limit")
      .eq("id", user.id)
      .single();

    setIsPaid(profile?.is_paid);
  };

  useEffect(() => {
    fetchAllNotes();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { error } = await supabase.from("notes").insert([
      {
        title: notes.title,
        description: notes.description,
        user_id: user.id,
      },
    ]);

    if (error) {
      console.error("Insert error:", error);
      return;
    }

    fetchAllNotes();
    setNotes({ title: "", description: "" });
  };

  const handleNotes = (e) => {
    const { name, value } = e.target;
    setNotes((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEdit = (note) => {
    setEditingNote(note);
    setNotes({ title: note.title, description: note.description });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editingNote) return;

    const { error } = await supabase
      .from("notes")
      .update([{ title: notes.title, description: notes.description }])
      .eq("id", editingNote.id)
      .eq("user_id", user.id);

    if (error) {
      console.error("Update error:", error);
      return;
    }
    setEditingNote(null);
    setNotes({ title: "", description: "" });
    fetchAllNotes();
  };

  const handleDelete = async (id) => {
    const { error } = await supabase
      .from("notes")
      .delete()
      .eq("id", id)
      .eq("user_id", user.id); // Ensure deleting only your own notes

    if (error) {
      console.error("Delete error:", error);
      return;
    }
    fetchAllNotes();
  };

  return (
    <main className="notes-container">
      <header>
        <h1 className="notes-title">Notes</h1>
      </header>

      {/* Notes List */}
      <section aria-label="All Notes" className="notes-list">
        {notesData?.map((note) => (
          <article key={note.id} className="note-card">
            <h3 className="note-title">{note.title}</h3>
            <p className="note-description">{note.description}</p>

            <div className="note-actions">
              <EditIcon
                className="action-icon"
                onClick={() => handleEdit(note)}
              />
              <DeleteIcon
                className="action-icon delete-icon"
                onClick={() => handleDelete(note.id)}
              />
            </div>
          </article>
        ))}
      </section>

      {/* Create Note Form */}
      <footer className="note-form-container">
        <h2>{editingNote ? "Edit Note" : "Add Note"}</h2>

        <form
          onSubmit={editingNote ? handleEditSubmit : handleSubmit}
          className="note-form"
        >
          <div className="form-group">
            <label>Title</label>
            <input
              type="text"
              name="title"
              value={notes.title}
              onChange={handleNotes}
            />
          </div>

          <div className="form-group">
            <label>Description</label>
            <input
              type="text"
              name="description"
              value={notes.description}
              onChange={handleNotes}
            />
          </div>

          <button type="submit" className="submit-btn" disabled={!isPaid && notesCount >= 2}>
            {editingNote ? "Edit Note" : isPaid ? "Add Note" : notesCount >= 2 ? "Upgrade to Add More Notes" : "Add Note"}
          </button>
        </form>
      </footer>
    </main>
  );
};

export default NotesApp;

/**
1. Table `id` vs `user.id`:
   - `id` → identifies the NOTE itself in the table (auto-increment or UUID)
   - `user.id` → unique ID of the logged-in user from Supabase Auth
   - **Important:** `id` ≠ `user.id` — they serve completely different purposes

2. Why we save `user_id: user.id` in the notes table:
   - Marks ownership of the note (who created it)
   - Enables Row-Level Security (RLS) to enforce per-user access
   - Ensures each user sees only their own notes
   - Prevents other users from editing or deleting your notes

3. Row-Level Security (RLS) policies for notes:
   - USING: auth.uid() = user_id       // allows read/update if user owns the note
   - WITH CHECK: auth.uid() = user_id  // allows insert/update only for owner

4. CRUD operations in multi-user setup:
   - INSERT: include `user_id: user.id` to mark ownership
   - SELECT: filter with `.eq("user_id", user.id)` to fetch only your notes
   - UPDATE/DELETE: RLS ensures users can only modify their own notes

5. What happens if you don’t save `user_id`:
   - Notes are anonymous
   - Everyone sees everything
   - RLS cannot protect data
   - App breaks for multiple users

6. Summary:
   - `id` = note identifier in the table
   - `user.id` = unique ID of the logged-in user
   - `user_id: user.id` is essential for multi-user functionality and security
*/
