import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shuffle } from 'lucide-react';

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

  // Removed automatic callback to prevent infinite loops

  const handleNumberClick = (number: number) => {
    if (selected.includes(number)) {
      setSelected(selected.filter(n => n !== number));
    } else if (selected.length < maxNumbers) {
      setSelected([...selected, number].sort((a, b) => a - b));
    }
  };

  const generateRandomNumbers = () => {
    const randomNumbers: number[] = [];
    while (randomNumbers.length < maxNumbers) {
      const randomNum = Math.floor(Math.random() * (numberRange.max - numberRange.min + 1)) + numberRange.min;
      if (!randomNumbers.includes(randomNum)) {
        randomNumbers.push(randomNum);
      }
    }
    const newNumbers = randomNumbers.sort((a, b) => a - b);
    setSelected(newNumbers);
  };

  const clearSelection = () => {
    setSelected([]);
  };

  // Generate number grid
  const numbers = [];
  for (let i = numberRange.min; i <= numberRange.max; i++) {
    numbers.push(i);
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Select {maxNumbers} Numbers</span>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={generateRandomNumbers}
              className="flex items-center gap-2"
            >
              <Shuffle className="w-4 h-4" />
              Quick Pick
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={clearSelection}
            >
              Clear
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Selected Numbers Display */}
        <div className="flex flex-wrap gap-2 min-h-[40px] items-center">
          <span className="text-sm font-medium text-slate-600">Selected:</span>
          {selected.length === 0 ? (
            <span className="text-slate-400 text-sm">None selected</span>
          ) : (
            selected.map((num) => (
              <Badge 
                key={num} 
                variant="default" 
                className="bg-blue-600 text-white text-base px-3 py-1"
              >
                {num}
              </Badge>
            ))
          )}
          <span className="text-sm text-slate-500 ml-auto">
            {selected.length}/{maxNumbers}
          </span>
        </div>

        {/* Number Grid */}
        <div className="grid grid-cols-7 gap-2">
          {numbers.map((number) => {
            const isSelected = selected.includes(number);
            const isDisabled = !isSelected && selected.length >= maxNumbers;
            
            return (
              <Button
                key={number}
                variant={isSelected ? "default" : "outline"}
                size="sm"
                onClick={() => handleNumberClick(number)}
                disabled={isDisabled}
                className={`
                  h-12 w-12 text-base font-medium
                  ${isSelected 
                    ? 'bg-blue-600 text-white border-blue-600 hover:bg-blue-700' 
                    : 'hover:bg-slate-50'
                  }
                  ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                `}
              >
                {number}
              </Button>
            );
          })}
        </div>

        {/* Action Buttons */}
        {selected.length === maxNumbers && (
          <div className="flex justify-center">
            <Button 
              size="lg" 
              className="bg-blue-600 hover:bg-blue-700 text-white px-8"
              onClick={() => {
                if (onNumbersSelected && selected.length === maxNumbers) {
                  onNumbersSelected(selected);
                  // Clear selection after adding to cart
                  setSelected([]);
                }
              }}
            >
              Add Ticket to Cart
            </Button>
          </div>
        )}
        
        {/* Instructions */}
        <div className="text-sm text-slate-600 text-center bg-slate-50 p-3 rounded-lg">
          {selected.length < maxNumbers 
            ? `Select ${maxNumbers - selected.length} more number${maxNumbers - selected.length === 1 ? '' : 's'} to complete your ticket`
            : 'Perfect! Click "Add Ticket to Cart" to proceed'
          }
        </div>
      </CardContent>
    </Card>
  );
}