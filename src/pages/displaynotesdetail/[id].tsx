import pool from "@/lib/db";
import { parse } from "cookie";
import { useState } from "react";
import AddLogo from "@/components/logo";
import Logout from "@/components/Logout";
import Link from "next/link";
import Image from "next/image";
import { GetServerSideProps } from "next";

type Notes={
    notes_id: number;
    notes_title:string;
    notes_content:string;
    
}
type Dashboard={
    notes: Notes[];
};
type Params={
   id : string;
};

export const getServerSideProps: GetServerSideProps<Dashboard> = async (
  context
) => {
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

  const id = Number(context.params!.id);

  try {
    const result = await pool.query(
      "SELECT notes_id, notes_title, notes_content FROM notes_tbl WHERE notes_user_id = $1 AND notes_id = $2",
      [userId, id]
    );
    const notes = result.rows;

    return { props: { notes } };
  } catch (error) {
    console.error("Error fetching notes:", error);
    return { props: { notes: [] } };
  }
}

export default function Dashboard({ notes }:Dashboard) {
    const [open, setOpen] = useState(false)
    const deleteNote = async (noteId:number) => {
    try {
      const res = await fetch("/api/delete_note", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: noteId }),
      });
      if (!res.ok) throw new Error("Failed to delete note");
      setOpen(false); // close dropdown
    } catch (err) {
      console.error(err);
      alert("Could not delete the note");
    }
  };
  return (
    <div>
        <nav className="flex items-center justify-between px-6 h10 bg-white shadow-md sticky top-0 z-50"> 
                <div className="flex items-center space-x-1">
                    <Link href="/dashboard" target='_self'>
                        <button type="submit" >
                            <Image src="/backbutton.png" alt="back-button-icon" width={17} height={35} />
                        </button>
                    </Link>
                     <AddLogo/>
                </div>
                    <Logout/>
        </nav>
    <div className="min-h-screen bg-white p-6">
      {notes.length === 0 && <p>No notes found.</p>}
      {notes.map((note) => (
        
            <div className=" mt-10 relative max-w-1/2 bg-gray-100 rounded-lg shadow p-6 mx-auto">

            <h2 className="text-lg font-semibold mb-2 break-words">{note.notes_title}</h2>

            <p className="text-gray-600 text-sm break-words">{note.notes_content}</p>

            </div>
            ))}
            
    </div>
    </div>
  );
}
