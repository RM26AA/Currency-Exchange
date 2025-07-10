
import { TrendingUp, TrendingDown } from 'lucide-react';

interface Currency {
  code: string;
  name: string;
  symbol: string;
  flag: string;
}

interface CurrencyCardProps {
  currency: Currency;
}

export const CurrencyCard = ({ currency }: CurrencyCardProps) => {
  // Mock data for demonstration
  const change = (Math.random() - 0.5) * 2; // Random change between -1 and 1
  const rate = (1 + Math.random() * 2).toFixed(4); // Random rate between 1 and 3
  const isPositive = change > 0;

  return (
    <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-100 hover:border-blue-300 hover:shadow-md transition-all duration-200 cursor-pointer hover:scale-105">
      <div className="flex items-center gap-3">
        <span className="text-2xl">{currency.flag}</span>
        <div>
          <div className="font-semibold text-gray-800">{currency.code}</div>
          <div className="text-xs text-gray-500">{currency.name}</div>
        </div>
      </div>
      <div className="text-right">
        <div className="font-bold text-gray-800">{rate}</div>
        <div className={`text-xs flex items-center gap-1 ${
          isPositive ? 'text-green-600' : 'text-red-600'
        }`}>
          {isPositive ? (
            <TrendingUp className="h-3 w-3" />
          ) : (
            <TrendingDown className="h-3 w-3" />
          )}
          {Math.abs(change).toFixed(2)}%
        </div>
      </div>
    </div>
  );
};
