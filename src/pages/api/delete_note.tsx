import pool from "@/lib/db";
import { parse } from "cookie";
import { NextApiRequest, NextApiResponse } from "next";

export default async function deleteNote(req:NextApiRequest, res:NextApiResponse) {
  if (req.method !== "DELETE") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  // get user_id from cookie (optional, to protect users)
  const cookies = req.headers.cookie ? parse(req.headers.cookie) : {};
  const userId = cookies.user_id;
  if (!userId) return res.status(401).json({ message: "Unauthorized" });

  const { id } = req.body; // note ID to delete
  if (!id) return res.status(400).json({ message: "Note ID is required" });

  try {
    await pool.query(
      "DELETE FROM notes_tbl WHERE notes_user_id = $1 AND notes_id = $2",
      [userId, id]
    );

    res.status(200).json({ message: "Note deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Database error" });
  }
}
