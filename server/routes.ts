import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { db } from "./db";
import { marketplaceListings } from "@shared/schema";
import Stripe from "stripe";
import { 
  insertUserSchema, 
  insertLotteryTicketSchema, 
  insertPrizeRedemptionSchema,
  insertRaivanConversionSchema,
  insertMarketplaceListingSchema,
  insertMarketplaceBidSchema,
  insertMarketplacePurchaseSchema,
  insertMarketplaceWatcherSchema,
  insertSellerProfileSchema,
  insertMarketplaceDisputeSchema
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
      res.status(500).json({ message: "Failed to fetch draw" });
    }
  });

  // New lottery code-based endpoints for unique identification
  app.get("/api/lotteries/code/:lotteryCode", async (req, res) => {
    try {
      const lottery = await storage.getLotteryByCode(req.params.lotteryCode);
      if (!lottery) {
        return res.status(404).json({ message: "Lottery not found" });
      }
      res.json(lottery);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch lottery by code" });
    }
  });

  app.get("/api/lottery-draws/code/:drawCode", async (req, res) => {
    try {
      const draw = await storage.getLotteryDrawByCode(req.params.drawCode);
      if (!draw) {
        return res.status(404).json({ message: "Draw not found" });
      }
      res.json(draw);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch draw by code" });
    }
  });

  // QR Code verification endpoint
  app.post("/api/lottery-draws/verify-qr", async (req, res) => {
    try {
      const { qrCodeData } = req.body;
      if (!qrCodeData) {
        return res.status(400).json({ message: "QR code data is required" });
      }
      
      const result = await storage.verifyWinnerQrCode(qrCodeData);
      res.json(result);
    } catch (error) {
      res.status(500).json({ message: "Failed to verify QR code" });
    }
  });

  // Draw execution endpoint
  app.post("/api/lotteries/:lotteryId/draw", async (req, res) => {
    try {
      const { drawExecutorId } = req.body;
      const result = await storage.drawLottery(req.params.lotteryId, drawExecutorId);
      res.status(201).json(result);
    } catch (error: any) {
      res.status(500).json({ message: "Failed to execute draw", error: error.message });
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

  // Country Operations Routes
  app.get("/api/country-operations", async (req, res) => {
    try {
      const countries = await storage.getCountryOperations();
      res.json(countries);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch country operations" });
    }
  });

  app.get("/api/country-operations/:countryCode", async (req, res) => {
    try {
      const country = await storage.getCountryOperation(req.params.countryCode);
      if (!country) {
        return res.status(404).json({ message: "Country operation not found" });
      }
      res.json(country);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch country operation" });
    }
  });

  // Territory Management Routes
  app.get("/api/territories", async (req, res) => {
    try {
      const { countryCode } = req.query;
      const territories = await storage.getTerritoryManagements(countryCode as string);
      res.json(territories);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch territories" });
    }
  });

  // New Token System Routes

  // Token Conversion Routes
  app.get("/api/token/conversion-rates", async (req, res) => {
    try {
      const rates = await storage.getTokenConversionRates();
      res.json(rates);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch conversion rates" });
    }
  });

  app.post("/api/users/:userId/token-conversions", async (req, res) => {
    try {
      const conversionData = insertRaivanConversionSchema.parse({
        ...req.body,
        userId: req.params.userId
      });
      
      // Validate conversion limits
      const isValid = await storage.validateConversionLimits(
        req.params.userId,
        conversionData.conversionType,
        conversionData.raivanAmount
      );
      
      if (!isValid) {
        return res.status(400).json({ message: "Daily conversion limit exceeded" });
      }
      
      const conversion = await storage.createTokenConversion(conversionData);
      res.status(201).json(conversion);
    } catch (error) {
      res.status(500).json({ message: "Failed to create token conversion" });
    }
  });

  app.get("/api/users/:userId/token-conversions", async (req, res) => {
    try {
      const conversions = await storage.getUserTokenConversions(req.params.userId);
      res.json(conversions);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch token conversions" });
    }
  });

  // New Token Packs Routes
  app.get("/api/token-packs/new", async (req, res) => {
    try {
      const packs = await storage.getActiveNewTokenPacks();
      res.json(packs);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch token packs" });
    }
  });

  app.post("/api/users/:userId/token-packs/:packId/purchase", async (req, res) => {
    try {
      const { paymentMethod } = req.body;
      const result = await storage.purchaseNewTokenPack(
        req.params.userId,
        req.params.packId,
        paymentMethod
      );
      
      if (result.success) {
        res.status(201).json({ message: "Token pack purchased successfully" });
      } else {
        res.status(400).json({ message: result.error });
      }
    } catch (error) {
      res.status(500).json({ message: "Failed to purchase token pack" });
    }
  });

  // XP Activities Routes
  app.get("/api/users/:userId/xp-activities", async (req, res) => {
    try {
      const activities = await storage.getUserXpActivities(req.params.userId);
      res.json(activities);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch XP activities" });
    }
  });

  app.post("/api/users/:userId/award-xp", async (req, res) => {
    try {
      const { activityType, xpAmount, activityId, activityData } = req.body;
      const activity = await storage.awardXP(
        req.params.userId,
        activityType,
        xpAmount,
        activityId,
        activityData
      );
      res.status(201).json(activity);
    } catch (error) {
      res.status(500).json({ message: "Failed to award XP" });
    }
  });

  // Achievements Routes
  app.get("/api/achievements", async (req, res) => {
    try {
      const achievements = await storage.getActiveAchievements();
      res.json(achievements);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch achievements" });
    }
  });

  app.get("/api/users/:userId/achievements", async (req, res) => {
    try {
      const userAchievements = await storage.getUserAchievements(req.params.userId);
      res.json(userAchievements);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch user achievements" });
    }
  });

  app.post("/api/users/:userId/achievements/check", async (req, res) => {
    try {
      const unlockedAchievements = await storage.checkAndUnlockAchievements(req.params.userId);
      res.json(unlockedAchievements);
    } catch (error) {
      res.status(500).json({ message: "Failed to check achievements" });
    }
  });

  app.post("/api/users/:userId/achievements/:achievementId/claim", async (req, res) => {
    try {
      const claimedAchievement = await storage.claimAchievementReward(
        req.params.userId,
        req.params.achievementId
      );
      res.json(claimedAchievement);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to claim achievement";
      res.status(400).json({ message: errorMessage });
    }
  });

  // New Viator Token System Routes
  app.get("/api/viator-token-packs", async (req, res) => {
    try {
      const packs = [
        {
          id: "starter-pack",
          name: "Starter Pack",
          description: "Perfect for new travelers starting their journey with 54 Kairos tokens",
          kairosAmount: 54,
          viatorPrice: "3.00",
          usdPrice: "3.00",
          packType: "starter",
          popularBadge: false
        },
        {
          id: "adventure-pack",
          name: "Adventure Pack",
          description: "Most popular choice with 189 Kairos tokens for the serious traveler",
          kairosAmount: 189,
          viatorPrice: "9.00",
          usdPrice: "9.00",
          packType: "adventure",
          popularBadge: true
        },
        {
          id: "explorer-pack",
          name: "Explorer Pack",
          description: "Premium pack with 360 Kairos tokens for unlimited adventures",
          kairosAmount: 360,
          viatorPrice: "15.00",
          usdPrice: "15.00",
          packType: "explorer",
          popularBadge: false
        }
      ];
      res.json(packs);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch Viator token packs" });
    }
  });

  app.get("/api/users/:userId/raivan-conversions", async (req, res) => {
    try {
      // Return empty array for now - will be implemented when storage methods are complete
      res.json([]);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch Raivan conversions" });
    }
  });

  app.post("/api/raivan-conversions", async (req, res) => {
    try {
      const { userId, raivanAmount, kairosAmount } = req.body;
      
      // Validate conversion rate (18 Raivan = 1 Kairos)
      const expectedKairos = Math.floor(raivanAmount / 18);
      if (kairosAmount !== expectedKairos) {
        return res.status(400).json({ message: "Invalid conversion rate" });
      }

      // Get current user data
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Check if user has enough Raivan tokens
      if (user.raivanTokens < raivanAmount) {
        return res.status(400).json({ message: "Insufficient Raivan tokens" });
      }

      // Update user tokens: subtract Raivan, add Kairos
      const updatedUser = await storage.updateUser(userId, {
        raivanTokens: user.raivanTokens - raivanAmount,
        kairosTokens: user.kairosTokens + kairosAmount
      });

      // Create conversion record
      const conversion = {
        id: "conversion-" + Date.now(),
        userId,
        raivanAmount,
        kairosAmount,
        conversionRate: "18.0",
        status: "completed",
        createdAt: new Date().toISOString()
      };

      res.json(conversion);
    } catch (error) {
      console.error("Raivan conversion error:", error);
      res.status(500).json({ message: "Failed to convert Raivan tokens" });
    }
  });

  app.post("/api/viator-token-packs/purchase", async (req, res) => {
    try {
      const { userId, packId, paymentMethod } = req.body;
      // For now, just simulate a successful purchase
      res.json({
        success: true,
        message: "Token pack purchased successfully"
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to purchase token pack" });
    }
  });

  // User Token Balance Routes - New Viator System
  app.patch("/api/users/:userId/viator-tokens", async (req, res) => {
    try {
      const { viatorTokens } = req.body;
      const user = await storage.updateUser(req.params.userId, { viatorTokens });
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: "Failed to update Viator tokens" });
    }
  });

  app.patch("/api/users/:userId/kairos-tokens", async (req, res) => {
    try {
      const { kairosTokens } = req.body;
      const user = await storage.updateUser(req.params.userId, { kairosTokens });
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: "Failed to update Kairos tokens" });
    }
  });

  app.patch("/api/users/:userId/raivan-tokens", async (req, res) => {
    try {
      const { raivanTokens } = req.body;
      const user = await storage.updateUser(req.params.userId, { raivanTokens });
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: "Failed to update Raivan tokens" });
    }
  });

  // Marketplace Selling and Auction Routes
  app.get("/api/marketplace/listings", async (req, res) => {
    try {
      const { category, sellerId, status } = req.query;
      const filters: any = {};
      if (category) filters.category = category as string;
      if (sellerId) filters.sellerId = sellerId as string;
      if (status) filters.status = status as string;
      
      const listings = await storage.getMarketplaceListings(filters);
      res.json(listings);
    } catch (error) {
      console.error('Marketplace listings error:', error);
      res.status(500).json({ message: "Failed to fetch marketplace listings" });
    }
  });

  // Create new marketplace listing
  app.post("/api/marketplace/listings", async (req, res) => {
    try {
      const listingData = req.body;
      
      // Validate required fields
      if (!listingData.title || !listingData.description || !listingData.sellerId) {
        return res.status(400).json({ message: "Missing required fields" });
      }

      // Generate unique listing ID
      listingData.id = `listing-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      listingData.status = 'active';
      listingData.totalWatchers = 0;
      listingData.totalViews = 0;
      listingData.createdAt = new Date().toISOString();
      listingData.updatedAt = new Date().toISOString();
      
      // Set verification hash for platform-derived items
      listingData.verificationHash = `verified-${listingData.sourceId}-${Date.now()}`;

      const newListing = await storage.createMarketplaceListing(listingData);
      res.status(201).json(newListing);
    } catch (error) {
      console.error('Create listing error:', error);
      res.status(500).json({ message: "Failed to create listing" });
    }
  });

  // Get user's available assets for selling
  app.get("/api/users/:userId/assets", async (req, res) => {
    try {
      const { userId } = req.params;
      
      // Mock user assets - in real implementation, this would come from user's inventory
      const mockAssets = [
        {
          id: "asset-bali-001",
          type: "lottery_prize",
          name: "Bali Cultural Experience Winner",
          description: "8-day authentic Bali cultural immersion experience from VoyageLotto lottery LT2025-101",
          verificationHash: "verified-bali-cultural-001",
          category: "travel_experiences",
          isAvailable: true,
          estimatedValue: 125000
        },
        {
          id: "asset-nft-001",
          type: "platform_nft",
          name: "VoyageLotto Premium NFT",
          description: "Exclusive digital collectible from VoyageLotto platform events",
          verificationHash: "verified-nft-premium-001",
          category: "digital_collectibles",
          isAvailable: true,
          estimatedValue: 45000
        },
        {
          id: "asset-token-pack-001",
          type: "token_pack",
          name: "Adventure Token Pack Voucher",
          description: "Unused Adventure pack voucher with 189 Kairos tokens",
          verificationHash: "verified-token-adventure-001",
          category: "token_vouchers",
          isAvailable: true,
          estimatedValue: 900
        }
      ];

      res.json(mockAssets);
    } catch (error) {
      console.error('User assets error:', error);
      res.status(500).json({ message: "Failed to fetch user assets" });
    }
  });

  app.get("/api/marketplace/listings/:id", async (req, res) => {
    try {
      const listing = await storage.getMarketplaceListing(req.params.id);
      if (!listing) {
        return res.status(404).json({ message: "Listing not found" });
      }
      res.json(listing);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch marketplace listing" });
    }
  });

  app.post("/api/marketplace/listings", async (req, res) => {
    try {
      const validatedData = insertMarketplaceListingSchema.parse(req.body);
      const listing = await storage.createMarketplaceListing(validatedData);
      res.status(201).json(listing);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid listing data", errors: error.errors });
      }
      const errorMessage = error instanceof Error ? error.message : "Failed to create marketplace listing";
      res.status(500).json({ message: errorMessage });
    }
  });

  app.patch("/api/marketplace/listings/:id", async (req, res) => {
    try {
      const listing = await storage.updateMarketplaceListing(req.params.id, req.body);
      res.json(listing);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to update marketplace listing";
      res.status(500).json({ message: errorMessage });
    }
  });

  app.delete("/api/marketplace/listings/:id", async (req, res) => {
    try {
      await storage.deleteMarketplaceListing(req.params.id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete marketplace listing" });
    }
  });

  // Marketplace Bidding Routes
  app.get("/api/marketplace/listings/:listingId/bids", async (req, res) => {
    try {
      const bids = await storage.getMarketplaceBids(req.params.listingId);
      res.json(bids);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch marketplace bids" });
    }
  });

  app.post("/api/marketplace/bids", async (req, res) => {
    try {
      const validatedData = insertMarketplaceBidSchema.parse(req.body);
      const bid = await storage.createMarketplaceBid(validatedData);
      res.status(201).json(bid);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid bid data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create marketplace bid" });
    }
  });

  app.get("/api/marketplace/listings/:listingId/highest-bid", async (req, res) => {
    try {
      const highestBid = await storage.getHighestBid(req.params.listingId);
      res.json(highestBid || null);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch highest bid" });
    }
  });

  // Marketplace Purchase Routes
  app.post("/api/marketplace/purchases", async (req, res) => {
    try {
      const validatedData = insertMarketplacePurchaseSchema.parse(req.body);
      const purchase = await storage.createMarketplacePurchase(validatedData);
      res.status(201).json(purchase);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid purchase data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create marketplace purchase" });
    }
  });

  // Purchase marketplace item with Kairos tokens
  app.post("/api/marketplace/listings/:listingId/purchase", async (req, res) => {
    try {
      const { listingId } = req.params;
      const { userId, purchasePrice, paymentMethod } = req.body;
      
      if (paymentMethod !== 'kairos_tokens') {
        return res.status(400).json({ message: "Only Kairos token payments are supported" });
      }

      // Get user to check token balance
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Get listing to verify it exists and get price
      const listings = await storage.getMarketplaceListings();
      const listing = listings.find(l => l.id === listingId);
      if (!listing) {
        return res.status(404).json({ message: "Listing not found" });
      }

      // Check if user has enough Kairos tokens
      const userTokens = user.kairosTokens || 0;
      if (userTokens < purchasePrice) {
        return res.status(400).json({ 
          message: `Insufficient Kairos tokens. You have ${userTokens} but need ${purchasePrice}` 
        });
      }

      // Deduct tokens from user
      const updatedUser = await storage.updateUser(userId, {
        kairosTokens: userTokens - purchasePrice
      });

      // Create purchase record
      const purchase = await storage.createMarketplacePurchase({
        userId,
        listingId,
        purchasePrice: purchasePrice,
        paymentMethod: 'kairos_tokens',
        status: 'completed',
        transactionHash: `kairos_${Date.now()}_${userId}_${listingId}`
      });

      res.status(201).json({ 
        purchase, 
        newTokenBalance: updatedUser.kairosTokens,
        message: "Purchase completed successfully with Kairos tokens"
      });
    } catch (error) {
      console.error('Kairos purchase failed:', error);
      res.status(500).json({ message: "Failed to complete purchase with Kairos tokens" });
    }
  });

  app.get("/api/marketplace/purchases", async (req, res) => {
    try {
      const { userId } = req.query;
      const purchases = await storage.getMarketplacePurchases(userId as string);
      res.json(purchases);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch marketplace purchases" });
    }
  });

  app.patch("/api/marketplace/purchases/:id", async (req, res) => {
    try {
      const purchase = await storage.updateMarketplacePurchase(req.params.id, req.body);
      res.json(purchase);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to update marketplace purchase";
      res.status(500).json({ message: errorMessage });
    }
  });

  app.post("/api/marketplace/purchases/:id/complete", async (req, res) => {
    try {
      const { transferCode } = req.body;
      const purchase = await storage.completeMarketplacePurchase(req.params.id, transferCode);
      res.json(purchase);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to complete marketplace purchase";
      res.status(400).json({ message: errorMessage });
    }
  });

  // Marketplace Watcher Routes
  app.post("/api/marketplace/watchers", async (req, res) => {
    try {
      const validatedData = insertMarketplaceWatcherSchema.parse(req.body);
      const watcher = await storage.addMarketplaceWatcher(validatedData);
      res.status(201).json(watcher);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid watcher data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to add marketplace watcher" });
    }
  });

  app.delete("/api/marketplace/watchers/:userId/:listingId", async (req, res) => {
    try {
      await storage.removeMarketplaceWatcher(req.params.userId, req.params.listingId);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to remove marketplace watcher" });
    }
  });

  app.get("/api/marketplace/listings/:listingId/watchers", async (req, res) => {
    try {
      const watchers = await storage.getMarketplaceWatchers(req.params.listingId);
      res.json(watchers);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch marketplace watchers" });
    }
  });

  app.get("/api/marketplace/watchers/:userId/:listingId", async (req, res) => {
    try {
      const isWatching = await storage.isUserWatching(req.params.userId, req.params.listingId);
      res.json({ isWatching });
    } catch (error) {
      res.status(500).json({ message: "Failed to check watching status" });
    }
  });

  // Seller Profile Routes
  app.get("/api/marketplace/sellers/:userId", async (req, res) => {
    try {
      const profile = await storage.getSellerProfile(req.params.userId);
      if (!profile) {
        return res.status(404).json({ message: "Seller profile not found" });
      }
      res.json(profile);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch seller profile" });
    }
  });

  app.post("/api/marketplace/sellers", async (req, res) => {
    try {
      const validatedData = insertSellerProfileSchema.parse(req.body);
      const profile = await storage.createSellerProfile(validatedData);
      res.status(201).json(profile);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid seller profile data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create seller profile" });
    }
  });

  app.patch("/api/marketplace/sellers/:userId", async (req, res) => {
    try {
      const profile = await storage.updateSellerProfile(req.params.userId, req.body);
      res.json(profile);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to update seller profile";
      res.status(500).json({ message: errorMessage });
    }
  });

  // Item Verification Routes
  app.get("/api/marketplace/verify/:itemType/:itemId", async (req, res) => {
    try {
      const verification = await storage.getItemVerification(req.params.itemId, req.params.itemType);
      if (!verification) {
        return res.status(404).json({ message: "Item verification not found" });
      }
      res.json(verification);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch item verification" });
    }
  });

  app.post("/api/marketplace/verify", async (req, res) => {
    try {
      const { itemId, itemType, ownerId } = req.body;
      const verification = await storage.verifyPlatformDerivedItem(itemId, itemType, ownerId);
      res.status(201).json(verification);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to verify platform-derived item";
      res.status(500).json({ message: errorMessage });
    }
  });

  // Marketplace Dispute Routes
  app.get("/api/marketplace/disputes", async (req, res) => {
    try {
      const { userId } = req.query;
      const disputes = await storage.getMarketplaceDisputes(userId as string);
      res.json(disputes);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch marketplace disputes" });
    }
  });

  app.post("/api/marketplace/disputes", async (req, res) => {
    try {
      const validatedData = insertMarketplaceDisputeSchema.parse(req.body);
      const dispute = await storage.createMarketplaceDispute(validatedData);
      res.status(201).json(dispute);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid dispute data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create marketplace dispute" });
    }
  });

  app.patch("/api/marketplace/disputes/:id", async (req, res) => {
    try {
      const dispute = await storage.updateMarketplaceDispute(req.params.id, req.body);
      res.json(dispute);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to update marketplace dispute";
      res.status(500).json({ message: errorMessage });
    }
  });

  app.post("/api/marketplace/disputes/:id/resolve", async (req, res) => {
    try {
      const { resolution, resolvedBy } = req.body;
      const dispute = await storage.resolveMarketplaceDispute(req.params.id, resolution, resolvedBy);
      res.json(dispute);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to resolve marketplace dispute";
      res.status(500).json({ message: errorMessage });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
