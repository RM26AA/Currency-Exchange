
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Crown } from 'lucide-react';

interface Currency {
  code: string;
  name: string;
  symbol: string;
  flag: string;
}

interface TopCurrenciesChartProps {
  currencies: Currency[];
  exchangeRates: Record<string, Record<string, number>>;
}

export const TopCurrenciesChart = ({ currencies, exchangeRates }: TopCurrenciesChartProps) => {
  // Calculate currency strength relative to USD (higher value = stronger)
  const getCurrencyStrength = (currencyCode: string) => {
    if (currencyCode === 'USD') return 1;
    // Get how much 1 USD is worth in this currency
    return exchangeRates['USD']?.[currencyCode] || 0;
  };

  // Create data for top 10 strongest currencies (lowest exchange rate from USD = strongest)
  const topCurrencies = currencies
    .map(currency => ({
      ...currency,
      strength: getCurrencyStrength(currency.code),
      // For display: show value of 1 unit in USD
      valueInUSD: currency.code === 'USD' ? 1 : (1 / getCurrencyStrength(currency.code))
    }))
    .filter(currency => currency.strength > 0)
    .sort((a, b) => b.valueInUSD - a.valueInUSD)
    .slice(0, 10)
    .map((currency, index) => ({
      ...currency,
      rank: index + 1,
      displayValue: currency.valueInUSD.toFixed(3)
    }));

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-semibold text-gray-800">{`${data.flag} ${data.name}`}</p>
          <p className="text-sm text-gray-600">{`1 ${data.code} = $${data.displayValue} USD`}</p>
          <p className="text-xs text-gray-500">{`Rank: #${data.rank}`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
      <CardHeader className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-t-lg">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Crown className="h-5 w-5" />
          Top 10 Strongest Currencies
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <div className="h-64 mb-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={topCurrencies}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="code" 
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 10, fill: '#666' }}
              />
              <YAxis 
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 10, fill: '#666' }}
                tickFormatter={(value) => `$${value}`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar 
                dataKey="valueInUSD" 
                fill="url(#gradient)"
                radius={[4, 4, 0, 0]}
              />
              <defs>
                <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.9}/>
                  <stop offset="95%" stopColor="#d97706" stopOpacity={0.7}/>
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </div>
        
        {/* Top 3 currencies list */}
        <div className="space-y-2">
          <h4 className="font-semibold text-gray-700 text-sm mb-3">🏆 Top 3 Strongest</h4>
          {topCurrencies.slice(0, 3).map((currency, index) => (
            <div key={currency.code} className="flex items-center justify-between p-2 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border border-yellow-200">
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold text-yellow-600">#{index + 1}</span>
                <span className="text-lg">{currency.flag}</span>
                <div>
                  <div className="font-semibold text-gray-800 text-sm">{currency.code}</div>
                  <div className="text-xs text-gray-500">{currency.name}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-bold text-orange-700">${currency.displayValue}</div>
                <div className="text-xs text-gray-500">per 1 {currency.code}</div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
