import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { 
  Target, Calendar as CalendarIcon, Hash, Globe, Mail, 
  Share2, MessageSquare, Copy, Eye, Zap
} from "lucide-react";
import { format } from "date-fns";

const campaignSchema = z.object({
  name: z.string().min(3, "Campaign name must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  campaignType: z.enum(["email", "social_media", "banner", "landing_page", "whatsapp"]),
  targetAudience: z.string().min(5, "Target audience description required"),
  budget: z.number().min(1, "Budget must be greater than 0"),
  startDate: z.date(),
  endDate: z.date(),
  goals: z.object({
    clicks: z.number().min(1, "Click goal required"),
    conversions: z.number().min(1, "Conversion goal required"),
    revenue: z.number().min(1, "Revenue goal required")
  }),
  tags: z.array(z.string()).min(1, "At least one tag required")
});

type CampaignFormData = z.infer<typeof campaignSchema>;

const campaignTypes = [
  { value: "email", label: "Email Campaign", icon: <Mail className="h-4 w-4" /> },
  { value: "social_media", label: "Social Media", icon: <Share2 className="h-4 w-4" /> },
  { value: "banner", label: "Banner Ads", icon: <Eye className="h-4 w-4" /> },
  { value: "landing_page", label: "Landing Page", icon: <Globe className="h-4 w-4" /> },
  { value: "whatsapp", label: "WhatsApp", icon: <MessageSquare className="h-4 w-4" /> }
];

const predefinedTags = [
  "summer", "winter", "adventure", "luxury", "budget", "family", 
  "solo", "couples", "europe", "asia", "america", "beach", "mountain"
];

interface CampaignCreatorProps {
  onCreateCampaign: (campaign: CampaignFormData) => void;
  onClose: () => void;
}

export default function CampaignCreator({ onCreateCampaign, onClose }: CampaignCreatorProps) {
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [customTag, setCustomTag] = useState("");
  const [generatedLink, setGeneratedLink] = useState("");

  const form = useForm<CampaignFormData>({
    resolver: zodResolver(campaignSchema),
    defaultValues: {
      name: "",
      description: "",
      campaignType: "email",
      targetAudience: "",
      budget: 500,
      startDate: new Date(),
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      goals: {
        clicks: 1000,
        conversions: 50,
        revenue: 5000
      },
      tags: []
    }
  });

  const watchedName = form.watch("name");
  const watchedType = form.watch("campaignType");

  // Generate campaign link when name or type changes
  React.useEffect(() => {
    if (watchedName && watchedType) {
      const slug = watchedName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      const code = `${watchedType.toUpperCase()}-${slug.substring(0, 10)}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
      setGeneratedLink(`https://travellotto.app/join?ref=${code}&campaign=${slug}`);
    }
  }, [watchedName, watchedType]);

  const addTag = (tag: string) => {
    if (tag && !selectedTags.includes(tag)) {
      const newTags = [...selectedTags, tag];
      setSelectedTags(newTags);
      form.setValue("tags", newTags);
    }
  };

  const removeTag = (tag: string) => {
    const newTags = selectedTags.filter(t => t !== tag);
    setSelectedTags(newTags);
    form.setValue("tags", newTags);
  };

  const addCustomTag = () => {
    if (customTag.trim()) {
      addTag(customTag.trim().toLowerCase());
      setCustomTag("");
    }
  };

  const onSubmit = (data: CampaignFormData) => {
    onCreateCampaign({ ...data, tags: selectedTags });
  };

  const copyLink = async () => {
    if (generatedLink) {
      await navigator.clipboard.writeText(generatedLink);
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="h-5 w-5 text-green-600" />
          Create New Campaign
        </CardTitle>
        <CardDescription>
          Set up a new marketing campaign with tracking and performance goals
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Campaign Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Summer Adventure 2025" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="campaignType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Campaign Type</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select campaign type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {campaignTypes.map((type) => (
                            <SelectItem key={type.value} value={type.value}>
                              <div className="flex items-center gap-2">
                                {type.icon}
                                {type.label}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Describe your campaign objectives and strategy..."
                          className="min-h-[100px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="targetAudience"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Target Audience</FormLabel>
                      <FormControl>
                        <Input placeholder="Adventure travelers aged 25-45 interested in Europe..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Campaign Settings */}
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="budget"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Budget ($)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          placeholder="500"
                          {...field}
                          onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="startDate"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Start Date</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="outline"
                                className={`w-full pl-3 text-left font-normal ${!field.value && "text-muted-foreground"}`}
                              >
                                {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              disabled={(date) => date < new Date()}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="endDate"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>End Date</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="outline"
                                className={`w-full pl-3 text-left font-normal ${!field.value && "text-muted-foreground"}`}
                              >
                                {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              disabled={(date) => date < form.getValues("startDate")}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Campaign Goals */}
                <div className="space-y-3">
                  <Label>Campaign Goals</Label>
                  <div className="grid grid-cols-3 gap-3">
                    <FormField
                      control={form.control}
                      name="goals.clicks"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs">Clicks</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              placeholder="1000"
                              {...field}
                              onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="goals.conversions"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs">Conversions</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              placeholder="50"
                              {...field}
                              onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="goals.revenue"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs">Revenue ($)</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              placeholder="5000"
                              {...field}
                              onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Tags Section */}
            <div className="space-y-3">
              <Label>Campaign Tags</Label>
              <div className="flex flex-wrap gap-2 mb-3">
                {selectedTags.map((tag) => (
                  <Badge 
                    key={tag} 
                    variant="secondary" 
                    className="cursor-pointer"
                    onClick={() => removeTag(tag)}
                  >
                    {tag} ×
                  </Badge>
                ))}
              </div>
              <div className="flex flex-wrap gap-2 mb-3">
                {predefinedTags.filter(tag => !selectedTags.includes(tag)).map((tag) => (
                  <Badge 
                    key={tag} 
                    variant="outline" 
                    className="cursor-pointer hover:bg-blue-50"
                    onClick={() => addTag(tag)}
                  >
                    + {tag}
                  </Badge>
                ))}
              </div>
              <div className="flex gap-2">
                <Input 
                  placeholder="Add custom tag..."
                  value={customTag}
                  onChange={(e) => setCustomTag(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCustomTag())}
                />
                <Button type="button" variant="outline" onClick={addCustomTag}>
                  <Hash className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Generated Campaign Link */}
            {generatedLink && (
              <div className="space-y-2">
                <Label>Generated Campaign Link</Label>
                <div className="flex gap-2">
                  <Input value={generatedLink} readOnly className="font-mono text-sm" />
                  <Button type="button" variant="outline" onClick={copyLink}>
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex justify-between pt-6">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <div className="flex gap-2">
                <Button type="button" variant="outline">
                  <Eye className="mr-2 h-4 w-4" />
                  Preview
                </Button>
                <Button type="submit" className="bg-green-600 hover:bg-green-700">
                  <Zap className="mr-2 h-4 w-4" />
                  Create Campaign
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}