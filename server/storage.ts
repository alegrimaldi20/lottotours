import { 
  type User, type InsertUser,
  type Mission, type InsertMission, type UserMission,
  type Lottery, type InsertLottery, type LotteryTicket, type InsertLotteryTicket,
  type NFT, type InsertNFT,
  type Prize, type InsertPrize, type PrizeRedemption, type InsertPrizeRedemption
} from "@shared/schema";
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

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private missions: Map<string, Mission>;
  private userMissions: Map<string, UserMission>;
  private lotteries: Map<string, Lottery>;
  private lotteryTickets: Map<string, LotteryTicket>;
  private nfts: Map<string, NFT>;
  private prizes: Map<string, Prize>;
  private prizeRedemptions: Map<string, PrizeRedemption>;

  constructor() {
    this.users = new Map();
    this.missions = new Map();
    this.userMissions = new Map();
    this.lotteries = new Map();
    this.lotteryTickets = new Map();
    this.nfts = new Map();
    this.prizes = new Map();
    this.prizeRedemptions = new Map();

    // Initialize with sample data
    this.initializeMissions();
    this.initializeLotteries();
    this.initializePrizes();
    this.initializeSampleUser();
  }

  private initializeMissions() {
    const defaultMissions: Mission[] = [
      {
        id: "mission-paris-culture",
        title: "Discover Paris Culture",
        description: "Learn about 3 famous Parisian landmarks and their history",
        type: "cultural",
        reward: 50,
        difficulty: "easy",
        location: "Paris",
        icon: "🗼",
        isActive: true,
        createdAt: new Date()
      },
      {
        id: "mission-tokyo-food",
        title: "Tokyo Food Explorer",
        description: "Identify 5 traditional Japanese dishes and their origins",
        type: "cultural",
        reward: 75,
        difficulty: "medium",
        location: "Tokyo",
        icon: "🍜",
        isActive: true,
        createdAt: new Date()
      },
      {
        id: "mission-beach-adventure",
        title: "Beach Adventure Challenge",
        description: "Complete beach-themed activities and earn tropical rewards",
        type: "sports",
        reward: 100,
        difficulty: "hard",
        location: "Maldives",
        icon: "🏖️",
        isActive: true,
        createdAt: new Date()
      }
    ];

    defaultMissions.forEach(mission => {
      this.missions.set(mission.id, mission);
    });
  }

  private initializeLotteries() {
    const defaultLotteries: Lottery[] = [
      {
        id: "lottery-paris-weekend",
        title: "Paris Weekend Getaway",
        description: "Win a romantic 3-day trip to Paris including flights and luxury hotel",
        theme: "paris",
        prizeTitle: "Paris Weekend Package",
        prizeDescription: "3 days in Paris with 4-star hotel, flights included, and €500 spending money",
        prizeValue: 200000, // $2000
        ticketPrice: 10, // 10 tokens
        maxTickets: 1000,
        soldTickets: 245,
        drawDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
        status: "active",
        winnerId: null,
        image: "🗼",
        createdAt: new Date()
      },
      {
        id: "lottery-tropical-escape",
        title: "Tropical Paradise Escape",
        description: "7-day all-inclusive resort vacation in the Maldives",
        theme: "tropical",
        prizeTitle: "Maldives Resort Package",
        prizeDescription: "7 days at a 5-star overwater villa resort with all meals and activities",
        prizeValue: 500000, // $5000
        ticketPrice: 25, // 25 tokens
        maxTickets: 500,
        soldTickets: 127,
        drawDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days from now
        status: "active",
        winnerId: null,
        image: "🏝️",
        createdAt: new Date()
      }
    ];

    defaultLotteries.forEach(lottery => {
      this.lotteries.set(lottery.id, lottery);
    });
  }

  private initializePrizes() {
    const defaultPrizes: Prize[] = [
      {
        id: "prize-city-break",
        title: "European City Break",
        description: "Choose from 10 European destinations for a 3-day city break",
        category: "travel_package",
        destination: "Europe",
        value: 80000, // $800
        tokensRequired: 500,
        image: "🏛️",
        provider: "TravelCorp",
        availability: 50,
        validUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year
        terms: "Valid for 12 months from redemption. Subject to availability.",
        isActive: true,
        createdAt: new Date()
      },
      {
        id: "prize-adventure-gear",
        title: "Adventure Travel Gear Set",
        description: "Complete travel backpack with hiking essentials",
        category: "product",
        destination: null,
        value: 25000, // $250
        tokensRequired: 150,
        image: "🎒",
        provider: "AdventureGear Co",
        availability: 100,
        validUntil: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000), // 6 months
        terms: "Shipping included. International delivery available.",
        isActive: true,
        createdAt: new Date()
      }
    ];

    defaultPrizes.forEach(prize => {
      this.prizes.set(prize.id, prize);
    });
  }

  private initializeSampleUser() {
    const sampleUser: User = {
      id: "sample-user",
      walletAddress: null,
      username: "Explorer",
      email: "explorer@travellotto.com",
      avatar: "🧭",
      tokens: 250,
      level: 3,
      totalMissionsCompleted: 5,
      createdAt: new Date()
    };

    this.users.set(sampleUser.id, sampleUser);
  }

  // Users
  async getUsers(): Promise<User[]> {
    return Array.from(this.users.values());
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByWallet(walletAddress: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.walletAddress === walletAddress);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { 
      ...insertUser,
      walletAddress: insertUser.walletAddress || null,
      email: insertUser.email || null,
      avatar: insertUser.avatar || null,
      id, 
      tokens: 0,
      level: 1,
      totalMissionsCompleted: 0,
      createdAt: new Date()
    };
    this.users.set(id, user);
    return user;
  }

  async updateUserTokens(userId: string, tokens: number): Promise<User> {
    const user = this.users.get(userId);
    if (!user) throw new Error("User not found");
    
    const updatedUser = { ...user, tokens };
    this.users.set(userId, updatedUser);
    return updatedUser;
  }

  // Missions
  async getMissions(): Promise<Mission[]> {
    return Array.from(this.missions.values());
  }

  async getActiveMissions(): Promise<Mission[]> {
    return Array.from(this.missions.values()).filter(mission => mission.isActive);
  }

  async getUserMissions(userId: string): Promise<UserMission[]> {
    return Array.from(this.userMissions.values()).filter(um => um.userId === userId);
  }

  async completeMission(userId: string, missionId: string): Promise<UserMission> {
    const existingMission = Array.from(this.userMissions.values())
      .find(um => um.userId === userId && um.missionId === missionId);
    
    if (existingMission) {
      const completed = { ...existingMission, status: "completed", completedAt: new Date() };
      this.userMissions.set(existingMission.id, completed);
      return completed;
    }

    const id = randomUUID();
    const userMission: UserMission = {
      id,
      userId,
      missionId,
      status: "completed",
      completedAt: new Date(),
      createdAt: new Date()
    };
    this.userMissions.set(id, userMission);
    return userMission;
  }

  // Lotteries
  async getLotteries(): Promise<Lottery[]> {
    return Array.from(this.lotteries.values()).sort((a, b) => 
      new Date(a.drawDate).getTime() - new Date(b.drawDate).getTime()
    );
  }

  async getActiveLotteries(): Promise<Lottery[]> {
    return Array.from(this.lotteries.values())
      .filter(lottery => lottery.status === "active")
      .sort((a, b) => new Date(a.drawDate).getTime() - new Date(b.drawDate).getTime());
  }

  async getLottery(id: string): Promise<Lottery | undefined> {
    return this.lotteries.get(id);
  }

  async purchaseLotteryTicket(insertTicket: InsertLotteryTicket): Promise<LotteryTicket> {
    const lottery = this.lotteries.get(insertTicket.lotteryId);
    if (!lottery) throw new Error("Lottery not found");
    
    const id = randomUUID();
    const ticket: LotteryTicket = {
      ...insertTicket,
      id,
      purchasedAt: new Date()
    };
    
    this.lotteryTickets.set(id, ticket);
    
    // Update sold tickets count
    const updatedLottery = { ...lottery, soldTickets: lottery.soldTickets + 1 };
    this.lotteries.set(lottery.id, updatedLottery);
    
    return ticket;
  }

  async getUserLotteryTickets(userId: string): Promise<LotteryTicket[]> {
    return Array.from(this.lotteryTickets.values()).filter(ticket => ticket.userId === userId);
  }

  async drawLottery(lotteryId: string): Promise<Lottery> {
    const lottery = this.lotteries.get(lotteryId);
    if (!lottery) throw new Error("Lottery not found");
    
    const tickets = Array.from(this.lotteryTickets.values()).filter(t => t.lotteryId === lotteryId);
    if (tickets.length === 0) throw new Error("No tickets sold");
    
    const winningTicket = tickets[Math.floor(Math.random() * tickets.length)];
    const updatedLottery = { ...lottery, status: "drawn", winnerId: winningTicket.userId };
    this.lotteries.set(lotteryId, updatedLottery);
    
    return updatedLottery;
  }

  // NFTs
  async getUserNFTs(userId: string): Promise<NFT[]> {
    return Array.from(this.nfts.values()).filter(nft => nft.ownerId === userId);
  }

  async mintNFT(insertNft: InsertNFT): Promise<NFT> {
    const id = randomUUID();
    const nft: NFT = {
      ...insertNft,
      metadata: insertNft.metadata || null,
      ownerId: insertNft.ownerId || null,
      id,
      tokenId: `TL-${id.slice(0, 8)}`,
      createdAt: new Date()
    };
    this.nfts.set(id, nft);
    return nft;
  }

  // Prizes
  async getPrizes(): Promise<Prize[]> {
    return Array.from(this.prizes.values()).sort((a, b) => a.tokensRequired - b.tokensRequired);
  }

  async getActivePrizes(): Promise<Prize[]> {
    return Array.from(this.prizes.values())
      .filter(prize => prize.isActive && prize.availability > 0)
      .sort((a, b) => a.tokensRequired - b.tokensRequired);
  }

  async redeemPrize(insertRedemption: InsertPrizeRedemption): Promise<PrizeRedemption> {
    const prize = this.prizes.get(insertRedemption.prizeId);
    if (!prize) throw new Error("Prize not found");
    if (prize.availability <= 0) throw new Error("Prize not available");
    
    const id = randomUUID();
    const redemption: PrizeRedemption = {
      ...insertRedemption,
      status: insertRedemption.status || "pending",
      id,
      redemptionCode: `TL-${randomUUID().slice(0, 8).toUpperCase()}`,
      redeemedAt: new Date()
    };
    
    this.prizeRedemptions.set(id, redemption);
    
    // Update prize availability
    const updatedPrize = { ...prize, availability: prize.availability - 1 };
    this.prizes.set(prize.id, updatedPrize);
    
    return redemption;
  }

  async getUserRedemptions(userId: string): Promise<PrizeRedemption[]> {
    return Array.from(this.prizeRedemptions.values())
      .filter(redemption => redemption.userId === userId)
      .sort((a, b) => new Date(b.redeemedAt!).getTime() - new Date(a.redeemedAt!).getTime());
  }
}

export const storage = new MemStorage();
