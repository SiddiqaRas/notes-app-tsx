import { parse } from 'cookie';
import { NextApiRequest, NextApiResponse } from 'next';
export default function handler(req:NextApiRequest, res:NextApiResponse) {
  const cookies = parse(req.headers.cookie || "");
  const userId = cookies.user_id;

  if (!userId) {
    return res.status(401).json({ message: "Not logged in" });
  }

  res.status(200).json({ userId });
}