import { NextApiRequest, NextApiResponse } from "next";
import pool from "@/lib/db";
import validator from "validator";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST") {
    const { username, email } = req.body;

    // Function to validate email
    function isValidEmail(email: string): boolean {
      if (email) return validator.isEmail(email);
      else return false;
    }

    // Validate email
    if (!isValidEmail(email)) {
      return res.status(400).json({ message: "Invalid email format." });
    }

    const client = await pool.connect();
    try {
      // Check if the player already exists
      const existingPlayer = await client.query(
        "SELECT * FROM Players WHERE Username = $1 OR Email = $2",
        [username, email]
      );
      if (existingPlayer.rows.length > 0) {
        return res.status(409).json({
          message: "Player with this username or email already exists.",
        });
      }

      // Insert new player
      await client.query(
        "INSERT INTO Players (Username, Email, CreatedAt, LastActive) VALUES ($1, $2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)",
        [username, email]
      );
      res.json({ message: "Player registered successfully." });
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    } finally {
      client.release();
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
};
