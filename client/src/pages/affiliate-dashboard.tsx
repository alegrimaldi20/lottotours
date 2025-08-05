import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "wouter";
import { 
  Link as LinkIcon, Users, TrendingUp, DollarSign, Award, Copy,
  Eye, MousePointer, UserPlus, ShoppingCart, Trophy, Calendar,
  BarChart3, PieChart, Target, Zap, Crown, Star, Gift
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
    firstConversion: 5000, // $50 bonus
    monthlyTarget: { referrals: 10, bonus: 10000 } // $100 bonus
  },
  minimumPayout: 5000, // $50
  payoutSchedule: "monthly",
  status: "active"
};

const sampleReferralStats = {
  totalClicks: 1247,
  totalRegistrations: 89,  
  totalConversions: 23,
  totalRevenue: 345600, // $3,456 in cents
  commissionEarned: 51840, // $518.40 in cents
  conversionRate: 0.0184, // 1.84%
  averageOrderValue: 15026, // $150.26 in cents
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
    firstTransactionAmount: 18900, // $189
    totalSpent: 18900,
    status: "converted",
    source: "social_media"
  },
  {
    id: "ref-2", 
    userId: "user-124",
    username: "wanderlust_maria",
    registeredAt: new Date("2025-01-19T16:45:00Z"),
    status: "registered",
    source: "email"
  },
  {
    id: "ref-3",
    userId: "user-125", 
    username: "adventure_seeker",
    registeredAt: new Date("2025-01-18T09:20:00Z"),
    firstTransactionAt: new Date("2025-01-19T11:30:00Z"),
    firstTransactionAmount: 12500, // $125
    totalSpent: 24800, // $248 (repeat customer)
    status: "converted",
    source: "banner"
  }
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
  const { toast } = useToast();

  // Mock queries - replace with real API calls
  const { data: affiliateProgram = sampleAffiliateProgram } = useQuery({
    queryKey: ['/api/affiliate-programs/agency-1'],
    enabled: true
  });

  const { data: referralStats = sampleReferralStats } = useQuery({
    queryKey: ['/api/affiliate/agency-1/stats'],
    enabled: true
  });

  const { data: recentReferrals = sampleRecentReferrals } = useQuery({
    queryKey: ['/api/affiliate/agency-1/referrals'],
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
            <Badge className={currentTierInfo.color}>
              {currentTierInfo.icon}
              <span className="ml-1">{currentTierInfo.name} Partner</span>
            </Badge>
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
                  {recentReferrals.map((referral) => (
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
                  {Object.entries(affiliateProgram.commissionTiers).map(([tier, data]) => (
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
                  <Eye className="mr-2 h-4 w-4" />
                  Download Banners
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <PieChart className="mr-2 h-4 w-4" />
                  Email Templates
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <BarChart3 className="mr-2 h-4 w-4" />
                  Social Media Kit
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}