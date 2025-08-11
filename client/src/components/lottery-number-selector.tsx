import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shuffle, Sparkles, Trophy } from 'lucide-react';

interface LotteryNumberSelectorProps {
  onNumbersSelected: (numbers: number[]) => void;
  maxNumbers?: number;
  numberRange?: { min: number; max: number };
  selectedNumbers?: number[];
}

export default function LotteryNumberSelector({
  onNumbersSelected,
  maxNumbers = 6,
  numberRange = { min: 1, max: 49 },
  selectedNumbers = []
}: LotteryNumberSelectorProps) {
  const [selected, setSelected] = useState<number[]>(selectedNumbers);
  const [animatingNumbers, setAnimatingNumbers] = useState<Set<number>>(new Set());
  const [isQuickPicking, setIsQuickPicking] = useState(false);

  // Remove automatic notification - only notify when explicitly adding to cart

  const handleNumberClick = (number: number) => {
    try {
      // Add animation effect
      setAnimatingNumbers(prev => new Set(prev).add(number));
      setTimeout(() => {
        setAnimatingNumbers(prev => {
          const newSet = new Set(prev);
          newSet.delete(number);
          return newSet;
        });
      }, 500);

      let newSelected: number[];
      if (selected.includes(number)) {
        newSelected = selected.filter(n => n !== number);
      } else if (selected.length < maxNumbers) {
        newSelected = [...selected, number].sort((a, b) => a - b);
      } else {
        return; // Don't allow more than maxNumbers
      }
      
      setSelected(newSelected);
    } catch (error) {
      console.error('Error in handleNumberClick:', error);
    }
  };

  const generateRandomNumbers = () => {
    try {
      setIsQuickPicking(true);
      setSelected([]);
      
      const randomNumbers: number[] = [];
      while (randomNumbers.length < maxNumbers) {
        const randomNum = Math.floor(Math.random() * (numberRange.max - numberRange.min + 1)) + numberRange.min;
        if (!randomNumbers.includes(randomNum)) {
          randomNumbers.push(randomNum);
        }
      }
      
      const sortedNumbers = randomNumbers.sort((a, b) => a - b);
      
      // Set all numbers at once instead of animating each individually to avoid conflicts
      setTimeout(() => {
        setSelected(sortedNumbers);
        setIsQuickPicking(false);
      }, 300);
      
    } catch (error) {
      console.error('Error in generateRandomNumbers:', error);
      setIsQuickPicking(false);
    }
  };

  const clearSelection = () => {
    try {
      setSelected([]);
      setAnimatingNumbers(new Set());
    } catch (error) {
      console.error('Error in clearSelection:', error);
    }
  };

  // Generate number grid
  const numbers = [];
  for (let i = numberRange.min; i <= numberRange.max; i++) {
    numbers.push(i);
  }

  const progressPercentage = (selected.length / maxNumbers) * 100;

  return (
    <div className="w-full max-w-5xl mx-auto">
      <Card className="bg-white shadow-2xl border-0 overflow-hidden">
        {/* Header with gradient background */}
        <CardHeader className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative z-10">
            <CardTitle className="flex items-center justify-between text-2xl">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 bg-white/20 rounded-full flex items-center justify-center">
                  <Trophy className="h-6 w-6" />
                </div>
                <div>
                  <div className="text-2xl font-bold">🎰 The Lottery House</div>
                  <div className="text-sm opacity-90">Pick your lucky numbers!</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold">{selected.length}/{maxNumbers}</div>
                <div className="text-sm opacity-90">Selected</div>
              </div>
            </CardTitle>
            
            {/* Progress bar */}
            <div className="mt-4 bg-white/20 rounded-full h-3 overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-yellow-400 to-orange-400 transition-all duration-700 ease-out"
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-8 bg-gradient-to-br from-gray-50 to-blue-50">
          {/* Selected Numbers Display */}
          <div className="mb-8 p-6 bg-white rounded-2xl shadow-lg border-2 border-blue-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-yellow-500" />
                Your Lucky Numbers
              </h3>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={generateRandomNumbers}
                  disabled={isQuickPicking}
                  className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white border-0 hover:from-yellow-500 hover:to-orange-500 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  <Shuffle className="w-4 h-4 mr-2" />
                  {isQuickPicking ? "Picking..." : "🎲 Quick Pick"}
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={clearSelection}
                  className="border-red-300 text-red-600 hover:bg-red-50 transition-all duration-300"
                >
                  Clear All
                </Button>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-3 min-h-[60px] items-center">
              {selected.length === 0 ? (
                <div className="text-gray-400 text-lg italic">Click numbers below to select</div>
              ) : (
                selected.map((num, index) => (
                  <div
                    key={num}
                    className="relative animate-in slide-in-from-bottom-2 duration-300"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <Badge 
                      className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-white text-lg font-bold shadow-lg border-2 border-white flex items-center justify-center transform hover:scale-110 transition-all duration-300"
                    >
                      {num}
                    </Badge>
                  </div>
                ))
              )}
            </div>
            
            {selected.length > 0 && selected.length < maxNumbers && (
              <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                <div className="text-sm text-blue-700 font-medium">
                  💡 Select {maxNumbers - selected.length} more number{maxNumbers - selected.length === 1 ? '' : 's'} to complete your ticket
                </div>
              </div>
            )}
          </div>

          {/* Number Grid */}
          <div className="mb-8">
            <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">
              Choose Your Numbers (1-{numberRange.max})
            </h3>
            <div className="grid grid-cols-7 gap-3 max-w-4xl mx-auto">
              {numbers.map((number) => {
                const isSelected = selected.includes(number);
                const isAnimating = animatingNumbers.has(number);
                const isDisabled = !isSelected && selected.length >= maxNumbers;
                
                return (
                  <div
                    key={number}
                    className={`
                      relative h-16 w-16 mx-auto cursor-pointer
                      ${isDisabled ? 'cursor-not-allowed' : 'cursor-pointer'}
                    `}
                    onClick={() => !isDisabled && handleNumberClick(number)}
                  >
                    {/* Lottery Ball */}
                    <div
                      className={`
                        h-16 w-16 rounded-full flex items-center justify-center text-lg font-bold
                        transition-all duration-300 transform relative overflow-hidden
                        ${isSelected 
                          ? 'bg-gradient-to-br from-yellow-400 via-orange-500 to-red-500 text-white shadow-2xl scale-110 border-4 border-yellow-200' 
                          : isDisabled
                          ? 'bg-gray-200 text-gray-400 shadow-sm'
                          : 'bg-gradient-to-br from-white to-gray-100 text-gray-800 shadow-lg hover:shadow-xl hover:scale-105 border-2 border-gray-200 hover:border-blue-300'
                        }
                        ${isAnimating ? 'animate-bounce scale-125' : ''}
                        ${!isDisabled && !isSelected ? 'hover:bg-gradient-to-br hover:from-blue-100 hover:to-purple-100' : ''}
                      `}
                    >
                      {/* Shine effect for selected numbers */}
                      {isSelected && (
                        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/30 to-transparent opacity-60 rounded-full"></div>
                      )}
                      
                      {/* Number */}
                      <span className="relative z-10">{number}</span>
                      
                      {/* Selection indicator */}
                      {isSelected && (
                        <div className="absolute -top-1 -right-1 h-6 w-6 bg-green-500 rounded-full flex items-center justify-center border-2 border-white">
                          <span className="text-white text-xs font-bold">✓</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Action Button */}
          {selected.length === maxNumbers && (
            <div className="text-center animate-in slide-in-from-bottom-4 duration-500">
              <div className="mb-4 p-4 bg-green-50 rounded-xl border-2 border-green-200">
                <div className="text-green-800 font-bold text-lg">🎉 Perfect! All numbers selected!</div>
                <div className="text-green-600 text-sm">Ready to add this ticket to your cart</div>
              </div>
              
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white px-12 py-4 text-xl font-bold rounded-2xl shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300 border-0"
                onClick={() => {
                  try {
                    if (onNumbersSelected && selected.length === maxNumbers) {
                      console.log('Adding ticket with numbers:', selected);
                      onNumbersSelected([...selected]); // Create a copy to avoid reference issues
                      setSelected([]);
                      setAnimatingNumbers(new Set()); // Clear animations
                    }
                  } catch (error) {
                    console.error('Error adding ticket to cart:', error);
                  }
                }}
              >
                <Trophy className="mr-3 h-6 w-6" />
                🎟️ Add Ticket to Cart
                <Sparkles className="ml-3 h-6 w-6" />
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Instructions */}
      <div className="mt-6 text-center">
        <div className="inline-block p-4 bg-white rounded-xl shadow-lg border border-gray-200">
          <div className="text-sm text-gray-600 max-w-2xl">
            🎯 <strong>How to play:</strong> Select {maxNumbers} numbers from 1 to {numberRange.max}. 
            Click the "🎲 Quick Pick" button for random numbers, or choose your own lucky combination!
          </div>
        </div>
      </div>
    </div>
  );
}