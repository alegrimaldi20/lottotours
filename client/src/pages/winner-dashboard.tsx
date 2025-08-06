import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "wouter";
import { 
  Crown, Calendar, MapPin, Phone, Mail, User, Award, Clock, 
  CheckCircle, AlertCircle, MessageSquare, ExternalLink, Star,
  Globe, Users, Briefcase, Camera, Heart
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import TravelImageRenderer from "@/components/travel-image-renderer";

// Temporary data until backend is implemented
const samplePrizeWinners = [
  {
    id: "winner-1",
    userId: "sample-user",
    lotteryId: "lottery-paris-weekend",
    prizeType: "lottery",
    prizeTitle: "Paris Weekend Getaway",
    prizeDescription: "3 days in Paris with 4-star hotel, flights included, and €500 spending money",
    prizeValue: 200000,
    status: "assigned",
    assignedAgency: {
      id: "agency-1",
      name: "European Adventures Co.",
      email: "bookings@europeadventures.com",
      phone: "+33 1 42 86 13 24",
      website: "https://europeadventures.com",
      rating: 4.8,
      contactPersonName: "Marie Dubois",
      contactPersonEmail: "marie.dubois@europeadventures.com"
    },
    tourPackage: {
      id: "package-paris-romantic",
      title: "Romantic Paris Experience",
      destination: "Paris, France",
      duration: 3,
      inclusions: ["Flights", "4-star Hotel", "Breakfast", "City Tour", "€500 Spending Money"],
      images: ["paris-1", "paris-2", "paris-3"]
    },
    claimedAt: new Date("2025-01-15T10:30:00Z"),
    assignedAt: new Date("2025-01-16T14:20:00Z"),
    contactedAt: new Date("2025-01-17T09:15:00Z"),
    expiresAt: new Date("2025-04-15T23:59:59Z"),
    communicationLog: [
      {
        date: "2025-01-17T09:15:00Z",
        from: "agency",
        message: "Congratulations! We're excited to help you plan your Paris adventure. Please let us know your preferred travel dates.",
        type: "initial_contact"
      },
      {
        date: "2025-01-17T15:30:00Z",
        from: "user",
        message: "Thank you! I'm thinking of traveling in March. Dates between March 15-25 would be perfect.",
        type: "response"
      }
    ],
    preferredDates: ["2025-03-15", "2025-03-22"],
    specialRequests: "Vegetarian meals preferred. Would love restaurant recommendations for authentic French cuisine."
  },
  {
    id: "winner-2",
    userId: "sample-user",
    prizeType: "mission_reward",
    prizeTitle: "Adventure Travel Gear Set",
    prizeDescription: "Complete travel backpack with hiking essentials worth $250 USD",
    prizeValue: 25000,
    status: "completed",
    assignedAgency: {
      id: "agency-2",
      name: "Adventure Gear Pro",
      email: "orders@adventuregear.com",
      phone: "+1-555-GEAR-PRO",
      website: "https://adventuregear.com",
      rating: 4.6,
      contactPersonName: "Jake Morrison",
      contactPersonEmail: "jake.morrison@adventuregear.com"
    },
    claimedAt: new Date("2025-01-10T16:45:00Z"),
    assignedAt: new Date("2025-01-11T11:30:00Z"),
    contactedAt: new Date("2025-01-11T14:20:00Z"),
    bookedAt: new Date("2025-01-12T10:15:00Z"),
    completedAt: new Date("2025-01-18T13:45:00Z"),
    bookingReference: "APG-2025-TL-789123",
    communicationLog: [
      {
        date: "2025-01-11T14:20:00Z",
        from: "agency",
        message: "Your adventure gear set has been reserved! Please confirm your shipping address and we'll send it out within 48 hours.",
        type: "initial_contact"
      },
      {
        date: "2025-01-12T10:15:00Z",
        from: "user",
        message: "Address confirmed. Very excited to receive the gear for my upcoming hiking trip!",
        type: "response"
      },
      {
        date: "2025-01-18T13:45:00Z",
        from: "agency",
        message: "Your adventure gear set has been delivered! Tracking number: TRK789123. Enjoy your adventures!",
        type: "completion"
      }
    ]
  }
];

const statusIcons = {
  pending: <Clock className="h-4 w-4 text-yellow-500" />,
  assigned: <User className="h-4 w-4 text-blue-500" />,
  contacted: <MessageSquare className="h-4 w-4 text-purple-500" />,
  booked: <Calendar className="h-4 w-4 text-green-500" />,
  completed: <CheckCircle className="h-4 w-4 text-green-600" />,
  cancelled: <AlertCircle className="h-4 w-4 text-red-500" />
};

const statusLabels = {
  pending: "Prize Pending",
  assigned: "Agency Assigned", 
  contacted: "Agency Contacted",
  booked: "Trip Booked",
  completed: "Completed",
  cancelled: "Cancelled"
};

const statusColors = {
  pending: "bg-yellow-100 text-yellow-800",
  assigned: "bg-blue-100 text-blue-800",
  contacted: "bg-purple-100 text-purple-800", 
  booked: "bg-green-100 text-green-800",
  completed: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800"
};

export default function WinnerDashboard() {
  const [selectedPrize, setSelectedPrize] = useState<any>(null);
  const [contactMessage, setContactMessage] = useState("");
  const [preferredDates, setPreferredDates] = useState("");
  const [specialRequests, setSpecialRequests] = useState("");
  const { toast } = useToast();

  // Mock query - replace with real API call
  const { data: prizeWinners = samplePrizeWinners, isLoading } = useQuery({
    queryKey: ['/api/users/sample-user/prize-winners'],
    enabled: true
  });

  const contactAgencyMutation = useMutation({
    mutationFn: async (data: { prizeId: string; message: string; dates?: string; requests?: string }) => {
      // Mock API call - replace with real endpoint
      await new Promise(resolve => setTimeout(resolve, 1000));
      return { success: true };
    },
    onSuccess: () => {
      toast({
        title: "Message Sent",
        description: "Your message has been sent to the travel agency. They will respond within 24 hours.",
      });
      setContactMessage("");
      setPreferredDates("");
      setSpecialRequests("");
    }
  });

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(date));
  };

  const formatCurrency = (cents: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(cents / 100);
  };

  const getDaysUntilExpiry = (expiryDate: Date) => {
    const now = new Date();
    const expiry = new Date(expiryDate);
    const diffTime = expiry.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 flex items-center justify-center">
        <div className="text-center">
          <Crown className="h-12 w-12 text-lottery-gold mx-auto mb-4 animate-pulse" />
          <p className="text-slate-600">Loading your prizes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50">
      {/* Header */}
      <div className="bg-white/90 backdrop-blur-md border-b border-lottery-purple/20 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/dashboard" className="text-slate-600 hover:text-lottery-gold transition-colors mr-4">
                ← Dashboard
              </Link>
              <div className="flex items-center gap-3">
                <Crown className="h-8 w-8 text-lottery-gold" />
                <h1 className="text-2xl font-bold text-slate-900">Prize Winners Dashboard</h1>
              </div>
            </div>
            <Badge variant="secondary" className="bg-lottery-gold/10 text-lottery-gold">
              {prizeWinners.length} Prize{prizeWinners.length !== 1 ? 's' : ''} Won
            </Badge>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-r from-lottery-gold/10 to-yellow-50 border-lottery-gold/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Total Prize Value</p>
                  <p className="text-2xl font-bold text-lottery-gold">
                    {formatCurrency(prizeWinners.reduce((sum, winner) => sum + (winner.prizeValue || 0), 0))}
                  </p>
                </div>
                <Award className="h-8 w-8 text-lottery-gold" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Completed</p>
                  <p className="text-2xl font-bold text-green-600">
                    {prizeWinners.filter(w => w.status === 'completed').length}
                  </p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">In Progress</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {prizeWinners.filter(w => ['assigned', 'contacted', 'booked'].includes(w.status)).length}
                  </p>
                </div>
                <Clock className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">  
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Active Agencies</p>
                  <p className="text-2xl font-bold text-purple-600">
                    {new Set(prizeWinners.filter(w => w.assignedAgency).map(w => w.assignedAgency.id)).size}
                  </p>
                </div>
                <Briefcase className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Prize Winners List */}
        <div className="space-y-6">
          {prizeWinners.map((winner) => (
            <Card key={winner.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 rounded-lg overflow-hidden bg-slate-100 flex-shrink-0">
                      {winner.tourPackage?.images?.[0] ? (
                        <TravelImageRenderer 
                          type="cultural" 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Award className="h-8 w-8 text-slate-400" />
                        </div>
                      )}
                    </div>
                    <div>
                      <CardTitle className="text-xl mb-2">{winner.prizeTitle}</CardTitle>
                      <CardDescription className="text-sm mb-3">
                        {winner.prizeDescription}
                      </CardDescription>
                      <div className="flex items-center gap-4">
                        <Badge className={statusColors[winner.status as keyof typeof statusColors]}>
                          {statusIcons[winner.status as keyof typeof statusIcons]}
                          <span className="ml-1">{statusLabels[winner.status as keyof typeof statusLabels]}</span>
                        </Badge>
                        <span className="text-sm text-slate-500">
                          Value: {formatCurrency(winner.prizeValue)}
                        </span>
                        {winner.expiresAt && (
                          <span className="text-sm text-slate-500">
                            Expires in {getDaysUntilExpiry(winner.expiresAt)} days
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" onClick={() => setSelectedPrize(winner)}>
                        View Details
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                          <Crown className="h-5 w-5 text-lottery-gold" />
                          {selectedPrize?.prizeTitle}
                        </DialogTitle>
                        <DialogDescription>
                          {selectedPrize?.prizeDescription}
                        </DialogDescription>
                      </DialogHeader>

                      <Tabs defaultValue="details" className="mt-6">
                        <TabsList className="grid w-full grid-cols-3">
                          <TabsTrigger value="details">Prize Details</TabsTrigger>
                          <TabsTrigger value="agency">Travel Agency</TabsTrigger>
                          <TabsTrigger value="communication">Communication</TabsTrigger>
                        </TabsList>

                        <TabsContent value="details" className="space-y-6">
                          <div className="grid grid-cols-2 gap-6">
                            <div>
                              <Label className="font-semibold">Prize Information</Label>
                              <div className="space-y-2 text-sm mt-2">
                                <p><strong>Type:</strong> {selectedPrize?.prizeType.replace('_', ' ').toUpperCase()}</p>
                                <p><strong>Value:</strong> {formatCurrency(selectedPrize?.prizeValue || 0)}</p>
                                <p><strong>Status:</strong> {statusLabels[selectedPrize?.status as keyof typeof statusLabels]}</p>
                                <p><strong>Claimed:</strong> {selectedPrize?.claimedAt ? formatDate(selectedPrize.claimedAt) : 'Not claimed'}</p>
                                {selectedPrize?.expiresAt && (
                                  <p><strong>Expires:</strong> {formatDate(selectedPrize.expiresAt)}</p>
                                )}
                                {selectedPrize?.bookingReference && (
                                  <p><strong>Booking Reference:</strong> {selectedPrize.bookingReference}</p>
                                )}
                              </div>
                            </div>

                            {selectedPrize?.tourPackage && (
                              <div>
                                <Label className="font-semibold">Tour Package Details</Label>
                                <div className="space-y-2 text-sm mt-2">
                                  <p><strong>Destination:</strong> {selectedPrize.tourPackage.destination}</p>
                                  <p><strong>Duration:</strong> {selectedPrize.tourPackage.duration} days</p>
                                  <div>
                                    <strong>Inclusions:</strong>
                                    <ul className="list-disc list-inside ml-4 mt-1">
                                      {selectedPrize.tourPackage.inclusions.map((inclusion: string, idx: number) => (
                                        <li key={idx}>{inclusion}</li>
                                      ))}
                                    </ul>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>

                          {selectedPrize?.preferredDates && (
                            <div>
                              <Label className="font-semibold">Your Preferences</Label>
                              <div className="space-y-2 text-sm mt-2">
                                <p><strong>Preferred Dates:</strong> {selectedPrize.preferredDates.join(', ')}</p>
                                {selectedPrize.specialRequests && (
                                  <p><strong>Special Requests:</strong> {selectedPrize.specialRequests}</p>
                                )}
                              </div>
                            </div>
                          )}
                        </TabsContent>

                        <TabsContent value="agency" className="space-y-6">
                          {selectedPrize?.assignedAgency ? (
                            <div className="space-y-6">
                              <div className="flex items-start gap-4">
                                <div className="w-16 h-16 rounded-lg bg-slate-100 flex items-center justify-center">
                                  <Briefcase className="h-8 w-8 text-slate-500" />
                                </div>
                                <div className="flex-1">
                                  <h3 className="text-lg font-semibold">{selectedPrize.assignedAgency.name}</h3>
                                  <div className="flex items-center gap-2 mt-1">
                                    <Star className="h-4 w-4 text-yellow-500" />
                                    <span className="text-sm text-slate-600">{selectedPrize.assignedAgency.rating} rating</span>
                                  </div>
                                </div>
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                  <Label className="font-semibold">Contact Information</Label>
                                  <div className="space-y-3 mt-3">
                                    <div className="flex items-center gap-3">
                                      <Mail className="h-4 w-4 text-slate-500" />
                                      <a href={`mailto:${selectedPrize.assignedAgency.email}`} 
                                         className="text-blue-600 hover:underline">
                                        {selectedPrize.assignedAgency.email}
                                      </a>
                                    </div>
                                    <div className="flex items-center gap-3">
                                      <Phone className="h-4 w-4 text-slate-500" />
                                      <a href={`tel:${selectedPrize.assignedAgency.phone}`} 
                                         className="text-blue-600 hover:underline">
                                        {selectedPrize.assignedAgency.phone}
                                      </a>
                                    </div>
                                    <div className="flex items-center gap-3">
                                      <Globe className="h-4 w-4 text-slate-500" />
                                      <a href={selectedPrize.assignedAgency.website} 
                                         target="_blank" 
                                         rel="noopener noreferrer"
                                         className="text-blue-600 hover:underline flex items-center gap-1">
                                        Visit Website
                                        <ExternalLink className="h-3 w-3" />
                                      </a>
                                    </div>
                                  </div>
                                </div>

                                <div>
                                  <Label className="font-semibold">Contact Person</Label>
                                  <div className="space-y-3 mt-3">
                                    <div className="flex items-center gap-3">
                                      <User className="h-4 w-4 text-slate-500" />
                                      <span>{selectedPrize.assignedAgency.contactPersonName}</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                      <Mail className="h-4 w-4 text-slate-500" />
                                      <a href={`mailto:${selectedPrize.assignedAgency.contactPersonEmail}`} 
                                         className="text-blue-600 hover:underline">
                                        {selectedPrize.assignedAgency.contactPersonEmail}
                                      </a>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              <Separator />

                              <div className="space-y-4">
                                <Label className="font-semibold">Send Message to Agency</Label>
                                <div className="space-y-4">
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                      <Label htmlFor="preferred-dates">Preferred Travel Dates</Label>
                                      <Input
                                        id="preferred-dates"
                                        value={preferredDates}
                                        onChange={(e) => setPreferredDates(e.target.value)}
                                        placeholder="e.g., March 15-22, 2025"
                                      />
                                    </div>
                                    <div>
                                      <Label htmlFor="special-requests">Special Requests</Label>
                                      <Input
                                        id="special-requests"
                                        value={specialRequests}
                                        onChange={(e) => setSpecialRequests(e.target.value)}
                                        placeholder="e.g., Vegetarian meals, accessible rooms"
                                      />
                                    </div>
                                  </div>
                                  <div>
                                    <Label htmlFor="message">Message</Label>
                                    <Textarea
                                      id="message"
                                      value={contactMessage}
                                      onChange={(e) => setContactMessage(e.target.value)}
                                      placeholder="Write your message to the travel agency..."
                                      rows={4}
                                    />
                                  </div>
                                  <Button 
                                    onClick={() => contactAgencyMutation.mutate({
                                      prizeId: selectedPrize.id,
                                      message: contactMessage,
                                      dates: preferredDates,
                                      requests: specialRequests
                                    })}
                                    disabled={!contactMessage.trim() || contactAgencyMutation.isPending}
                                    className="btn-lottery"
                                  >
                                    {contactAgencyMutation.isPending ? "Sending..." : "Send Message"}
                                  </Button>
                                </div>
                              </div>
                            </div>
                          ) : (
                            <div className="text-center py-8">
                              <Briefcase className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                              <p className="text-slate-500">No travel agency assigned yet</p>
                            </div>
                          )}
                        </TabsContent>

                        <TabsContent value="communication" className="space-y-6">
                          {selectedPrize?.communicationLog?.length > 0 ? (
                            <div className="space-y-4">
                              <Label className="font-semibold">Communication History</Label>
                              <div className="space-y-4">
                                {selectedPrize.communicationLog.map((comm: any, idx: number) => (
                                  <div key={idx} className={`p-4 rounded-lg ${
                                    comm.from === 'agency' ? 'bg-blue-50 border-l-4 border-blue-500' : 'bg-slate-50 border-l-4 border-slate-400'
                                  }`}>
                                    <div className="flex items-center justify-between mb-2">
                                      <span className="font-medium text-sm">
                                        {comm.from === 'agency' ? '🏢 Travel Agency' : '👤 You'}
                                      </span>
                                      <span className="text-xs text-slate-500">
                                        {formatDate(new Date(comm.date))}
                                      </span>
                                    </div>
                                    <p className="text-sm">{comm.message}</p>
                                  </div>
                                ))}
                              </div>
                            </div>
                          ) : (
                            <div className="text-center py-8">
                              <MessageSquare className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                              <p className="text-slate-500">No communication yet</p>
                            </div>
                          )}
                        </TabsContent>
                      </Tabs>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>

              {winner.assignedAgency && (
                <CardContent className="pt-0">
                  <Separator className="mb-4" />
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <Briefcase className="h-4 w-4 text-slate-500" />
                        <span className="text-sm font-medium">{winner.assignedAgency.name}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3 text-yellow-500" />
                        <span className="text-xs text-slate-600">{winner.assignedAgency.rating}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => window.open(`mailto:${winner.assignedAgency.contactPersonEmail}`, '_blank')}
                      >
                        <Mail className="h-3 w-3 mr-1" />
                        Contact
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => window.open(winner.assignedAgency.website, '_blank')}
                      >
                        <ExternalLink className="h-3 w-3 mr-1" />
                        Website
                      </Button>
                    </div>
                  </div>
                </CardContent>
              )}
            </Card>
          ))}
        </div>

        {prizeWinners.length === 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <Crown className="h-16 w-16 text-slate-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-slate-600 mb-2">No Prizes Yet</h3>
              <p className="text-slate-500 mb-6">
                Keep participating in lotteries and completing missions to win amazing prizes!
              </p>
              <div className="flex justify-center gap-4">
                <Link href="/lotteries">
                  <Button className="btn-lottery">
                    <Award className="mr-2 h-4 w-4" />
                    Browse Lotteries
                  </Button>
                </Link>
                <Link href="/missions">
                  <Button variant="outline">
                    <MapPin className="mr-2 h-4 w-4" />
                    View Missions
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}