import { Facebook, Twitter, Linkedin } from "lucide-react";
import { Link } from "wouter";

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-2xl font-bold mb-4" data-testid="footer-logo">TravelLotto</h3>
            <p className="text-slate-400 mb-4">
              Blockchain-powered travel lottery platform. Win amazing travel experiences through missions and lotteries.
            </p>
            <div className="flex space-x-4">
              <a
                href="#"
                className="text-slate-400 hover:text-white transition-colors"
                data-testid="link-facebook"
              >
                <Facebook size={20} />
              </a>
              <a
                href="#"
                className="text-slate-400 hover:text-white transition-colors"
                data-testid="link-twitter"
              >
                <Twitter size={20} />
              </a>
              <a
                href="#"
                className="text-slate-400 hover:text-white transition-colors"
                data-testid="link-linkedin"
              >
                <Linkedin size={20} />
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Platform</h4>
            <ul className="space-y-2 text-slate-400">
              <li>
                <Link href="/lotteries" className="hover:text-white transition-colors" data-testid="footer-link-lotteries">
                  Travel Lotteries
                </Link>
              </li>
              <li>
                <Link href="/missions" className="hover:text-white transition-colors" data-testid="footer-link-missions">
                  Missions & Rewards
                </Link>
              </li>
              <li>
                <Link href="/marketplace" className="hover:text-white transition-colors" data-testid="footer-link-marketplace">
                  Prize Marketplace
                </Link>
              </li>
              <li>
                <Link href="/token-shop" className="hover:text-white transition-colors" data-testid="footer-link-tokens">
                  Buy Tokens
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Account</h4>
            <ul className="space-y-2 text-slate-400">
              <li>
                <Link href="/dashboard" className="hover:text-white transition-colors" data-testid="footer-link-dashboard">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link href="/verification-demo" className="hover:text-white transition-colors" data-testid="footer-link-verification">
                  Mission Verification
                </Link>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors" data-testid="footer-link-wallet">
                  Wallet Connection
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors" data-testid="footer-link-support">
                  Support Center
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Legal & Support</h4>
            <ul className="space-y-2 text-slate-400">
              <li>
                <Link href="/service-conditions" className="hover:text-white transition-colors" data-testid="footer-link-service-dashboard">
                  Service Dashboard
                </Link>
              </li>
              <li>
                <Link href="/privacy-policy" className="hover:text-white transition-colors" data-testid="footer-link-privacy">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms-of-service" className="hover:text-white transition-colors" data-testid="footer-link-terms">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/operating-conditions" className="hover:text-white transition-colors" data-testid="footer-link-operations">
                  Operating Conditions
                </Link>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors" data-testid="footer-link-help">
                  Help Center
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 mt-8 pt-8">
          <div className="grid md:grid-cols-2 gap-8 mb-6">
            <div>
              <h4 className="font-semibold mb-4 text-white">Platform Features</h4>
              <ul className="space-y-2 text-slate-400 text-sm">
                <li>✓ Blockchain-verified lottery drawings with unique codes</li>
                <li>✓ QR code verification for winning tickets</li>
                <li>✓ Multi-language support (English, Spanish, Portuguese)</li>
                <li>✓ Secure token-based economy</li>
                <li>✓ Real travel packages and experiences</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-white">Current Destinations</h4>
              <ul className="space-y-2 text-slate-400 text-sm">
                <li>🏝️ Bali Cultural Immersion - 8 days</li>
                <li>🏔️ Patagonia Wilderness - 10 days</li>
                <li>🏜️ Morocco Desert & Cities - 12 days</li>
              </ul>
            </div>
          </div>
          <div className="text-center text-slate-400">
            <p data-testid="footer-copyright">&copy; 2025 TravelLotto. All rights reserved. | Blockchain-powered travel experiences.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
