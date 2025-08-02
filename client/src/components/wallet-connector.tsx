import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Wallet, Unlink, Coins } from "lucide-react";
import Web3Service from "@/lib/web3";

interface WalletConnectorProps {
  onWalletChange?: (address: string | null) => void;
}

export const WalletConnector: React.FC<WalletConnectorProps> = ({
  onWalletChange
}) => {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [tokenBalance, setTokenBalance] = useState<string>('0');
  const [isConnecting, setIsConnecting] = useState(false);
  const [isDisconnecting, setIsDisconnecting] = useState(false);

  // Check wallet connection status on mount
  useEffect(() => {
    const address = Web3Service.getWalletAddress();
    setWalletAddress(address);
    if (address) {
      updateTokenBalance();
    }
  }, []);

  const updateTokenBalance = async () => {
    try {
      const balance = await Web3Service.getTokenBalance();
      setTokenBalance(balance);
    } catch (error) {
      console.warn('Failed to update token balance:', error);
    }
  };

  const handleConnect = async () => {
    setIsConnecting(true);
    try {
      const address = await Web3Service.connectWallet();
      setWalletAddress(address);
      onWalletChange?.(address);
      
      if (address) {
        await updateTokenBalance();
      }
    } catch (error) {
      console.warn('Wallet connection failed:', error);
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDisconnect = async () => {
    setIsDisconnecting(true);
    try {
      await Web3Service.disconnectWallet();
      setWalletAddress(null);
      setTokenBalance('0');
      onWalletChange?.(null);
    } catch (error) {
      console.warn('Wallet disconnection failed:', error);
    } finally {
      setIsDisconnecting(false);
    }
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <Card className="w-full max-w-sm border-2 border-adventure-teal shadow-lg bg-gradient-to-r from-adventure-teal/5 to-ocean-pulse/5">
      <CardHeader className="pb-3 bg-gradient-to-r from-adventure-teal/10 to-ocean-pulse/10">
        <CardTitle className="flex items-center gap-2 text-lg font-bold text-adventure-teal">
          <Wallet className="h-5 w-5" />
          Web3 Wallet
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {!walletAddress ? (
          <div className="space-y-3">
            <p className="text-sm text-slate-600">
              Connect your wallet to participate in blockchain lotteries and earn tokens.
            </p>
            <Button
              onClick={handleConnect}
              disabled={isConnecting}
              className="w-full btn-lottery gap-2"
              data-testid="connect-wallet-button"
            >
              <Wallet className="h-4 w-4" />
              {isConnecting ? 'Connecting...' : 'Connect Wallet'}
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="p-3 bg-slate-50 rounded-lg">
              <div className="font-medium text-sm mb-1">Connected Wallet</div>
              <Badge variant="secondary" className="bg-adventure-teal text-white">
                {formatAddress(walletAddress)}
              </Badge>
            </div>
            
            <div className="p-3 bg-slate-50 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="font-medium text-sm">Token Balance</div>
                <div className="flex items-center gap-1">
                  <Coins className="h-4 w-4 text-lottery-gold" />
                  <span className="font-bold text-lottery-gold">
                    {Web3Service.formatTokenAmount(tokenBalance)}
                  </span>
                </div>
              </div>
            </div>

            <Button
              onClick={handleDisconnect}
              disabled={isDisconnecting}
              variant="outline"
              className="w-full gap-2"
              data-testid="disconnect-wallet-button"
            >
              <Unlink className="h-4 w-4" />
              {isDisconnecting ? 'Disconnecting...' : 'Disconnect'}
            </Button>
          </div>
        )}

        <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm">
          <div className="font-medium text-blue-800 mb-1">ℹ️ DApp Features</div>
          <div className="text-blue-700">
            {walletAddress 
              ? 'Your lottery tickets will be stored on the blockchain as NFTs.'
              : 'Connect to unlock blockchain lottery tickets and token rewards.'
            }
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WalletConnector;