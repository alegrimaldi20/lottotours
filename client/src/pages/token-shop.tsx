import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'wouter';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Star, Coins, ShoppingCart, CreditCard, Zap } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import type { TokenPack } from "@shared/schema";

// Initialize Stripe
if (!import.meta.env.VITE_STRIPE_PUBLIC_KEY) {
  throw new Error('Missing required Stripe key: VITE_STRIPE_PUBLIC_KEY');
}
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

interface CheckoutFormProps {
  tokenPack: TokenPack;
  onSuccess: () => void;
  onCancel: () => void;
}

const CheckoutForm: React.FC<CheckoutFormProps> = ({ tokenPack, onSuccess, onCancel }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setIsProcessing(true);
    setErrorMessage(null);

    try {
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/token-shop?success=true`,
        },
      });

      if (error) {
        setErrorMessage(error.message || 'Payment failed');
      } else {
        onSuccess();
      }
    } catch (err) {
      setErrorMessage('An unexpected error occurred');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <Card className="border-2 border-lottery-gold shadow-lg">
        <CardHeader className="bg-gradient-to-r from-lottery-gold/10 to-lottery-orange/10">
          <CardTitle className="text-center">
            Complete Your Purchase
          </CardTitle>
          <div className="text-center space-y-2">
            <div className="text-2xl font-bold text-lottery-gold">
              {tokenPack.tokenAmount} Tokens
            </div>
            <div className="text-lg text-slate-600">
              ${tokenPack.priceUsd} USD
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <PaymentElement />
            
            {errorMessage && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                {errorMessage}
              </div>
            )}
            
            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                className="flex-1"
                disabled={isProcessing}
                data-testid="cancel-payment-button"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={!stripe || isProcessing}
                className="flex-1 btn-lottery"
                data-testid="confirm-payment-button"
              >
                {isProcessing ? 'Processing...' : `Pay $${tokenPack.priceUsd}`}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default function TokenShop() {
  const queryClient = useQueryClient();
  const [selectedPack, setSelectedPack] = useState<TokenPack | null>(null);
  const [clientSecret, setClientSecret] = useState<string>('');
  const [showCheckout, setShowCheckout] = useState(false);

  // Fetch token packs
  const { data: tokenPacks, isLoading } = useQuery<TokenPack[]>({
    queryKey: ['/api/token-packs'],
    queryFn: () => apiRequest('/api/token-packs').then(res => res.json()),
  });

  // Create payment intent mutation
  const createPaymentMutation = useMutation({
    mutationFn: async (tokenPackId: string) => {
      const response = await apiRequest('/api/create-token-payment-intent', {
        method: 'POST',
        body: { tokenPackId, userId: 'sample-user' }
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Payment creation failed');
      }
      return data;
    },
    onSuccess: (data) => {
      setClientSecret(data.clientSecret);
      setShowCheckout(true);
    },
    onError: (error: any) => {
      console.error('Payment creation failed:', error);
      // Show user-friendly error message
      alert(`Payment system error: ${error.message || 'Unable to create payment. Please try again later.'}`);
    }
  });

  const handlePurchase = (tokenPack: TokenPack) => {
    setSelectedPack(tokenPack);
    createPaymentMutation.mutate(tokenPack.id);
  };

  const handlePaymentSuccess = () => {
    setShowCheckout(false);
    setSelectedPack(null);
    setClientSecret('');
    queryClient.invalidateQueries({ queryKey: ['/api/users'] });
  };

  const handlePaymentCancel = () => {
    setShowCheckout(false);
    setSelectedPack(null);
    setClientSecret('');
  };

  const getPackIcon = (tokenAmount: number) => {
    if (tokenAmount === 54) return <Coins className="h-8 w-8 text-adventure-teal" />;
    if (tokenAmount === 189) return <Star className="h-8 w-8 text-lottery-gold" />;
    return <Zap className="h-8 w-8 text-lottery-purple" />;
  };

  const getPackGradient = (tokenAmount: number) => {
    if (tokenAmount === 54) return "from-adventure-teal/10 to-adventure-cyan/10";
    if (tokenAmount === 189) return "from-lottery-gold/10 to-lottery-orange/10";
    return "from-lottery-purple/10 to-lottery-pink/10";
  };

  if (showCheckout && selectedPack && clientSecret) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 p-4">
        <div className="max-w-6xl mx-auto py-8">
          <div className="text-center mb-8">
            <Link href="/token-shop">
              <Button variant="ghost" className="mb-4">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Token Shop
              </Button>
            </Link>
          </div>
          
          <Elements stripe={stripePromise} options={{ clientSecret }}>
            <CheckoutForm
              tokenPack={selectedPack}
              onSuccess={handlePaymentSuccess}
              onCancel={handlePaymentCancel}
            />
          </Elements>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-lottery-gold via-lottery-orange to-lottery-purple text-white py-16">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <Link href="/dashboard">
            <Button variant="ghost" className="mb-4 text-white hover:bg-white/20">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
          
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Token Shop
          </h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto">
            Purchase token packs to participate in exciting lottery drawings for amazing travel prizes
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto p-4 py-12">
        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin w-8 h-8 border-4 border-lottery-gold border-t-transparent rounded-full mx-auto"></div>
            <p className="mt-4 text-slate-600">Loading token packs...</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-6">
            {tokenPacks?.map((pack) => (
              <Card 
                key={pack.id} 
                className={`relative border-2 hover:shadow-lg transition-all duration-300 ${
                  pack.popularBadge ? 'border-lottery-gold scale-105' : 'border-slate-200'
                }`}
              >
                {pack.popularBadge && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-lottery-gold text-white px-4 py-1">
                      <Star className="h-3 w-3 mr-1" />
                      Most Popular
                    </Badge>
                  </div>
                )}
                
                <CardHeader className={`bg-gradient-to-r ${getPackGradient(pack.tokenAmount)} text-center`}>
                  <div className="flex justify-center mb-3">
                    {getPackIcon(pack.tokenAmount)}
                  </div>
                  <CardTitle className="text-xl font-bold">
                    {pack.name}
                  </CardTitle>
                  <p className="text-slate-600 text-sm">
                    {pack.description}
                  </p>
                </CardHeader>
                
                <CardContent className="text-center space-y-4">
                  <div className="py-4">
                    <div className="text-3xl font-bold text-lottery-gold mb-2">
                      {pack.tokenAmount}
                    </div>
                    <div className="text-lg text-slate-600">
                      Tokens
                    </div>
                  </div>
                  
                  <div className="border-t pt-4">
                    <div className="text-2xl font-bold text-slate-900 mb-4">
                      ${pack.priceUsd} USD
                    </div>
                    <Button
                      onClick={() => handlePurchase(pack)}
                      disabled={createPaymentMutation.isPending}
                      className="w-full btn-lottery gap-2"
                      data-testid={`buy-token-pack-${pack.tokenAmount}`}
                    >
                      <ShoppingCart className="h-4 w-4" />
                      {createPaymentMutation.isPending ? 'Processing...' : 'Purchase Now'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Info Section */}
        <div className="mt-12 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-bold text-blue-900 mb-3">
            <CreditCard className="h-5 w-5 inline mr-2" />
            How Token Purchasing Works
          </h3>
          <div className="text-blue-800 space-y-2">
            <p>• Tokens are used to purchase lottery tickets for amazing travel prizes</p>
            <p>• All payments are securely processed through Stripe</p>
            <p>• Tokens are instantly added to your account after successful payment</p>
            <p>• Your tokens never expire and can be used across all lotteries</p>
          </div>
        </div>
      </div>
    </div>
  );
}