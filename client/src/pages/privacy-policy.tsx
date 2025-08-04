import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Shield, Eye, Database, Lock, Globe, UserCheck } from "lucide-react";

export default function PrivacyPolicy() {
  const sections = [
    {
      id: "data-collection",
      title: "Information We Collect",
      icon: <Database className="h-5 w-5" />,
      content: [
        "Account Information: Username, email address, and profile preferences",
        "Wallet Data: Blockchain wallet addresses and transaction histories (public blockchain data)",
        "Mission Data: Photo submissions, text responses, and location data for mission verification",
        "Usage Analytics: Platform interaction patterns, feature usage, and performance metrics",
        "Device Information: Browser type, IP address, and device identifiers for security purposes"
      ]
    },
    {
      id: "data-usage",
      title: "How We Use Your Information",
      icon: <Eye className="h-5 w-5" />,
      content: [
        "Platform Operations: Process lottery entries, mission verifications, and prize distributions",
        "Account Management: Maintain user accounts, preferences, and transaction histories",
        "Communication: Send notifications about wins, mission updates, and platform announcements",
        "Security: Detect fraudulent activity, prevent multi-accounting, and protect user assets",
        "Platform Improvement: Analytics to enhance user experience and develop new features"
      ]
    },
    {
      id: "data-sharing",
      title: "Information Sharing & Disclosure",
      icon: <UserCheck className="h-5 w-5" />,
      content: [
        "Travel Partners: Winner information shared with travel providers for prize fulfillment only",
        "Blockchain Networks: Transaction data is publicly visible on blockchain networks by design",
        "Legal Requirements: Information disclosed when required by law or legal processes",
        "Service Providers: Limited data shared with payment processors and verification services",
        "No Sale Policy: We never sell personal information to third parties for marketing purposes"
      ]
    },
    {
      id: "data-security",
      title: "Data Security & Protection",
      icon: <Lock className="h-5 w-5" />,
      content: [
        "Encryption: All sensitive data encrypted in transit and at rest using industry standards",
        "Access Controls: Strict employee access controls with regular security training",
        "Blockchain Security: Wallet connections secured through industry-standard Web3 protocols",
        "Regular Audits: Security assessments and penetration testing conducted regularly",
        "Incident Response: Immediate notification procedures for any security breaches"
      ]
    },
    {
      id: "user-rights",
      title: "Your Privacy Rights",
      icon: <Shield className="h-5 w-5" />,
      content: [
        "Access Rights: Request copies of all personal data we hold about you",
        "Correction Rights: Update or correct inaccurate personal information",
        "Deletion Rights: Request deletion of your account and associated data",
        "Portability Rights: Receive your data in a structured, machine-readable format",
        "Withdraw Consent: Opt out of non-essential data processing at any time"
      ]
    },
    {
      id: "international",
      title: "International Transfers & Compliance",
      icon: <Globe className="h-5 w-5" />,
      content: [
        "Global Operations: Data may be processed in multiple countries where we operate",
        "GDPR Compliance: Full compliance with European Union data protection regulations",
        "CCPA Compliance: California Consumer Privacy Act rights respected for US users",
        "Data Localization: Regional data storage requirements met where applicable",
        "Transfer Safeguards: Appropriate safeguards in place for all international transfers"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-teal-800">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-4">
              Privacy Policy & Data Protection
            </h1>
            <p className="text-lg text-gray-200">
              Your privacy is fundamental to how we operate TravelLotto
            </p>
            <div className="flex items-center justify-center mt-4 space-x-4">
              <Badge variant="secondary" className="bg-gold/20 text-gold border-gold/30">
                Last Updated: January 2025
              </Badge>
              <Badge variant="secondary" className="bg-teal/20 text-teal border-teal/30">
                GDPR & CCPA Compliant
              </Badge>
            </div>
          </div>

          <div className="space-y-6">
            {sections.map((section) => (
              <Card key={section.id} className="bg-white/10 backdrop-blur-sm border-white/20">
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <div className="text-gold">{section.icon}</div>
                    <CardTitle className="text-white">{section.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="max-h-48">
                    <div className="space-y-3">
                      {section.content.map((item, index) => (
                        <div key={index} className="text-gray-200 text-sm leading-relaxed">
                          <span className="font-medium text-gold">
                            {item.split(':')[0]}:
                          </span>
                          <span className="ml-2">
                            {item.split(':').slice(1).join(':')}
                          </span>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="mt-8 bg-white/10 backdrop-blur-sm border-white/20">
            <CardHeader>
              <CardTitle className="text-white text-center">Contact & Data Requests</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <div className="space-y-4 text-gray-200">
                <p>
                  <strong className="text-gold">Data Protection Officer:</strong><br />
                  privacy@travellotto.com
                </p>
                <p>
                  <strong className="text-gold">Response Time:</strong><br />
                  We respond to privacy requests within 30 days
                </p>
                <p>
                  <strong className="text-gold">Complaint Rights:</strong><br />
                  You have the right to lodge complaints with your local data protection authority
                </p>
              </div>
            </CardContent>
          </Card>

          <div className="mt-8 text-center text-gray-400 text-sm">
            <p>
              This privacy policy may be updated to reflect changes in our practices or applicable laws.
            </p>
            <p className="mt-2">
              Material changes will be communicated through the platform and via email.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}