import { db } from "./db";
import { sql, eq, desc, count, sum, and, or, inArray, gte, lte, isNull, isNotNull, ne } from "drizzle-orm";
import crypto from "crypto";
import {
  users, lotteries, lotteryTickets, lotteryDraws, missions, userMissions,
  prizes, 
  type User, type Lottery, type LotteryTicket, type LotteryDraw, type Mission,
  type UserMission, type Prize,
  type InsertUser, type InsertLottery, type InsertLotteryTicket,
  type InsertLotteryDraw, type InsertMission, type InsertUserMission,
  type InsertPrize
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
  redeemPrize(userId: string, prizeId: string, tokensUsed: number): Promise<any>;
  getUserPrizeRedemptions(userId: string): Promise<any[]>;

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
      console.log("Initializing sample data...");
      
      // Insert sample user
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

      // Insert sample lotteries with proper schema
      await db.insert(lotteries).values([
        {
          id: "lottery-bali-adventure",
          title: "Bali Cultural Immersion Adventure",
          description: "8-day authentic Balinese cultural experience with local guides",
          theme: "Cultural Adventure",
          prizeTitle: "Bali Cultural Experience",
          prizeDescription: "8-day guided cultural immersion in Bali",
          prizeValue: 450000,
          lotteryCode: "LT2025-101",
          ticketPrice: 45,
          maxTickets: 500,
          soldTickets: 0,
          drawDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          image: "/api/placeholder/400/300"
        },
        {
          id: "lottery-patagonia-expedition", 
          title: "Patagonia Wilderness Expedition",
          description: "10-day guided trekking adventure through pristine Patagonia",
          theme: "Adventure",
          prizeTitle: "Patagonia Expedition",
          prizeDescription: "10-day guided trekking adventure",
          prizeValue: 650000,
          lotteryCode: "LT2025-102",
          ticketPrice: 65,
          maxTickets: 300,
          soldTickets: 0,
          drawDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
          image: "/api/placeholder/400/300"
        },
        {
          id: "lottery-vip-ultimate-world",
          title: "VIP Ultimate World Experience", 
          description: "Luxury 21-day around-the-world adventure with VIP access",
          theme: "Luxury",
          prizeTitle: "World Tour VIP",
          prizeDescription: "21-day luxury world adventure",
          prizeValue: 2500000,
          lotteryCode: "LT2025-VIP",
          ticketPrice: 125,
          maxTickets: 100,
          soldTickets: 47,
          drawDate: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000),
          image: "/api/placeholder/400/300"
        }
      ]);

      // Insert sample missions
      await db.insert(missions).values([
        {
          title: "Cultural Photo Quest",
          description: "Take photos of 3 local cultural landmarks",
          type: "cultural",
          reward: 50,
          difficulty: "easy",
          location: "Any City",
          icon: "📸",
          verificationMethod: "proof_required",
          verificationCriteria: JSON.stringify({ requiredPhotos: 3, type: "landmarks" }),
          requiredProofType: "photo"
        },
        {
          title: "Local Food Discovery",
          description: "Try 2 traditional local dishes and share your experience",
          type: "cultural", 
          reward: 75,
          difficulty: "medium",
          location: "Any City",
          icon: "🍜",
          verificationMethod: "proof_required",
          verificationCriteria: JSON.stringify({ requiredDishes: 2, requireReview: true }),
          requiredProofType: "photo"
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
    const result = await db.select().from(users).where(eq(users.id, id));
    return result[0];
  }

  async getUserByWallet(walletAddress: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.walletAddress, walletAddress));
    return result[0];
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async updateUser(userId: string, updateData: Partial<InsertUser>): Promise<User> {
    const [user] = await db.update(users)
      .set(updateData)
      .where(eq(users.id, userId))
      .returning();
    return user;
  }

  async updateUserTokens(userId: string, tokenChange: number): Promise<User> {
    const [user] = await db.update(users)
      .set({ 
        raivanTokens: sql`${users.raivanTokens} + ${tokenChange}`
      })
      .where(eq(users.id, userId))
      .returning();
    return user;
  }

  // Lottery methods  
  async getLotteries(): Promise<Lottery[]> {
    return await db.select().from(lotteries);
  }

  async getActiveLotteries(): Promise<Lottery[]> {
    return await db.select().from(lotteries).where(eq(lotteries.status, "active"));
  }

  async getLottery(id: string): Promise<Lottery | undefined> {
    const result = await db.select().from(lotteries).where(eq(lotteries.id, id));
    return result[0];
  }

  async createLottery(lottery: InsertLottery): Promise<Lottery> {
    const [newLottery] = await db.insert(lotteries).values(lottery).returning();
    return newLottery;
  }

  async updateLottery(id: string, updates: Partial<Lottery>): Promise<Lottery> {
    const [lottery] = await db.update(lotteries)
      .set(updates)
      .where(eq(lotteries.id, id))
      .returning();
    return lottery;
  }
  
  // Lottery ticket methods
  async getUserLotteryTickets(userId: string): Promise<LotteryTicket[]> {
    return await db.select().from(lotteryTickets).where(eq(lotteryTickets.userId, userId));
  }

  async purchaseLotteryTicket(insertTicket: InsertLotteryTicket): Promise<LotteryTicket> {
    const [ticket] = await db.insert(lotteryTickets).values({
      ...insertTicket,
      ticketCode: generateUniqueCode("TK"),
      isAutoGenerated: insertTicket.isAutoGenerated || false
    }).returning();
    
    // Update lottery sold tickets count
    await db.update(lotteries)
      .set({ soldTickets: sql`${lotteries.soldTickets} + 1` })
      .where(eq(lotteries.id, insertTicket.lotteryId));
    
    return ticket;
  }
  
  // Lottery draw methods
  async executeLotteryDraw(lotteryId: string, drawExecutorId?: string): Promise<{ lottery: Lottery, draw: LotteryDraw }> {
    // Get lottery and all tickets
    const lottery = await this.getLottery(lotteryId);
    if (!lottery) throw new Error("Lottery not found");
    
    const tickets = await db.select().from(lotteryTickets)
      .where(eq(lotteryTickets.lotteryId, lotteryId));
    
    if (tickets.length === 0) throw new Error("No tickets purchased");
    
    // Select random winning ticket
    const winningTicket = tickets[Math.floor(Math.random() * tickets.length)];
    
    // Create draw record
    const [draw] = await db.insert(lotteryDraws).values({
      drawCode: generateUniqueCode("DRW"),
      lotteryId,
      winningTicketId: winningTicket.id,
      winnerId: winningTicket.userId,
      winningNumbers: winningTicket.selectedNumbers,
      totalTicketsSold: tickets.length,
      drawExecutorId,
      verificationHash: crypto.randomBytes(32).toString('hex')
    }).returning();
    
    // Update lottery status and winner
    const [updatedLottery] = await db.update(lotteries)
      .set({ 
        status: "drawn",
        winnerId: winningTicket.userId
      })
      .where(eq(lotteries.id, lotteryId))
      .returning();
    
    // Mark winning ticket
    await db.update(lotteryTickets)
      .set({ isWinner: true })
      .where(eq(lotteryTickets.id, winningTicket.id));
    
    return { lottery: updatedLottery, draw };
  }

  async getLotteryDraws(lotteryId?: string): Promise<LotteryDraw[]> {
    if (lotteryId) {
      return await db.select().from(lotteryDraws).where(eq(lotteryDraws.lotteryId, lotteryId));
    }
    return await db.select().from(lotteryDraws);
  }

  async getLotteryDraw(drawId: string): Promise<LotteryDraw | undefined> {
    const result = await db.select().from(lotteryDraws).where(eq(lotteryDraws.id, drawId));
    return result[0];
  }

  async getLotteryByCode(lotteryCode: string): Promise<Lottery | undefined> {
    const result = await db.select().from(lotteries).where(eq(lotteries.lotteryCode, lotteryCode));
    return result[0];
  }

  async getLotteryDrawByCode(drawCode: string): Promise<LotteryDraw | undefined> {
    const result = await db.select().from(lotteryDraws).where(eq(lotteryDraws.drawCode, drawCode));
    return result[0];
  }

  // Prize methods
  async getPrizes(): Promise<Prize[]> {
    return await db.select().from(prizes);
  }

  async getActivePrizes(): Promise<Prize[]> {
    return await db.select().from(prizes).where(eq(prizes.isActive, true));
  }

  async getPrize(id: string): Promise<Prize | undefined> {
    const result = await db.select().from(prizes).where(eq(prizes.id, id));
    return result[0];
  }

  async redeemPrize(userId: string, prizeId: string, tokensUsed: number): Promise<any> {
    // For now, return a simple redemption object
    return {
      id: generateUniqueCode("RDM"),
      userId,
      prizeId, 
      tokensUsed,
      status: "pending",
      redeemedAt: new Date()
    };
  }

  async getUserPrizeRedemptions(userId: string): Promise<any[]> {
    // Return empty array for now
    return [];
  }

  // Mission methods
  async getMissions(): Promise<Mission[]> {
    return await db.select().from(missions);
  }

  async getActiveMissions(): Promise<Mission[]> {
    return await db.select().from(missions).where(eq(missions.isActive, true));
  }

  async getMission(id: string): Promise<Mission | undefined> {
    const result = await db.select().from(missions).where(eq(missions.id, id));
    return result[0];
  }

  async getUserMissions(userId: string): Promise<UserMission[]> {
    return await db.select().from(userMissions).where(eq(userMissions.userId, userId));
  }

  async createUserMission(userMission: InsertUserMission): Promise<UserMission> {
    const [newUserMission] = await db.insert(userMissions).values(userMission).returning();
    return newUserMission;
  }

  async updateUserMission(id: string, updates: Partial<UserMission>): Promise<UserMission> {
    const [userMission] = await db.update(userMissions)
      .set(updates)
      .where(eq(userMissions.id, id))
      .returning();
    return userMission;
  }
}

export const storage = new DatabaseStorage();