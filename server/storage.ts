import { db } from "./db";
import { sql, eq, desc, count, sum, and, or, inArray, gte, lte, isNull, isNotNull, ne } from "drizzle-orm";
import crypto from "crypto";
import {
  users, lotteries, lotteryTickets, lotteryDraws, missions, userMissions,
  prizes, userFavorites, prizeRedemptions, countryOperations, affiliatePartners,
  territories, territoryManagers, territoryManagement, raivanConversions,
  viatorTokenPacks, raivanActivities, userConversionLimits, achievements,
  userAchievements, marketplaceListings, marketplaceBids, marketplacePurchases,
  marketplaceWatchers, sellerProfiles, itemVerifications, marketplaceDisputes,
  type User, type Lottery, type LotteryTicket, type LotteryDraw, type Mission,
  type UserMission, type Prize, type UserFavorite, type PrizeRedemption,
  type CountryOperations, type AffiliatePartner, type Territory,
  type TerritoryManager, type TerritoryManagement, type RaivanConversion,
  type ViatorTokenPack, type RaivanActivity, type UserConversionLimit,
  type Achievement, type UserAchievement, type MarketplaceListing,
  type MarketplaceBid, type MarketplacePurchase, type MarketplaceWatcher,
  type SellerProfile, type ItemVerification, type MarketplaceDispute,
  type InsertUser, type InsertLottery, type InsertLotteryTicket,
  type InsertLotteryDraw, type InsertMission, type InsertUserMission,
  type InsertPrize, type InsertUserFavorite, type InsertPrizeRedemption,
  type InsertCountryOperations, type InsertAffiliatePartner,
  type InsertTerritory, type InsertTerritoryManager,
  type InsertTerritoryManagement, type InsertRaivanConversion,
  type InsertViatorTokenPack, type InsertRaivanActivity,
  type InsertUserConversionLimit, type InsertAchievement,
  type InsertUserAchievement, type InsertMarketplaceListing,
  type InsertMarketplaceBid, type InsertMarketplacePurchase,
  type InsertMarketplaceWatcher, type InsertSellerProfile,
  type InsertItemVerification, type InsertMarketplaceDispute
} from "@shared/schema";

// Main interface definition
export interface IStorage {
  // User methods
  getUsers(): Promise<User[]>;
  getUser(id: string): Promise<User | undefined>;
  getUserByWallet(walletAddress: string): Promise<User | undefined>;
  createUser(insertUser: InsertUser): Promise<User>;
  updateUser(userId: string, updateData: Partial<InsertUser>): Promise<User>;
  updateUserTokens(userId: string, tokenChange: number): Promise<User>;

  // Lottery methods  
  getLotteries(): Promise<Lottery[]>;
  getActiveLotteries(): Promise<Lottery[]>;
  getLottery(id: string): Promise<Lottery | undefined>;
  createLottery(lottery: InsertLottery): Promise<Lottery>;
  updateLottery(id: string, updates: Partial<Lottery>): Promise<Lottery>;
  
  // Lottery ticket methods
  getUserLotteryTickets(userId: string): Promise<LotteryTicket[]>;
  purchaseLotteryTicket(insertTicket: InsertLotteryTicket): Promise<LotteryTicket>;
  
  // Lottery draw methods
  executeLotteryDraw(lotteryId: string, drawExecutorId?: string): Promise<{ lottery: Lottery, draw: LotteryDraw }>;
  getLotteryDraws(lotteryId?: string): Promise<LotteryDraw[]>;
  getLotteryDraw(drawId: string): Promise<LotteryDraw | undefined>;
  getLotteryByCode(lotteryCode: string): Promise<Lottery | undefined>;
  getLotteryDrawByCode(drawCode: string): Promise<LotteryDraw | undefined>;

  // Prize methods
  getPrizes(): Promise<Prize[]>;
  getActivePrizes(): Promise<Prize[]>;
  getPrize(id: string): Promise<Prize | undefined>;
  redeemPrize(userId: string, prizeId: string, tokensUsed: number): Promise<PrizeRedemption>;
  getUserPrizeRedemptions(userId: string): Promise<PrizeRedemption[]>;

  // Mission methods
  getMissions(): Promise<Mission[]>;
  getActiveMissions(): Promise<Mission[]>;
  getMission(id: string): Promise<Mission | undefined>;
  getUserMissions(userId: string): Promise<UserMission[]>;
  createUserMission(userMission: InsertUserMission): Promise<UserMission>;
  updateUserMission(id: string, updates: Partial<UserMission>): Promise<UserMission>;
}

function generateUniqueCode(prefix: string, length: number = 8): string {
  const randomBytes = crypto.randomBytes(4);
  const randomString = randomBytes.toString('hex').toUpperCase().slice(0, length);
  return `${prefix}-${randomString}`;
}

export class DatabaseStorage implements IStorage {
  constructor() {
    this.initializeDataIfNeeded();
  }

  private async initializeDataIfNeeded() {
    try {
      const existingUsers = await db.select().from(users).limit(1);
      if (existingUsers.length === 0) {
        await this.initializeSampleData();
      }
    } catch (error) {
      console.log("Database initialization will happen on first API call");
    }
  }

  private async initializeSampleData() {
    try {
      // Insert sample user with proper schema fields
      const [sampleUser] = await db.insert(users).values({
        walletAddress: null,
        username: "Explorer",
        email: "explorer@travellotto.com", 
        avatar: "🧭",
        viatorTokens: "250",
        kairosTokens: 5000,
        raivanTokens: 15000,
        level: 3,
        totalMissionsCompleted: 5,
        stripeCustomerId: null
      }).returning();

      // Insert sample lotteries
      await db.insert(lotteries).values([
        {
          id: "lottery-bali-adventure",
          title: "Bali Cultural Immersion Adventure",
          description: "8-day authentic Balinese cultural experience with local guides",
          lotteryCode: "LT2025-101",
          ticketPrice: 45,
          maxTickets: 500,
          soldTickets: 0,
          drawDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          prizes: JSON.stringify({
            grand: "Bali 8-day cultural tour for 2 ($4,500 value)",
            second: "Bali accommodation voucher ($1,200 value)",
            third: "Traditional Balinese craft set ($300 value)"
          }),
          status: "active",
          winnerId: null,
          createdAt: new Date(),
          isActive: true,
        },
        {
          id: "lottery-patagonia-expedition", 
          title: "Patagonia Wilderness Expedition",
          description: "10-day guided trekking adventure through pristine Patagonia",
          lotteryCode: "LT2025-102",
          ticketPrice: 65,
          maxTickets: 300,
          soldTickets: 0,
          drawDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
          prizes: JSON.stringify({
            grand: "Patagonia expedition for 2 ($6,500 value)",
            second: "Professional hiking gear set ($1,500 value)", 
            third: "Patagonia adventure photography book ($200 value)"
          }),
          status: "active",
          winnerId: null,
          createdAt: new Date(),
          isActive: true,
        },
        {
          id: "lottery-vip-ultimate-world",
          title: "VIP Ultimate World Experience", 
          description: "Luxury 21-day around-the-world adventure with VIP access",
          lotteryCode: "LT2025-VIP",
          ticketPrice: 125,
          maxTickets: 100,
          soldTickets: 47, // Current number based on logs
          drawDate: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000),
          prizes: JSON.stringify({
            grand: "21-day luxury world tour for 2 ($25,000 value)",
            second: "First-class flight vouchers ($8,000 value)",
            third: "Luxury resort weekend getaway ($2,000 value)"
          }),
          status: "active",
          winnerId: null,
          createdAt: new Date(),
          isActive: true,
        }
      ]);

      console.log("Sample data initialized successfully");
    } catch (error) {
      console.log("Sample data already exists or error:", error);
    }
  }

  // User methods
  async getUsers(): Promise<User[]> {
    return await db.select().from(users);
  }

  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByWallet(walletAddress: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.walletAddress, walletAddress));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async updateUser(userId: string, updateData: Partial<InsertUser>): Promise<User> {
    const [user] = await db
      .update(users)
      .set(updateData)
      .where(eq(users.id, userId))
      .returning();
    
    if (!user) throw new Error("User not found");
    return user;
  }

  async updateUserTokens(userId: string, tokenChange: number): Promise<User> {
    const [user] = await db
      .update(users)
      .set({
        kairosTokens: sql`${users.kairosTokens} + ${tokenChange}`
      })
      .where(eq(users.id, userId))
      .returning();
    
    if (!user) throw new Error("User not found");
    return user;
  }

  // Lottery methods
  async getLotteries(): Promise<Lottery[]> {
    return await db.select().from(lotteries);
  }

  async getActiveLotteries(): Promise<Lottery[]> {
    return await db.select().from(lotteries).where(eq(lotteries.isActive, true));
  }

  async getLottery(id: string): Promise<Lottery | undefined> {
    const [lottery] = await db.select().from(lotteries).where(eq(lotteries.id, id));
    return lottery || undefined;
  }

  async createLottery(lottery: InsertLottery): Promise<Lottery> {
    const [newLottery] = await db.insert(lotteries).values(lottery).returning();
    return newLottery;
  }

  async updateLottery(id: string, updates: Partial<Lottery>): Promise<Lottery> {
    const [lottery] = await db
      .update(lotteries)
      .set(updates)
      .where(eq(lotteries.id, id))
      .returning();
    
    if (!lottery) throw new Error("Lottery not found");
    return lottery;
  }

  // Lottery ticket methods
  async getUserLotteryTickets(userId: string): Promise<LotteryTicket[]> {
    console.log(`Fetching tickets for user: ${userId}`);
    console.log(`Querying lottery tickets for user: ${userId}`);
    
    const tickets = await db
      .select()
      .from(lotteryTickets)
      .where(eq(lotteryTickets.userId, userId))
      .orderBy(desc(lotteryTickets.createdAt));
    
    console.log(`Database query successful, found ${tickets.length} tickets`);
    console.log(`Found ${tickets.length} tickets for user`);
    
    return tickets;
  }

  async purchaseLotteryTicket(insertTicket: InsertLotteryTicket): Promise<LotteryTicket> {
    const [lottery] = await db.select().from(lotteries).where(eq(lotteries.id, insertTicket.lotteryId));
    if (!lottery) throw new Error("Lottery not found");
    
    // Check user's tokens and deduct the cost
    const [user] = await db.select().from(users).where(eq(users.id, insertTicket.userId));
    if (!user) throw new Error("User not found");
    
    if (user.kairosTokens < lottery.ticketPrice) {
      throw new Error("Insufficient Kairos tokens");
    }
    
    // Generate ticket code
    const ticketCode = `TK-${lottery.lotteryCode || lottery.id}-${String(lottery.soldTickets + 1).padStart(4, '0')}`;
    
    // Deduct Kairos tokens from user
    await db
      .update(users)
      .set({ kairosTokens: user.kairosTokens - lottery.ticketPrice })
      .where(eq(users.id, insertTicket.userId));
    
    const [ticket] = await db
      .insert(lotteryTickets)
      .values({
        ...insertTicket,
        ticketCode
      })
      .returning();
    
    // Update sold tickets count
    await db
      .update(lotteries)
      .set({ soldTickets: lottery.soldTickets + 1 })
      .where(eq(lotteries.id, lottery.id));
    
    return ticket;
  }

  // Lottery draw methods
  async executeLotteryDraw(lotteryId: string, drawExecutorId?: string): Promise<{ lottery: Lottery, draw: LotteryDraw }> {
    const tickets = await db.select().from(lotteryTickets).where(eq(lotteryTickets.lotteryId, lotteryId));
    
    if (tickets.length === 0) {
      throw new Error("No tickets sold for this lottery");
    }
    
    // Select random winning ticket
    const winningTicket = tickets[Math.floor(Math.random() * tickets.length)];
    
    // Generate draw code and verification hash
    const drawCode = generateUniqueCode("DRW", 6);
    const verificationHash = crypto
      .createHash('sha256')
      .update(`${drawCode}-${winningTicket.id}-${Date.now()}`)
      .digest('hex');
    
    const [draw] = await db
      .insert(lotteryDraws)
      .values({
        drawCode,
        lotteryId,
        winningTicketId: winningTicket.id,
        winnerId: winningTicket.userId,
        winningNumbers: winningTicket.selectedNumbers,
        totalTicketsSold: tickets.length,
        drawExecutorId: drawExecutorId || 'system',
        verificationHash,
        winnerQrCode: `QR-${drawCode}`,
        drawData: JSON.stringify({
          totalParticipants: new Set(tickets.map(t => t.userId)).size,
          winningTicketNumber: winningTicket.ticketNumber,
          drawTimestamp: new Date().toISOString()
        })
      })
      .returning();
    
    const [updatedLottery] = await db
      .update(lotteries)
      .set({ 
        status: "drawn", 
        winnerId: winningTicket.userId
      })
      .where(eq(lotteries.id, lotteryId))
      .returning();
    
    return { lottery: updatedLottery, draw };
  }

  async getLotteryDraws(lotteryId?: string): Promise<LotteryDraw[]> {
    if (lotteryId) {
      return await db.select().from(lotteryDraws).where(eq(lotteryDraws.lotteryId, lotteryId));
    }
    return await db.select().from(lotteryDraws);
  }

  async getLotteryDraw(drawId: string): Promise<LotteryDraw | undefined> {
    const [draw] = await db.select().from(lotteryDraws).where(eq(lotteryDraws.id, drawId));
    return draw;
  }

  async getLotteryByCode(lotteryCode: string): Promise<Lottery | undefined> {
    const [lottery] = await db.select().from(lotteries).where(eq(lotteries.lotteryCode, lotteryCode));
    return lottery;
  }

  async getLotteryDrawByCode(drawCode: string): Promise<LotteryDraw | undefined> {
    const [draw] = await db.select().from(lotteryDraws).where(eq(lotteryDraws.drawCode, drawCode));
    return draw;
  }

  // Prize methods (simplified implementations)
  async getPrizes(): Promise<Prize[]> {
    return await db.select().from(prizes);
  }

  async getActivePrizes(): Promise<Prize[]> {
    return await db.select().from(prizes).where(eq(prizes.isActive, true));
  }

  async getPrize(id: string): Promise<Prize | undefined> {
    const [prize] = await db.select().from(prizes).where(eq(prizes.id, id));
    return prize;
  }

  async redeemPrize(userId: string, prizeId: string, tokensUsed: number): Promise<PrizeRedemption> {
    // This is a simplified implementation
    const [redemption] = await db.insert(prizeRedemptions).values({
      userId,
      prizeId,
      tokensUsed,
      redemptionCode: generateUniqueCode("RDM", 6),
      status: "pending"
    }).returning();
    
    return redemption;
  }

  async getUserPrizeRedemptions(userId: string): Promise<PrizeRedemption[]> {
    return await db.select().from(prizeRedemptions).where(eq(prizeRedemptions.userId, userId));
  }

  // Mission methods (simplified implementations)
  async getMissions(): Promise<Mission[]> {
    return await db.select().from(missions);
  }

  async getActiveMissions(): Promise<Mission[]> {
    return await db.select().from(missions).where(eq(missions.isActive, true));
  }

  async getMission(id: string): Promise<Mission | undefined> {
    const [mission] = await db.select().from(missions).where(eq(missions.id, id));
    return mission;
  }

  async getUserMissions(userId: string): Promise<UserMission[]> {
    return await db.select().from(userMissions).where(eq(userMissions.userId, userId));
  }

  async createUserMission(userMission: InsertUserMission): Promise<UserMission> {
    const [newUserMission] = await db.insert(userMissions).values(userMission).returning();
    return newUserMission;
  }

  async updateUserMission(id: string, updates: Partial<UserMission>): Promise<UserMission> {
    const [userMission] = await db
      .update(userMissions)
      .set(updates)
      .where(eq(userMissions.id, id))
      .returning();
    
    if (!userMission) throw new Error("User mission not found");
    return userMission;
  }
}

export const storage = new DatabaseStorage();