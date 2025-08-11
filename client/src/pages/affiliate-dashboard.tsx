import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "wouter";
import PartnerTypeSelector from "@/components/partner-type-selector";
import { 
  Link as LinkIcon, Users, TrendingUp, DollarSign, Award, Copy,
  Eye, MousePointer, UserPlus, ShoppingCart, Trophy, Calendar,
  BarChart3, PieChart, Target, Zap, Crown, Star, Gift, Download,
  Share2, Mail, MessageSquare, Globe, Smartphone, Monitor,
  TrendingDown, RefreshCw, Filter, ArrowUpRight, ArrowDownRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import CampaignCreator from "@/components/campaign-creator";

// Sample affiliate program data
const sampleAffiliateProgram = {
  id: "affiliate-1",
  agencyId: "agency-1",
  programName: "European Adventures Affiliate Program",
  uniqueCode: "EURO-ADV-2025",
  affiliateLink: "https://travellotto.app/join?ref=EURO-ADV-2025",
  baseCommissionRate: 0.15, // 15%
  commissionTiers: {
    bronze: { threshold: 0, rate: 0.15 },
    silver: { threshold: 10, rate: 0.18 },
    gold: { threshold: 25, rate: 0.22 },
    platinum: { threshold: 50, rate: 0.28 }
  },
  bonusThresholds: {
    firstConversion: 5000, // $50 USD bonus
    monthlyTarget: { referrals: 10, bonus: 10000 } // $100 USD bonus
  },
  minimumPayout: 5000, // $50 USD
  payoutSchedule: "monthly",
  status: "active"
};

const sampleReferralStats = {
  totalClicks: 1247,
  totalRegistrations: 89,  
  totalConversions: 23,
  totalRevenue: 345600, // $3,456 USD in cents
  commissionEarned: 51840, // $518.40 USD in cents
  conversionRate: 0.0184, // 1.84%
  averageOrderValue: 15026, // $150.26 USD in cents
  currentTier: "silver",
  nextTierProgress: 0.6 // 60% to gold
};

const sampleRecentReferrals = [
  {
    id: "ref-1",
    userId: "user-123",
    username: "traveler_alex",
    registeredAt: new Date("2025-01-20T14:30:00Z"),
    firstTransactionAt: new Date("2025-01-21T10:15:00Z"),
    firstTransactionAmount: 18900, // $189 USD
    totalSpent: 18900,
    status: "converted",
    source: "social_media",
    campaign: "summer_adventure"
  },
  {
    id: "ref-2", 
    userId: "user-124",
    username: "wanderlust_maria",
    registeredAt: new Date("2025-01-19T16:45:00Z"),
    status: "registered",
    source: "email",
    campaign: "newsletter_january"
  },
  {
    id: "ref-3",
    userId: "user-125", 
    username: "adventure_seeker",
    registeredAt: new Date("2025-01-18T09:20:00Z"),
    firstTransactionAt: new Date("2025-01-19T11:30:00Z"),
    firstTransactionAmount: 12500, // $125 USD
    totalSpent: 24800, // $248 USD (repeat customer)
    status: "converted",
    source: "banner",
    campaign: "winter_promo"
  }
];

const sampleLeaderboard = [
  {
    rank: 1,
    agencyName: "European Adventures",
    totalReferrals: 156,
    convertedReferrals: 42,
    totalRevenue: 127800, // $1,278 USD
    commissionEarned: 25560, // $255.60 USD
    conversionRate: 0.269,
    badge: "platinum"
  },
  {
    rank: 2,
    agencyName: "Nordic Expeditions", 
    totalReferrals: 134,
    convertedReferrals: 31,
    totalRevenue: 98500, // $985 USD
    commissionEarned: 19700, // $197 USD
    conversionRate: 0.231,
    badge: "gold"
  },
  {
    rank: 3,
    agencyName: "Mediterranean Tours",
    totalReferrals: 89,
    convertedReferrals: 23,
    totalRevenue: 76300, // $763 USD
    commissionEarned: 13734, // $137.34 USD
    conversionRate: 0.258,
    badge: "silver"
  }
];

const sampleTrafficSources = [
  { source: "Social Media", clicks: 487, conversions: 12, rate: 2.46, revenue: 34200 },
  { source: "Email Campaigns", clicks: 312, conversions: 8, rate: 2.56, revenue: 22500 },
  { source: "Banner Ads", clicks: 298, conversions: 3, rate: 1.01, revenue: 8900 },
  { source: "Direct Links", clicks: 150, conversions: 5, rate: 3.33, revenue: 15600 }
];

const sampleCampaignPerformance = [
  { name: "Summer Adventure", clicks: 245, conversions: 8, revenue: 18700, roi: 234 },
  { name: "Winter Promo", clicks: 189, conversions: 6, revenue: 14200, roi: 198 },
  { name: "Newsletter January", clicks: 167, conversions: 4, revenue: 9800, roi: 156 },
  { name: "Holiday Special", clicks: 134, conversions: 5, revenue: 12300, roi: 211 }
];

const tierColors = {
  bronze: "bg-amber-100 text-amber-800",
  silver: "bg-slate-100 text-slate-800", 
  gold: "bg-yellow-100 text-yellow-800",
  platinum: "bg-purple-100 text-purple-800"
};

const tierIcons = {
  bronze: <Award className="h-4 w-4" />,
  silver: <Star className="h-4 w-4" />,
  gold: <Crown className="h-4 w-4" />,
  platinum: <Trophy className="h-4 w-4" />
};

export default function AffiliateDashboard() {
  const [copiedLink, setCopiedLink] = useState(false);
  const [showCampaignCreator, setShowCampaignCreator] = useState(false);
  const [selectedPartnerType, setSelectedPartnerType] = useState<'travel_agency' | 'individual_user'>('travel_agency');
  const [showPartnerSelector, setShowPartnerSelector] = useState(false);
  const { toast } = useToast();

  // Mock queries - replace with real API calls
  const { data: affiliateProgram = sampleAffiliateProgram } = useQuery<any>({
    queryKey: ['/api/affiliate-programs/agency-1'],
    enabled: true
  });

  const { data: referralStats = sampleReferralStats } = useQuery<any>({
    queryKey: ['/api/affiliate/agency-1/stats'],
    enabled: true
  });

  const { data: recentReferrals = sampleRecentReferrals } = useQuery<any>({
    queryKey: ['/api/affiliate/agency-1/referrals'],
    enabled: true
  });

  const { data: leaderboard = sampleLeaderboard } = useQuery<any>({
    queryKey: ['/api/affiliate/leaderboard/monthly'],
    enabled: true
  });

  const { data: trafficSources = sampleTrafficSources } = useQuery<any>({
    queryKey: ['/api/affiliate/agency-1/traffic-sources'],
    enabled: true
  });

  const { data: campaignPerformance = sampleCampaignPerformance } = useQuery<any>({
    queryKey: ['/api/affiliate/agency-1/campaigns'],
    enabled: true
  });

  const copyAffiliateLink = async () => {
    try {
      await navigator.clipboard.writeText(affiliateProgram.affiliateLink);
      setCopiedLink(true);
      toast({
        title: "Link Copied!",
        description: "Your affiliate link has been copied to clipboard.",
      });
      setTimeout(() => setCopiedLink(false), 3000);
    } catch (err) {
      toast({
        title: "Copy Failed",
        description: "Unable to copy link. Please copy manually.",
        variant: "destructive",
      });
    }
  };

  const formatCurrency = (cents: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(cents / 100);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(date));
  };

  const getTierInfo = (tier: string) => {
    const tierData = affiliateProgram.commissionTiers[tier as keyof typeof affiliateProgram.commissionTiers];
    return {
      name: tier.charAt(0).toUpperCase() + tier.slice(1),
      rate: (tierData.rate * 100).toFixed(1) + '%',
      color: tierColors[tier as keyof typeof tierColors],
      icon: tierIcons[tier as keyof typeof tierIcons]
    };
  };

  const currentTierInfo = getTierInfo(referralStats.currentTier);

  const handleCreateCampaign = (campaignData: any) => {
    console.log("Creating campaign:", campaignData);
    setShowCampaignCreator(false);
    toast({
      title: "Campaign Created!",
      description: `Campaign "${campaignData.name}" has been created successfully.`,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <div className="bg-white/90 backdrop-blur-md border-b border-blue-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/dashboard" className="text-slate-600 hover:text-blue-600 transition-colors mr-4">
                ← Dashboard
              </Link>
              <div className="flex items-center gap-3">
                <LinkIcon className="h-8 w-8 text-blue-600" />
                <h1 className="text-2xl font-bold text-slate-900">Affiliate Program</h1>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button 
                variant="outline" 
                onClick={() => setShowPartnerSelector(true)}
                className="border-blue-200 hover:border-blue-300"
              >
                Switch Partner Type
              </Button>
              <Badge className={`${selectedPartnerType === 'travel_agency' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}`}>
                <Trophy className="mr-1 h-4 w-4" />
                {selectedPartnerType === 'travel_agency' ? 'Travel Agency' : 'Individual User'} • {currentTierInfo.name}
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm font-medium">Total Earnings</p>
                  <p className="text-2xl font-bold">
                    {formatCurrency(referralStats.commissionEarned)}
                  </p>
                </div>
                <DollarSign className="h-8 w-8 text-blue-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm font-medium">Conversions</p>
                  <p className="text-2xl font-bold">{referralStats.totalConversions}</p>
                </div>
                <ShoppingCart className="h-8 w-8 text-green-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm font-medium">Conversion Rate</p>
                  <p className="text-2xl font-bold">{(referralStats.conversionRate * 100).toFixed(1)}%</p>
                </div>
                <TrendingUp className="h-8 w-8 text-purple-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100 text-sm font-medium">Avg. Order Value</p>
                  <p className="text-2xl font-bold">
                    {formatCurrency(referralStats.averageOrderValue)}
                  </p>
                </div>
                <Target className="h-8 w-8 text-orange-200" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Advanced Analytics Tabs */}
        <Tabs defaultValue="overview" className="w-full mb-8">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
            <TabsTrigger value="payouts">Payouts</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-8">
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Affiliate Link & Tools */}
              <div className="lg:col-span-2 space-y-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <LinkIcon className="h-5 w-5 text-blue-600" />
                  Your Exclusive Affiliate Link
                </CardTitle>
                <CardDescription>
                  Share this unique link to start earning commissions on every referral
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input 
                    value={affiliateProgram.affiliateLink} 
                    readOnly 
                    className="font-mono text-sm"
                  />
                  <Button 
                    onClick={copyAffiliateLink}
                    variant="outline"
                    className="flex-shrink-0"
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    {copiedLink ? "Copied!" : "Copy"}
                  </Button>
                </div>
                
                <div className="grid grid-cols-3 gap-4 pt-4">
                  <div className="text-center">
                    <div className="bg-blue-50 rounded-lg p-4 mb-2">
                      <Eye className="h-6 w-6 text-blue-600 mx-auto" />
                    </div>
                    <p className="text-sm font-medium">{referralStats.totalClicks.toLocaleString()}</p>
                    <p className="text-xs text-slate-500">Total Clicks</p>
                  </div>
                  <div className="text-center">
                    <div className="bg-green-50 rounded-lg p-4 mb-2">
                      <UserPlus className="h-6 w-6 text-green-600 mx-auto" />
                    </div>
                    <p className="text-sm font-medium">{referralStats.totalRegistrations}</p>
                    <p className="text-xs text-slate-500">Registrations</p>
                  </div>
                  <div className="text-center">
                    <div className="bg-purple-50 rounded-lg p-4 mb-2">
                      <ShoppingCart className="h-6 w-6 text-purple-600 mx-auto" />
                    </div>
                    <p className="text-sm font-medium">{referralStats.totalConversions}</p>
                    <p className="text-xs text-slate-500">Conversions</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Referrals */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-green-600" />
                  Recent Referrals
                </CardTitle>
                <CardDescription>
                  Latest users who joined through your affiliate link
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentReferrals.map((referral: any) => (
                    <div key={referral.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
                          {referral.username.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-medium">{referral.username}</p>
                          <div className="flex items-center gap-4 text-sm text-slate-500">
                            <span>Registered: {formatDate(referral.registeredAt)}</span>
                            <Badge variant="outline" className="text-xs">
                              {referral.source.replace('_', ' ')}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge className={
                          referral.status === 'converted' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-blue-100 text-blue-800'
                        }>
                          {referral.status === 'converted' ? '✓ Converted' : 'Registered'}
                        </Badge>
                        {referral.totalSpent > 0 && (
                          <p className="text-sm font-semibold text-green-600 mt-1">
                            {formatCurrency(referral.totalSpent)}
                          </p>
                        )}
                        {referral.campaign && (
                          <p className="text-xs text-purple-600 bg-purple-50 px-2 py-1 rounded mt-1 inline-block">
                            {referral.campaign.replace('_', ' ')}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Commission Tiers */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-blue-600" />
                  Commission Tiers
                </CardTitle>
                <CardDescription>
                  Your current tier and commission rate
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    {currentTierInfo.icon}
                    <span className="font-bold text-lg">{currentTierInfo.name}</span>
                  </div>
                  <p className="text-2xl font-bold text-blue-600">{currentTierInfo.rate}</p>
                  <p className="text-sm text-slate-600">Commission Rate</p>
                </div>

                <div className="space-y-3">
                  {Object.entries(affiliateProgram.commissionTiers).map(([tier, data]: [string, any]) => (
                    <div key={tier} className={`p-3 rounded-lg border ${
                      tier === referralStats.currentTier 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-slate-200'
                    }`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {tierIcons[tier as keyof typeof tierIcons]}
                          <span className="font-medium capitalize">{tier}</span>
                        </div>
                        <span className="font-semibold">{(data.rate * 100).toFixed(1)}%</span>
                      </div>
                      <p className="text-xs text-slate-500 mt-1">
                        {data.threshold > 0 ? `${data.threshold}+ conversions` : 'No minimum'}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Performance Goals */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-purple-600" />
                  Performance Goals
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Next Tier Progress</span>
                    <span className="text-sm text-slate-500">
                      {Math.round(referralStats.nextTierProgress * 100)}%
                    </span>
                  </div>
                  <Progress value={referralStats.nextTierProgress * 100} className="h-2" />
                  <p className="text-xs text-slate-500 mt-1">
                    {Math.ceil(25 * (1 - referralStats.nextTierProgress))} more conversions to Gold tier
                  </p>
                </div>

                <Separator />

                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm">Monthly Target</span>
                    <Badge variant="outline">8/10 referrals</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Bonus Eligible</span>
                    <span className="text-sm font-semibold text-green-600">
                      {formatCurrency(affiliateProgram.bonusThresholds.monthlyTarget.bonus)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Marketing Materials */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Gift className="h-5 w-5 text-orange-600" />
                  Marketing Materials
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  <Download className="mr-2 h-4 w-4" />
                  Download Banners
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Mail className="mr-2 h-4 w-4" />
                  Email Templates
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Share2 className="mr-2 h-4 w-4" />
                  Social Media Kit
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <MessageSquare className="mr-2 h-4 w-4" />
                  WhatsApp Templates
                </Button>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-yellow-600" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  className="w-full justify-start bg-blue-600 hover:bg-blue-700 text-white"
                  data-testid="button-create-landing-page"
                  onClick={() => {
                    toast({
                      title: "Landing Page Creator",
                      description: "Herramienta de creación de páginas activa",
                    });
                  }}
                >
                  <Globe className="mr-2 h-4 w-4" />
                  Create Landing Page
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  data-testid="button-generate-qr"
                  onClick={() => {
                    toast({
                      title: "QR Code Generator",
                      description: "Generador de códigos QR activado",
                    });
                  }}
                >
                  <BarChart3 className="mr-2 h-4 w-4" />
                  Generate QR Code
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  data-testid="button-reset-analytics"
                  onClick={() => {
                    toast({
                      title: "Analytics Reset",
                      description: "Estadísticas de enlaces reiniciadas",
                    });
                  }}
                >
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Reset Link Analytics
                </Button>
              </CardContent>
            </Card>
            </div>
            </div>
          </TabsContent>

          {/* Leaderboard Tab */}
          <TabsContent value="leaderboard" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-yellow-600" />
                  Monthly Affiliate Leaderboard
                </CardTitle>
                <CardDescription>
                  Top performing travel agencies this month
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {leaderboard.map((entry: any, index: number) => (
                    <div key={index} className={`p-4 rounded-lg border ${
                      entry.rank === 1 ? 'border-yellow-500 bg-yellow-50' :
                      entry.rank === 2 ? 'border-gray-400 bg-gray-50' :
                      entry.rank === 3 ? 'border-amber-600 bg-amber-50' :
                      'border-slate-200 bg-white'
                    }`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                            entry.rank === 1 ? 'bg-yellow-500 text-white' :
                            entry.rank === 2 ? 'bg-gray-400 text-white' :
                            entry.rank === 3 ? 'bg-amber-600 text-white' :
                            'bg-slate-200 text-slate-700'
                          }`}>
                            {entry.rank}
                          </div>
                          <div>
                            <h3 className="font-semibold">{entry.agencyName}</h3>
                            <div className="flex items-center gap-4 text-sm text-slate-600">
                              <span>{entry.totalReferrals} referrals</span>
                              <span>{entry.convertedReferrals} conversions</span>
                              <span>{(entry.conversionRate * 100).toFixed(1)}% rate</span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-green-600">{formatCurrency(entry.commissionEarned)}</p>
                          <p className="text-sm text-slate-500">{formatCurrency(entry.totalRevenue)} revenue</p>
                          <Badge className={`mt-1 ${tierColors[entry.badge as keyof typeof tierColors]}`}>
                            {entry.badge.charAt(0).toUpperCase() + entry.badge.slice(1)}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Traffic Sources */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-blue-600" />
                    Traffic Sources
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {trafficSources.map((source: any, index: number) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                        <div>
                          <p className="font-medium">{source.source}</p>
                          <p className="text-sm text-slate-500">{source.clicks} clicks</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">{source.rate.toFixed(2)}%</p>
                          <p className="text-sm text-green-600">{formatCurrency(source.revenue)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Device Breakdown */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Monitor className="h-5 w-5 text-purple-600" />
                    Device Analytics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Smartphone className="h-4 w-4 text-blue-600" />
                        <span>Mobile</span>
                      </div>
                      <div className="text-right">
                        <span className="font-semibold">64%</span>
                        <Progress value={64} className="w-20 h-2 mt-1" />
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Monitor className="h-4 w-4 text-purple-600" />
                        <span>Desktop</span>
                      </div>
                      <div className="text-right">
                        <span className="font-semibold">28%</span>
                        <Progress value={28} className="w-20 h-2 mt-1" />
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Monitor className="h-4 w-4 text-green-600" />
                        <span>Tablet</span>
                      </div>
                      <div className="text-right">
                        <span className="font-semibold">8%</span>
                        <Progress value={8} className="w-20 h-2 mt-1" />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Campaigns Tab */}
          <TabsContent value="campaigns" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="h-5 w-5 text-green-600" />
                      Campaign Performance
                    </CardTitle>
                    <CardDescription>
                      Track your marketing campaign effectiveness
                    </CardDescription>
                  </div>
                  <Dialog open={showCampaignCreator} onOpenChange={setShowCampaignCreator}>
                    <DialogTrigger asChild>
                      <Button className="bg-green-600 hover:bg-green-700">
                        <Target className="mr-2 h-4 w-4" />
                        Create Campaign
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                      <CampaignCreator 
                        onCreateCampaign={handleCreateCampaign}
                        onClose={() => setShowCampaignCreator(false)}
                      />
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {campaignPerformance.map((campaign: any, index: number) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-semibold">{campaign.name}</h3>
                        <Badge className={campaign.roi > 200 ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}>
                          {campaign.roi}% ROI
                        </Badge>
                      </div>
                      <div className="grid grid-cols-4 gap-4 text-sm">
                        <div>
                          <p className="text-slate-500">Clicks</p>
                          <p className="font-semibold">{campaign.clicks}</p>
                        </div>
                        <div>
                          <p className="text-slate-500">Conversions</p>
                          <p className="font-semibold">{campaign.conversions}</p>
                        </div>
                        <div>
                          <p className="text-slate-500">Revenue</p>
                          <p className="font-semibold text-green-600">{formatCurrency(campaign.revenue)}</p>
                        </div>
                        <div>
                          <p className="text-slate-500">Conv. Rate</p>
                          <p className="font-semibold">{((campaign.conversions / campaign.clicks) * 100).toFixed(1)}%</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Payouts Tab */}
          <TabsContent value="payouts" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Payout Summary */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5 text-green-600" />
                    Payout Summary
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                    <span className="text-sm">Available Balance</span>
                    <span className="font-bold text-green-600">{formatCurrency(referralStats.commissionEarned)}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                    <span className="text-sm">Pending Approval</span>
                    <span className="font-semibold text-blue-600">{formatCurrency(12450)}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                    <span className="text-sm">Total Paid Out</span>
                    <span className="font-semibold">{formatCurrency(89650)}</span>
                  </div>
                  <Button className="w-full bg-green-600 hover:bg-green-700">
                    Request Payout
                  </Button>
                </CardContent>
              </Card>

              {/* Payout History */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-blue-600" />
                    Recent Payouts
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">January 2025</p>
                        <p className="text-sm text-slate-500">Paid on Jan 31</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-green-600">+{formatCurrency(42380)}</p>
                        <Badge className="bg-green-100 text-green-800">Paid</Badge>
                      </div>
                    </div>
                    <div className="flex justify-between items-center p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">December 2024</p>
                        <p className="text-sm text-slate-500">Paid on Dec 31</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-green-600">+{formatCurrency(38750)}</p>
                        <Badge className="bg-green-100 text-green-800">Paid</Badge>
                      </div>
                    </div>
                    <div className="flex justify-between items-center p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">February 2025</p>
                        <p className="text-sm text-slate-500">Processing</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-blue-600">+{formatCurrency(12450)}</p>
                        <Badge className="bg-blue-100 text-blue-800">Pending</Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Partner Type Selector Dialog */}
        <Dialog open={showPartnerSelector} onOpenChange={setShowPartnerSelector}>
          <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Select Your Partnership Level</DialogTitle>
            </DialogHeader>
            <PartnerTypeSelector 
              selectedType={selectedPartnerType}
              onSelectPartnerType={(type) => {
                setSelectedPartnerType(type);
                setShowPartnerSelector(false);
                toast({
                  title: "Partnership Type Updated!",
                  description: `You are now enrolled in the ${type === 'travel_agency' ? 'Travel Agency' : 'Individual User'} affiliate program.`,
                });
              }}
            />
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}