import pool from "@/lib/db";
import bcrypt from "bcrypt";
import type { NextApiRequest, NextApiResponse } from "next";

interface SignUpRequestBody {
    email ?: string;
    password ?: string;

}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { email, password } = req.body as SignUpRequestBody;
  if (!email || typeof email !== "string" || email.trim() === "") {
   return res.status(405).json({ message: "Invalid Email" });
  }

  if (email.length > 255) {
    return res.status(405).json({ message: "Email length cannot exceed 255 characters" });
  }

  if(!password || typeof password !== "string"){
   return res.status(405).json({ message: "Invalid Password" });
  }
  
  if(password.length > 100){
    return res.status(405).json({ message: "Password length cannot exceed 100 characters" });
  }

  try {
    const existingUser = await pool.query<{user_email: string}>(
      "SELECT user_email FROM notes_user WHERE user_email = $1",
      [email]
    );

    if (existingUser.rows.length > 0) {
      return res.status(409).json({ message: "Email already exists" });
    }
    const hashpassword = await bcrypt.hash(password,10)
    const result = await pool.query<{user_email: string}>(
      "INSERT INTO notes_user (user_email, user_password) VALUES ($1, $2) RETURNING *",
      [email, hashpassword]
    );

    res.status(200).json(result.rows[0]);
  } catch (error:unknown) {
    console.error(error);
    res.status(500).json({ error: "Database error" });
  }
}