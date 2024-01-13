import { NextApiRequest, NextApiResponse } from "next";
import pool from "@/lib/db";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST") {
    const { gameName, creatorID, initialState } = req.body;

    // Validate the input
    if (!gameName || !creatorID || !initialState) {
      return res.status(400).json({
        message:
          "Missing required fields: gameName, creatorID, or initialState.",
      });
    }

    try {
      await pool.query("BEGIN");

      // Insert the new game into the Games table
      const insertGameQuery = `
        INSERT INTO Games (GameName, CreatorID, IsActive, CreatedAt, LastUpdated) 
        VALUES ($1, $2, TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP) RETURNING GameID
      `;
      const gameResult = await pool.query(insertGameQuery, [
        gameName,
        creatorID,
      ]);
      const newGameId = gameResult.rows[0].GameID;

      // Insert the initial game state into the GameStates table
      const insertStateQuery = `
        INSERT INTO GameStates (GameID, StateJSON, CreatedAt, UpdatedAt) 
        VALUES ($1, $2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
      `;
      await pool.query(insertStateQuery, [
        newGameId,
        JSON.stringify(initialState),
      ]);

      await pool.query("COMMIT");

      res.json({ message: "New game and initial state saved successfully." });
    } catch (error) {
      await pool.query("ROLLBACK");
      res.status(500).json({ error: (error as Error).message });
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
};
