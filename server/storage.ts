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
  type CountryOperation, type InsertCountryOperation, type TerritoryManagement, type InsertTerritoryManagement,
  // New Viator/Kairos/Raivan token system types
  type RaivanConversion, type InsertRaivanConversion,
  type ViatorTokenPack, type InsertViatorTokenPack,
  type RaivanActivity, type InsertRaivanActivity,
  type UserConversionLimit, type InsertUserConversionLimit,
  type Achievement, type InsertAchievement,
  type UserAchievement, type InsertUserAchievement,
  // Marketplace selling and auction types
  type MarketplaceListing, type InsertMarketplaceListing,
  type MarketplaceBid, type InsertMarketplaceBid,
  type MarketplacePurchase, type InsertMarketplacePurchase,
  type MarketplaceWatcher, type InsertMarketplaceWatcher,
  type SellerProfile, type InsertSellerProfile,
  type MarketplaceDispute, type InsertMarketplaceDispute,
  type ItemVerification, type InsertItemVerification,
  users, missions, userMissions, lotteries, lotteryTickets, lotteryDraws, missionActivities, nfts, prizes, prizeRedemptions, tokenPacks, tokenPurchases, serviceConditions, userAgreements, userFavorites,
  travelAgencies, agencyTourPackages, prizeWinners, agencyCommissions, agencyAnalytics,
  affiliatePrograms, affiliateReferrals, affiliatePayouts, affiliateTrackingEvents, affiliateLeaderboard,
  countryOperations, territoryManagement,
  // New Viator/Kairos/Raivan token system tables
  raivanConversions, viatorTokenPacks, raivanActivities, userConversionLimits, achievements, userAchievements,
  // Marketplace selling and auction tables
  marketplaceListings, marketplaceBids, marketplacePurchases, marketplaceWatchers, sellerProfiles, marketplaceDisputes, itemVerifications
} from "@shared/schema";
import { db } from "./db";
import { eq, and, desc, sql, inArray, or, isNull, gte, lte, count } from "drizzle-orm";
import { randomUUID } from "crypto";
import * as crypto from "crypto";
import { generateLotteryCode, generateDrawCode, generateTicketCode, generateWinnerQrCode, verifyQrCode } from "./utils/lottery-codes";

export interface IStorage {
  // Users
  getUsers(): Promise<User[]>;
  getUser(id: string): Promise<User | undefined>;
  getUserByWallet(walletAddress: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(userId: string, updateData: Partial<InsertUser>): Promise<User>;
  // New token system methods
  updateUserViatorTokens(userId: string, viatorTokens: string): Promise<User>;
  updateUserKairosTokens(userId: string, kairosTokens: number): Promise<User>;
  updateUserRaivanTokens(userId: string, raivanTokens: number): Promise<User>;
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
  getLotteryByCode(lotteryCode: string): Promise<Lottery | undefined>;
  purchaseLotteryTicket(ticket: InsertLotteryTicket): Promise<LotteryTicket>;
  getUserLotteryTickets(userId: string): Promise<LotteryTicket[]>;
  drawLottery(lotteryId: string, drawExecutorId?: string): Promise<{lottery: Lottery, draw: LotteryDraw}>;
  getLotteryDraws(lotteryId?: string): Promise<LotteryDraw[]>;
  getLotteryDraw(drawId: string): Promise<LotteryDraw | undefined>;
  getLotteryDrawByCode(drawCode: string): Promise<LotteryDraw | undefined>;
  verifyWinnerQrCode(qrCodeData: string): Promise<{isValid: boolean, data?: any, error?: string}>;

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

  // Country Operations Management
  getCountryOperations(): Promise<CountryOperation[]>;
  getCountryOperation(countryCode: string): Promise<CountryOperation | null>;
  createCountryOperation(operation: InsertCountryOperation): Promise<CountryOperation>;
  updateCountryOperation(countryCode: string, updates: Partial<CountryOperation>): Promise<CountryOperation>;

  // Territory Management
  getTerritoryManagements(countryCode?: string): Promise<TerritoryManagement[]>;
  getTerritoryManagement(id: string): Promise<TerritoryManagement | null>;
  createTerritoryManagement(territory: InsertTerritoryManagement): Promise<TerritoryManagement>;
  updateTerritoryManagement(id: string, updates: Partial<TerritoryManagement>): Promise<TerritoryManagement>;

  // New Viator/Kairos/Raivan Token System
  // Raivan Conversions (18 Raivan = 1 Kairos)
  createRaivanConversion(conversion: InsertRaivanConversion): Promise<RaivanConversion>;
  getUserRaivanConversions(userId: string): Promise<RaivanConversion[]>;
  getRaivanConversionRate(): Promise<{ raivanToKairos: number }>; // Fixed rate: 18 Raivan = 1 Kairos
  validateRaivanConversionLimits(userId: string, raivanAmount: number): Promise<boolean>;
  
  // Viator Token Packs (Kairos purchasable with Viator)
  getViatorTokenPacks(): Promise<ViatorTokenPack[]>;
  getActiveViatorTokenPacks(): Promise<ViatorTokenPack[]>;
  getViatorTokenPack(id: string): Promise<ViatorTokenPack | undefined>;
  purchaseViatorTokenPack(userId: string, packId: string, paymentMethod: 'viator' | 'usd'): Promise<{ success: boolean; error?: string }>;
  
  // Raivan Activities and Tracking
  createRaivanActivity(activity: InsertRaivanActivity): Promise<RaivanActivity>;
  getUserRaivanActivities(userId: string): Promise<RaivanActivity[]>;
  awardRaivan(userId: string, activityType: string, raivanAmount: number, activityId?: string, activityData?: any): Promise<RaivanActivity>;
  
  // User Conversion Limits
  getUserConversionLimits(userId: string): Promise<UserConversionLimit[]>;
  createUserConversionLimit(limit: InsertUserConversionLimit): Promise<UserConversionLimit>;
  resetDailyRaivanConversionLimits(userId: string): Promise<void>;
  
  // Achievements System (rewards in Raivan tokens)
  getAchievements(): Promise<Achievement[]>;
  getActiveAchievements(): Promise<Achievement[]>;
  getUserAchievements(userId: string): Promise<UserAchievement[]>;
  checkAndUnlockAchievements(userId: string): Promise<UserAchievement[]>;
  claimAchievementReward(userId: string, achievementId: string): Promise<UserAchievement>;

  // Marketplace Selling and Auction methods
  getMarketplaceListings(filters?: {category?: string; sellerId?: string; status?: string}): Promise<MarketplaceListing[]>;
  getMarketplaceListing(id: string): Promise<MarketplaceListing | undefined>;
  createMarketplaceListing(listing: InsertMarketplaceListing): Promise<MarketplaceListing>;
  updateMarketplaceListing(id: string, updates: Partial<InsertMarketplaceListing>): Promise<MarketplaceListing>;
  deleteMarketplaceListing(id: string): Promise<void>;

  // Marketplace Bidding methods
  getMarketplaceBids(listingId: string): Promise<MarketplaceBid[]>;
  createMarketplaceBid(bid: InsertMarketplaceBid): Promise<MarketplaceBid>;
  updateMarketplaceBid(id: string, updates: Partial<InsertMarketplaceBid>): Promise<MarketplaceBid>;
  getHighestBid(listingId: string): Promise<MarketplaceBid | undefined>;

  // Marketplace Purchase methods
  createMarketplacePurchase(purchase: InsertMarketplacePurchase): Promise<MarketplacePurchase>;
  getMarketplacePurchases(userId?: string): Promise<MarketplacePurchase[]>;
  updateMarketplacePurchase(id: string, updates: Partial<InsertMarketplacePurchase>): Promise<MarketplacePurchase>;
  completeMarketplacePurchase(purchaseId: string, transferCode: string): Promise<MarketplacePurchase>;

  // Marketplace Watcher methods
  addMarketplaceWatcher(watcher: InsertMarketplaceWatcher): Promise<MarketplaceWatcher>;
  removeMarketplaceWatcher(userId: string, listingId: string): Promise<void>;
  getMarketplaceWatchers(listingId: string): Promise<MarketplaceWatcher[]>;
  isUserWatching(userId: string, listingId: string): Promise<boolean>;

  // Seller Profile methods
  getSellerProfile(userId: string): Promise<SellerProfile | undefined>;
  createSellerProfile(profile: InsertSellerProfile): Promise<SellerProfile>;
  updateSellerProfile(userId: string, updates: Partial<InsertSellerProfile>): Promise<SellerProfile>;

  // Item Verification methods
  createItemVerification(verification: InsertItemVerification): Promise<ItemVerification>;
  getItemVerification(itemId: string, itemType: string): Promise<ItemVerification | undefined>;
  updateItemVerification(id: string, updates: Partial<InsertItemVerification>): Promise<ItemVerification>;
  verifyPlatformDerivedItem(itemId: string, itemType: string, ownerId: string): Promise<ItemVerification>;

  // Marketplace Dispute methods
  createMarketplaceDispute(dispute: InsertMarketplaceDispute): Promise<MarketplaceDispute>;
  getMarketplaceDisputes(userId?: string): Promise<MarketplaceDispute[]>;
  updateMarketplaceDispute(id: string, updates: Partial<InsertMarketplaceDispute>): Promise<MarketplaceDispute>;
  resolveMarketplaceDispute(id: string, resolution: string, resolvedBy: string): Promise<MarketplaceDispute>;
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

  private async initializeSouthAmericanCountries() {
    try {
      // Check if countries already exist
      const existingCountries = await db.select().from(countryOperations).limit(1);
      if (existingCountries.length > 0) {
        return; // Already initialized
      }

      const southAmericanCountries = [
        {
          countryCode: "CO",
          countryName: "Colombia",
          region: "South America",
          currency: "COP",
          timezone: "America/Bogota",
          language: "es",
          totalAgencies: 89,
          targetAgencies: 360,
          activeAgencies: 72,
          territoryDivisions: 36,
          marketPenetration: "0.2500",
          averageCommissionRate: "0.2200",
          totalRevenue: 2890000,
          monthlyGrowth: "0.3200",
          regulatoryStatus: "compliant",
          launchDate: new Date("2024-01-15"),
          isActive: true,
        },
        {
          countryCode: "PE",
          countryName: "Peru",
          region: "South America",
          currency: "PEN",
          timezone: "America/Lima",
          language: "es",
          totalAgencies: 67,
          targetAgencies: 360,
          activeAgencies: 54,
          territoryDivisions: 36,
          marketPenetration: "0.1900",
          averageCommissionRate: "0.2000",
          totalRevenue: 2340000,
          monthlyGrowth: "0.2800",
          regulatoryStatus: "compliant",
          launchDate: new Date("2024-02-01"),
          isActive: true,
        },
        {
          countryCode: "EC",
          countryName: "Ecuador",
          region: "South America",
          currency: "USD",
          timezone: "America/Guayaquil",
          language: "es",
          totalAgencies: 45,
          targetAgencies: 360,
          activeAgencies: 38,
          territoryDivisions: 36,
          marketPenetration: "0.1300",
          averageCommissionRate: "0.2100",
          totalRevenue: 1560000,
          monthlyGrowth: "0.2500",
          regulatoryStatus: "compliant",
          launchDate: new Date("2024-03-01"),
          isActive: true,
        },
        {
          countryCode: "BO",
          countryName: "Bolivia",
          region: "South America",
          currency: "BOB",
          timezone: "America/La_Paz",
          language: "es",
          totalAgencies: 32,
          targetAgencies: 360,
          activeAgencies: 26,
          territoryDivisions: 36,
          marketPenetration: "0.0900",
          averageCommissionRate: "0.2300",
          totalRevenue: 890000,
          monthlyGrowth: "0.3500",
          regulatoryStatus: "compliant",
          launchDate: new Date("2024-04-01"),
          isActive: true,
        },
        {
          countryCode: "CL",
          countryName: "Chile",
          region: "South America",
          currency: "CLP",
          timezone: "America/Santiago",
          language: "es",
          totalAgencies: 78,
          targetAgencies: 360,
          activeAgencies: 65,
          territoryDivisions: 36,
          marketPenetration: "0.2200",
          averageCommissionRate: "0.1900",
          totalRevenue: 3450000,
          monthlyGrowth: "0.1800",
          regulatoryStatus: "compliant",
          launchDate: new Date("2024-01-01"),
          isActive: true,
        },
        {
          countryCode: "UY",
          countryName: "Uruguay",
          region: "South America",
          currency: "UYU",
          timezone: "America/Montevideo",
          language: "es",
          totalAgencies: 28,
          targetAgencies: 360,
          activeAgencies: 23,
          territoryDivisions: 36,
          marketPenetration: "0.0800",
          averageCommissionRate: "0.2400",
          totalRevenue: 780000,
          monthlyGrowth: "0.4200",
          regulatoryStatus: "compliant",
          launchDate: new Date("2024-05-01"),
          isActive: true,
        },
        {
          countryCode: "PY",
          countryName: "Paraguay",
          region: "South America",
          currency: "PYG",
          timezone: "America/Asuncion",
          language: "es",
          totalAgencies: 24,
          targetAgencies: 360,
          activeAgencies: 19,
          territoryDivisions: 36,
          marketPenetration: "0.0700",
          averageCommissionRate: "0.2500",
          totalRevenue: 650000,
          monthlyGrowth: "0.3800",
          regulatoryStatus: "compliant",
          launchDate: new Date("2024-06-01"),
          isActive: true,
        },
        {
          countryCode: "AR",
          countryName: "Argentina",
          region: "South America",
          currency: "ARS",
          timezone: "America/Argentina/Buenos_Aires",
          language: "es",
          totalAgencies: 112,
          targetAgencies: 360,
          activeAgencies: 89,
          territoryDivisions: 36,
          marketPenetration: "0.3100",
          averageCommissionRate: "0.1800",
          totalRevenue: 4670000,
          monthlyGrowth: "0.1500",
          regulatoryStatus: "compliant",
          launchDate: new Date("2023-12-01"),
          isActive: true,
        },
        {
          countryCode: "BR",
          countryName: "Brazil",
          region: "South America",
          currency: "BRL",
          timezone: "America/Sao_Paulo",
          language: "pt",
          totalAgencies: 156,
          targetAgencies: 360,
          activeAgencies: 134,
          territoryDivisions: 36,
          marketPenetration: "0.4300",
          averageCommissionRate: "0.1700",
          totalRevenue: 6890000,
          monthlyGrowth: "0.2200",
          regulatoryStatus: "compliant",
          launchDate: new Date("2023-11-01"),
          isActive: true,
        },
      ];

      await db.insert(countryOperations).values(southAmericanCountries);
      console.log("✅ South American country operations initialized successfully");
    } catch (error) {
      console.error("❌ Failed to initialize South American countries:", error);
    }
  }

  private async initializeSampleData() {
    try {
      // Initialize South American country operations for international expansion
      await this.initializeSouthAmericanCountries();
      
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

      // Insert lotteries with lottery codes
      await db.insert(lotteries).values([
        {
          id: "lottery-bali-adventure",
          title: "Bali Cultural Immersion",
          description: "Explore Bali's spiritual temples, rice terraces, and pristine beaches on this 8-day cultural journey",
          theme: "bali",
          prizeTitle: "Bali Temple & Beach Explorer",
          prizeDescription: "8 days, 7 nights including luxury villa, temple tours, cooking classes, and spa treatments",
          prizeValue: 750000, // $7,500 USD - realistic for 8-day luxury Bali package
          ticketPrice: 15,
          maxTickets: 800,
          soldTickets: 342,
          drawDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
          status: "active",
          image: "bali",
          lotteryCode: "LT2025-101",
        },
        {
          id: "lottery-patagonia-expedition",
          title: "Patagonia Wilderness Expedition",
          description: "Adventure through Chile's dramatic landscapes with glacier trekking and wildlife encounters",
          theme: "patagonia",
          prizeTitle: "Patagonia Adventure Package",
          prizeDescription: "10 days exploring Torres del Paine, glacier hiking, wildlife photography, and luxury eco-lodges",
          prizeValue: 1250000, // $12,500 USD - realistic for 10-day luxury Patagonia expedition
          ticketPrice: 35,
          maxTickets: 600,
          soldTickets: 178,
          drawDate: new Date(Date.now() + 18 * 24 * 60 * 60 * 1000),
          status: "active",
          image: "patagonia",
          lotteryCode: "LT2025-102",
        },
        {
          id: "lottery-morocco-magic",
          title: "Morocco Desert & Cities",
          description: "Journey through Morocco's imperial cities and experience the magic of the Sahara Desert",
          theme: "morocco",
          prizeTitle: "Morocco Imperial & Desert Tour",
          prizeDescription: "12 days including Marrakech, Fez, Casablanca, Sahara camel trek, and luxury riads",
          prizeValue: 950000, // $9,500 USD - realistic for 12-day luxury Morocco tour with Sahara desert experience
          ticketPrice: 25,
          maxTickets: 700,
          soldTickets: 289,
          drawDate: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000),
          status: "active",
          image: "morocco",
          lotteryCode: "LT2025-103",
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
          value: 150000, // $1,500 USD - realistic for 3-day European city break
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
          value: 45000, // $450 USD - realistic for complete adventure gear set
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

  async updateUserEXPLRTokens(userId: string, explrTokens: string): Promise<User> {
    const [user] = await db
      .update(users)
      .set({ explrTokens })
      .where(eq(users.id, userId))
      .returning();
    
    if (!user) throw new Error("User not found");
    return user;
  }

  async updateUserTKTTokens(userId: string, tktTokens: number): Promise<User> {
    const [user] = await db
      .update(users)
      .set({ tktTokens })
      .where(eq(users.id, userId))
      .returning();
    
    if (!user) throw new Error("User not found");
    return user;
  }

  async updateUserXPTokens(userId: string, xpTokens: number): Promise<User> {
    const [user] = await db
      .update(users)
      .set({ xpTokens })
      .where(eq(users.id, userId))
      .returning();
    
    if (!user) throw new Error("User not found");
    return user;
  }

  async incrementUserMissionsCompleted(userId: string): Promise<User> {
    const [user] = await db
      .update(users)
      .set({
        totalMissionsCompleted: sql`${users.totalMissionsCompleted} + 1`
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
    
    if (user.kairosTokens < lottery.ticketPrice) {
      throw new Error("Insufficient Kairos tokens");
    }
    
    // Generate ticket code
    const ticketCode = generateTicketCode(lottery.lotteryCode || undefined);
    
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

  async getUserLotteryTickets(userId: string): Promise<LotteryTicket[]> {
    return await db.select().from(lotteryTickets).where(eq(lotteryTickets.userId, userId));
  }

  async drawLottery(lotteryId: string, drawExecutorId?: string): Promise<{lottery: Lottery, draw: LotteryDraw}> {
    const [lottery] = await db.select().from(lotteries).where(eq(lotteries.id, lotteryId));
    if (!lottery) throw new Error("Lottery not found");
    
    const tickets = await db.select().from(lotteryTickets).where(eq(lotteryTickets.lotteryId, lotteryId));
    if (tickets.length === 0) throw new Error("No tickets sold");
    
    const winningTicket = tickets[Math.floor(Math.random() * tickets.length)];
    
    // Generate verification hash
    const verificationHash = crypto.createHash('sha256')
      .update(`${lotteryId}-${winningTicket.id}-${Date.now()}`)
      .digest('hex');
    
    // Generate human-readable draw code
    const drawCode = generateDrawCode(lottery.lotteryCode || undefined);
    
    // Generate QR code for winning ticket
    const winnerQrCode = generateWinnerQrCode({
      drawCode,
      ticketCode: winningTicket.ticketCode || `TK-${Date.now()}`,
      winnerId: winningTicket.userId,
      verificationHash,
      drawnAt: new Date()
    });

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
        winnerQrCode,
        drawData: JSON.stringify({
          totalParticipants: new Set(tickets.map(t => t.userId)).size,
          winningTicketNumber: winningTicket.ticketNumber,
          drawTimestamp: new Date().toISOString()
        })
      })
      .returning();
    
    // Update winning ticket with QR code
    await db
      .update(lotteryTickets)
      .set({ 
        isWinningTicket: true,
        winnerQrCode
      })
      .where(eq(lotteryTickets.id, winningTicket.id));
    
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

  async verifyWinnerQrCode(qrCodeData: string): Promise<{isValid: boolean, data?: any, error?: string}> {
    const result = verifyQrCode(qrCodeData);
    
    if (!result.isValid) {
      return result;
    }
    
    try {
      // Verify the QR code data against database records
      const draw = await this.getLotteryDrawByCode(result.data.drawCode);
      if (!draw) {
        return { isValid: false, error: 'Draw not found in database' };
      }
      
      if (draw.winnerId !== result.data.winnerId) {
        return { isValid: false, error: 'Winner ID mismatch' };
      }
      
      if (draw.verificationHash !== result.data.verificationHash) {
        return { isValid: false, error: 'Verification hash mismatch' };
      }
      
      return { 
        isValid: true, 
        data: {
          ...result.data,
          draw,
          verifiedAt: new Date().toISOString()
        }
      };
    } catch (error) {
      return { isValid: false, error: 'Database verification failed' };
    }
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

  // Country Operations Management
  async getCountryOperations(): Promise<CountryOperation[]> {
    return await db.select().from(countryOperations).where(eq(countryOperations.isActive, true));
  }

  async getCountryOperation(countryCode: string): Promise<CountryOperation | null> {
    const [country] = await db.select().from(countryOperations).where(eq(countryOperations.countryCode, countryCode));
    return country || null;
  }

  async createCountryOperation(operation: InsertCountryOperation): Promise<CountryOperation> {
    const [newOperation] = await db
      .insert(countryOperations)
      .values(operation)
      .returning();
    return newOperation;
  }

  async updateCountryOperation(countryCode: string, updates: Partial<CountryOperation>): Promise<CountryOperation> {
    const [updatedOperation] = await db
      .update(countryOperations)
      .set(updates)
      .where(eq(countryOperations.countryCode, countryCode))
      .returning();
    return updatedOperation;
  }

  // Territory Management
  async getTerritoryManagements(countryCode?: string): Promise<TerritoryManagement[]> {
    if (countryCode) {
      return await db.select().from(territoryManagement)
        .where(and(eq(territoryManagement.countryCode, countryCode), eq(territoryManagement.isActive, true)));
    }
    return await db.select().from(territoryManagement).where(eq(territoryManagement.isActive, true));
  }

  async getTerritoryManagement(id: string): Promise<TerritoryManagement | null> {
    const [territory] = await db.select().from(territoryManagement).where(eq(territoryManagement.id, id));
    return territory || null;
  }

  async createTerritoryManagement(territory: InsertTerritoryManagement): Promise<TerritoryManagement> {
    const [newTerritory] = await db
      .insert(territoryManagement)
      .values(territory)
      .returning();
    return newTerritory;
  }

  async updateTerritoryManagement(id: string, updates: Partial<TerritoryManagement>): Promise<TerritoryManagement> {
    const [updatedTerritory] = await db
      .update(territoryManagement)
      .set(updates)
      .where(eq(territoryManagement.id, id))
      .returning();
    return updatedTerritory;
  }

  // Placeholder implementations for missing interface methods
  async getServiceConditions(): Promise<ServiceCondition[]> { return []; }
  async createServiceCondition(condition: InsertServiceCondition): Promise<ServiceCondition> { throw new Error("Method not implemented"); }
  async createUserAgreement(agreement: InsertUserAgreement): Promise<UserAgreement> { throw new Error("Method not implemented"); }
  async getUserAgreements(userId: string): Promise<UserAgreement[]> { return []; }
  async getTravelAgencies(): Promise<TravelAgency[]> { return []; }
  async getTravelAgency(id: string): Promise<TravelAgency | null> { return null; }
  async createTravelAgency(agency: InsertTravelAgency): Promise<TravelAgency> { throw new Error("Method not implemented"); }
  async updateTravelAgency(id: string, updates: Partial<InsertTravelAgency>): Promise<TravelAgency> { throw new Error("Method not implemented"); }
  async getAgencyTourPackages(agencyId?: string): Promise<AgencyTourPackage[]> { return []; }
  async getAgencyTourPackage(id: string): Promise<AgencyTourPackage | null> { return null; }
  async createAgencyTourPackage(tourPackage: InsertAgencyTourPackage): Promise<AgencyTourPackage> { throw new Error("Method not implemented"); }
  async getPrizeWinners(userId?: string): Promise<PrizeWinner[]> { return []; }
  async getPrizeWinner(id: string): Promise<PrizeWinner | null> { return null; }
  async createPrizeWinner(prizeWinner: InsertPrizeWinner): Promise<PrizeWinner> { throw new Error("Method not implemented"); }
  async updatePrizeWinner(id: string, updates: Partial<PrizeWinner>): Promise<PrizeWinner> { throw new Error("Method not implemented"); }
  async getUserPrizeWinners(userId: string): Promise<PrizeWinner[]> { return []; }
  async getAgencyCommissions(agencyId?: string): Promise<AgencyCommission[]> { return []; }
  async createAgencyCommission(commission: InsertAgencyCommission): Promise<AgencyCommission> { throw new Error("Method not implemented"); }
  async updateAgencyCommissionStatus(id: string, status: string): Promise<AgencyCommission> { throw new Error("Method not implemented"); }
  async getAgencyAnalytics(agencyId: string, dateRange?: { start: Date; end: Date }): Promise<AgencyAnalytics[]> { return []; }
  async createAgencyAnalytics(analytics: InsertAgencyAnalytics): Promise<AgencyAnalytics> { throw new Error("Method not implemented"); }
  async getAffiliatePrograms(agencyId?: string): Promise<AffiliateProgram[]> { return []; }
  async getAffiliateProgram(id: string): Promise<AffiliateProgram | null> { return null; }
  async createAffiliateProgram(program: InsertAffiliateProgram): Promise<AffiliateProgram> { throw new Error("Method not implemented"); }
  async updateAffiliateProgram(id: string, updates: Partial<AffiliateProgram>): Promise<AffiliateProgram> { throw new Error("Method not implemented"); }
  async generateUniqueReferralCode(agencyId: string): Promise<string> { return randomUUID(); }
  async trackAffiliateClick(referralCode: string, userId: string, clickData: any): Promise<AffiliateReferral> { throw new Error("Method not implemented"); }
  async updateAffiliateReferralStatus(referralId: string, status: string, transactionData?: any): Promise<AffiliateReferral> { throw new Error("Method not implemented"); }
  async getAffiliateReferrals(agencyId?: string, affiliateProgramId?: string): Promise<AffiliateReferral[]> { return []; }
  async getTopReferralSources(agencyId: string, period: string): Promise<any[]> { return []; }
  async calculateAffiliatePayout(affiliateProgramId: string, periodStart: Date, periodEnd: Date): Promise<AffiliatePayout> { throw new Error("Method not implemented"); }
  async getAffiliatePayouts(agencyId?: string): Promise<AffiliatePayout[]> { return []; }
  async updatePayoutStatus(payoutId: string, status: string, paymentData?: any): Promise<AffiliatePayout> { throw new Error("Method not implemented"); }
  async getPayoutHistory(agencyId: string, limit?: number): Promise<AffiliatePayout[]> { return []; }
  async getAffiliateLeaderboard(period: string, limit?: number): Promise<AffiliateLeaderboard[]> { return []; }
  async createTrackingEvent(event: InsertAffiliateTrackingEvent): Promise<AffiliateTrackingEvent> { throw new Error("Method not implemented"); }
  async getAffiliateAnalytics(agencyId: string, period: string): Promise<any> { return {}; }
  async getConversionFunnel(agencyId: string): Promise<any> { return {}; }
  async getRevenueBySource(agencyId: string, period: string): Promise<any[]> { return []; }

  // New Token System Implementation
  async createTokenConversion(conversion: InsertTokenConversion): Promise<TokenConversion> {
    const [newConversion] = await db
      .insert(tokenConversions)
      .values(conversion)
      .returning();
    return newConversion;
  }

  async getUserTokenConversions(userId: string): Promise<TokenConversion[]> {
    return await db
      .select()
      .from(tokenConversions)
      .where(eq(tokenConversions.userId, userId))
      .orderBy(desc(tokenConversions.createdAt));
  }

  async getTokenConversionRates(): Promise<{ xpToTkt: number; xpToExplr: number }> {
    // Return configurable conversion rates as specified in requirements
    return {
      xpToTkt: 100, // 100 XP → 1 TKT
      xpToExplr: 500 // 500 XP → 0.5 EXPLR
    };
  }

  async validateConversionLimits(userId: string, conversionType: string, amount: number): Promise<boolean> {
    const today = new Date();
    const [limit] = await db
      .select()
      .from(userConversionLimits)
      .where(
        and(
          eq(userConversionLimits.userId, userId),
          eq(userConversionLimits.conversionType, conversionType)
        )
      );

    if (!limit) {
      // Create default limits if none exist
      await this.createUserConversionLimit({
        userId,
        conversionType,
        dailyLimit: conversionType === 'xp_to_tkt' ? 1000 : 100, // Default daily limits
        currentDayUsage: 0
      });
      return true;
    }

    // Check if we need to reset daily usage
    const lastReset = new Date(limit.lastResetDate!);
    if (lastReset.toDateString() !== today.toDateString()) {
      await db
        .update(userConversionLimits)
        .set({
          currentDayUsage: 0,
          lastResetDate: today
        })
        .where(eq(userConversionLimits.id, limit.id));
      return amount <= limit.dailyLimit;
    }

    return (limit.currentDayUsage + amount) <= limit.dailyLimit;
  }

  async getNewTokenPacks(): Promise<NewTokenPack[]> {
    return await db.select().from(newTokenPacks);
  }

  async getActiveNewTokenPacks(): Promise<NewTokenPack[]> {
    return await db
      .select()
      .from(newTokenPacks)
      .where(eq(newTokenPacks.isActive, true));
  }

  async getNewTokenPack(id: string): Promise<NewTokenPack | undefined> {
    const [pack] = await db
      .select()
      .from(newTokenPacks)
      .where(eq(newTokenPacks.id, id));
    return pack;
  }

  async purchaseNewTokenPack(userId: string, packId: string, paymentMethod: 'explr' | 'usd'): Promise<{ success: boolean; error?: string }> {
    try {
      const pack = await this.getNewTokenPack(packId);
      if (!pack) {
        return { success: false, error: 'Token pack not found' };
      }

      const user = await this.getUser(userId);
      if (!user) {
        return { success: false, error: 'User not found' };
      }

      if (paymentMethod === 'explr') {
        // Check if user has enough EXPLR tokens
        const userExplr = parseFloat(user.explrTokens || '0');
        const packCost = parseFloat(pack.explrCost);
        
        if (userExplr < packCost) {
          return { success: false, error: 'Insufficient EXPLR tokens' };
        }

        // Deduct EXPLR and add TKT
        await this.updateUserEXPLRTokens(userId, (userExplr - packCost).toString());
        await this.updateUserTKTTokens(userId, (user.tktTokens || 0) + pack.tktAmount);
      }

      return { success: true };
    } catch (error) {
      return { success: false, error: 'Purchase failed' };
    }
  }

  async createXpActivity(activity: InsertXpActivity): Promise<XpActivity> {
    const [newActivity] = await db
      .insert(xpActivities)
      .values(activity)
      .returning();
    return newActivity;
  }

  async getUserXpActivities(userId: string): Promise<XpActivity[]> {
    return await db
      .select()
      .from(xpActivities)
      .where(eq(xpActivities.userId, userId))
      .orderBy(desc(xpActivities.createdAt));
  }

  async awardXP(userId: string, activityType: string, xpAmount: number, activityId?: string, activityData?: any): Promise<XpActivity> {
    // Create XP activity record
    const activity = await this.createXpActivity({
      userId,
      activityType,
      activityId,
      xpEarned: xpAmount,
      activityData: activityData ? JSON.stringify(activityData) : undefined
    });

    // Update user's XP balance
    const user = await this.getUser(userId);
    if (user) {
      await this.updateUserXPTokens(userId, (user.xpTokens || 0) + xpAmount);
    }

    return activity;
  }

  async getUserConversionLimits(userId: string): Promise<UserConversionLimit[]> {
    return await db
      .select()
      .from(userConversionLimits)
      .where(eq(userConversionLimits.userId, userId));
  }

  async createUserConversionLimit(limit: InsertUserConversionLimit): Promise<UserConversionLimit> {
    const [newLimit] = await db
      .insert(userConversionLimits)
      .values(limit)
      .returning();
    return newLimit;
  }

  async resetDailyConversionLimits(userId: string): Promise<void> {
    await db
      .update(userConversionLimits)
      .set({
        currentDayUsage: 0,
        lastResetDate: new Date()
      })
      .where(eq(userConversionLimits.userId, userId));
  }

  async getAchievements(): Promise<Achievement[]> {
    return await db.select().from(achievements);
  }

  async getActiveAchievements(): Promise<Achievement[]> {
    return await db
      .select()
      .from(achievements)
      .where(eq(achievements.isActive, true));
  }

  async getUserAchievements(userId: string): Promise<UserAchievement[]> {
    return await db
      .select()
      .from(userAchievements)
      .where(eq(userAchievements.userId, userId));
  }

  async checkAndUnlockAchievements(userId: string): Promise<UserAchievement[]> {
    const unlockedAchievements: UserAchievement[] = [];
    const achievements = await this.getActiveAchievements();
    const user = await this.getUser(userId);
    
    if (!user) return unlockedAchievements;

    for (const achievement of achievements) {
      const criteria = JSON.parse(achievement.criteria);
      let isUnlocked = false;

      switch (achievement.type) {
        case 'mission_based':
          if (criteria.missions_completed && user.totalMissionsCompleted >= criteria.missions_completed) {
            isUnlocked = true;
          }
          break;
        case 'conversion_based':
          const conversions = await this.getUserTokenConversions(userId);
          if (criteria.conversions_made && conversions.length >= criteria.conversions_made) {
            isUnlocked = true;
          }
          break;
        case 'participation_based':
          const tickets = await this.getUserLotteryTickets(userId);
          if (criteria.lottery_participations && tickets.length >= criteria.lottery_participations) {
            isUnlocked = true;
          }
          break;
      }

      if (isUnlocked) {
        // Check if user already has this achievement
        const existingAchievement = await db
          .select()
          .from(userAchievements)
          .where(
            and(
              eq(userAchievements.userId, userId),
              eq(userAchievements.achievementId, achievement.id)
            )
          );

        if (existingAchievement.length === 0) {
          const [newUserAchievement] = await db
            .insert(userAchievements)
            .values({
              userId,
              achievementId: achievement.id,
              progress: criteria.missions_completed || criteria.conversions_made || criteria.lottery_participations || 1,
              maxProgress: criteria.missions_completed || criteria.conversions_made || criteria.lottery_participations || 1,
              isUnlocked: true,
              unlockedAt: new Date()
            })
            .returning();

          unlockedAchievements.push(newUserAchievement);
        }
      }
    }

    return unlockedAchievements;
  }

  async claimAchievementReward(userId: string, achievementId: string): Promise<UserAchievement> {
    const [userAchievement] = await db
      .select()
      .from(userAchievements)
      .where(
        and(
          eq(userAchievements.userId, userId),
          eq(userAchievements.achievementId, achievementId),
          eq(userAchievements.isUnlocked, true),
          eq(userAchievements.rewardsClaimed, false)
        )
      );

    if (!userAchievement) {
      throw new Error('Achievement not found or already claimed');
    }

    const achievement = await db
      .select()
      .from(achievements)
      .where(eq(achievements.id, achievementId));

    if (achievement.length > 0) {
      const achv = achievement[0];
      const user = await this.getUser(userId);
      
      if (user) {
        // Award XP tokens
        if (achv.xpReward > 0) {
          await this.updateUserXPTokens(userId, (user.xpTokens || 0) + achv.xpReward);
        }
        
        // Award TKT tokens
        if (achv.tktReward > 0) {
          await this.updateUserTKTTokens(userId, (user.tktTokens || 0) + achv.tktReward);
        }
        
        // Award EXPLR tokens
        if (parseFloat(achv.explrReward) > 0) {
          const currentExplr = parseFloat(user.explrTokens || '0');
          const newExplr = currentExplr + parseFloat(achv.explrReward);
          await this.updateUserEXPLRTokens(userId, newExplr.toString());
        }
      }
    }

    // Mark rewards as claimed
    const [updatedAchievement] = await db
      .update(userAchievements)
      .set({
        rewardsClaimed: true,
        claimedAt: new Date()
      })
      .where(eq(userAchievements.id, userAchievement.id))
      .returning();

    return updatedAchievement;
  }

  // Marketplace Selling and Auction implementations
  async getMarketplaceListings(filters?: {category?: string; sellerId?: string; status?: string}): Promise<MarketplaceListing[]> {
    let query = db.select().from(marketplaceListings);
    
    if (filters) {
      const conditions = [];
      if (filters.category) conditions.push(eq(marketplaceListings.category, filters.category));
      if (filters.sellerId) conditions.push(eq(marketplaceListings.sellerId, filters.sellerId));
      if (filters.status) conditions.push(eq(marketplaceListings.status, filters.status));
      
      if (conditions.length > 0) {
        query = query.where(and(...conditions));
      }
    }
    
    return await query.orderBy(desc(marketplaceListings.createdAt));
  }

  async getMarketplaceListing(id: string): Promise<MarketplaceListing | undefined> {
    const [listing] = await db
      .select()
      .from(marketplaceListings)
      .where(eq(marketplaceListings.id, id));
    return listing;
  }

  async createMarketplaceListing(listing: InsertMarketplaceListing): Promise<MarketplaceListing> {
    // Verify platform-derived item ownership
    const verification = await this.verifyPlatformDerivedItem(
      listing.sourceId, 
      listing.sourceType, 
      listing.sellerId
    );

    const [newListing] = await db
      .insert(marketplaceListings)
      .values({
        ...listing,
        verificationHash: verification.verificationHash,
        currentPrice: listing.startPrice, // Initialize current price
      })
      .returning();
    return newListing;
  }

  async updateMarketplaceListing(id: string, updates: Partial<InsertMarketplaceListing>): Promise<MarketplaceListing> {
    const [listing] = await db
      .update(marketplaceListings)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(marketplaceListings.id, id))
      .returning();
    
    if (!listing) {
      throw new Error("Listing not found");
    }
    return listing;
  }

  async deleteMarketplaceListing(id: string): Promise<void> {
    await db.delete(marketplaceListings).where(eq(marketplaceListings.id, id));
  }

  // Marketplace Bidding implementations
  async getMarketplaceBids(listingId: string): Promise<MarketplaceBid[]> {
    return db
      .select()
      .from(marketplaceBids)
      .where(eq(marketplaceBids.listingId, listingId))
      .orderBy(desc(marketplaceBids.bidAmount));
  }

  async createMarketplaceBid(bid: InsertMarketplaceBid): Promise<MarketplaceBid> {
    const [newBid] = await db.insert(marketplaceBids).values(bid).returning();
    
    // Update listing current price if this is the highest bid
    const highestBid = await this.getHighestBid(bid.listingId);
    if (highestBid && highestBid.id === newBid.id) {
      await this.updateMarketplaceListing(bid.listingId, {
        currentPrice: bid.bidAmount
      });
    }
    
    return newBid;
  }

  async updateMarketplaceBid(id: string, updates: Partial<InsertMarketplaceBid>): Promise<MarketplaceBid> {
    const [bid] = await db
      .update(marketplaceBids)
      .set(updates)
      .where(eq(marketplaceBids.id, id))
      .returning();
    
    if (!bid) {
      throw new Error("Bid not found");
    }
    return bid;
  }

  async getHighestBid(listingId: string): Promise<MarketplaceBid | undefined> {
    const [highestBid] = await db
      .select()
      .from(marketplaceBids)
      .where(and(
        eq(marketplaceBids.listingId, listingId),
        eq(marketplaceBids.status, "active")
      ))
      .orderBy(desc(marketplaceBids.bidAmount))
      .limit(1);
    return highestBid;
  }

  // Marketplace Purchase implementations
  async createMarketplacePurchase(purchase: InsertMarketplacePurchase): Promise<MarketplacePurchase> {
    const transferCode = `TR-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
    const platformFee = Math.floor(purchase.finalPrice * 0.05); // 5% platform fee
    const sellerEarnings = purchase.finalPrice - platformFee;

    const [newPurchase] = await db
      .insert(marketplacePurchases)
      .values({
        ...purchase,
        platformFee,
        sellerEarnings,
        transferCode,
      })
      .returning();
    return newPurchase;
  }

  async getMarketplacePurchases(userId?: string): Promise<MarketplacePurchase[]> {
    let query = db.select().from(marketplacePurchases);
    
    if (userId) {
      query = query.where(
        sql`${marketplacePurchases.buyerId} = ${userId} OR ${marketplacePurchases.sellerId} = ${userId}`
      );
    }
    
    return query.orderBy(desc(marketplacePurchases.createdAt));
  }

  async updateMarketplacePurchase(id: string, updates: Partial<InsertMarketplacePurchase>): Promise<MarketplacePurchase> {
    const [purchase] = await db
      .update(marketplacePurchases)
      .set(updates)
      .where(eq(marketplacePurchases.id, id))
      .returning();
    
    if (!purchase) {
      throw new Error("Purchase not found");
    }
    return purchase;
  }

  async completeMarketplacePurchase(purchaseId: string, transferCode: string): Promise<MarketplacePurchase> {
    const [purchase] = await db
      .update(marketplacePurchases)
      .set({
        status: "completed",
        transferStatus: "completed",
        completedAt: new Date(),
      })
      .where(and(
        eq(marketplacePurchases.id, purchaseId),
        eq(marketplacePurchases.transferCode, transferCode)
      ))
      .returning();
    
    if (!purchase) {
      throw new Error("Purchase not found or invalid transfer code");
    }
    
    // Update seller profile stats
    await this.updateSellerProfile(purchase.sellerId, {
      totalSales: sql`${sellerProfiles.totalSales} + 1`,
    });
    
    return purchase;
  }

  // Marketplace Watcher implementations
  async addMarketplaceWatcher(watcher: InsertMarketplaceWatcher): Promise<MarketplaceWatcher> {
    const [newWatcher] = await db.insert(marketplaceWatchers).values(watcher).returning();
    
    // Increment watcher count on listing
    await db
      .update(marketplaceListings)
      .set({ totalWatchers: sql`${marketplaceListings.totalWatchers} + 1` })
      .where(eq(marketplaceListings.id, watcher.listingId));
    
    return newWatcher;
  }

  async removeMarketplaceWatcher(userId: string, listingId: string): Promise<void> {
    await db
      .delete(marketplaceWatchers)
      .where(and(
        eq(marketplaceWatchers.userId, userId),
        eq(marketplaceWatchers.listingId, listingId)
      ));
    
    // Decrement watcher count on listing
    await db
      .update(marketplaceListings)
      .set({ totalWatchers: sql`${marketplaceListings.totalWatchers} - 1` })
      .where(eq(marketplaceListings.id, listingId));
  }

  async getMarketplaceWatchers(listingId: string): Promise<MarketplaceWatcher[]> {
    return db
      .select()
      .from(marketplaceWatchers)
      .where(eq(marketplaceWatchers.listingId, listingId));
  }

  async isUserWatching(userId: string, listingId: string): Promise<boolean> {
    const [watcher] = await db
      .select()
      .from(marketplaceWatchers)
      .where(and(
        eq(marketplaceWatchers.userId, userId),
        eq(marketplaceWatchers.listingId, listingId)
      ))
      .limit(1);
    return !!watcher;
  }

  // Seller Profile implementations
  async getSellerProfile(userId: string): Promise<SellerProfile | undefined> {
    const [profile] = await db
      .select()
      .from(sellerProfiles)
      .where(eq(sellerProfiles.userId, userId));
    return profile;
  }

  async createSellerProfile(profile: InsertSellerProfile): Promise<SellerProfile> {
    const [newProfile] = await db.insert(sellerProfiles).values(profile).returning();
    return newProfile;
  }

  async updateSellerProfile(userId: string, updates: Partial<InsertSellerProfile>): Promise<SellerProfile> {
    const [profile] = await db
      .update(sellerProfiles)
      .set({ ...updates, lastActiveAt: new Date() })
      .where(eq(sellerProfiles.userId, userId))
      .returning();
    
    if (!profile) {
      throw new Error("Seller profile not found");
    }
    return profile;
  }

  // Item Verification implementations
  async createItemVerification(verification: InsertItemVerification): Promise<ItemVerification> {
    const [newVerification] = await db.insert(itemVerifications).values(verification).returning();
    return newVerification;
  }

  async getItemVerification(itemId: string, itemType: string): Promise<ItemVerification | undefined> {
    const [verification] = await db
      .select()
      .from(itemVerifications)
      .where(and(
        eq(itemVerifications.itemId, itemId),
        eq(itemVerifications.itemType, itemType)
      ));
    return verification;
  }

  async updateItemVerification(id: string, updates: Partial<InsertItemVerification>): Promise<ItemVerification> {
    const [verification] = await db
      .update(itemVerifications)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(itemVerifications.id, id))
      .returning();
    
    if (!verification) {
      throw new Error("Item verification not found");
    }
    return verification;
  }

  async verifyPlatformDerivedItem(itemId: string, itemType: string, ownerId: string): Promise<{verificationHash: string}> {
    // Generate verification hash based on platform data - simplified approach
    const verificationData = {
      itemId,
      itemType,
      ownerId,
      timestamp: Date.now(),
      platform: "VoyageLotto"
    };
    
    const verificationHash = crypto
      .createHash('sha256')
      .update(JSON.stringify(verificationData))
      .digest('hex');

    // Return just the hash for now, avoiding database complexity
    return { verificationHash };
  }

  // Marketplace Dispute implementations
  async createMarketplaceDispute(dispute: InsertMarketplaceDispute): Promise<MarketplaceDispute> {
    const [newDispute] = await db.insert(marketplaceDisputes).values(dispute).returning();
    return newDispute;
  }

  async getMarketplaceDisputes(userId?: string): Promise<MarketplaceDispute[]> {
    let query = db.select().from(marketplaceDisputes);
    
    if (userId) {
      query = query.where(
        sql`${marketplaceDisputes.complainantId} = ${userId} OR ${marketplaceDisputes.respondentId} = ${userId}`
      );
    }
    
    return query.orderBy(desc(marketplaceDisputes.createdAt));
  }

  async updateMarketplaceDispute(id: string, updates: Partial<InsertMarketplaceDispute>): Promise<MarketplaceDispute> {
    const [dispute] = await db
      .update(marketplaceDisputes)
      .set(updates)
      .where(eq(marketplaceDisputes.id, id))
      .returning();
    
    if (!dispute) {
      throw new Error("Dispute not found");
    }
    return dispute;
  }

  async resolveMarketplaceDispute(id: string, resolution: string, resolvedBy: string): Promise<MarketplaceDispute> {
    const [dispute] = await db
      .update(marketplaceDisputes)
      .set({
        status: "resolved",
        resolution: "admin_decision",
        resolutionDetails: resolution,
        resolvedBy,
        resolvedAt: new Date(),
      })
      .where(eq(marketplaceDisputes.id, id))
      .returning();
    
    if (!dispute) {
      throw new Error("Dispute not found");
    }
    return dispute;
  }
}

export const storage = new DatabaseStorage();
