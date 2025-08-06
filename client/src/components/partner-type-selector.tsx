import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Building2, User, Crown, Star, Trophy, Zap, 
  DollarSign, Users, TrendingUp, Award, 
  CheckCircle, ArrowRight
} from "lucide-react";

interface PartnerTypeSelectorProps {
  onSelectPartnerType: (type: 'travel_agency' | 'individual_user') => void;
  selectedType?: 'travel_agency' | 'individual_user';
}

export default function PartnerTypeSelector({ onSelectPartnerType, selectedType }: PartnerTypeSelectorProps) {
  const [hoveredType, setHoveredType] = useState<string | null>(null);

  const partnerTypes = [
    {
      type: 'travel_agency' as const,
      title: 'Travel Agency Partner',
      subtitle: 'Professional Business Partnership',
      icon: <Building2 className="h-8 w-8" />,
      color: 'blue',
      description: 'Enterprise-level partnership for established travel agencies with enhanced benefits and higher commission rates.',
      features: [
        'Higher commission rates (18-28%)',
        'Volume-based tier progression',
        'Dedicated account management',
        'Custom marketing materials',
        'Priority customer support',
        'Bulk booking capabilities'
      ],
      tiers: [
        { name: 'Bronze Agency', rate: '18%', volume: '$5K USD+/month' },
        { name: 'Silver Agency', rate: '22%', volume: '$15K USD+/month' },
        { name: 'Gold Agency', rate: '25%', volume: '$35K USD+/month' },
        { name: 'Platinum Agency', rate: '28%', volume: '$75K USD+/month' }
      ],
      minimumPayout: '$100 USD',
      payoutSchedule: 'Weekly or Monthly',
      specialBenefits: [
        'API integration access',
        'White-label solutions',
        'Regional exclusivity opportunities',
        'Advanced analytics dashboard'
      ]
    },
    {
      type: 'individual_user' as const,
      title: 'Individual Affiliate',
      subtitle: 'Personal Referral Program',
      icon: <User className="h-8 w-8" />,
      color: 'green',
      description: 'Personal affiliate program for individual users to earn commissions by referring friends and family.',
      features: [
        'Competitive commission rates (10-18%)',
        'Easy-to-share referral links',
        'Social media integration',
        'Personal dashboard',
        'Milestone bonuses',
        'Mobile-friendly tracking'
      ],
      tiers: [
        { name: 'Bronze User', rate: '10%', volume: '$500 USD+/month' },
        { name: 'Silver User', rate: '13%', volume: '$1.5K USD+/month' },
        { name: 'Gold User', rate: '15%', volume: '$3K USD+/month' },
        { name: 'Platinum User', rate: '18%', volume: '$6K USD+/month' }
      ],
      minimumPayout: '$25 USD',
      payoutSchedule: 'Monthly',
      specialBenefits: [
        'Social sharing tools',
        'Gamified achievements',
        'Friend & family bonuses',
        'Simplified tax reporting'
      ]
    }
  ];

  const getTypeColors = (type: string, isSelected: boolean, isHovered: boolean) => {
    if (type === 'travel_agency') {
      return {
        card: isSelected ? 'border-blue-500 bg-blue-50' : isHovered ? 'border-blue-300 bg-blue-25' : 'border-gray-200',
        icon: isSelected ? 'text-blue-600 bg-blue-100' : 'text-blue-500 bg-blue-50',
        button: 'bg-blue-600 hover:bg-blue-700'
      };
    } else {
      return {
        card: isSelected ? 'border-green-500 bg-green-50' : isHovered ? 'border-green-300 bg-green-25' : 'border-gray-200',
        icon: isSelected ? 'text-green-600 bg-green-100' : 'text-green-500 bg-green-50',
        button: 'bg-green-600 hover:bg-green-700'
      };
    }
  };

  const getTierIcon = (index: number) => {
    switch (index) {
      case 0: return <Award className="h-4 w-4 text-amber-600" />;
      case 1: return <Star className="h-4 w-4 text-gray-500" />;
      case 2: return <Trophy className="h-4 w-4 text-yellow-500" />;
      case 3: return <Crown className="h-4 w-4 text-purple-600" />;
      default: return <Award className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-slate-900 mb-4">Choose Your Partnership Level</h2>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
          Select the partnership type that matches your business scale. Both partners earn commissions, 
          but travel agencies receive enhanced benefits and higher rates due to their larger business impact.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
        {partnerTypes.map((partner) => {
          const isSelected = selectedType === partner.type;
          const isHovered = hoveredType === partner.type;
          const colors = getTypeColors(partner.type, isSelected, isHovered);

          return (
            <Card 
              key={partner.type}
              className={`transition-all duration-300 cursor-pointer ${colors.card} hover:shadow-lg`}
              onMouseEnter={() => setHoveredType(partner.type)}
              onMouseLeave={() => setHoveredType(null)}
              onClick={() => onSelectPartnerType(partner.type)}
            >
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div className={`p-3 rounded-lg ${colors.icon}`}>
                    {partner.icon}
                  </div>
                  {isSelected && (
                    <CheckCircle className="h-6 w-6 text-green-600" />
                  )}
                </div>
                <CardTitle className="text-xl">{partner.title}</CardTitle>
                <CardDescription className="text-sm font-medium text-slate-600">
                  {partner.subtitle}
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-6">
                <p className="text-sm text-slate-600">{partner.description}</p>

                {/* Commission Tiers */}
                <div>
                  <h4 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                    <TrendingUp className="h-4 w-4" />
                    Commission Tiers
                  </h4>
                  <div className="grid grid-cols-2 gap-2">
                    {partner.tiers.map((tier, index) => (
                      <div key={tier.name} className="flex items-center gap-2 p-2 bg-white rounded-lg border">
                        {getTierIcon(index)}
                        <div className="text-xs">
                          <div className="font-medium">{tier.name}</div>
                          <div className="text-slate-500">{tier.rate} • {tier.volume}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Key Features */}
                <div>
                  <h4 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                    <Zap className="h-4 w-4" />
                    Key Features
                  </h4>
                  <div className="space-y-1">
                    {partner.features.slice(0, 3).map((feature, index) => (
                      <div key={index} className="flex items-center gap-2 text-xs text-slate-600">
                        <CheckCircle className="h-3 w-3 text-green-500 flex-shrink-0" />
                        {feature}
                      </div>
                    ))}
                    {partner.features.length > 3 && (
                      <div className="text-xs text-slate-500">
                        +{partner.features.length - 3} more benefits
                      </div>
                    )}
                  </div>
                </div>

                {/* Payout Info */}
                <div className="grid grid-cols-2 gap-4 pt-2 border-t">
                  <div className="text-center">
                    <div className="text-lg font-bold text-slate-900">{partner.minimumPayout}</div>
                    <div className="text-xs text-slate-500">Min. Payout</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-slate-900">{partner.payoutSchedule}</div>
                    <div className="text-xs text-slate-500">Frequency</div>
                  </div>
                </div>

                {/* Select Button */}
                <Button 
                  className={`w-full ${colors.button} text-white`}
                  onClick={() => onSelectPartnerType(partner.type)}
                  disabled={isSelected}
                >
                  {isSelected ? (
                    <>
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Selected
                    </>
                  ) : (
                    <>
                      Select {partner.title}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {selectedType && (
        <div className="text-center">
          <Badge className="text-sm px-4 py-2">
            <CheckCircle className="mr-2 h-4 w-4" />
            {selectedType === 'travel_agency' ? 'Travel Agency Partnership' : 'Individual Affiliate Program'} Selected
          </Badge>
        </div>
      )}
    </div>
  );
}