import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Settings, 
  Clock, 
  Shield, 
  Globe, 
  CreditCard, 
  Trophy, 
  AlertTriangle, 
  CheckCircle,
  Gavel,
  FileText
} from "lucide-react";

export default function OperatingConditions() {
  const [acknowledgedSections, setAcknowledgedSections] = useState<string[]>([]);

  const toggleAcknowledgment = (sectionId: string) => {
    setAcknowledgedSections(prev => 
      prev.includes(sectionId) 
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  const operationalRules = [
    {
      id: "platform-availability",
      title: "Platform Availability & Maintenance",
      icon: <Clock className="h-5 w-5" />,
      type: "operational",
      rules: [
        "Platform operates 24/7 with scheduled maintenance windows announced 48 hours in advance",
        "Emergency maintenance may occur without notice to address critical security issues",
        "Service interruptions exceeding 4 hours trigger automatic lottery draw extensions",
        "Users receive service credits for extended outages exceeding 24 hours",
        "Backup systems ensure data integrity during all maintenance periods"
      ]
    },
    {
      id: "transaction-processing",
      title: "Transaction Processing & Blockchain Operations",
      icon: <CreditCard className="h-5 w-5" />,
      type: "financial",
      rules: [
        "All token purchases require blockchain confirmation (typically 5-15 minutes)",
        "Gas fees for blockchain transactions are paid by the platform, not users",
        "Failed transactions are automatically refunded within 24 hours",
        "Lottery ticket purchases are final once blockchain confirmation is received",
        "Prize distributions occur within 72 hours of draw completion"
      ]
    },
    {
      id: "verification-standards",
      title: "Mission Verification Standards",
      icon: <Shield className="h-5 w-5" />,
      type: "verification",
      rules: [
        "Photo submissions must be original, unedited images with visible mission elements",
        "Location verification requires GPS coordinates within 100m accuracy",
        "Text submissions undergo automated content analysis for authenticity",
        "Manual review missions are processed within 72 hours by certified reviewers",
        "Appeals for rejected missions can be submitted within 14 days"
      ]
    },
    {
      id: "prize-fulfillment",
      title: "Prize Fulfillment & Travel Arrangements",
      icon: <Trophy className="h-5 w-5" />,
      type: "prizes",
      rules: [
        "Travel prizes include all specified components with no hidden fees",
        "Winners must claim prizes within 30 days of notification",
        "Travel dates must be booked within 6 months of winning",
        "Prize modifications subject to 15% administrative fee",
        "Force majeure events may require prize rescheduling without penalty"
      ]
    },
    {
      id: "compliance-monitoring",
      title: "Compliance & Anti-Fraud Measures",
      icon: <Gavel className="h-5 w-5" />,
      type: "compliance",
      rules: [
        "All user activities monitored for fraud detection and prevention",
        "Multi-account creation results in immediate permanent suspension",
        "Suspicious transaction patterns trigger automatic account review",
        "KYC verification required for prizes exceeding $1,000 USD value",
        "Regular audits ensure compliance with international gaming regulations"
      ]
    }
  ];

  const serviceLevel = {
    uptime: "99.9%",
    support: "24/7",
    response: "< 4 hours",
    resolution: "< 24 hours"
  };

  const isAllAcknowledged = operationalRules.every(rule => acknowledgedSections.includes(rule.id));

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-teal-800">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-4">
              Operating Conditions & Service Standards
            </h1>
            <p className="text-lg text-gray-200">
              Comprehensive operational guidelines and service level commitments
            </p>
            <div className="flex items-center justify-center mt-4 space-x-4">
              <Badge variant="secondary" className="bg-gold/20 text-gold border-gold/30">
                Service Level: Premium
              </Badge>
              <Badge variant="secondary" className="bg-emerald/20 text-emerald border-emerald/30">
                Uptime: {serviceLevel.uptime}
              </Badge>
            </div>
          </div>

          <Tabs defaultValue="operations" className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-white/10 backdrop-blur-sm">
              <TabsTrigger value="operations" className="data-[state=active]:bg-gold/20">
                <Settings className="h-4 w-4 mr-2" />
                Operations
              </TabsTrigger>
              <TabsTrigger value="standards" className="data-[state=active]:bg-gold/20">
                <FileText className="h-4 w-4 mr-2" />
                Service Standards
              </TabsTrigger>
              <TabsTrigger value="compliance" className="data-[state=active]:bg-gold/20">
                <Gavel className="h-4 w-4 mr-2" />
                Compliance
              </TabsTrigger>
            </TabsList>

            <TabsContent value="operations" className="space-y-6 mt-6">
              {operationalRules.map((section) => {
                const isAcknowledged = acknowledgedSections.includes(section.id);
                const typeColors = {
                  operational: "border-blue-500/30 bg-blue-500/10",
                  financial: "border-emerald-500/30 bg-emerald-500/10",
                  verification: "border-orange-500/30 bg-orange-500/10",
                  prizes: "border-purple-500/30 bg-purple-500/10",
                  compliance: "border-red-500/30 bg-red-500/10"
                };

                return (
                  <Card key={section.id} className={`${typeColors[section.type as keyof typeof typeColors]} backdrop-blur-sm border-white/20`}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="text-gold">{section.icon}</div>
                          <CardTitle className="text-white">{section.title}</CardTitle>
                        </div>
                        <Button
                          onClick={() => toggleAcknowledgment(section.id)}
                          variant={isAcknowledged ? "default" : "outline"}
                          size="sm"
                          className={isAcknowledged 
                            ? "bg-emerald-600 hover:bg-emerald-700 text-white" 
                            : "border-white/30 text-white hover:bg-white/10"
                          }
                          data-testid={`acknowledge-${section.id}`}
                        >
                          {isAcknowledged ? (
                            <>
                              <CheckCircle className="h-4 w-4 mr-2" />
                              Acknowledged
                            </>
                          ) : (
                            "Acknowledge"
                          )}
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {section.rules.map((rule, index) => (
                          <div key={index} className="flex items-start space-x-2">
                            <div className="h-2 w-2 bg-gold rounded-full mt-2 flex-shrink-0" />
                            <p className="text-gray-200 text-sm leading-relaxed">
                              {rule}
                            </p>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </TabsContent>

            <TabsContent value="standards" className="space-y-6 mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center">
                      <Globe className="h-5 w-5 mr-2 text-gold" />
                      Service Level Agreement
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Platform Uptime</span>
                      <Badge className="bg-emerald-600 text-white">{serviceLevel.uptime}</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Support Availability</span>
                      <Badge className="bg-blue-600 text-white">{serviceLevel.support}</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Response Time</span>
                      <Badge className="bg-orange-600 text-white">{serviceLevel.response}</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Issue Resolution</span>
                      <Badge className="bg-purple-600 text-white">{serviceLevel.resolution}</Badge>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center">
                      <AlertTriangle className="h-5 w-5 mr-2 text-gold" />
                      Emergency Procedures
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 text-gray-200 text-sm">
                      <p>• Immediate notification for security incidents</p>
                      <p>• Automatic lottery extensions for system outages</p>
                      <p>• Emergency contact via support@travellotto.com</p>
                      <p>• 24/7 technical response team activation</p>
                      <p>• Regular disaster recovery testing</p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Alert className="bg-gold/10 border-gold/30">
                <AlertTriangle className="h-4 w-4 text-gold" />
                <AlertDescription className="text-gray-200">
                  Service level commitments are backed by our comprehensive insurance and compensation policies.
                  Users receive automatic credits for any service level breaches.
                </AlertDescription>
              </Alert>
            </TabsContent>

            <TabsContent value="compliance" className="space-y-6 mt-6">
              <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                <CardHeader>
                  <CardTitle className="text-white">Regulatory Compliance Framework</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="text-gold font-semibold mb-3">Gaming Regulations</h4>
                      <ul className="space-y-2 text-gray-200 text-sm">
                        <li>• Licensed in Malta Gaming Authority (MGA)</li>
                        <li>• UK Gambling Commission compliant</li>
                        <li>• Curaçao eGaming certification</li>
                        <li>• Regular third-party audits</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="text-gold font-semibold mb-3">Financial Compliance</h4>
                      <ul className="space-y-2 text-gray-200 text-sm">
                        <li>• AML/KYC procedures implemented</li>
                        <li>• PCI DSS Level 1 certification</li>
                        <li>• SOX compliance for financial reporting</li>
                        <li>• Regular compliance monitoring</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                <CardHeader>
                  <CardTitle className="text-white">User Protection Measures</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <Shield className="h-5 w-5 text-gold mt-1" />
                      <div>
                        <h4 className="text-white font-medium">Responsible Gaming</h4>
                        <p className="text-gray-300 text-sm">Built-in spending limits, cooling-off periods, and self-exclusion tools</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <Globe className="h-5 w-5 text-gold mt-1" />
                      <div>
                        <h4 className="text-white font-medium">International Standards</h4>
                        <p className="text-gray-300 text-sm">Compliance with GDPR, CCPA, and regional data protection laws</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <CheckCircle className="h-5 w-5 text-gold mt-1" />
                      <div>
                        <h4 className="text-white font-medium">Transparent Operations</h4>
                        <p className="text-gray-300 text-sm">All lottery draws verified by independent third parties</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <Card className="mt-8 bg-white/10 backdrop-blur-sm border-white/20">
            <CardHeader>
              <CardTitle className="text-white text-center">Operating Conditions Agreement</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <div className="mb-4">
                <p className="text-gray-200 mb-2">
                  Sections Acknowledged: {acknowledgedSections.length} of {operationalRules.length}
                </p>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-gold to-teal h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(acknowledgedSections.length / operationalRules.length) * 100}%` }}
                  />
                </div>
              </div>
              
              <Button
                disabled={!isAllAcknowledged}
                className={isAllAcknowledged 
                  ? "bg-gradient-to-r from-gold to-amber-500 hover:from-gold/90 hover:to-amber-500/90 text-black font-semibold px-8 py-3"
                  : "bg-gray-600 text-gray-400 cursor-not-allowed px-8 py-3"
                }
                size="lg"
                data-testid="acknowledge-all-conditions"
              >
                {isAllAcknowledged ? (
                  <>
                    <CheckCircle className="h-5 w-5 mr-2" />
                    Acknowledge All Conditions
                  </>
                ) : (
                  "Review All Sections to Continue"
                )}
              </Button>
              
              {isAllAcknowledged && (
                <p className="text-emerald-400 text-sm mt-3">
                  ✓ You have acknowledged all operating conditions
                </p>
              )}
            </CardContent>
          </Card>

          <div className="mt-8 text-center text-gray-400 text-sm">
            <p>
              For operational questions or service issues, contact operations@travellotto.com
            </p>
            <p className="mt-2">
              These operating conditions are reviewed quarterly and updated as needed.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}