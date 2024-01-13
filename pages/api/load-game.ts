import { NextApiRequest, NextApiResponse } from "next";
import pool from "@/lib/db";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "GET") {
    const { GameID } = req.query;

    if (!GameID) {
      return res.status(400).json({ message: "Missing required GameID" });
    }

    try {
      const game = await pool.query("SELECT * FROM Games WHERE GameID = $1", [
        GameID,
      ]);

      if (game.rows.length === 0 || !game.rows[0].isactive) {
        return res.json({ message: "The requested game has ended" });
      }

      const gameState = await pool.query(
        "SELECT * FROM GameStates WHERE GameID = $1",
        [GameID]
      );

      const result = gameState.rows;

      res.json({ result });
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
};
