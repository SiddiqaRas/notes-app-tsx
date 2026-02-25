import AddNavbar from '@/components/navbar'
import pool from '@/lib/db';
import { parse } from "cookie";
import { useState } from 'react';
import Link from 'next/link';
import { GetServerSidePropsContext } from 'next';
import Image from 'next/image';
 type Note={
    notes_id: number;
    notes_title: string;
    notes_content: string;
    notes_keywords: string;
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
      "SELECT notes_id, notes_title, notes_content, notes_keywords FROM notes_tbl WHERE notes_user_id = $1 ORDER BY notes_timestamp DESC",
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
     
    } catch (err) {
      console.error(err);
      alert("Could not delete the note");
    }
  };

  return (
    <div >
      <AddNavbar />
      <h1 className="text-3xl text-center mt-20 mb-5 font-sans font-bold">
        My Notes
      </h1>
      <div className="min-h-60 p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {notes.length === 0 && <p>No notes found.</p>}

        {notes.map((note) => (
          <div key={note.notes_id}>
            <div className="mt-10 relative w-80 h-70 bg-white rounded-3xl shadow-xl p-4 ml-5 mr-5 border-2 border-solid border-[#FEF3C6] transform hover:-translate-y-2 transition-all duration-300">
              <div className="absolute top-53 end-10 rounded-full p-3 bg-[#FEFCE8] border-2 border-solid border-[#FEF3C6] transform hover:-translate-y-2 transition-all duration-300">
                  <Link href={`/editnotesdetail/${note.notes_id}`}>
                  <Image
                    src="/pencil.png"
                    alt="icon for adding a new note"
                    width={20}
                    height={20}
                    >
                    </Image>
                  </Link>
                </div>
                <div className="absolute top-53 right-25 rounded-full p-3 bg-[#FEFCE8] border-2 border-solid border-[#FEF3C6] transform hover:-translate-y-2 transition-all duration-300">
                 <Link href='#' onClick={() => deleteNote(note.notes_id)}> 
                 <Image src="/trash.png"
                  alt="icon for adding a new note"
                   width={20} 
                   height={20}
                    > 
                    </Image> 
                    </Link> 
                </div>
              {/* Note content */}
              <h2 className="mt-8 ml-3 mr-3 mb-2 break-words font-sans text-2xl font-bold">
                {note.notes_title}
              </h2>

              {note.notes_content.length > previewLength && (
                <Link className="text-gray-700 ml-3 text-sm mt-5 inline-block hover:text-black"
                  href={`/displaynotesdetail/${note.notes_id}`}
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
