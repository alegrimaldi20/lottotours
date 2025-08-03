import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link } from "wouter";
import MissionVerification from "@/components/mission-verification";
import type { Mission, UserMission } from "@shared/schema";

const SAMPLE_USER_ID = "sample-user";

export default function Missions() {
  const { data: missions, isLoading: missionsLoading } = useQuery<Mission[]>({
    queryKey: ["/api/missions"],
  });

  const { data: userMissions } = useQuery<(UserMission & { mission: Mission })[]>({
    queryKey: [`/api/users/${SAMPLE_USER_ID}/missions`],
  });

  if (missionsLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-explore-blue mx-auto mb-4"></div>
          <p className="text-slate-600">Loading missions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Link href="/dashboard">
              <Button variant="outline" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-slate-900 mb-2">Mission Control</h1>
              <p className="text-lg text-slate-600">
                Complete missions with advanced verification systems to earn tokens and unlock travel rewards
              </p>
            </div>
            <Badge variant="outline" className="text-lg px-4 py-2">
              {missions?.length || 0} missions available
            </Badge>
          </div>
        </div>

        {/* Verification Methods Info */}
        <Card className="mb-8 border-blue-200 bg-blue-50/30">
          <CardHeader>
            <CardTitle className="text-blue-900">Mission Verification Methods</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span><strong>Auto:</strong> Instant completion</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span><strong>Proof Required:</strong> Photo/text evidence</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                <span><strong>Manual:</strong> Admin review needed</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <span><strong>Time-based:</strong> Duration required</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Missions Grid */}
        <div className="grid gap-8">
          {missions?.map((mission) => {
            const userMission = userMissions?.find(um => um.missionId === mission.id);
            return (
              <MissionVerification
                key={mission.id}
                mission={mission}
                userMission={userMission}
                userId={SAMPLE_USER_ID}
              />
            );
          })}
        </div>

        {!missions?.length && (
          <div className="text-center py-12">
            <p className="text-slate-500 text-lg">No missions available at the moment.</p>
            <p className="text-slate-400">Check back later for new adventures!</p>
          </div>
        )}
      </div>
    </div>
  );
}