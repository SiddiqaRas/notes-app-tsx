import { NextApiRequest, NextApiResponse } from "next";

export default function handler(req:NextApiRequest, res:NextApiResponse) {
  // Set the cookie to expire in the past → removes it
  res.setHeader(
    "Set-Cookie",
    "user_id=; Path=/; HttpOnly; SameSite=Lax; Expires=Thu, 01 Jan 1970 00:00:00 GMT"
  );

  res.status(200).json({ message: "Logged out successfully" });
}
