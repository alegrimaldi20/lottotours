import { 
  type User, type InsertUser,
  type Mission, type InsertMission, type UserMission,
  type Lottery, type InsertLottery, type LotteryTicket, type InsertLotteryTicket,
  type LotteryDraw, type InsertLotteryDraw, type MissionActivity, type InsertMissionActivity,
  type NFT, type InsertNFT,
  type Prize, type InsertPrize, type PrizeRedemption, type InsertPrizeRedemption,
  type TokenPack, type InsertTokenPack, type TokenPurchase, type InsertTokenPurchase,
  type ServiceCondition, type InsertServiceCondition, type UserAgreement, type InsertUserAgreement,
  type UserFavorite, type InsertUserFavorite,
  type TravelAgency, type InsertTravelAgency, type AgencyTourPackage, type InsertAgencyTourPackage,
  type PrizeWinner, type InsertPrizeWinner, type AgencyCommission, type InsertAgencyCommission,
  type AgencyAnalytics, type InsertAgencyAnalytics,
  type AffiliateProgram, type InsertAffiliateProgram, type AffiliateReferral, type InsertAffiliateReferral,
  type AffiliatePayout, type InsertAffiliatePayout, type AffiliateTrackingEvent, type InsertAffiliateTrackingEvent,
  type AffiliateLeaderboard, type InsertAffiliateLeaderboard,
  users, missions, userMissions, lotteries, lotteryTickets, lotteryDraws, missionActivities, nfts, prizes, prizeRedemptions, tokenPacks, tokenPurchases, serviceConditions, userAgreements, userFavorites,
  travelAgencies, agencyTourPackages, prizeWinners, agencyCommissions, agencyAnalytics,
  affiliatePrograms, affiliateReferrals, affiliatePayouts, affiliateTrackingEvents, affiliateLeaderboard
} from "@shared/schema";
import { db } from "./db";
import { eq, and, desc, sql } from "drizzle-orm";
import { randomUUID } from "crypto";
import * as crypto from "crypto";

export interface IStorage {
  // Users
  getUsers(): Promise<User[]>;
  getUser(id: string): Promise<User | undefined>;
  getUserByWallet(walletAddress: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(userId: string, updateData: Partial<InsertUser>): Promise<User>;
  updateUserTokens(userId: string, tokens: number): Promise<User>;
  incrementUserMissionsCompleted(userId: string): Promise<User>;

  // User Favorites
  getUserFavorites(userId: string): Promise<UserFavorite[]>;
  addUserFavorite(favorite: InsertUserFavorite): Promise<UserFavorite>;
  removeUserFavorite(userId: string, favoriteId: string): Promise<void>;
  checkUserFavorite(userId: string, itemType: string, itemId: string): Promise<UserFavorite | undefined>;

  // Missions
  getMissions(): Promise<Mission[]>;
  getActiveMissions(): Promise<Mission[]>;
  getUserMissions(userId: string): Promise<UserMission[]>;
  startMission(userId: string, missionId: string): Promise<UserMission>;
  completeMission(userId: string, missionId: string, verificationData?: any): Promise<UserMission>;
  verifyMission(userMissionId: string, approved: boolean, verifiedBy: string): Promise<UserMission>;
  createMissionActivity(activity: InsertMissionActivity): Promise<MissionActivity>;
  getMissionActivities(userMissionId?: string, userId?: string): Promise<MissionActivity[]>;
  getMissionActivity(activityId: string): Promise<MissionActivity | undefined>;

  // Lotteries
  getLotteries(): Promise<Lottery[]>;
  getActiveLotteries(): Promise<Lottery[]>;
  getLottery(id: string): Promise<Lottery | undefined>;
  purchaseLotteryTicket(ticket: InsertLotteryTicket): Promise<LotteryTicket>;
  getUserLotteryTickets(userId: string): Promise<LotteryTicket[]>;
  drawLottery(lotteryId: string, drawExecutorId?: string): Promise<{lottery: Lottery, draw: LotteryDraw}>;
  getLotteryDraws(lotteryId?: string): Promise<LotteryDraw[]>;
  getLotteryDraw(drawId: string): Promise<LotteryDraw | undefined>;

  // NFTs
  getUserNFTs(userId: string): Promise<NFT[]>;
  mintNFT(nft: InsertNFT): Promise<NFT>;

  // Prizes
  getPrizes(): Promise<Prize[]>;
  getActivePrizes(): Promise<Prize[]>;
  redeemPrize(redemption: InsertPrizeRedemption): Promise<PrizeRedemption>;
  getUserRedemptions(userId: string): Promise<PrizeRedemption[]>;

  // Token Packs & Purchases
  getTokenPacks(): Promise<TokenPack[]>;
  getActiveTokenPacks(): Promise<TokenPack[]>;
  createTokenPurchase(purchase: InsertTokenPurchase): Promise<TokenPurchase>;
  updateTokenPurchaseStatus(paymentIntentId: string, status: string): Promise<TokenPurchase>;
  getUserTokenPurchases(userId: string): Promise<TokenPurchase[]>;
  updateUserStripeCustomerId(userId: string, stripeCustomerId: string): Promise<User>;

  // Service Conditions & User Agreements
  getServiceConditions(): Promise<ServiceCondition[]>;
  createServiceCondition(condition: InsertServiceCondition): Promise<ServiceCondition>;
  createUserAgreement(agreement: InsertUserAgreement): Promise<UserAgreement>;
  getUserAgreements(userId: string): Promise<UserAgreement[]>;
  
  // Travel Agency Partnership Module
  getTravelAgencies(): Promise<TravelAgency[]>;
  getTravelAgency(id: string): Promise<TravelAgency | null>;
  createTravelAgency(agency: InsertTravelAgency): Promise<TravelAgency>;  
  updateTravelAgency(id: string, updates: Partial<InsertTravelAgency>): Promise<TravelAgency>;

  getAgencyTourPackages(agencyId?: string): Promise<AgencyTourPackage[]>;
  getAgencyTourPackage(id: string): Promise<AgencyTourPackage | null>;
  createAgencyTourPackage(tourPackage: InsertAgencyTourPackage): Promise<AgencyTourPackage>;

  // Prize Winners Management
  getPrizeWinners(userId?: string): Promise<PrizeWinner[]>;
  getPrizeWinner(id: string): Promise<PrizeWinner | null>;
  createPrizeWinner(prizeWinner: InsertPrizeWinner): Promise<PrizeWinner>;
  updatePrizeWinner(id: string, updates: Partial<PrizeWinner>): Promise<PrizeWinner>;
  getUserPrizeWinners(userId: string): Promise<PrizeWinner[]>;

  // Agency Commission Management
  getAgencyCommissions(agencyId?: string): Promise<AgencyCommission[]>;
  createAgencyCommission(commission: InsertAgencyCommission): Promise<AgencyCommission>;
  updateAgencyCommissionStatus(id: string, status: string): Promise<AgencyCommission>;

  // Agency Analytics
  getAgencyAnalytics(agencyId: string, dateRange?: { start: Date; end: Date }): Promise<AgencyAnalytics[]>;
  createAgencyAnalytics(analytics: InsertAgencyAnalytics): Promise<AgencyAnalytics>;

  // Exclusive Affiliate Program Module
  getAffiliatePrograms(agencyId?: string): Promise<AffiliateProgram[]>;
  getAffiliateProgram(id: string): Promise<AffiliateProgram | null>;
  createAffiliateProgram(program: InsertAffiliateProgram): Promise<AffiliateProgram>;
  updateAffiliateProgram(id: string, updates: Partial<AffiliateProgram>): Promise<AffiliateProgram>;
  generateUniqueReferralCode(agencyId: string): Promise<string>;
  
  // Affiliate Referral Tracking
  trackAffiliateClick(referralCode: string, userId: string, clickData: any): Promise<AffiliateReferral>;
  updateAffiliateReferralStatus(referralId: string, status: string, transactionData?: any): Promise<AffiliateReferral>;
  getAffiliateReferrals(agencyId?: string, affiliateProgramId?: string): Promise<AffiliateReferral[]>;
  getTopReferralSources(agencyId: string, period: string): Promise<any[]>;
  
  // Affiliate Payouts & Performance
  calculateAffiliatePayout(affiliateProgramId: string, periodStart: Date, periodEnd: Date): Promise<AffiliatePayout>;
  getAffiliatePayouts(agencyId?: string): Promise<AffiliatePayout[]>;
  updatePayoutStatus(payoutId: string, status: string, paymentData?: any): Promise<AffiliatePayout>;
  getPayoutHistory(agencyId: string, limit?: number): Promise<AffiliatePayout[]>;
  
  // Affiliate Analytics & Leaderboard
  getAffiliateLeaderboard(period: string, limit?: number): Promise<AffiliateLeaderboard[]>;
  createTrackingEvent(event: InsertAffiliateTrackingEvent): Promise<AffiliateTrackingEvent>;
  getAffiliateAnalytics(agencyId: string, period: string): Promise<any>;
  getConversionFunnel(agencyId: string): Promise<any>;
  getRevenueBySource(agencyId: string, period: string): Promise<any[]>;
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
      // Insert missions with verification methods
      await db.insert(missions).values([
        {
          id: "mission-paris-culture",
          title: "Discover Parisian Culture",
          description: "Visit a local museum and share your experience with traditional French culture",
          type: "cultural",
          reward: 150,
          difficulty: "easy",
          location: "Paris, France",
          icon: "🎨",
          verificationMethod: "auto",
          verificationCriteria: null,
          completionTimeLimit: null,
          requiredProofType: "none",
          autoCompleteDelay: 5,
          isActive: true,
        },
        {
          id: "mission-beach-adventure",
          title: "Beach Adventure Challenge",
          description: "Document your tropical beach exploration with photos and local insights",
          type: "travel",
          reward: 200,
          difficulty: "medium",
          location: "Tropical beaches",
          icon: "🏖️",
          verificationMethod: "proof_required",
          verificationCriteria: JSON.stringify({
            requiredElements: ["photo", "location", "description"],
            minDescriptionLength: 50
          }),
          completionTimeLimit: null,
          requiredProofType: "photo",
          autoCompleteDelay: 0,
          isActive: true,
        },
        {
          id: "mission-mountain-hike",
          title: "Mountain Summit Quest",
          description: "Complete a challenging mountain hike and capture the summit view",
          type: "sports",
          reward: 300,
          difficulty: "hard",
          location: "Mountain regions",
          icon: "⛰️",
          verificationMethod: "time_based",
          verificationCriteria: JSON.stringify({
            minimumDuration: 120,
            requiredElevationGain: 500
          }),
          completionTimeLimit: 180,
          requiredProofType: "photo",
          autoCompleteDelay: 0,
          isActive: true,
        },
        {
          id: "mission-local-cuisine",
          title: "Local Cuisine Explorer",
          description: "Try 3 authentic local dishes and write a detailed review of each experience",
          type: "cultural",
          reward: 180,
          difficulty: "easy",
          location: "Any destination",
          icon: "🍽️",
          verificationMethod: "manual",
          verificationCriteria: JSON.stringify({
            requiredDishes: 3,
            minReviewLength: 100,
            requiresPhotos: true
          }),
          completionTimeLimit: null,
          requiredProofType: "text",
          autoCompleteDelay: 0,
          isActive: true,
        },
      ]);

      // Insert lotteries (using existing schema)
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
        },
        {
          id: "lottery-tokyo-adventure",
          title: "Tokyo Cultural Adventure",
          description: "Experience Japan's ancient traditions and modern wonders in Tokyo and Mount Fuji",
          theme: "tokyo",
          prizeTitle: "Tokyo & Mount Fuji Explorer",
          prizeDescription: "5 days, 4 nights cultural tour including Mount Fuji, temples, and authentic experiences",
          prizeValue: 400000,
          ticketPrice: 75,
          maxTickets: 800,
          soldTickets: 156,
          drawDate: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000),
          status: "active",
          image: "tokyo",
        },
        {
          id: "lottery-swiss-alps",
          title: "Swiss Alps Winter Adventure",
          description: "Luxury ski resort experience in the breathtaking Swiss Alps with mountain views",
          theme: "europe",
          prizeTitle: "Swiss Alps Luxury Resort",
          prizeDescription: "6 days, 5 nights at a 5-star alpine resort with ski passes and spa access",
          prizeValue: 600000,
          ticketPrice: 90,
          maxTickets: 600,
          soldTickets: 203,
          drawDate: new Date(Date.now() + 28 * 24 * 60 * 60 * 1000),
          status: "active",
          image: "europe",
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
        tokens: sql`${users.tokens} + ${tokenChange}`
      })
      .where(eq(users.id, userId))
      .returning();
    
    if (!user) throw new Error("User not found");
    return user;
  }

  // User Favorites
  async getUserFavorites(userId: string): Promise<UserFavorite[]> {
    return await db
      .select()
      .from(userFavorites)
      .where(eq(userFavorites.userId, userId))
      .orderBy(desc(userFavorites.createdAt));
  }

  async addUserFavorite(favorite: InsertUserFavorite): Promise<UserFavorite> {
    // Check if favorite already exists
    const existing = await this.checkUserFavorite(
      favorite.userId,
      favorite.itemType,
      favorite.itemId
    );
    
    if (existing) {
      return existing;
    }

    const [newFavorite] = await db
      .insert(userFavorites)
      .values(favorite)
      .returning();
    
    return newFavorite;
  }

  async removeUserFavorite(userId: string, favoriteId: string): Promise<void> {
    await db
      .delete(userFavorites)
      .where(
        and(
          eq(userFavorites.id, favoriteId),
          eq(userFavorites.userId, userId)
        )
      );
  }

  async checkUserFavorite(userId: string, itemType: string, itemId: string): Promise<UserFavorite | undefined> {
    const [favorite] = await db
      .select()
      .from(userFavorites)
      .where(
        and(
          eq(userFavorites.userId, userId),
          eq(userFavorites.itemType, itemType),
          eq(userFavorites.itemId, itemId)
        )
      );
    
    return favorite;
  }

  // Missions
  async getMissions(): Promise<Mission[]> {
    return await db.select().from(missions);
  }

  async getActiveMissions(): Promise<Mission[]> {
    return await db.select().from(missions).where(eq(missions.isActive, true));
  }

  async getUserMissions(userId: string): Promise<(UserMission & { mission: Mission })[]> {
    return await db
      .select({
        id: userMissions.id,
        userId: userMissions.userId,
        missionId: userMissions.missionId,
        status: userMissions.status,
        startedAt: userMissions.startedAt,
        completedAt: userMissions.completedAt,
        verificationData: userMissions.verificationData,
        tokensAwarded: userMissions.tokensAwarded,
        verificationStatus: userMissions.verificationStatus,
        verifiedBy: userMissions.verifiedBy,
        createdAt: userMissions.createdAt,
        mission: {
          id: missions.id,
          title: missions.title,
          description: missions.description,
          type: missions.type,
          reward: missions.reward,
          difficulty: missions.difficulty,
          location: missions.location,
          icon: missions.icon,
          verificationMethod: missions.verificationMethod,
          verificationCriteria: missions.verificationCriteria,
          completionTimeLimit: missions.completionTimeLimit,
          requiredProofType: missions.requiredProofType,
          autoCompleteDelay: missions.autoCompleteDelay,
          isActive: missions.isActive,
          createdAt: missions.createdAt,
        }
      })
      .from(userMissions)
      .innerJoin(missions, eq(userMissions.missionId, missions.id))
      .where(eq(userMissions.userId, userId));
  }

  async completeMission(userId: string, missionId: string, verificationData?: any): Promise<UserMission> {
    // Get mission details for verification requirements
    const [mission] = await db
      .select()
      .from(missions)
      .where(eq(missions.id, missionId));
    
    if (!mission) {
      throw new Error("Mission not found");
    }

    // Check if mission already exists
    const [existingMission] = await db
      .select()
      .from(userMissions)
      .where(and(eq(userMissions.userId, userId), eq(userMissions.missionId, missionId)));
    
    const now = new Date();
    let status = "completed";
    let verificationStatus = "approved";
    let verifiedBy = "system";
    let tokensAwarded = mission.reward;

    // Create mission activity record for completion attempt (only if mission activity table exists)
    try {
      await this.createMissionActivity({
        userMissionId: existingMission?.id || '',
        userId,
        missionId,
        activityType: 'completion_attempt',
        activityData: JSON.stringify({
          verificationMethod: mission.verificationMethod,
          timestamp: now.toISOString()
        }),
        proofData: verificationData ? JSON.stringify(verificationData) : null,
        isSignificant: true
      });
    } catch (error) {
      console.log("Mission activity tracking not yet available:", error);
    }

    // Apply verification method logic
    switch (mission.verificationMethod) {
      case "auto":
        // Immediate completion with auto-delay if specified
        if (mission.autoCompleteDelay && mission.autoCompleteDelay > 0) {
          status = "in_progress";
          verificationStatus = "pending";
          // Note: In a real system, you'd set up a delayed job here
        }
        break;
      
      case "manual":
        status = "pending_verification";
        verificationStatus = "pending";
        verifiedBy = "admin";
        tokensAwarded = 0; // No tokens until manually verified
        break;
      
      case "proof_required":
        if (!verificationData || !verificationData.proofData) {
          throw new Error("Proof required for this mission");
        }
        status = "pending_verification";
        verificationStatus = "pending";
        verifiedBy = "system";
        tokensAwarded = 0; // No tokens until proof is verified
        break;
      
      case "time_based":
        if (!existingMission || !existingMission.startedAt) {
          throw new Error("Mission must be started first for time-based verification");
        }
        const timeElapsed = now.getTime() - existingMission.startedAt.getTime();
        const requiredTime = (mission.completionTimeLimit || 60) * 60 * 1000; // Convert minutes to milliseconds
        
        if (timeElapsed < requiredTime) {
          throw new Error(`Mission requires ${mission.completionTimeLimit} minutes to complete`);
        }
        break;
    }
    
    if (existingMission) {
      // Update existing mission
      const [updated] = await db
        .update(userMissions)
        .set({ 
          status,
          completedAt: status === "completed" ? now : null,
          verificationData: verificationData ? JSON.stringify(verificationData) : null,
          tokensAwarded,
          verificationStatus,
          verifiedBy
        })
        .where(eq(userMissions.id, existingMission.id))
        .returning();

      // Award tokens if immediately approved
      if (tokensAwarded > 0) {
        await this.updateUserTokens(userId, tokensAwarded);
        await this.incrementUserMissionsCompleted(userId);
      }

      return updated;
    }

    // Create new mission record
    const [userMission] = await db
      .insert(userMissions)
      .values({
        userId,
        missionId,
        status,
        startedAt: status === "in_progress" ? now : null,
        completedAt: status === "completed" ? now : null,
        verificationData: verificationData ? JSON.stringify(verificationData) : null,
        tokensAwarded,
        verificationStatus,
        verifiedBy
      })
      .returning();

    // Award tokens if immediately approved
    if (tokensAwarded > 0) {
      await this.updateUserTokens(userId, tokensAwarded);
      await this.incrementUserMissionsCompleted(userId);
    }
    
    return userMission;
  }

  async startMission(userId: string, missionId: string): Promise<UserMission> {
    // Check if mission already exists
    const [existingMission] = await db
      .select()
      .from(userMissions)
      .where(and(eq(userMissions.userId, userId), eq(userMissions.missionId, missionId)));
    
    if (existingMission) {
      if (existingMission.status === "active") {
        // Update to in_progress
        const [updated] = await db
          .update(userMissions)
          .set({ 
            status: "in_progress",
            startedAt: new Date()
          })
          .where(eq(userMissions.id, existingMission.id))
          .returning();
        return updated;
      }
      return existingMission;
    }
    
    // Create new mission record
    const [userMission] = await db
      .insert(userMissions)
      .values({
        userId,
        missionId,
        status: "in_progress",
        startedAt: new Date(),
        verificationStatus: "none"
      })
      .returning();
    
    return userMission;
  }

  async verifyMission(userMissionId: string, approved: boolean, verifiedBy: string): Promise<UserMission> {
    // Get the user mission
    const [userMission] = await db
      .select()
      .from(userMissions)
      .where(eq(userMissions.id, userMissionId));
    
    if (!userMission) {
      throw new Error("User mission not found");
    }

    // Get the mission to award tokens
    const [mission] = await db
      .select()
      .from(missions)
      .where(eq(missions.id, userMission.missionId));
    
    if (!mission) {
      throw new Error("Mission not found");
    }

    const now = new Date();
    let status = approved ? "completed" : "failed";
    let tokensAwarded = approved ? mission.reward : 0;
    
    const [updated] = await db
      .update(userMissions)
      .set({ 
        status,
        completedAt: approved ? now : null,
        tokensAwarded,
        verificationStatus: approved ? "approved" : "rejected",
        verifiedBy
      })
      .where(eq(userMissions.id, userMissionId))
      .returning();

    // Award tokens if approved
    if (approved && tokensAwarded > 0) {
      await this.updateUserTokens(userMission.userId, tokensAwarded);
      await this.incrementUserMissionsCompleted(userMission.userId);
    }

    // Create verification activity record (only if mission activity table exists)
    try {
      await this.createMissionActivity({
        userMissionId: userMissionId,
        userId: userMission.userId,
        missionId: userMission.missionId,
        activityType: approved ? 'verified' : 'failed',
        activityData: JSON.stringify({
          verificationResult: approved ? 'approved' : 'rejected',
          verifiedBy,
          tokensAwarded,
          timestamp: now.toISOString()
        }),
        verificationResult: approved ? 'approved' : 'rejected',
        tokenChange: tokensAwarded,
        isSignificant: true
      });
    } catch (error) {
      console.log("Mission activity tracking not yet available:", error);
    }

    return updated;
  }

  async createMissionActivity(activity: InsertMissionActivity): Promise<MissionActivity> {
    const activityId = crypto.randomUUID();
    const activityHash = crypto.createHash('sha256')
      .update(`${activity.userId}-${activity.missionId}-${activity.activityType}-${Date.now()}`)
      .digest('hex');

    const [created] = await db
      .insert(missionActivities)
      .values({
        ...activity,
        activityId,
        activityHash
      })
      .returning();
    
    return created;
  }

  async getMissionActivities(userMissionId?: string, userId?: string): Promise<MissionActivity[]> {
    if (userMissionId && userId) {
      return await db.select().from(missionActivities).where(and(
        eq(missionActivities.userMissionId, userMissionId),
        eq(missionActivities.userId, userId)
      ));
    } else if (userMissionId) {
      return await db.select().from(missionActivities).where(eq(missionActivities.userMissionId, userMissionId));
    } else if (userId) {
      return await db.select().from(missionActivities).where(eq(missionActivities.userId, userId));
    }
    
    return await db.select().from(missionActivities);
  }

  async getMissionActivity(activityId: string): Promise<MissionActivity | undefined> {
    const [activity] = await db.select().from(missionActivities).where(eq(missionActivities.activityId, activityId));
    return activity;
  }

  async incrementUserMissionsCompleted(userId: string): Promise<User> {
    const [updated] = await db
      .update(users)
      .set({ 
        totalMissionsCompleted: sql`${users.totalMissionsCompleted} + 1`
      })
      .where(eq(users.id, userId))
      .returning();
    return updated;
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
    
    // Check user's tokens and deduct the cost
    const [user] = await db.select().from(users).where(eq(users.id, insertTicket.userId));
    if (!user) throw new Error("User not found");
    
    if (user.tokens < lottery.ticketPrice) {
      throw new Error("Insufficient tokens");
    }
    
    // Deduct tokens from user
    await db
      .update(users)
      .set({ tokens: user.tokens - lottery.ticketPrice })
      .where(eq(users.id, insertTicket.userId));
    
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

  async drawLottery(lotteryId: string, drawExecutorId?: string): Promise<{lottery: Lottery, draw: LotteryDraw}> {
    const [lottery] = await db.select().from(lotteries).where(eq(lotteries.id, lotteryId));
    if (!lottery) throw new Error("Lottery not found");
    
    const tickets = await db.select().from(lotteryTickets).where(eq(lotteryTickets.lotteryId, lotteryId));
    if (tickets.length === 0) throw new Error("No tickets sold");
    
    const winningTicket = tickets[Math.floor(Math.random() * tickets.length)];
    
    // Generate unique draw ID and create draw record
    const drawId = crypto.randomUUID();
    const verificationHash = crypto.createHash('sha256')
      .update(`${lotteryId}-${winningTicket.id}-${Date.now()}`)
      .digest('hex');
    
    const [draw] = await db
      .insert(lotteryDraws)
      .values({
        drawId,
        lotteryId,
        winningTicketId: winningTicket.id,
        winnerId: winningTicket.userId,
        winningNumbers: winningTicket.selectedNumbers,
        totalTicketsSold: tickets.length,
        drawExecutorId: drawExecutorId || 'system',
        verificationHash,
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
    const [draw] = await db.select().from(lotteryDraws).where(eq(lotteryDraws.drawId, drawId));
    return draw;
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

  // Token Pack & Purchase Methods
  async getTokenPacks(): Promise<TokenPack[]> {
    return await db.select().from(tokenPacks);
  }

  async getActiveTokenPacks(): Promise<TokenPack[]> {
    return await db.select().from(tokenPacks).where(eq(tokenPacks.isActive, true));
  }

  async createTokenPurchase(purchase: InsertTokenPurchase): Promise<TokenPurchase> {
    const [newPurchase] = await db
      .insert(tokenPurchases)
      .values(purchase)
      .returning();
    return newPurchase;
  }

  async updateTokenPurchaseStatus(paymentIntentId: string, status: string): Promise<TokenPurchase> {
    const [updatedPurchase] = await db
      .update(tokenPurchases)
      .set({ status })
      .where(eq(tokenPurchases.stripePaymentIntentId, paymentIntentId))
      .returning();
    return updatedPurchase;
  }

  async getUserTokenPurchases(userId: string): Promise<TokenPurchase[]> {
    return await db.select().from(tokenPurchases).where(eq(tokenPurchases.userId, userId));
  }

  async updateUserStripeCustomerId(userId: string, stripeCustomerId: string): Promise<User> {
    const [updatedUser] = await db
      .update(users)
      .set({ stripeCustomerId })
      .where(eq(users.id, userId))
      .returning();
    return updatedUser;
  }
}

export const storage = new DatabaseStorage();
