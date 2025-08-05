import { nanoid } from "nanoid";

/**
 * Utility functions for generating lottery drawing codes and QR codes
 */

// Generate human-readable lottery code (e.g., "LT2025-001")
export function generateLotteryCode(): string {
  const year = new Date().getFullYear();
  const sequence = Math.floor(Math.random() * 999) + 1;
  return `LT${year}-${sequence.toString().padStart(3, '0')}`;
}

// Generate human-readable draw code (e.g., "DRW-2025-001-TK")
export function generateDrawCode(lotteryCode?: string): string {
  const year = new Date().getFullYear();
  const sequence = Math.floor(Math.random() * 999) + 1;
  const suffix = lotteryCode ? lotteryCode.split('-')[1] || 'TK' : 'TK';
  return `DRW-${year}-${sequence.toString().padStart(3, '0')}-${suffix}`;
}

// Generate human-readable ticket code (e.g., "TK-2025-001-0001")
export function generateTicketCode(lotteryCode?: string): string {
  const year = new Date().getFullYear();
  const lotterySeq = lotteryCode ? lotteryCode.split('-')[1] || '001' : '001';
  const ticketSeq = Math.floor(Math.random() * 9999) + 1;
  return `TK-${year}-${lotterySeq}-${ticketSeq.toString().padStart(4, '0')}`;
}

// Generate verification hash for draw security
export function generateVerificationHash(drawData: any): string {
  const dataString = JSON.stringify(drawData);
  // Simple hash generation - in production, use crypto.createHash
  let hash = 0;
  for (let i = 0; i < dataString.length; i++) {
    const char = dataString.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash).toString(16).toUpperCase();
}

// Generate QR code data for winning tickets
export function generateWinnerQrCode(data: {
  drawCode: string;
  ticketCode: string;
  winnerId: string;
  verificationHash: string;
  drawnAt: Date;
}): string {
  const qrData = {
    type: 'LOTTERY_WINNER',
    drawCode: data.drawCode,
    ticketCode: data.ticketCode,
    winnerId: data.winnerId,
    verificationHash: data.verificationHash,
    drawnAt: data.drawnAt.toISOString(),
    generatedAt: new Date().toISOString(),
    // Add security signature
    signature: generateVerificationHash({
      drawCode: data.drawCode,
      ticketCode: data.ticketCode,
      winnerId: data.winnerId,
    })
  };
  
  return JSON.stringify(qrData);
}

// Verify QR code data
export function verifyQrCode(qrCodeData: string): {
  isValid: boolean;
  data?: any;
  error?: string;
} {
  try {
    const data = JSON.parse(qrCodeData);
    
    if (data.type !== 'LOTTERY_WINNER') {
      return { isValid: false, error: 'Invalid QR code type' };
    }
    
    // Verify signature
    const expectedSignature = generateVerificationHash({
      drawCode: data.drawCode,
      ticketCode: data.ticketCode,
      winnerId: data.winnerId,
    });
    
    if (data.signature !== expectedSignature) {
      return { isValid: false, error: 'Invalid QR code signature' };
    }
    
    return { isValid: true, data };
  } catch (error) {
    return { isValid: false, error: 'Invalid QR code format' };
  }
}

// Format display codes for UI
export function formatDisplayCode(code: string, type: 'lottery' | 'draw' | 'ticket'): {
  formatted: string;
  parts: string[];
  description: string;
} {
  const parts = code.split('-');
  
  switch (type) {
    case 'lottery':
      return {
        formatted: code,
        parts,
        description: `Lottery ${parts[0]} • Year ${parts[1]} • Series ${parts[2]}`
      };
    case 'draw':
      return {
        formatted: code,
        parts,
        description: `Drawing ${parts[1]} • Year ${parts[2]} • Series ${parts[3]}`
      };
    case 'ticket':
      return {
        formatted: code,
        parts,
        description: `Ticket ${parts[3]} • Year ${parts[1]} • Lottery ${parts[2]}`
      };
    default:
      return {
        formatted: code,
        parts,
        description: 'Unknown code format'
      };
  }
}