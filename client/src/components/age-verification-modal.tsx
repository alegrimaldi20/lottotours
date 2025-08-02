import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { AlertTriangle, Shield, Calendar, User } from 'lucide-react';

interface AgeVerificationModalProps {
  isOpen: boolean;
  onVerified: () => void;
}

export function AgeVerificationModal({ isOpen, onVerified }: AgeVerificationModalProps) {
  const [birthDate, setBirthDate] = useState('');
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [acknowledgedRisks, setAcknowledgedRisks] = useState(false);
  const [error, setError] = useState('');

  const calculateAge = (birthDate: string) => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    
    return age;
  };

  const handleVerification = () => {
    setError('');
    
    if (!birthDate) {
      setError('Please enter your birth date');
      return;
    }
    
    const age = calculateAge(birthDate);
    
    if (age < 18) {
      setError('You must be 18 or older to use this platform');
      return;
    }
    
    if (!agreedToTerms) {
      setError('Please agree to the terms and conditions');
      return;
    }
    
    if (!acknowledgedRisks) {
      setError('Please acknowledge the gaming risks');
      return;
    }
    
    localStorage.setItem('ageVerified', 'true');
    localStorage.setItem('verificationDate', new Date().toISOString());
    onVerified();
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent className="max-w-md mx-auto bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 border-2 border-gold-400 text-white">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl font-bold text-gold-400">
            <Shield className="w-6 h-6" />
            Age Verification Required
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="bg-red-900/30 border border-red-500 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-6 h-6 text-red-400 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-red-400 mb-2">Important Gaming Notice</h3>
                <ul className="text-sm space-y-1 text-red-200">
                  <li>• This platform involves real money transactions</li>
                  <li>• Gaming can be addictive and cause financial loss</li>
                  <li>• Only spend what you can afford to lose</li>
                  <li>• Seek help if gambling becomes problematic</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <Label htmlFor="birthDate" className="flex items-center gap-2 text-gold-300">
                <Calendar className="w-4 h-4" />
                Date of Birth
              </Label>
              <Input
                id="birthDate"
                type="date"
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
                className="bg-gray-800/50 border-gray-600 text-white"
                max={new Date().toISOString().split('T')[0]}
              />
            </div>

            <div className="space-y-3">
              <div className="flex items-start space-x-2">
                <Checkbox
                  id="terms"
                  checked={agreedToTerms}
                  onCheckedChange={(checked) => setAgreedToTerms(checked as boolean)}
                  className="border-gold-400 data-[state=checked]:bg-gold-500"
                />
                <Label htmlFor="terms" className="text-sm leading-relaxed">
                  I agree to the Terms of Service and Privacy Policy, and confirm I am legally permitted to participate in gaming activities in my jurisdiction.
                </Label>
              </div>

              <div className="flex items-start space-x-2">
                <Checkbox
                  id="risks"
                  checked={acknowledgedRisks}
                  onCheckedChange={(checked) => setAcknowledgedRisks(checked as boolean)}
                  className="border-gold-400 data-[state=checked]:bg-gold-500"
                />
                <Label htmlFor="risks" className="text-sm leading-relaxed">
                  I acknowledge the risks of gaming and confirm I will only spend money I can afford to lose.
                </Label>
              </div>
            </div>

            {error && (
              <div className="bg-red-900/50 border border-red-500 rounded p-3 text-red-200 text-sm">
                {error}
              </div>
            )}

            <Button
              onClick={handleVerification}
              className="w-full bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-600 hover:to-gold-700 text-black font-semibold"
              data-testid="button-verify-age"
            >
              <User className="w-4 h-4 mr-2" />
              Verify Age & Enter Platform
            </Button>
          </div>

          <div className="text-xs text-gray-400 text-center space-y-1">
            <p>Problem Gambling Resources:</p>
            <p>🇺🇸 National Problem Gambling Helpline: 1-800-522-4700</p>
            <p>🌍 BeGambleAware.org • GamCare.org.uk</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}