import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertUserSchema, 
  insertLotteryTicketSchema, 
  insertPrizeRedemptionSchema 
} from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Users routes
  app.get("/api/users", async (req, res) => {
    try {
      const users = await storage.getUsers();
      res.json(users);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch users" });
    }
  });

  app.get("/api/users/:id", async (req, res) => {
    try {
      const user = await storage.getUser(req.params.id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  app.post("/api/users", async (req, res) => {
    try {
      const validatedData = insertUserSchema.parse(req.body);
      const user = await storage.createUser(validatedData);
      res.status(201).json(user);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid user data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create user" });
    }
  });

  app.patch("/api/users/:id/tokens", async (req, res) => {
    try {
      const { tokens } = req.body;
      if (typeof tokens !== "number") {
        return res.status(400).json({ message: "Invalid tokens value" });
      }
      const user = await storage.updateUserTokens(req.params.id, tokens);
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: "Failed to update user tokens" });
    }
  });

  // Missions routes
  app.get("/api/missions", async (req, res) => {
    try {
      const missions = await storage.getActiveMissions();
      res.json(missions);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch missions" });
    }
  });

  app.get("/api/users/:userId/missions", async (req, res) => {
    try {
      const userMissions = await storage.getUserMissions(req.params.userId);
      res.json(userMissions);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch user missions" });
    }
  });

  app.post("/api/users/:userId/missions/:missionId/complete", async (req, res) => {
    try {
      const userMission = await storage.completeMission(req.params.userId, req.params.missionId);
      res.status(201).json(userMission);
    } catch (error) {
      res.status(500).json({ message: "Failed to complete mission" });
    }
  });

  // Lotteries routes
  app.get("/api/lotteries", async (req, res) => {
    try {
      const lotteries = await storage.getActiveLotteries();
      res.json(lotteries);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch lotteries" });
    }
  });

  app.get("/api/lotteries/:id", async (req, res) => {
    try {
      const lottery = await storage.getLottery(req.params.id);
      if (!lottery) {
        return res.status(404).json({ message: "Lottery not found" });
      }
      res.json(lottery);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch lottery" });
    }
  });

  app.post("/api/lottery-tickets", async (req, res) => {
    try {
      const validatedData = insertLotteryTicketSchema.parse(req.body);
      const ticket = await storage.purchaseLotteryTicket(validatedData);
      res.status(201).json(ticket);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid ticket data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to purchase ticket" });
    }
  });

  app.get("/api/users/:userId/tickets", async (req, res) => {
    try {
      const tickets = await storage.getUserLotteryTickets(req.params.userId);
      res.json(tickets);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch user tickets" });
    }
  });

  // NFTs routes
  app.get("/api/users/:userId/nfts", async (req, res) => {
    try {
      const nfts = await storage.getUserNFTs(req.params.userId);
      res.json(nfts);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch user NFTs" });
    }
  });

  // Prizes routes
  app.get("/api/prizes", async (req, res) => {
    try {
      const prizes = await storage.getActivePrizes();
      res.json(prizes);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch prizes" });
    }
  });

  app.post("/api/prize-redemptions", async (req, res) => {
    try {
      const validatedData = insertPrizeRedemptionSchema.parse(req.body);
      const redemption = await storage.redeemPrize(validatedData);
      res.status(201).json(redemption);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid redemption data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to redeem prize" });
    }
  });

  app.get("/api/users/:userId/redemptions", async (req, res) => {
    try {
      const redemptions = await storage.getUserRedemptions(req.params.userId);
      res.json(redemptions);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch user redemptions" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
