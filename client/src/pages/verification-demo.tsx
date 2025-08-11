import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Clock, Camera, FileText, CheckCircle, AlertCircle, Award, User } from "lucide-react";

// Simulated verification methods for demonstration
export default function VerificationDemo() {
  const [autoProgress, setAutoProgress] = useState(0);
  const [proofData, setProofData] = useState({ photo: "", text: "" });
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [verificationStates, setVerificationStates] = useState({
    auto: "ready", // ready, processing, completed
    proof: "ready", // ready, submitted, verified
    manual: "ready", // ready, submitted, under_review, approved/rejected
    time: "ready" // ready, in_progress, completed
  });

  // Auto verification simulation
  const handleAutoVerification = () => {
    setVerificationStates(prev => ({ ...prev, auto: "processing" }));
    setAutoProgress(0);
    
    const interval = setInterval(() => {
      setAutoProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setVerificationStates(curr => ({ ...curr, auto: "completed" }));
          return 100;
        }
        return prev + 20;
      });
    }, 200);
  };

  // Proof-based verification simulation
  const handleProofSubmission = () => {
    if (!proofData.photo && !proofData.text) {
      alert("Please provide either a photo URL or text description");
      return;
    }
    
    setVerificationStates(prev => ({ ...prev, proof: "submitted" }));
    
    // Simulate automatic verification of proof
    setTimeout(() => {
      setVerificationStates(prev => ({ ...prev, proof: "verified" }));
    }, 1500);
  };

  // Manual verification simulation
  const handleManualSubmission = () => {
    setVerificationStates(prev => ({ ...prev, manual: "submitted" }));
    
    setTimeout(() => {
      setVerificationStates(prev => ({ ...prev, manual: "under_review" }));
    }, 1000);
  };

  // Simulate admin approval
  const handleAdminApproval = (approved: boolean) => {
    setVerificationStates(prev => ({ 
      ...prev, 
      manual: approved ? "approved" : "rejected" 
    }));
  };

  // Time-based verification simulation
  const handleTimeBasedStart = () => {
    setVerificationStates(prev => ({ ...prev, time: "in_progress" }));
    setTimeElapsed(0);
    
    const timer = setInterval(() => {
      setTimeElapsed(prev => {
        if (prev >= 120) { // 2 minutes simulation
          clearInterval(timer);
          setVerificationStates(curr => ({ ...curr, time: "completed" }));
          return 120;
        }
        return prev + 1;
      });
    }, 50); // Fast simulation
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "ready":
        return <Badge variant="secondary">Ready</Badge>;
      case "processing":
      case "in_progress":
      case "submitted":
        return <Badge variant="default">In Progress</Badge>;
      case "under_review":
        return <Badge variant="outline">Under Review</Badge>;
      case "completed":
      case "verified":
      case "approved":
        return <Badge variant="default" className="bg-green-500">Completed</Badge>;
      case "rejected":
        return <Badge variant="destructive">Rejected</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Mission Verification System Demo</h1>
          <p className="text-lg text-slate-600">
            Interactive demonstration of different verification methods for mission compliance
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Auto Verification */}
          <Card className="border-green-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="w-5 h-5 text-green-500" />
                Auto Verification
                {getStatusBadge(verificationStates.auto)}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-slate-600">
                Missions are automatically verified after completion. May include optional delay for realism.
              </p>
              
              {verificationStates.auto === "processing" && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Processing...</span>
                    <span>{autoProgress}%</span>
                  </div>
                  <Progress value={autoProgress} className="w-full" />
                </div>
              )}
              
              <div className="flex gap-2">
                <Button 
                  onClick={handleAutoVerification}
                  disabled={verificationStates.auto !== "ready"}
                  className="bg-green-500 hover:bg-green-600"
                  data-testid="button-auto-verification"
                >
                  {verificationStates.auto === "ready" ? "Complete Mission" : 
                   verificationStates.auto === "processing" ? "Processing..." : "✓ Completed"}
                </Button>
                
                {verificationStates.auto === "completed" && (
                  <Button 
                    variant="outline" 
                    onClick={() => setVerificationStates(prev => ({ ...prev, auto: "ready" }))}
                    data-testid="button-auto-reset"
                  >
                    Reset
                  </Button>
                )}
              </div>
              
              {verificationStates.auto === "completed" && (
                <div className="flex items-center gap-2 text-green-600 bg-green-50 p-3 rounded">
                  <CheckCircle className="w-4 h-4" />
                  <span className="text-sm font-medium">Mission completed! 150 tokens awarded</span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Proof Required Verification */}
          <Card className="border-blue-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Camera className="w-5 h-5 text-blue-500" />
                Proof Required
                {getStatusBadge(verificationStates.proof)}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-slate-600">
                Submit photo or text evidence to verify mission completion.
              </p>
              
              <div className="space-y-3">
                <div>
                  <Label htmlFor="photo-url">Photo Evidence (URL)</Label>
                  <Input
                    id="photo-url"
                    type="url"
                    placeholder="https://example.com/photo.jpg"
                    value={proofData.photo}
                    onChange={(e) => setProofData(prev => ({ ...prev, photo: e.target.value }))}
                    disabled={verificationStates.proof !== "ready"}
                  />
                </div>
                
                <div>
                  <Label htmlFor="text-proof">Text Description</Label>
                  <Textarea
                    id="text-proof"
                    placeholder="Describe your experience..."
                    value={proofData.text}
                    onChange={(e) => setProofData(prev => ({ ...prev, text: e.target.value }))}
                    disabled={verificationStates.proof !== "ready"}
                    rows={3}
                  />
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button 
                  onClick={handleProofSubmission}
                  disabled={verificationStates.proof !== "ready"}
                  className="bg-blue-500 hover:bg-blue-600"
                >
                  {verificationStates.proof === "ready" ? "Submit Proof" : 
                   verificationStates.proof === "submitted" ? "Verifying..." : "✓ Verified"}
                </Button>
                
                {verificationStates.proof === "verified" && (
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setVerificationStates(prev => ({ ...prev, proof: "ready" }));
                      setProofData({ photo: "", text: "" });
                    }}
                  >
                    Reset
                  </Button>
                )}
              </div>
              
              {verificationStates.proof === "verified" && (
                <div className="flex items-center gap-2 text-blue-600 bg-blue-50 p-3 rounded">
                  <CheckCircle className="w-4 h-4" />
                  <span className="text-sm font-medium">Proof verified! 200 tokens awarded</span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Manual Review Verification */}
          <Card className="border-amber-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5 text-amber-500" />
                Manual Review
                {getStatusBadge(verificationStates.manual)}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-slate-600">
                Requires admin review and approval before tokens are awarded.
              </p>
              
              <div className="flex gap-2">
                <Button 
                  onClick={handleManualSubmission}
                  disabled={verificationStates.manual !== "ready"}
                  className="bg-amber-500 hover:bg-amber-600"
                >
                  {verificationStates.manual === "ready" ? "Submit for Review" : 
                   verificationStates.manual === "submitted" ? "Submitting..." : 
                   verificationStates.manual === "under_review" ? "Under Review" : 
                   verificationStates.manual === "approved" ? "✓ Approved" : "✗ Rejected"}
                </Button>
                
                {verificationStates.manual === "under_review" && (
                  <>
                    <Button 
                      onClick={() => handleAdminApproval(true)}
                      size="sm"
                      className="bg-green-500 hover:bg-green-600"
                    >
                      Admin: Approve
                    </Button>
                    <Button 
                      onClick={() => handleAdminApproval(false)}
                      size="sm"
                      variant="destructive"
                    >
                      Admin: Reject
                    </Button>
                  </>
                )}
                
                {(verificationStates.manual === "approved" || verificationStates.manual === "rejected") && (
                  <Button 
                    variant="outline" 
                    onClick={() => setVerificationStates(prev => ({ ...prev, manual: "ready" }))}
                  >
                    Reset
                  </Button>
                )}
              </div>
              
              {verificationStates.manual === "approved" && (
                <div className="flex items-center gap-2 text-green-600 bg-green-50 p-3 rounded">
                  <CheckCircle className="w-4 h-4" />
                  <span className="text-sm font-medium">Mission approved! 180 tokens awarded</span>
                </div>
              )}
              
              {verificationStates.manual === "rejected" && (
                <div className="flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded">
                  <AlertCircle className="w-4 h-4" />
                  <span className="text-sm font-medium">Mission rejected. No tokens awarded.</span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Time-based Verification */}
          <Card className="border-purple-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-purple-500" />
                Time-based Verification
                {getStatusBadge(verificationStates.time)}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-slate-600">
                Requires minimum time duration to complete. Mission starts when initiated.
              </p>
              
              {verificationStates.time === "in_progress" && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Time elapsed:</span>
                    <span>{Math.floor(timeElapsed / 60)}:{(timeElapsed % 60).toString().padStart(2, '0')}</span>
                  </div>
                  <Progress value={(timeElapsed / 120) * 100} className="w-full" />
                  <p className="text-xs text-slate-500">Minimum required: 2:00</p>
                </div>
              )}
              
              <div className="flex gap-2">
                <Button 
                  onClick={handleTimeBasedStart}
                  disabled={verificationStates.time !== "ready"}
                  className="bg-purple-500 hover:bg-purple-600"
                >
                  {verificationStates.time === "ready" ? "Start Mission" : 
                   verificationStates.time === "in_progress" ? "In Progress..." : "✓ Completed"}
                </Button>
                
                {verificationStates.time === "completed" && (
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setVerificationStates(prev => ({ ...prev, time: "ready" }));
                      setTimeElapsed(0);
                    }}
                  >
                    Reset
                  </Button>
                )}
              </div>
              
              {verificationStates.time === "completed" && (
                <div className="flex items-center gap-2 text-purple-600 bg-purple-50 p-3 rounded">
                  <CheckCircle className="w-4 h-4" />
                  <span className="text-sm font-medium">Time requirement met! 300 tokens awarded</span>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Summary */}
        <Card className="mt-8 bg-slate-50">
          <CardHeader>
            <CardTitle>Verification Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-4 gap-4 text-sm">
              <div className="text-center">
                <div className="font-medium text-green-600">Auto Verification</div>
                <div className="text-xs text-slate-600">Instant completion with optional delay</div>
              </div>
              <div className="text-center">
                <div className="font-medium text-blue-600">Proof Required</div>
                <div className="text-xs text-slate-600">Photo/text evidence validation</div>
              </div>
              <div className="text-center">
                <div className="font-medium text-amber-600">Manual Review</div>
                <div className="text-xs text-slate-600">Human administrator approval</div>
              </div>
              <div className="text-center">
                <div className="font-medium text-purple-600">Time-based</div>
                <div className="text-xs text-slate-600">Minimum duration requirement</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}