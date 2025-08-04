import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, AlertTriangle, FileText, Shield, Globe, Coins } from "lucide-react";

export default function TermsOfService() {
  const [acceptedSections, setAcceptedSections] = useState<string[]>([]);

  const toggleSection = (sectionId: string) => {
    setAcceptedSections(prev => 
      prev.includes(sectionId) 
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  const sections = [
    {
      id: "platform-overview",
      title: "Platform Overview & Purpose",
      icon: <Globe className="h-5 w-5" />,
      content: [
        "TravelLotto is a blockchain-powered travel lottery platform that combines digital gaming mechanics with authentic travel experiences.",
        "Users participate in themed missions, lotteries, and challenges to earn tokens and NFTs redeemable for real travel packages.",
        "All lottery draws are conducted transparently using blockchain technology to ensure fairness and verifiability.",
        "The platform operates internationally and complies with applicable laws in jurisdictions where it operates."
      ]
    },
    {
      id: "user-eligibility",
      title: "User Eligibility & Account Requirements",
      icon: <Shield className="h-5 w-5" />,
      content: [
        "Users must be 18 years or older to participate in lottery activities.",
        "Account registration requires valid contact information and email verification.",
        "Users are responsible for maintaining the security of their wallet connections and private keys.",
        "Multi-account creation to circumvent platform limits is strictly prohibited.",
        "Users must comply with local laws regarding online gaming and lottery participation."
      ]
    },
    {
      id: "token-economics",
      title: "Token Economics & Digital Assets",
      icon: <Coins className="h-5 w-5" />,
      content: [
        "Platform tokens are utility tokens used exclusively for purchasing lottery tickets and accessing platform features.",
        "Token purchases are final and non-refundable except as required by applicable law.",
        "Token balances do not expire but may be subject to inactivity policies after 24 months.",
        "NFT rewards represent digital collectibles and may include redemption rights for physical experiences.",
        "All blockchain transactions are recorded permanently and cannot be reversed."
      ]
    },
    {
      id: "lottery-operations",
      title: "Lottery Operations & Fair Play",
      icon: <FileText className="h-5 w-5" />,
      content: [
        "All lottery draws are conducted using cryptographically secure random number generation.",
        "Draw dates and times are published in advance and cannot be modified once tickets are sold.",
        "Maximum ticket limits per user may apply to ensure fair participation.",
        "Prize distribution follows the published prize structure with no hidden deductions.",
        "Winners are notified within 48 hours and have 30 days to claim prizes."
      ]
    },
    {
      id: "travel-redemption",
      title: "Travel Prize Redemption & Fulfillment",
      icon: <CheckCircle className="h-5 w-5" />,
      content: [
        "Travel prizes must be redeemed within 12 months of winning unless otherwise specified.",
        "Prize packages include specified accommodations, transportation, and experiences as detailed.",
        "Winners are responsible for obtaining necessary travel documents (passport, visas, etc.).",
        "Travel dates are subject to availability and may require advance booking.",
        "Prize packages cannot be exchanged for cash value except where legally required."
      ]
    },
    {
      id: "mission-verification",
      title: "Mission Verification & Compliance",
      icon: <AlertTriangle className="h-5 w-5" />,
      content: [
        "Mission completion requires authentic verification according to specified criteria.",
        "Photo and text submissions must be original content created by the user.",
        "False or fraudulent mission submissions result in immediate account suspension.",
        "Verification processes may include manual review and can take up to 72 hours.",
        "Disputed verifications are reviewed by platform administrators with final decision authority."
      ]
    }
  ];

  const allSectionsAccepted = sections.every(section => acceptedSections.includes(section.id));

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-teal-800">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-4">
              Terms of Service & Operating Conditions
            </h1>
            <p className="text-lg text-gray-200">
              Please review and accept all sections to use the TravelLotto platform
            </p>
            <div className="flex items-center justify-center mt-4 space-x-4">
              <Badge variant="secondary" className="bg-gold/20 text-gold border-gold/30">
                Effective Date: January 2025
              </Badge>
              <Badge variant="secondary" className="bg-teal/20 text-teal border-teal/30">
                Version 1.0
              </Badge>
            </div>
          </div>

          <div className="space-y-6">
            {sections.map((section) => {
              const isAccepted = acceptedSections.includes(section.id);
              return (
                <Card key={section.id} className="bg-white/10 backdrop-blur-sm border-white/20">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="text-gold">{section.icon}</div>
                        <CardTitle className="text-white">{section.title}</CardTitle>
                      </div>
                      <Button
                        onClick={() => toggleSection(section.id)}
                        variant={isAccepted ? "default" : "outline"}
                        size="sm"
                        className={isAccepted 
                          ? "bg-emerald-600 hover:bg-emerald-700 text-white" 
                          : "border-white/30 text-white hover:bg-white/10"
                        }
                        data-testid={`accept-${section.id}`}
                      >
                        {isAccepted ? (
                          <>
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Accepted
                          </>
                        ) : (
                          "Accept Section"
                        )}
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-32">
                      <div className="space-y-2">
                        {section.content.map((item, index) => (
                          <p key={index} className="text-gray-200 text-sm leading-relaxed">
                            • {item}
                          </p>
                        ))}
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <Separator className="my-8 bg-white/20" />
          
          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardHeader>
              <CardTitle className="text-white text-center">Agreement Summary</CardTitle>
              <CardDescription className="text-gray-300 text-center">
                By accepting all sections above, you agree to the complete Terms of Service
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <div className="mb-4">
                <p className="text-gray-200 mb-2">
                  Sections Accepted: {acceptedSections.length} of {sections.length}
                </p>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-gold to-teal h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(acceptedSections.length / sections.length) * 100}%` }}
                  />
                </div>
              </div>
              
              <Button
                disabled={!allSectionsAccepted}
                className={allSectionsAccepted 
                  ? "bg-gradient-to-r from-gold to-amber-500 hover:from-gold/90 hover:to-amber-500/90 text-black font-semibold px-8 py-3"
                  : "bg-gray-600 text-gray-400 cursor-not-allowed px-8 py-3"
                }
                size="lg"
                data-testid="complete-acceptance"
              >
                {allSectionsAccepted ? (
                  <>
                    <CheckCircle className="h-5 w-5 mr-2" />
                    Complete Agreement
                  </>
                ) : (
                  "Accept All Sections to Continue"
                )}
              </Button>
              
              {allSectionsAccepted && (
                <p className="text-emerald-400 text-sm mt-3">
                  ✓ You have accepted all terms and conditions
                </p>
              )}
            </CardContent>
          </Card>

          <div className="mt-8 text-center text-gray-400 text-sm">
            <p>
              For questions about these terms, contact us at legal@travellotto.com
            </p>
            <p className="mt-2">
              These terms may be updated periodically. Users will be notified of material changes.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}