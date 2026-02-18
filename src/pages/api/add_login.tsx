import pool from "@/lib/db";
import bcrypt from "bcrypt";
import { serialize } from "cookie";
import type { NextApiRequest, NextApiResponse } from "next";
interface LoginRequestBody{
    lemail?: string;
    lpassword?: string;
}
export default async function handler(req:NextApiRequest, res:NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { lemail, lpassword } = req.body as LoginRequestBody;

  if (!lemail || typeof lemail !== "string" || lemail.trim() === "") {
    return res.status(400).json({ message: "Invalid Email" });
  }

  if (lemail.length > 255) {
    return res.status(400).json({ message: "Email too long" });
  }

  if (!lpassword || typeof lpassword !== "string") {
    return res.status(400).json({ message: "Invalid Password" });
  }

  if (lpassword.length > 100) {
    return res.status(400).json({ message: "Password too long" });
  }

  try {
    const result = await pool.query<{user_email:string; user_password:string; user_id:number}>(
      "SELECT user_id,user_email,user_password FROM notes_user WHERE user_email = $1",
      [lemail.trim().toLowerCase()]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const user = result.rows[0];

    const isMatch = await bcrypt.compare(lpassword, user.user_password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const cookie = serialize("user_id", String(user.user_id), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60,
    });

    res.setHeader("Set-Cookie", cookie);
    return res.status(200).json({ message: "Login successful" });
  } catch (error:unknown) {
    console.error(error);
    res.status(500).json({ error: "Database error" });
  }
}
