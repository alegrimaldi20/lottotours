import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { 
  Hash, Search, Database, Eye, Calendar, User, Trophy,
  ArrowLeft, Copy, Check, AlertCircle, Zap
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";

export default function UniqueIdsPage() {
  const [searchDrawId, setSearchDrawId] = useState("");
  const [searchActivityId, setSearchActivityId] = useState("");
  const [selectedUserId, setSelectedUserId] = useState("sample-user");
  const [copiedId, setCopiedId] = useState("");
  const { toast } = useToast();

  // Fetch all lottery draws
  const { data: allDraws = [], isLoading: drawsLoading } = useQuery({
    queryKey: ['/api/lottery-draws'],
  });

  // Fetch specific draw by ID
  const { data: specificDraw, isLoading: specificDrawLoading } = useQuery({
    queryKey: ['/api/lottery-draws', searchDrawId],
    enabled: !!searchDrawId && searchDrawId.length > 10,
  });

  // Fetch mission activities for user
  const { data: userActivities = [], isLoading: activitiesLoading } = useQuery({
    queryKey: [`/api/mission-activities?userId=${selectedUserId}`],
  });

  // Fetch specific activity by ID
  const { data: specificActivity, isLoading: specificActivityLoading } = useQuery({
    queryKey: ['/api/mission-activities', searchActivityId],
    enabled: !!searchActivityId && searchActivityId.length > 10,
  });

  const copyToClipboard = async (id: string, type: string) => {
    try {
      await navigator.clipboard.writeText(id);
      setCopiedId(id);
      toast({
        title: `${type} ID Copied!`,
        description: "The unique ID has been copied to your clipboard.",
      });
      setTimeout(() => setCopiedId(""), 3000);
    } catch (err) {
      toast({
        title: "Copy Failed",
        description: "Unable to copy ID. Please copy manually.",
        variant: "destructive",
      });
    }
  };

  const formatDate = (date: string) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(date));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <div className="bg-white/90 backdrop-blur-md border-b border-purple-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/dashboard" className="text-slate-600 hover:text-purple-600 transition-colors mr-4">
                <ArrowLeft className="h-5 w-5" />
              </Link>
              <div className="flex items-center gap-3">
                <Hash className="h-8 w-8 text-purple-600" />
                <h1 className="text-2xl font-bold text-slate-900">Unique ID System</h1>
              </div>
            </div>
            <Badge className="bg-purple-100 text-purple-800">
              <Database className="mr-1 h-4 w-4" />
              Always Accessible
            </Badge>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* System Overview */}
        <Card className="mb-8 border-2 border-purple-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-purple-600" />
              Comprehensive Unique ID Tracking
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-slate-600">
              Every draw and activity in TravelLotto has a unique, always-accessible ID for complete transparency and regulatory compliance. 
              These IDs provide an immutable audit trail for all system operations.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                <Trophy className="h-6 w-6 text-blue-600" />
                <div>
                  <h4 className="font-semibold text-blue-900">Lottery Draw IDs</h4>
                  <p className="text-sm text-blue-700">Unique identifier for every lottery draw execution</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                <Zap className="h-6 w-6 text-green-600" />
                <div>
                  <h4 className="font-semibold text-green-900">Activity IDs</h4>
                  <p className="text-sm text-green-700">Unique identifier for every mission activity</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Lottery Draw Tracking */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-blue-600" />
                Lottery Draw Tracking
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Search by Draw ID */}
              <div className="space-y-2">
                <Label htmlFor="draw-search" className="text-sm font-medium">Search by Draw ID</Label>
                <div className="flex gap-2">
                  <Input
                    id="draw-search"
                    placeholder="Enter draw ID..."
                    value={searchDrawId}
                    onChange={(e) => setSearchDrawId(e.target.value)}
                  />
                  <Button variant="outline" size="sm">
                    <Search className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Specific Draw Result */}
              {specificDraw && (
                <Card className="border-blue-200">
                  <CardContent className="pt-4">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold text-blue-900">Draw Found</h4>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(specificDraw.drawId, "Draw")}
                        >
                          {copiedId === specificDraw.drawId ? (
                            <Check className="h-4 w-4 text-green-600" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <span className="text-slate-500">Draw ID:</span>
                          <div className="font-mono text-blue-600 break-all">{specificDraw.drawId}</div>
                        </div>
                        <div>
                          <span className="text-slate-500">Drawn At:</span>
                          <div>{formatDate(specificDraw.drawnAt)}</div>
                        </div>
                        <div>
                          <span className="text-slate-500">Tickets Sold:</span>
                          <div>{specificDraw.totalTicketsSold}</div>
                        </div>
                        <div>
                          <span className="text-slate-500">Verified:</span>
                          <Badge className={specificDraw.isVerified ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                            {specificDraw.isVerified ? "Yes" : "No"}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              <Separator />

              {/* All Recent Draws */}
              <div className="space-y-3">
                <h4 className="font-semibold text-slate-900">Recent Draws</h4>
                {drawsLoading ? (
                  <div className="text-center py-4 text-slate-500">Loading draws...</div>
                ) : allDraws.length === 0 ? (
                  <div className="text-center py-4 text-slate-500">No draws found</div>
                ) : (
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {allDraws.slice(0, 5).map((draw: any) => (
                      <div key={draw.drawId} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-mono truncate text-blue-600">
                            {draw.drawId}
                          </div>
                          <div className="text-xs text-slate-500">
                            {formatDate(draw.drawnAt)} • {draw.totalTicketsSold} tickets
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(draw.drawId, "Draw")}
                        >
                          {copiedId === draw.drawId ? (
                            <Check className="h-4 w-4 text-green-600" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Mission Activity Tracking */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-green-600" />
                Mission Activity Tracking
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Search by Activity ID */}
              <div className="space-y-2">
                <Label htmlFor="activity-search" className="text-sm font-medium">Search by Activity ID</Label>
                <div className="flex gap-2">
                  <Input
                    id="activity-search"
                    placeholder="Enter activity ID..."
                    value={searchActivityId}
                    onChange={(e) => setSearchActivityId(e.target.value)}
                    data-testid="input-activity-search"
                  />
                  <Button 
                    variant="outline" 
                    size="sm"
                    data-testid="button-search-activity"
                    onClick={() => {
                      toast({
                        title: "Activity Search",
                        description: `Buscando actividad: ${searchActivityId}`,
                      });
                    }}
                  >
                    <Search className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Specific Activity Result */}
              {specificActivity && (
                <Card className="border-green-200">
                  <CardContent className="pt-4">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold text-green-900">Activity Found</h4>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(specificActivity.activityId, "Activity")}
                        >
                          {copiedId === specificActivity.activityId ? (
                            <Check className="h-4 w-4 text-green-600" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <span className="text-slate-500">Activity ID:</span>
                          <div className="font-mono text-green-600 break-all">{specificActivity.activityId}</div>
                        </div>
                        <div>
                          <span className="text-slate-500">Type:</span>
                          <Badge className="bg-green-100 text-green-800 capitalize">
                            {specificActivity.activityType}
                          </Badge>
                        </div>
                        <div>
                          <span className="text-slate-500">Token Change:</span>
                          <div className={specificActivity.tokenChange > 0 ? "text-green-600" : "text-slate-600"}>
                            {specificActivity.tokenChange > 0 ? `+${specificActivity.tokenChange}` : specificActivity.tokenChange || 0}
                          </div>
                        </div>
                        <div>
                          <span className="text-slate-500">Significant:</span>
                          <Badge className={specificActivity.isSignificant ? "bg-blue-100 text-blue-800" : "bg-slate-100 text-slate-800"}>
                            {specificActivity.isSignificant ? "Yes" : "No"}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              <Separator />

              {/* User Activities */}
              <div className="space-y-3">
                <h4 className="font-semibold text-slate-900">User Activities</h4>
                {activitiesLoading ? (
                  <div className="text-center py-4 text-slate-500">Loading activities...</div>
                ) : userActivities.length === 0 ? (
                  <div className="text-center py-4 text-slate-500">No activities found</div>
                ) : (
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {userActivities.slice(0, 5).map((activity: any) => (
                      <div key={activity.activityId} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-mono truncate text-green-600">
                            {activity.activityId}
                          </div>
                          <div className="text-xs text-slate-500 capitalize">
                            {activity.activityType} • {formatDate(activity.createdAt)}
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(activity.activityId, "Activity")}
                        >
                          {copiedId === activity.activityId ? (
                            <Check className="h-4 w-4 text-green-600" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}