import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Clock, MapPin, Camera, FileText, Award, AlertCircle } from "lucide-react";
import type { Mission, UserMission } from "@shared/schema";

interface MissionVerificationProps {
  mission: Mission;
  userMission?: UserMission;
  userId: string;
}

interface VerificationData {
  proofType: "photo" | "text" | "location" | "none";
  proofData?: string;
  location?: {
    latitude: number;
    longitude: number;
    accuracy?: number;
  };
  additionalData?: Record<string, any>;
}

export default function MissionVerification({ mission, userMission, userId }: MissionVerificationProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [proofText, setProofText] = useState("");
  const [proofImage, setProofImage] = useState("");

  const startMissionMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest(`/api/users/${userId}/missions/${mission.id}/start`, {
        method: "POST",
      });
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Mission Started!",
        description: "You can now work on completing this mission.",
      });
      queryClient.invalidateQueries({ queryKey: [`/api/users/${userId}/missions`] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to start mission",
        variant: "destructive",
      });
    },
  });

  const completeMissionMutation = useMutation({
    mutationFn: async (verificationData?: VerificationData) => {
      const response = await apiRequest(`/api/users/${userId}/missions/${mission.id}/complete`, {
        method: "POST",
        body: { verificationData },
      });
      return response.json();
    },
    onSuccess: (data) => {
      if (data.status === "completed") {
        toast({
          title: "Mission Completed!",
          description: `You earned ${data.tokensAwarded} tokens!`,
        });
      } else if (data.status === "pending_verification") {
        toast({
          title: "Submission Received",
          description: "Your mission is under review. Tokens will be awarded after verification.",
        });
      }
      queryClient.invalidateQueries({ queryKey: [`/api/users/${userId}/missions`] });
      queryClient.invalidateQueries({ queryKey: ["/api/users/sample-user"] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to complete mission",
        variant: "destructive",
      });
    },
  });

  const handleStartMission = () => {
    startMissionMutation.mutate();
  };

  const handleCompleteMission = () => {
    let verificationData: VerificationData | undefined;

    // Prepare verification data based on mission requirements
    if (mission.verificationMethod === "proof_required") {
      if (mission.requiredProofType === "photo" && !proofImage) {
        toast({
          title: "Proof Required",
          description: "Please provide a photo as proof of completion.",
          variant: "destructive",
        });
        return;
      }
      if (mission.requiredProofType === "text" && !proofText) {
        toast({
          title: "Proof Required",
          description: "Please provide a written description of your experience.",
          variant: "destructive",
        });
        return;
      }

      verificationData = {
        proofType: mission.requiredProofType as "photo" | "text" | "location" | "none",
        proofData: mission.requiredProofType === "photo" ? proofImage : proofText,
        additionalData: {
          submittedAt: new Date().toISOString(),
        },
      };
    }

    completeMissionMutation.mutate(verificationData);
  };

  const getStatusBadge = () => {
    if (!userMission) {
      return <Badge variant="secondary">Available</Badge>;
    }

    switch (userMission.status) {
      case "in_progress":
        return <Badge variant="default">In Progress</Badge>;
      case "completed":
        return <Badge variant="default" className="bg-green-500">Completed</Badge>;
      case "pending_verification":
        return <Badge variant="outline">Under Review</Badge>;
      case "failed":
        return <Badge variant="destructive">Failed</Badge>;
      default:
        return <Badge variant="secondary">Available</Badge>;
    }
  };

  const getVerificationMethodIcon = () => {
    switch (mission.verificationMethod) {
      case "auto":
        return <Award className="w-4 h-4 text-green-500" />;
      case "manual":
        return <AlertCircle className="w-4 h-4 text-amber-500" />;
      case "proof_required":
        return mission.requiredProofType === "photo" ? 
          <Camera className="w-4 h-4 text-blue-500" /> : 
          <FileText className="w-4 h-4 text-blue-500" />;
      case "time_based":
        return <Clock className="w-4 h-4 text-purple-500" />;
      default:
        return <Award className="w-4 h-4" />;
    }
  };

  const getVerificationMethodText = () => {
    switch (mission.verificationMethod) {
      case "auto":
        return "Automatic completion";
      case "manual":
        return "Manual review required";
      case "proof_required":
        return `${mission.requiredProofType} proof required`;
      case "time_based":
        return `${mission.completionTimeLimit} min minimum duration`;
      default:
        return "Standard completion";
    }
  };

  const canStart = !userMission || userMission.status === "active";
  const canComplete = userMission?.status === "in_progress" || 
                    (mission.verificationMethod === "auto" && (!userMission || userMission.status === "active"));
  const isCompleted = userMission?.status === "completed";
  const isPending = userMission?.status === "pending_verification";

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <span className="text-2xl">{mission.icon}</span>
            {mission.title}
          </CardTitle>
          {getStatusBadge()}
        </div>
        <div className="flex items-center gap-4 text-sm text-slate-600">
          <div className="flex items-center gap-1">
            {getVerificationMethodIcon()}
            {getVerificationMethodText()}
          </div>
          <div className="flex items-center gap-1">
            <Award className="w-4 h-4" />
            {mission.reward} tokens
          </div>
          {mission.location && (
            <div className="flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              {mission.location}
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <p className="text-slate-700">{mission.description}</p>

        {mission.verificationCriteria && (
          <div className="p-3 bg-slate-50 rounded-lg">
            <h4 className="font-medium mb-2">Requirements:</h4>
            <pre className="text-sm text-slate-600 whitespace-pre-wrap">
              {JSON.stringify(JSON.parse(mission.verificationCriteria), null, 2)}
            </pre>
          </div>
        )}

        {/* Proof submission for proof_required missions */}
        {mission.verificationMethod === "proof_required" && userMission?.status !== "completed" && (
          <div className="space-y-3">
            <h4 className="font-medium">Submit Proof:</h4>
            
            {mission.requiredProofType === "photo" && (
              <div className="space-y-2">
                <Label htmlFor="proof-image">Upload Photo URL</Label>
                <Input
                  id="proof-image"
                  type="url"
                  placeholder="https://example.com/your-photo.jpg"
                  value={proofImage}
                  onChange={(e) => setProofImage(e.target.value)}
                />
              </div>
            )}

            {mission.requiredProofType === "text" && (
              <div className="space-y-2">
                <Label htmlFor="proof-text">Describe Your Experience</Label>
                <Textarea
                  id="proof-text"
                  placeholder="Share details about completing this mission..."
                  value={proofText}
                  onChange={(e) => setProofText(e.target.value)}
                  rows={4}
                />
              </div>
            )}
          </div>
        )}

        {/* Action buttons */}
        <div className="flex gap-2">
          {canStart && (
            <Button
              onClick={handleStartMission}
              disabled={startMissionMutation.isPending}
              variant="outline"
            >
              {startMissionMutation.isPending ? "Starting..." : "Start Mission"}
            </Button>
          )}

          {canComplete && (
            <Button
              onClick={handleCompleteMission}
              disabled={completeMissionMutation.isPending}
            >
              {completeMissionMutation.isPending ? "Submitting..." : "Complete Mission"}
            </Button>
          )}

          {isCompleted && (
            <Badge variant="default" className="bg-green-500 px-4 py-2">
              ✓ Completed - {userMission?.tokensAwarded} tokens earned
            </Badge>
          )}

          {isPending && (
            <Badge variant="outline" className="px-4 py-2">
              Under Review - Awaiting verification
            </Badge>
          )}
        </div>

        {/* Time-based mission info */}
        {mission.verificationMethod === "time_based" && userMission?.startedAt && (
          <div className="p-3 bg-blue-50 rounded-lg">
            <div className="flex items-center gap-2 text-sm">
              <Clock className="w-4 h-4 text-blue-500" />
              <span>
                Started: {new Date(userMission.startedAt).toLocaleString()}
              </span>
            </div>
            <div className="text-sm text-slate-600 mt-1">
              Minimum duration: {mission.completionTimeLimit} minutes
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}