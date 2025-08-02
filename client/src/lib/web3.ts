import { createWeb3Modal, defaultConfig } from '@web3modal/ethers';
import { BrowserProvider, Contract, parseEther, formatEther } from 'ethers';

// Web3Modal configuration
const projectId = import.meta.env.VITE_WALLETCONNECT_PROJECT_ID || 'demo-project-id';

const mainnet = {
  chainId: 1,
  name: 'Ethereum',
  currency: 'ETH',
  explorerUrl: 'https://etherscan.io',
  rpcUrl: 'https://eth.rpc.bloxberg.org'
};

const sepolia = {
  chainId: 11155111,
  name: 'Sepolia',
  currency: 'ETH',
  explorerUrl: 'https://sepolia.etherscan.io',
  rpcUrl: 'https://sepolia.rpc.thirdweb.com'
};

const metadata = {
  name: 'TravelLotto DApp',
  description: 'Blockchain-based travel lottery platform',
  url: typeof window !== 'undefined' ? window.location.origin : 'https://localhost:5000',
  icons: ['https://avatars.githubusercontent.com/u/37784886']
};

const config = defaultConfig({
  metadata,
  defaultChainId: 11155111, // Sepolia testnet
  rpcUrl: 'https://sepolia.rpc.thirdweb.com',
  auth: {
    email: false,
    socials: [],
    walletFeatures: true
  }
});

// Create the modal
export const web3Modal = createWeb3Modal({
  ethersConfig: config,
  chains: [sepolia, mainnet],
  projectId,
  enableAnalytics: false,
  enableOnramp: false,
  allowUnsupportedChain: false
});

// Web3 connection state
let provider: BrowserProvider | null = null;
let signer: any = null;
let walletAddress: string | null = null;

// Contract addresses (placeholder - should be deployed contracts)
const LOTTERY_TOKEN_ADDRESS = '0x742d35Cc6634C0532925a3b8D092Fd6cF6D09c0A'; // Example ERC20 token
const LOTTERY_CONTRACT_ADDRESS = '0x742d35Cc6634C0532925a3b8D092Fd6cF6D09c0B'; // Example lottery contract

// ERC20 Token ABI (simplified)
const ERC20_ABI = [
  "function balanceOf(address account) view returns (uint256)",
  "function transfer(address to, uint256 amount) returns (bool)",
  "function approve(address spender, uint256 amount) returns (bool)",
  "function allowance(address owner, address spender) view returns (uint256)"
];

// Lottery Contract ABI (simplified)
const LOTTERY_ABI = [
  "function buyTicket(uint256 lotteryId, uint256[] numbers) payable returns (uint256)",
  "function getTicketPrice(uint256 lotteryId) view returns (uint256)",
  "function getUserTickets(address user, uint256 lotteryId) view returns (uint256[])"
];

export class Web3Service {
  static async connectWallet(): Promise<string | null> {
    try {
      await web3Modal.open();
      
      // For demo purposes, simulate wallet connection without actual provider
      // In production, this would use the real wallet provider
      const mockAddress = '0x742d35Cc6634C0532925a3b8D092Fd6cF6D09c0A';
      walletAddress = mockAddress;
      
      console.log('Simulated wallet connected:', walletAddress);
      return walletAddress;
    } catch (error) {
      console.warn('Wallet connection error:', error);
      return null;
    }
  }

  static async disconnectWallet(): Promise<void> {
    try {
      await web3Modal.close();
      provider = null;
      signer = null;
      walletAddress = null;
    } catch (error) {
      console.warn('Wallet disconnection error:', error);
    }
  }

  static getWalletAddress(): string | null {
    return walletAddress;
  }

  static async getTokenBalance(): Promise<string> {
    try {
      if (!walletAddress) return '0';
      
      // Simulate token balance for demo
      const mockBalance = (Math.random() * 1000).toFixed(2);
      return mockBalance;
    } catch (error) {
      console.warn('Token balance error:', error);
      return '0';
    }
  }

  static async buyLotteryTicket(lotteryId: string, selectedNumbers: number[]): Promise<{ success: boolean; txHash?: string; error?: string }> {
    try {
      if (!signer || !walletAddress) {
        return { success: false, error: 'Wallet not connected' };
      }

      // For demo purposes, we'll simulate the transaction
      // In a real DApp, this would interact with actual smart contracts
      console.log('Simulating lottery ticket purchase:', {
        lotteryId,
        selectedNumbers,
        wallet: walletAddress
      });

      // Simulate transaction delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Generate fake transaction hash
      const txHash = '0x' + Math.random().toString(16).substr(2, 64);
      
      console.log('Simulated transaction successful:', txHash);
      return { success: true, txHash };

    } catch (error) {
      console.warn('Lottery ticket purchase error:', error);
      return { success: false, error: 'Transaction failed' };
    }
  }

  static async approveTokenSpending(amount: string): Promise<boolean> {
    try {
      if (!signer) return false;
      
      const tokenContract = new Contract(LOTTERY_TOKEN_ADDRESS, ERC20_ABI, signer);
      const tx = await tokenContract.approve(LOTTERY_CONTRACT_ADDRESS, parseEther(amount));
      await tx.wait();
      
      return true;
    } catch (error) {
      console.warn('Token approval error:', error);
      return false;
    }
  }

  // Locale-safe number formatting for blockchain values
  static formatTokenAmount(amount: string | number, locale: string = 'en-US'): string {
    try {
      const num = typeof amount === 'string' ? parseFloat(amount) : amount;
      
      // Use explicit locale formatting to avoid browser locale issues
      return new Intl.NumberFormat(locale, {
        minimumFractionDigits: 0,
        maximumFractionDigits: 6,
        useGrouping: true
      }).format(num);
    } catch (error) {
      console.warn('Token formatting error:', error);
      return amount.toString();
    }
  }
}

// Wallet event handling (simplified for demo)
if (typeof window !== 'undefined') {
  try {
    web3Modal.subscribeEvents((event) => {
      console.log('Web3Modal event:', event);
      // Handle wallet connection events here
    });
  } catch (error) {
    console.warn('Web3Modal event subscription error:', error);
  }
}

export default Web3Service;