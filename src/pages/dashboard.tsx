import AddNavbar from '@/components/navbar'
import pool from '@/lib/db';
import { parse } from "cookie";
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { GetServerSidePropsContext } from 'next';
 type Note={
    notes_id: number;
    notes_title: string;
    notes_content: string;
 };
 type DashboardProps = {
  notes: Note[]; // props from getServerSideProps
};

export async function getServerSideProps(context:GetServerSidePropsContext) {
  const cookies = context.req.headers.cookie
    ? parse(context.req.headers.cookie)
    : {};
  const userId = cookies.user_id;

  if (!userId) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  try {
    const result = await pool.query(
      "SELECT notes_id, notes_title, notes_content FROM notes_tbl WHERE notes_user_id = $1 ORDER BY notes_timestamp DESC",
      [userId]
    );

    return { props: { notes: result.rows } };
  } catch (error:unknown) {
    console.error("Error fetching notes:", error);
    return { props: { notes: [] } };
  }
}

export default function Dashboard({notes: initialNotes }: DashboardProps) {
  const [notes, setNotes] = useState(initialNotes);
  const [openId, setOpenId] = useState<number | null>(null);
  const previewLength = 50;
  const deleteNote = async (noteId:number) => {
    try {
      const res = await fetch("/api/delete_note", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: noteId }),
      });
      if (!res.ok) throw new Error("Failed to delete note");

      // Remove note from state to update UI instantly
      setNotes((prev) => prev.filter((note) => note.notes_id !== noteId));
      setOpenId(null); // close dropdown
    } catch (err) {
      console.error(err);
      alert("Could not delete the note");
    }
  };

  return (
    <div>
      <AddNavbar />
      <h1 className="text-3xl font-semibold text-center mt-8 mb-8">
        My Notes
      </h1>
      <div className="min-h-60 bg-gray-100 p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {notes.length === 0 && <p>No notes found.</p>}

        {notes.map((note) => (
          <div key={note.notes_id}>
            <div className="mt-10 relative w-130 h-50 bg-gray-100 rounded-lg shadow p-4 mx-8">

              {/* 3 dots button */}
              <button
                onClick={() =>
                  setOpenId(
                    openId === note.notes_id ? null : note.notes_id
                  )
                }
                className="absolute top-3 right-3 text-black text-lg"
              >
                ⋮
              </button>

              {/* Dropdown */}
              {openId === note.notes_id && (
                <div className="absolute top-5 right-7 border border-gray-300 bg-white w-20 z-10 rounded shadow">
                  <Link href={`/editnotesdetail/${note.notes_id}`}>
                  <button className="block w-full text-left px-3 py-2 hover:bg-gray-100">
                    Edit
                  </button>
                  </Link>
                  <button
                    onClick={() => deleteNote(note.notes_id)}
                    className="block w-full text-left px-3 py-2 text-red-500 hover:bg-gray-100"
                  >
                    Delete
                  </button>
                </div>
              )}

              {/* Note content */}
              <h2 className="text-lg font-semibold mb-2 break-words">
                {note.notes_title}
              </h2>

              <p className="text-gray-600 text-sm break-words">
                {note.notes_content.length > previewLength
                  ? note.notes_content.slice(0, previewLength) + "..."
                  : note.notes_content}
              </p>

              {note.notes_content.length > previewLength && (
                <Link
                  href={`/displaynotesdetail/${note.notes_id}`}
                  className="text-gray-700 text-sm mt-2 inline-block hover:underline"
                >
                  Read More
                </Link>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
