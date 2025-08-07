import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Home, Search, Plane } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="max-w-md w-full px-4">
        <Card className="text-center">
          <CardHeader className="pb-6">
            <div className="mx-auto mb-4">
              <Plane className="h-16 w-16 text-blue-600 mx-auto" />
            </div>
            <CardTitle className="text-3xl font-bold text-gray-900 mb-2">
              Oops! Page Not Found
            </CardTitle>
            <CardDescription className="text-lg">
              Looks like you've wandered off the travel path. Let's get you back on track!
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-4">
            <div className="text-6xl font-bold text-gray-300 mb-6">
              404
            </div>
            
            <div className="space-y-3">
              <Link href="/dashboard">
                <Button className="w-full" data-testid="back-to-dashboard">
                  <Home className="h-4 w-4 mr-2" />
                  Back to Dashboard
                </Button>
              </Link>
              
              <Link href="/lotteries">
                <Button variant="outline" className="w-full" data-testid="view-lotteries">
                  <Search className="h-4 w-4 mr-2" />
                  Browse Lotteries
                </Button>
              </Link>
              
              <Link href="/">
                <Button variant="ghost" className="w-full" data-testid="home-page">
                  Go to Homepage
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}