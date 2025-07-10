
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';

interface ExchangeRateChartProps {
  fromCurrency: string;
  toCurrency: string;
}

export const ExchangeRateChart = ({ fromCurrency, toCurrency }: ExchangeRateChartProps) => {
  // Generate mock historical data
  const generateMockData = () => {
    const data = [];
    const baseRate = 0.85 + Math.random() * 0.3; // Random base rate
    
    for (let i = 29; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      
      // Add some realistic variation
      const variation = (Math.random() - 0.5) * 0.02;
      const rate = Math.max(0.1, baseRate + variation);
      
      data.push({
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        rate: parseFloat(rate.toFixed(4))
      });
    }
    
    return data;
  };

  const data = generateMockData();
  const latestRate = data[data.length - 1]?.rate || 1;
  const previousRate = data[data.length - 2]?.rate || 1;
  const change = ((latestRate - previousRate) / previousRate * 100);
  const isPositive = change > 0;

  return (
    <div className="space-y-4">
      <div className="text-center">
        <div className="text-sm text-gray-600 mb-1">
          {fromCurrency} → {toCurrency}
        </div>
        <div className="text-2xl font-bold text-gray-800">
          {latestRate.toFixed(4)}
        </div>
        <div className={`text-sm flex items-center justify-center gap-1 ${
          isPositive ? 'text-green-600' : 'text-red-600'
        }`}>
          <span>{isPositive ? '↗' : '↘'}</span>
          {Math.abs(change).toFixed(2)}% (30d)
        </div>
      </div>
      
      <div className="h-32">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="date" 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 10, fill: '#666' }}
              interval="preserveStartEnd"
            />
            <YAxis 
              hide
              domain={['dataMin - 0.001', 'dataMax + 0.001']}
            />
            <Line 
              type="monotone" 
              dataKey="rate" 
              stroke={isPositive ? "#10b981" : "#ef4444"}
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4, stroke: isPositive ? "#10b981" : "#ef4444", strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
