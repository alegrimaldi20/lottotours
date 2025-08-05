import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LotteryDrawDisplay } from "@/components/lottery-draw-display"
import { QRVerification } from "@/components/qr-verification"
import { Search, Hash, QrCode, Trophy, Ticket } from "lucide-react"

export default function LotteryVerification() {
  const [searchQuery, setSearchQuery] = useState("")
  const [searchType, setSearchType] = useState<"draw" | "lottery">("draw")
  const [activeCode, setActiveCode] = useState<string>("")

  const handleSearch = () => {
    if (searchQuery.trim()) {
      setActiveCode(searchQuery.trim())
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  const sampleCodes = {
    draw: ["DRW-2025-001-TK", "DRW-2025-002-TK", "DRW-2025-003-TK"],
    lottery: ["LT2025-001", "LT2025-002", "LT2025-003", "LT2025-004"]
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
          Lottery Verification System
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Verify lottery drawings, check winning tickets, and validate QR codes for secure and transparent lottery operations
        </p>
      </div>

      <Tabs defaultValue="search" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="search" className="flex items-center gap-2">
            <Search className="h-4 w-4" />
            Code Search
          </TabsTrigger>
          <TabsTrigger value="qr" className="flex items-center gap-2">
            <QrCode className="h-4 w-4" />
            QR Verification
          </TabsTrigger>
        </TabsList>

        <TabsContent value="search" className="space-y-6">
          <Card data-testid="search-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Hash className="h-5 w-5" />
                Search by Code
              </CardTitle>
              <CardDescription>
                Enter a draw code (e.g., DRW-2025-001-TK) or lottery code (e.g., LT2025-001) to view details
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Badge 
                  variant={searchType === "draw" ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => setSearchType("draw")}
                  data-testid="badge-draw-search"
                >
                  <Trophy className="h-3 w-3 mr-1" />
                  Draw Code
                </Badge>
                <Badge 
                  variant={searchType === "lottery" ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => setSearchType("lottery")}
                  data-testid="badge-lottery-search"
                >
                  <Ticket className="h-3 w-3 mr-1" />
                  Lottery Code
                </Badge>
              </div>

              <div className="flex gap-2">
                <Input
                  data-testid="input-search-code"
                  placeholder={searchType === "draw" ? "Enter draw code (e.g., DRW-2025-001-TK)" : "Enter lottery code (e.g., LT2025-001)"}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="font-mono"
                />
                <Button 
                  data-testid="button-search"
                  onClick={handleSearch}
                  disabled={!searchQuery.trim()}
                >
                  Search
                </Button>
              </div>

              <div className="space-y-2">
                <p className="text-sm text-gray-600 dark:text-gray-400">Sample codes to try:</p>
                <div className="flex flex-wrap gap-2">
                  {sampleCodes[searchType].map((code) => (
                    <Badge
                      key={code}
                      variant="outline"
                      className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800"
                      onClick={() => {
                        setSearchQuery(code)
                        setActiveCode(code)
                      }}
                      data-testid={`sample-code-${code}`}
                    >
                      {code}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {activeCode && (
            <LotteryDrawDisplay
              drawCode={searchType === "draw" ? activeCode : undefined}
              lotteryCode={searchType === "lottery" ? activeCode : undefined}
              showFullDetails={true}
            />
          )}
        </TabsContent>

        <TabsContent value="qr" className="space-y-6">
          <QRVerification />
        </TabsContent>
      </Tabs>
    </div>
  )
}