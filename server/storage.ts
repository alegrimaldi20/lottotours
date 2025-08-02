import { 
  type User, type InsertUser,
  type Mission, type InsertMission, type UserMission,
  type Lottery, type InsertLottery, type LotteryTicket, type InsertLotteryTicket,
  type NFT, type InsertNFT,
  type Prize, type InsertPrize, type PrizeRedemption, type InsertPrizeRedemption,
  users, missions, userMissions, lotteries, lotteryTickets, nfts, prizes, prizeRedemptions
} from "@shared/schema";
import { db } from "./db";
import { eq, and } from "drizzle-orm";
import { randomUUID } from "crypto";

export interface IStorage {
  // Users
  getUsers(): Promise<User[]>;
  getUser(id: string): Promise<User | undefined>;
  getUserByWallet(walletAddress: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUserTokens(userId: string, tokens: number): Promise<User>;

  // Missions
  getMissions(): Promise<Mission[]>;
  getActiveMissions(): Promise<Mission[]>;
  getUserMissions(userId: string): Promise<UserMission[]>;
  completeMission(userId: string, missionId: string): Promise<UserMission>;

  // Lotteries
  getLotteries(): Promise<Lottery[]>;
  getActiveLotteries(): Promise<Lottery[]>;
  getLottery(id: string): Promise<Lottery | undefined>;
  purchaseLotteryTicket(ticket: InsertLotteryTicket): Promise<LotteryTicket>;
  getUserLotteryTickets(userId: string): Promise<LotteryTicket[]>;
  drawLottery(lotteryId: string): Promise<Lottery>;

  // NFTs
  getUserNFTs(userId: string): Promise<NFT[]>;
  mintNFT(nft: InsertNFT): Promise<NFT>;

  // Prizes
  getPrizes(): Promise<Prize[]>;
  getActivePrizes(): Promise<Prize[]>;
  redeemPrize(redemption: InsertPrizeRedemption): Promise<PrizeRedemption>;
  getUserRedemptions(userId: string): Promise<PrizeRedemption[]>;
}

export class DatabaseStorage implements IStorage {
  constructor() {
    // Initialize with sample data on first run
    this.initializeDataIfNeeded();
  }

  private async initializeDataIfNeeded() {
    try {
      // Check if data already exists
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
      // Insert missions
      await db.insert(missions).values([
        {
          id: "mission-paris-culture",
          title: "Discover Paris Culture",
          description: "Learn about 3 famous Parisian landmarks and their history",
          type: "cultural",
          reward: 50,
          difficulty: "easy",
          location: "Paris",
          icon: "paris",
          isActive: true,
        },
        {
          id: "mission-tokyo-food",
          title: "Tokyo Food Explorer",
          description: "Identify 5 traditional Japanese dishes and their origins",
          type: "cultural",
          reward: 75,
          difficulty: "medium",
          location: "Tokyo",
          icon: "tokyo",
          isActive: true,
        },
        {
          id: "mission-beach-adventure",
          title: "Beach Adventure Challenge",
          description: "Complete beach-themed activities and earn tropical rewards",
          type: "sports",
          reward: 100,
          difficulty: "hard",
          location: "Maldives",
          icon: "tropical",
          isActive: true,
        }
      ]);

      // Insert lotteries
      await db.insert(lotteries).values([
        {
          id: "lottery-paris-weekend",
          title: "Paris Weekend Getaway",
          description: "Win a romantic 3-day trip to Paris including flights and luxury hotel",
          theme: "paris",
          prizeTitle: "Paris Weekend Package",
          prizeDescription: "3 days in Paris with 4-star hotel, flights included, and €500 spending money",
          prizeValue: 200000,
          ticketPrice: 10,
          maxTickets: 1000,
          soldTickets: 245,
          drawDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          status: "active",
          image: "paris",
        },
        {
          id: "lottery-tropical-escape",
          title: "Tropical Paradise Escape",
          description: "7-day all-inclusive resort vacation in the Maldives",
          theme: "tropical",
          prizeTitle: "Maldives Resort Package",
          prizeDescription: "7 days at a 5-star overwater villa resort with all meals and activities",
          prizeValue: 500000,
          ticketPrice: 25,
          maxTickets: 500,
          soldTickets: 127,
          drawDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
          status: "active",
          image: "tropical",
        }
      ]);

      // Insert prizes
      await db.insert(prizes).values([
        {
          id: "prize-city-break",
          title: "European City Break",
          description: "Choose from 10 European destinations for a 3-day city break",
          category: "travel_package",
          destination: "Europe",
          value: 80000,
          tokensRequired: 500,
          image: "europe",
          provider: "TravelCorp",
          availability: 50,
          validUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
          terms: "Valid for 12 months from redemption. Subject to availability.",
          isActive: true,
        },
        {
          id: "prize-adventure-gear",
          title: "Adventure Travel Gear Set",
          description: "Complete travel backpack with hiking essentials",
          category: "product",
          destination: null,
          value: 25000,
          tokensRequired: 150,
          image: "adventure-gear",
          provider: "AdventureGear Co",
          availability: 100,
          validUntil: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000),
          terms: "Shipping included. International delivery available.",
          isActive: true,
        }
      ]);

      // Insert sample user
      await db.insert(users).values({
        id: "sample-user",
        walletAddress: null,
        username: "Explorer",
        email: "explorer@travellotto.com",
        avatar: "🧭",
        tokens: 250,
        level: 3,
        totalMissionsCompleted: 5,
      });

      console.log("Sample data initialized successfully");
    } catch (error) {
      console.log("Sample data already exists or error:", error);
    }
  }



  // Users
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
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async updateUserTokens(userId: string, tokens: number): Promise<User> {
    const [user] = await db
      .update(users)
      .set({ tokens })
      .where(eq(users.id, userId))
      .returning();
    
    if (!user) throw new Error("User not found");
    return user;
  }

  // Missions
  async getMissions(): Promise<Mission[]> {
    return await db.select().from(missions);
  }

  async getActiveMissions(): Promise<Mission[]> {
    return await db.select().from(missions).where(eq(missions.isActive, true));
  }

  async getUserMissions(userId: string): Promise<UserMission[]> {
    return await db.select().from(userMissions).where(eq(userMissions.userId, userId));
  }

  async completeMission(userId: string, missionId: string): Promise<UserMission> {
    // Check if mission already exists
    const [existingMission] = await db
      .select()
      .from(userMissions)
      .where(and(eq(userMissions.userId, userId), eq(userMissions.missionId, missionId)));
    
    if (existingMission) {
      const [updated] = await db
        .update(userMissions)
        .set({ status: "completed", completedAt: new Date() })
        .where(eq(userMissions.id, existingMission.id))
        .returning();
      return updated;
    }

    const [userMission] = await db
      .insert(userMissions)
      .values({
        userId,
        missionId,
        status: "completed",
        completedAt: new Date(),
      })
      .returning();
    
    return userMission;
  }

  // Lotteries
  async getLotteries(): Promise<Lottery[]> {
    return await db.select().from(lotteries);
  }

  async getActiveLotteries(): Promise<Lottery[]> {
    return await db.select().from(lotteries).where(eq(lotteries.status, "active"));
  }

  async getLottery(id: string): Promise<Lottery | undefined> {
    const [lottery] = await db.select().from(lotteries).where(eq(lotteries.id, id));
    return lottery || undefined;
  }

  async purchaseLotteryTicket(insertTicket: InsertLotteryTicket): Promise<LotteryTicket> {
    const [lottery] = await db.select().from(lotteries).where(eq(lotteries.id, insertTicket.lotteryId));
    if (!lottery) throw new Error("Lottery not found");
    
    const [ticket] = await db
      .insert(lotteryTickets)
      .values(insertTicket)
      .returning();
    
    // Update sold tickets count
    await db
      .update(lotteries)
      .set({ soldTickets: lottery.soldTickets + 1 })
      .where(eq(lotteries.id, lottery.id));
    
    return ticket;
  }

  async getUserLotteryTickets(userId: string): Promise<LotteryTicket[]> {
    return await db.select().from(lotteryTickets).where(eq(lotteryTickets.userId, userId));
  }

  async drawLottery(lotteryId: string): Promise<Lottery> {
    const [lottery] = await db.select().from(lotteries).where(eq(lotteries.id, lotteryId));
    if (!lottery) throw new Error("Lottery not found");
    
    const tickets = await db.select().from(lotteryTickets).where(eq(lotteryTickets.lotteryId, lotteryId));
    if (tickets.length === 0) throw new Error("No tickets sold");
    
    const winningTicket = tickets[Math.floor(Math.random() * tickets.length)];
    const [updatedLottery] = await db
      .update(lotteries)
      .set({ status: "drawn", winnerId: winningTicket.userId })
      .where(eq(lotteries.id, lotteryId))
      .returning();
    
    return updatedLottery;
  }

  // NFTs
  async getUserNFTs(userId: string): Promise<NFT[]> {
    return await db.select().from(nfts).where(eq(nfts.ownerId, userId));
  }

  async mintNFT(insertNft: InsertNFT): Promise<NFT> {
    const [nft] = await db
      .insert(nfts)
      .values(insertNft)
      .returning();
    return nft;
  }

  // Prizes
  async getPrizes(): Promise<Prize[]> {
    return await db.select().from(prizes);
  }

  async getActivePrizes(): Promise<Prize[]> {
    return await db.select().from(prizes).where(and(eq(prizes.isActive, true)));
  }

  async redeemPrize(insertRedemption: InsertPrizeRedemption): Promise<PrizeRedemption> {
    const [prize] = await db.select().from(prizes).where(eq(prizes.id, insertRedemption.prizeId));
    if (!prize) throw new Error("Prize not found");
    if (prize.availability <= 0) throw new Error("Prize not available");
    
    const [redemption] = await db
      .insert(prizeRedemptions)
      .values({
        ...insertRedemption,
        redemptionCode: `TL-${randomUUID().slice(0, 8).toUpperCase()}`,
      })
      .returning();
    
    // Update prize availability
    await db
      .update(prizes)
      .set({ availability: prize.availability - 1 })
      .where(eq(prizes.id, prize.id));
    
    return redemption;
  }

  async getUserRedemptions(userId: string): Promise<PrizeRedemption[]> {
    return await db.select().from(prizeRedemptions).where(eq(prizeRedemptions.userId, userId));
  }
}

export const storage = new DatabaseStorage();
