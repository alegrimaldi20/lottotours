import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { 
  FileText, 
  Shield, 
  Settings, 
  CheckCircle, 
  Clock, 
  AlertTriangle,
  User,
  Calendar,
  TrendingUp
} from "lucide-react";

interface ServiceCondition {
  id: string;
  conditionType: string;
  version: string;
  title: string;
  effectiveDate: string;
  isActive: boolean;
}

interface UserAgreement {
  id: string;
  conditionType: string;
  version: string;
  agreementStatus: string;
  sectionsAccepted: string[];
  agreedAt: string | null;
}

export default function ServiceConditionsDashboard() {
  const [selectedCondition, setSelectedCondition] = useState<string | null>(null);

  // Fetch service conditions
  const { data: conditions = [], isLoading: conditionsLoading } = useQuery({
    queryKey: ["/api/service-conditions"],
  });

  // Fetch user agreements  
  const { data: agreements = [], isLoading: agreementsLoading } = useQuery<UserAgreement[]>({
    queryKey: ["/api/users/sample-user/agreements"],
  });

  const conditionTypes = [
    {
      type: "terms_of_service",
      title: "Terms of Service",
      icon: <FileText className="h-5 w-5" />,
      description: "Platform usage terms and conditions",
      color: "blue"
    },
    {
      type: "privacy_policy", 
      title: "Privacy Policy",
      icon: <Shield className="h-5 w-5" />,
      description: "Data protection and privacy rights",
      color: "emerald"
    },
    {
      type: "operating_conditions",
      title: "Operating Conditions",
      icon: <Settings className="h-5 w-5" />,
      description: "Service standards and operational rules",
      color: "purple"
    }
  ];

  const getAgreementStatus = (conditionType: string) => {
    const agreement = agreements.find((a) => a.conditionType === conditionType);
    return agreement?.agreementStatus || "pending";
  };

  const getComplianceScore = () => {
    const acceptedCount = agreements.filter((a) => a.agreementStatus === "accepted").length;
    return Math.round((acceptedCount / conditionTypes.length) * 100);
  };

  const complianceScore = getComplianceScore();

  if (conditionsLoading || agreementsLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-teal-800 flex items-center justify-center">
        <div className="text-white text-lg">Loading service conditions...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-teal-800">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-4">
              Service Conditions Dashboard
            </h1>
            <p className="text-lg text-gray-200">
              Manage your agreements and compliance status
            </p>
            <div className="flex items-center justify-center mt-4 space-x-4">
              <Badge variant="secondary" className="bg-gold/20 text-gold border-gold/30">
                <User className="h-4 w-4 mr-2" />
                Sample User
              </Badge>
              <Badge 
                variant="secondary" 
                className={complianceScore === 100 
                  ? "bg-emerald/20 text-emerald border-emerald/30" 
                  : "bg-orange/20 text-orange border-orange/30"
                }
              >
                <TrendingUp className="h-4 w-4 mr-2" />
                {complianceScore}% Compliant
              </Badge>
            </div>
          </div>

          {/* Compliance Overview */}
          <Card className="mb-8 bg-white/10 backdrop-blur-sm border-white/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <CheckCircle className="h-5 w-5 mr-2 text-gold" />
                Compliance Overview
              </CardTitle>
              <CardDescription className="text-gray-300">
                Your current status across all service conditions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-white font-medium">Overall Compliance</span>
                    <span className="text-gold">{complianceScore}%</span>
                  </div>
                  <Progress value={complianceScore} className="h-2" />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                  {conditionTypes.map((condition) => {
                    const status = getAgreementStatus(condition.type);
                    const statusColors = {
                      accepted: "text-emerald-400 bg-emerald-500/20",
                      pending: "text-orange-400 bg-orange-500/20",
                      revoked: "text-red-400 bg-red-500/20"
                    };

                    return (
                      <div 
                        key={condition.type}
                        className="bg-white/5 rounded-lg p-4 border border-white/10"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className={`text-${condition.color}-400`}>
                            {condition.icon}
                          </div>
                          <Badge className={statusColors[status as keyof typeof statusColors]}>
                            {status === "accepted" && <CheckCircle className="h-3 w-3 mr-1" />}
                            {status === "pending" && <Clock className="h-3 w-3 mr-1" />}
                            {status === "revoked" && <AlertTriangle className="h-3 w-3 mr-1" />}
                            {status.charAt(0).toUpperCase() + status.slice(1)}
                          </Badge>
                        </div>
                        <h3 className="text-white font-medium text-sm">{condition.title}</h3>
                        <p className="text-gray-400 text-xs mt-1">{condition.description}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Service Conditions Tabs */}
          <Tabs defaultValue="terms" className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-white/10 backdrop-blur-sm">
              <TabsTrigger value="terms" className="data-[state=active]:bg-gold/20">
                <FileText className="h-4 w-4 mr-2" />
                Terms of Service
              </TabsTrigger>
              <TabsTrigger value="privacy" className="data-[state=active]:bg-gold/20">
                <Shield className="h-4 w-4 mr-2" />
                Privacy Policy
              </TabsTrigger>
              <TabsTrigger value="operating" className="data-[state=active]:bg-gold/20">
                <Settings className="h-4 w-4 mr-2" />
                Operating Conditions
              </TabsTrigger>
            </TabsList>

            {conditionTypes.map((conditionType) => (
              <TabsContent 
                key={conditionType.type} 
                value={conditionType.type.split('_')[0]} 
                className="space-y-6 mt-6"
              >
                <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`text-${conditionType.color}-400`}>
                          {conditionType.icon}
                        </div>
                        <div>
                          <CardTitle className="text-white">{conditionType.title}</CardTitle>
                          <CardDescription className="text-gray-300">
                            {conditionType.description}
                          </CardDescription>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge 
                          variant="secondary" 
                          className="bg-gold/20 text-gold border-gold/30 mb-2"
                        >
                          Version 1.0
                        </Badge>
                        <div className="text-sm text-gray-400">
                          <Calendar className="h-4 w-4 inline mr-1" />
                          Jan 2025
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                        <div>
                          <h4 className="text-white font-medium">Agreement Status</h4>
                          <p className="text-gray-400 text-sm">
                            Current status for this service condition
                          </p>
                        </div>
                        <div className="flex items-center space-x-3">
                          {getAgreementStatus(conditionType.type) === "accepted" ? (
                            <Badge className="bg-emerald-600 text-white">
                              <CheckCircle className="h-4 w-4 mr-2" />
                              Accepted
                            </Badge>
                          ) : (
                            <Badge className="bg-orange-600 text-white">
                              <Clock className="h-4 w-4 mr-2" />
                              Pending
                            </Badge>
                          )}
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-white/30 text-white hover:bg-white/10"
                            onClick={() => window.open(`/${conditionType.type.replace('_', '-')}`, '_blank')}
                            data-testid={`view-${conditionType.type}`}
                          >
                            View Details
                          </Button>
                        </div>
                      </div>

                      {/* Agreement History */}
                      <div className="bg-white/5 rounded-lg p-4">
                        <h4 className="text-white font-medium mb-3">Agreement History</h4>
                        <ScrollArea className="h-32">
                          <div className="space-y-2">
                            {agreements
                              .filter((agreement) => agreement.conditionType === conditionType.type)
                              .map((agreement) => (
                                <div key={agreement.id} className="flex items-center justify-between py-2 border-b border-white/10 last:border-b-0">
                                  <div className="flex items-center space-x-3">
                                    <div className={`h-2 w-2 rounded-full ${
                                      agreement.agreementStatus === "accepted" ? "bg-emerald-400" : "bg-orange-400"
                                    }`} />
                                    <span className="text-gray-300 text-sm">
                                      Version {agreement.version}
                                    </span>
                                  </div>
                                  <div className="text-right">
                                    <div className="text-gray-400 text-xs">
                                      {agreement.agreedAt 
                                        ? new Date(agreement.agreedAt).toLocaleDateString()
                                        : "Not agreed"
                                      }
                                    </div>
                                  </div>
                                </div>
                              ))
                            }
                            {agreements.filter((a) => a.conditionType === conditionType.type).length === 0 && (
                              <div className="text-gray-400 text-sm text-center py-4">
                                No agreement history found
                              </div>
                            )}
                          </div>
                        </ScrollArea>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            ))}
          </Tabs>

          {/* Action Center */}
          <Card className="mt-8 bg-white/10 backdrop-blur-sm border-white/20">
            <CardHeader>
              <CardTitle className="text-white text-center">Action Center</CardTitle>
              <CardDescription className="text-gray-300 text-center">
                Quick actions for managing your service conditions
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button
                  variant="outline"
                  className="border-white/30 text-white hover:bg-white/10"
                  onClick={() => window.open('/terms-of-service', '_blank')}
                  data-testid="review-terms"
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Review Terms
                </Button>
                <Button
                  variant="outline"
                  className="border-white/30 text-white hover:bg-white/10"
                  onClick={() => window.open('/privacy-policy', '_blank')}
                  data-testid="review-privacy"
                >
                  <Shield className="h-4 w-4 mr-2" />
                  Review Privacy
                </Button>
                <Button
                  variant="outline"
                  className="border-white/30 text-white hover:bg-white/10"
                  onClick={() => window.open('/operating-conditions', '_blank')}
                  data-testid="review-operations"
                >
                  <Settings className="h-4 w-4 mr-2" />
                  Review Operations
                </Button>
              </div>
              
              {complianceScore < 100 && (
                <div className="mt-6 p-4 bg-orange-500/10 border border-orange-500/30 rounded-lg">
                  <AlertTriangle className="h-5 w-5 text-orange-400 mx-auto mb-2" />
                  <p className="text-orange-200 text-sm">
                    You have pending agreements. Complete all service conditions to maintain full platform access.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="mt-8 text-center text-gray-400 text-sm">
            <p>
              Service conditions are regularly updated to maintain compliance and improve user protection.
            </p>
            <p className="mt-2">
              You will be notified of any material changes requiring new agreements.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}