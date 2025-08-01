import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { type Review, type Service, insertReviewSchema } from "@shared/schema";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Star } from "lucide-react";
import { z } from "zod";

const reviewFormSchema = insertReviewSchema.extend({
  rating: z.number().min(1, "Please select a rating").max(5),
});

type ReviewFormData = z.infer<typeof reviewFormSchema>;

const StarRating = ({ rating, onRatingChange, interactive = false }: { 
  rating: number; 
  onRatingChange?: (rating: number) => void;
  interactive?: boolean;
}) => {
  const [hoverRating, setHoverRating] = useState(0);

  return (
    <div className="flex space-x-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type={interactive ? "button" : undefined}
          className={`${interactive ? 'hover:scale-110 transition-transform' : ''}`}
          onClick={interactive ? () => onRatingChange?.(star) : undefined}
          onMouseEnter={interactive ? () => setHoverRating(star) : undefined}
          onMouseLeave={interactive ? () => setHoverRating(0) : undefined}
          disabled={!interactive}
          data-testid={`star-${star}`}
        >
          <Star
            className={`w-5 h-5 ${
              star <= (interactive ? (hoverRating || rating) : rating)
                ? 'text-yellow-400 fill-current'
                : 'text-gray-300'
            }`}
          />
        </button>
      ))}
    </div>
  );
};

export default function Reviews() {
  const [selectedRating, setSelectedRating] = useState<number>(0);
  const { toast } = useToast();

  const { data: reviews, isLoading: reviewsLoading } = useQuery<Review[]>({
    queryKey: ["/api/reviews"],
  });

  const { data: services } = useQuery<Service[]>({
    queryKey: ["/api/services"],
  });

  const form = useForm<ReviewFormData>({
    resolver: zodResolver(reviewFormSchema),
    defaultValues: {
      reviewerName: "",
      serviceId: "",
      rating: 0,
      content: "",
    },
  });

  const createReviewMutation = useMutation({
    mutationFn: async (data: ReviewFormData) => {
      const response = await apiRequest("POST", "/api/reviews", data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Review Submitted!",
        description: "Thank you for sharing your experience.",
      });
      form.reset();
      setSelectedRating(0);
      queryClient.invalidateQueries({ queryKey: ["/api/reviews"] });
    },
    onError: () => {
      toast({
        title: "Submission Failed",
        description: "Please check your information and try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: ReviewFormData) => {
    createReviewMutation.mutate({ ...data, rating: selectedRating });
  };

  const handleRatingChange = (rating: number) => {
    setSelectedRating(rating);
    form.setValue("rating", rating);
  };

  const averageRating = reviews?.length 
    ? (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1)
    : "0.0";

  return (
    <section id="reviews" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4" data-testid="reviews-title">
            What Our Clients Say
          </h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto" data-testid="reviews-subtitle">
            Join thousands of satisfied clients who trust us with their professional needs.
          </p>
        </div>

        {/* Review Stats */}
        <div className="bg-slate-50 rounded-xl p-8 mb-12">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-primary-custom" data-testid="stat-total-reviews">
                {reviews?.length || 0}+
              </div>
              <div className="text-slate-600">Total Reviews</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary-custom" data-testid="stat-average-rating">
                {averageRating}
              </div>
              <div className="text-slate-600">Average Rating</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary-custom" data-testid="stat-response-rate">
                98%
              </div>
              <div className="text-slate-600">Response Rate</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary-custom" data-testid="stat-satisfaction-rate">
                95%
              </div>
              <div className="text-slate-600">Client Satisfaction</div>
            </div>
          </div>
        </div>

        {/* Reviews Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {reviewsLoading ? (
            Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="bg-slate-50 rounded-xl p-6 border border-slate-200 animate-pulse">
                <div className="h-4 bg-slate-200 rounded mb-4"></div>
                <div className="h-20 bg-slate-200 rounded mb-4"></div>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-slate-200 rounded-full mr-3"></div>
                  <div>
                    <div className="h-4 w-24 bg-slate-200 rounded mb-1"></div>
                    <div className="h-3 w-20 bg-slate-200 rounded"></div>
                  </div>
                </div>
              </div>
            ))
          ) : reviews?.length ? (
            reviews.slice(0, 6).map((review) => {
              const service = services?.find(s => s.id === review.serviceId);
              return (
                <div key={review.id} className="bg-slate-50 rounded-xl p-6 border border-slate-200" data-testid={`review-${review.id}`}>
                  <div className="flex items-center mb-4">
                    <StarRating rating={review.rating} />
                    <span className="text-sm text-slate-500 ml-3" data-testid={`review-date-${review.id}`}>
                      {new Date(review.createdAt!).toLocaleDateString('en-US', {
                        month: 'short',
                        year: 'numeric'
                      })}
                    </span>
                  </div>
                  <p className="text-slate-700 mb-4" data-testid={`review-content-${review.id}`}>
                    "{review.content}"
                  </p>
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-primary-custom rounded-full flex items-center justify-center text-white font-semibold mr-3">
                      {review.reviewerName.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="font-medium text-slate-900" data-testid={`review-author-${review.id}`}>
                        {review.reviewerName}
                      </div>
                      <div className="text-sm text-slate-500" data-testid={`review-service-${review.id}`}>
                        {service?.name || 'Service'}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="col-span-3 text-center py-12">
              <p className="text-slate-500 text-lg">No reviews yet. Be the first to share your experience!</p>
            </div>
          )}
        </div>

        {/* Write Review Form */}
        <div className="bg-slate-50 rounded-xl p-8">
          <h3 className="text-2xl font-semibold text-slate-900 mb-6" data-testid="review-form-title">
            Share Your Experience
          </h3>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="reviewerName" className="block text-sm font-semibold text-slate-700 mb-2">
                  Your Name
                </Label>
                <Input
                  id="reviewerName"
                  {...form.register("reviewerName")}
                  placeholder="Enter your name"
                  data-testid="input-reviewer-name"
                />
                {form.formState.errors.reviewerName && (
                  <p className="text-sm text-red-500 mt-1">{form.formState.errors.reviewerName.message}</p>
                )}
              </div>
              <div>
                <Label className="block text-sm font-semibold text-slate-700 mb-2">
                  Service Used
                </Label>
                <Select onValueChange={(value) => form.setValue("serviceId", value)}>
                  <SelectTrigger data-testid="select-review-service">
                    <SelectValue placeholder="Select service" />
                  </SelectTrigger>
                  <SelectContent>
                    {services?.map((service) => (
                      <SelectItem key={service.id} value={service.id} data-testid={`service-option-${service.id}`}>
                        {service.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {form.formState.errors.serviceId && (
                  <p className="text-sm text-red-500 mt-1">{form.formState.errors.serviceId.message}</p>
                )}
              </div>
            </div>

            <div>
              <Label className="block text-sm font-semibold text-slate-700 mb-2">
                Rating
              </Label>
              <StarRating 
                rating={selectedRating} 
                onRatingChange={handleRatingChange}
                interactive={true}
              />
              {form.formState.errors.rating && (
                <p className="text-sm text-red-500 mt-1">{form.formState.errors.rating.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="content" className="block text-sm font-semibold text-slate-700 mb-2">
                Your Review
              </Label>
              <Textarea
                id="content"
                {...form.register("content")}
                rows={4}
                placeholder="Share your experience with our service..."
                data-testid="input-review-content"
              />
              {form.formState.errors.content && (
                <p className="text-sm text-red-500 mt-1">{form.formState.errors.content.message}</p>
              )}
            </div>

            <Button
              type="submit"
              disabled={createReviewMutation.isPending}
              className="bg-primary-custom text-white px-8 py-3 rounded-lg font-semibold hover:bg-secondary-custom transition-colors"
              data-testid="button-submit-review"
            >
              {createReviewMutation.isPending ? "Submitting..." : "Submit Review"}
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
}
