import pool from "@/lib/db";
import { parse } from "cookie";
import {NextApiRequest, NextApiResponse} from "next";
type data={
  title:string;
  content:string;
};
export default async function handler(req:NextApiRequest, res:NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }
 const cookies = req.headers.cookie ? parse(req.headers.cookie) : {};
 const userId = cookies.user_id;
  if (!userId) return res.status(401).json({ message: "Not authenticated" });

  const { title, content } = req.body;
  if (!title || typeof title !== "string" || title.trim() === "") {
   return res.status(405).json({ message: "Invalid Title" });
  }

  if (title.length > 255) {
    return res.status(405).json({ message: "Title legth cannot be greater than 255 characters" });
  }

  if(!content || typeof content !== "string"){
   return res.status(405).json({ message: "Invalid Content" });
  }
  
  if(content.length > 10000){
    return res.status(405).json({ message: "Content Lenth cannot be greater than 10000 characters" });
  }

  try {
    const result = await pool.query(
      "INSERT INTO notes_tbl (notes_title, notes_content, notes_user_id) VALUES ($1, $2, $3) RETURNING *",
      [title, content, userId]
    );

    res.status(200).json(result.rows[0]);
  } catch (error:unknown) {
    console.error(error);
    res.status(500).json({ error: "Database error" });
  }
}