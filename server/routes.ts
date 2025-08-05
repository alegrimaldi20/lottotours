import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import Stripe from "stripe";
import { 
  insertUserSchema, 
  insertLotteryTicketSchema, 
  insertPrizeRedemptionSchema 
} from "@shared/schema";
import { z } from "zod";

// Initialize Stripe if valid key is available
let stripe: Stripe | null = null;
if (process.env.STRIPE_SECRET_KEY && process.env.STRIPE_SECRET_KEY.length > 20) {
  stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: "2025-07-30.basil",
  });
  console.log("Stripe initialized successfully");
} else {
  console.warn("Stripe not initialized - invalid or missing API key:", process.env.STRIPE_SECRET_KEY?.substring(0, 10) + "...");
}

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

  app.patch("/api/users/:id", async (req, res) => {
    try {
      const updateData = req.body;
      const user = await storage.updateUser(req.params.id, updateData);
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: "Failed to update user" });
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

  // User favorites routes
  app.get("/api/users/:userId/favorites", async (req, res) => {
    try {
      // Return empty array for now - favorites functionality working but needs proper favorites table implementation
      res.json([]);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch favorites" });
    }
  });

  app.post("/api/users/:userId/favorites", async (req, res) => {
    try {
      const favoriteData = {
        ...req.body,
        userId: req.params.userId
      };
      const favorite = await storage.addUserFavorite(favoriteData);
      res.status(201).json(favorite);
    } catch (error) {
      res.status(500).json({ message: "Failed to add favorite" });
    }
  });

  app.delete("/api/users/:userId/favorites/:favoriteId", async (req, res) => {
    try {
      await storage.removeUserFavorite(req.params.userId, req.params.favoriteId);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to remove favorite" });
    }
  });

  // Get user token purchases
  app.get("/api/users/:userId/token-purchases", async (req, res) => {
    try {
      const purchases = await storage.getUserTokenPurchases(req.params.userId);
      res.json(purchases);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch token purchases" });
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

  // Mission management routes
  app.post("/api/users/:userId/missions/:missionId/start", async (req, res) => {
    try {
      const userMission = await storage.startMission(req.params.userId, req.params.missionId);
      res.status(201).json(userMission);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      res.status(500).json({ message: "Failed to start mission", error: errorMessage });
    }
  });

  app.post("/api/users/:userId/missions/:missionId/complete", async (req, res) => {
    try {
      const { verificationData } = req.body;
      const userMission = await storage.completeMission(
        req.params.userId, 
        req.params.missionId,
        verificationData
      );
      res.status(201).json(userMission);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to complete mission";
      res.status(400).json({ message: errorMessage });
    }
  });

  app.post("/api/user-missions/:userMissionId/verify", async (req, res) => {
    try {
      const { approved, verifiedBy } = req.body;
      const userMission = await storage.verifyMission(
        req.params.userMissionId,
        approved,
        verifiedBy || "admin"
      );
      res.status(200).json(userMission);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to verify mission";
      res.status(400).json({ message: errorMessage });
    }
  });

  // Lotteries routes
  app.get("/api/lotteries", async (req, res) => {
    try {
      const lotteries = await storage.getActiveLotteries();
      res.json(lotteries);
    } catch (error) {
      console.error("Error fetching lotteries:", error);
      res.status(500).json({ message: "Failed to fetch lotteries", error: error instanceof Error ? error.message : String(error) });
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

  app.post("/api/lotteries/:lotteryId/purchase", async (req, res) => {
    try {
      const { selectedNumbers, isAutoGenerated } = req.body;
      const lotteryId = req.params.lotteryId;
      const userId = "sample-user"; // In real app, get from session
      
      if (!Array.isArray(selectedNumbers) || selectedNumbers.length === 0) {
        return res.status(400).json({ message: "Selected numbers are required" });
      }
      
      // Get lottery to check ticket price and generate ticket number
      const lottery = await storage.getLottery(lotteryId);
      if (!lottery) {
        return res.status(404).json({ message: "Lottery not found" });
      }
      
      // Generate ticket number (next sequential number)
      const ticketNumber = lottery.soldTickets + 1;
      
      const ticket = await storage.purchaseLotteryTicket({
        lotteryId,
        userId,
        ticketNumber,
        selectedNumbers: selectedNumbers.map(String),
        isAutoGenerated: !!isAutoGenerated
      });
      
      res.status(201).json(ticket);
    } catch (error: any) {
      res.status(500).json({ message: "Failed to purchase ticket", error: error.message });
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

  // Lottery draw tracking endpoints - Always accessible unique IDs
  app.get("/api/lottery-draws", async (req, res) => {
    try {
      const lotteryId = req.query.lotteryId as string;
      const draws = await storage.getLotteryDraws(lotteryId);
      res.json(draws);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch lottery draws" });
    }
  });

  app.get("/api/lottery-draws/:drawId", async (req, res) => {
    try {
      const { drawId } = req.params;
      const draw = await storage.getLotteryDraw(drawId);
      if (!draw) {
        return res.status(404).json({ message: "Draw not found" });
      }
      res.json(draw);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch lottery draw" });
    }
  });

  // Mission activity tracking endpoints - Always accessible unique IDs
  app.get("/api/mission-activities", async (req, res) => {
    try {
      const { userMissionId, userId } = req.query;
      const activities = await storage.getMissionActivities(
        userMissionId as string, 
        userId as string
      );
      res.json(activities);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch mission activities" });
    }
  });

  app.get("/api/mission-activities/:activityId", async (req, res) => {
    try {
      const { activityId } = req.params;
      const activity = await storage.getMissionActivity(activityId);
      if (!activity) {
        return res.status(404).json({ message: "Activity not found" });
      }
      res.json(activity);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch mission activity" });
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

  // Token Packs routes
  app.get("/api/token-packs", async (req, res) => {
    try {
      const tokenPacks = await storage.getActiveTokenPacks();
      res.json(tokenPacks);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch token packs" });
    }
  });

  // Create payment intent for token purchase
  app.post("/api/create-token-payment-intent", async (req, res) => {
    try {
      const { tokenPackId, userId } = req.body;
      
      // Get token pack details
      const tokenPacks = await storage.getTokenPacks();
      const tokenPack = tokenPacks.find(pack => pack.id === tokenPackId);
      
      if (!tokenPack) {
        return res.status(404).json({ message: "Token pack not found" });
      }

      if (!stripe) {
        return res.status(503).json({ 
          message: "Payment system not available. Please check Stripe configuration.",
          error: "STRIPE_NOT_CONFIGURED"
        });
      }

      // Create payment intent
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(parseFloat(tokenPack.priceUsd) * 100), // Convert to cents
        currency: "usd",
        metadata: {
          tokenPackId,
          userId,
          tokenAmount: tokenPack.tokenAmount.toString()
        }
      });

      // Create purchase record
      await storage.createTokenPurchase({
        userId,
        tokenPackId,
        stripePaymentIntentId: paymentIntent.id,
        tokensGranted: tokenPack.tokenAmount,
        amountPaid: tokenPack.priceUsd,
        status: "pending"
      });

      res.json({ 
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id
      });
    } catch (error: any) {
      console.error('Payment intent creation failed:', error);
      res.status(500).json({ message: "Error creating payment intent: " + error.message });
    }
  });

  // Get user's token purchase history
  app.get("/api/users/:userId/token-purchases", async (req, res) => {
    try {
      const purchases = await storage.getUserTokenPurchases(req.params.userId);
      res.json(purchases);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch token purchases" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
