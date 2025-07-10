
import { useState, useEffect } from 'react';
import { ArrowUpDown, TrendingUp, RefreshCw, X } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CurrencyCard } from '@/components/CurrencyCard';
import { ExchangeRateChart } from '@/components/ExchangeRateChart';
import { BillCalculator } from '@/components/BillCalculator';
import { TopCurrenciesChart } from '@/components/TopCurrenciesChart';

// Enhanced exchange rates with more currencies
const exchangeRates = {
  USD: { EUR: 0.85, GBP: 0.73, JPY: 110.25, CAD: 1.25, AUD: 1.35, CHF: 0.92, CNY: 6.45, INR: 74.5, KRW: 1180, BRL: 5.2, MXN: 20.1, SGD: 1.35, NOK: 8.6, SEK: 9.2, DKK: 6.3, PLN: 3.9, RUB: 75, ZAR: 14.8, TRY: 8.5, AED: 3.67 },
  EUR: { USD: 1.18, GBP: 0.86, JPY: 129.50, CAD: 1.47, AUD: 1.59, CHF: 1.08, CNY: 7.6, INR: 87.8, KRW: 1390, BRL: 6.1, MXN: 23.7, SGD: 1.59, NOK: 10.1, SEK: 10.8, DKK: 7.4, PLN: 4.6, RUB: 88.3, ZAR: 17.4, TRY: 10.0, AED: 4.33 },
  GBP: { USD: 1.37, EUR: 1.16, JPY: 150.75, CAD: 1.71, AUD: 1.85, CHF: 1.26, CNY: 8.8, INR: 102.1, KRW: 1616, BRL: 7.1, MXN: 27.5, SGD: 1.85, NOK: 11.8, SEK: 12.6, DKK: 8.6, PLN: 5.3, RUB: 102.7, ZAR: 20.3, TRY: 11.6, AED: 5.03 },
  JPY: { USD: 0.0091, EUR: 0.0077, GBP: 0.0066, CAD: 0.011, AUD: 0.012, CHF: 0.0083, CNY: 0.058, INR: 0.68, KRW: 10.7, BRL: 0.047, MXN: 0.18, SGD: 0.012, NOK: 0.078, SEK: 0.083, DKK: 0.057, PLN: 0.035, RUB: 0.68, ZAR: 0.13, TRY: 0.077, AED: 0.033 },
  CAD: { USD: 0.80, EUR: 0.68, GBP: 0.58, JPY: 88.20, AUD: 1.08, CHF: 0.74, CNY: 5.16, INR: 59.6, KRW: 944, BRL: 4.16, MXN: 16.1, SGD: 1.08, NOK: 6.9, SEK: 7.4, DKK: 5.0, PLN: 3.1, RUB: 60, ZAR: 11.8, TRY: 6.8, AED: 2.94 },
  AUD: { USD: 0.74, EUR: 0.63, GBP: 0.54, JPY: 81.67, CAD: 0.93, CHF: 0.68, CNY: 4.78, INR: 55.2, KRW: 873, BRL: 3.85, MXN: 14.9, SGD: 1.00, NOK: 6.4, SEK: 6.8, DKK: 4.7, PLN: 2.9, RUB: 55.6, ZAR: 11.0, TRY: 6.3, AED: 2.72 },
  CHF: { USD: 1.09, EUR: 0.93, GBP: 0.79, JPY: 120.07, CAD: 1.36, AUD: 1.47, CNY: 7.03, INR: 81.2, KRW: 1286, BRL: 5.67, MXN: 21.9, SGD: 1.47, NOK: 9.4, SEK: 10.0, DKK: 6.9, PLN: 4.2, RUB: 81.8, ZAR: 16.1, TRY: 9.3, AED: 4.00 },
  CNY: { USD: 0.155, EUR: 0.132, GBP: 0.114, JPY: 17.1, CAD: 0.194, AUD: 0.209, CHF: 0.142, INR: 11.5, KRW: 183, BRL: 0.81, MXN: 3.1, SGD: 0.209, NOK: 1.33, SEK: 1.43, DKK: 0.98, PLN: 0.60, RUB: 11.6, ZAR: 2.3, TRY: 1.32, AED: 0.569 },
  INR: { USD: 0.0134, EUR: 0.0114, GBP: 0.0098, JPY: 1.48, CAD: 0.0168, AUD: 0.0181, CHF: 0.0123, CNY: 0.087, KRW: 15.8, BRL: 0.070, MXN: 0.27, SGD: 0.0181, NOK: 0.115, SEK: 0.124, DKK: 0.085, PLN: 0.052, RUB: 1.01, ZAR: 0.199, TRY: 0.114, AED: 0.0493 },
  KRW: { USD: 0.00085, EUR: 0.00072, GBP: 0.00062, JPY: 0.093, CAD: 0.00106, AUD: 0.00115, CHF: 0.00078, CNY: 0.0055, INR: 0.063, BRL: 0.0044, MXN: 0.017, SGD: 0.00115, NOK: 0.0073, SEK: 0.0078, DKK: 0.0053, PLN: 0.0033, RUB: 0.064, ZAR: 0.0125, TRY: 0.0072, AED: 0.00311 },
  BRL: { USD: 0.192, EUR: 0.164, GBP: 0.141, JPY: 21.2, CAD: 0.240, AUD: 0.260, CHF: 0.176, CNY: 1.24, INR: 14.3, KRW: 227, MXN: 3.9, SGD: 0.260, NOK: 1.65, SEK: 1.77, DKK: 1.21, PLN: 0.75, RUB: 14.4, ZAR: 2.8, TRY: 1.63, AED: 0.706 },
  MXN: { USD: 0.050, EUR: 0.042, GBP: 0.036, JPY: 5.5, CAD: 0.062, AUD: 0.067, CHF: 0.046, CNY: 0.32, INR: 3.7, KRW: 58.7, BRL: 0.26, SGD: 0.067, NOK: 0.43, SEK: 0.46, DKK: 0.31, PLN: 0.19, RUB: 3.7, ZAR: 0.74, TRY: 0.42, AED: 0.183 },
  SGD: { USD: 0.74, EUR: 0.63, GBP: 0.54, JPY: 81.67, CAD: 0.93, AUD: 1.00, CHF: 0.68, CNY: 4.78, INR: 55.2, KRW: 873, BRL: 3.85, MXN: 14.9, NOK: 6.4, SEK: 6.8, DKK: 4.7, PLN: 2.9, RUB: 55.6, ZAR: 11.0, TRY: 6.3, AED: 2.72 },
  NOK: { USD: 0.116, EUR: 0.099, GBP: 0.085, JPY: 12.8, CAD: 0.145, AUD: 0.156, CHF: 0.106, CNY: 0.75, INR: 8.7, KRW: 137, BRL: 0.61, MXN: 2.3, SGD: 0.156, SEK: 1.07, DKK: 0.73, PLN: 0.45, RUB: 8.7, ZAR: 1.72, TRY: 0.99, AED: 0.426 },
  SEK: { USD: 0.109, EUR: 0.093, GBP: 0.079, JPY: 12.0, CAD: 0.135, AUD: 0.147, CHF: 0.100, CNY: 0.70, INR: 8.1, KRW: 128, BRL: 0.56, MXN: 2.2, SGD: 0.147, NOK: 0.93, DKK: 0.68, PLN: 0.42, RUB: 8.2, ZAR: 1.61, TRY: 0.92, AED: 0.400 },
  DKK: { USD: 0.159, EUR: 0.135, GBP: 0.116, JPY: 17.5, CAD: 0.198, AUD: 0.213, CHF: 0.145, CNY: 1.02, INR: 11.8, KRW: 187, BRL: 0.83, MXN: 3.2, SGD: 0.213, NOK: 1.37, SEK: 1.47, PLN: 0.62, RUB: 11.9, ZAR: 2.35, TRY: 1.35, AED: 0.584 },
  PLN: { USD: 0.256, EUR: 0.218, GBP: 0.188, JPY: 28.3, CAD: 0.320, AUD: 0.345, CHF: 0.234, CNY: 1.65, INR: 19.1, KRW: 302, BRL: 1.33, MXN: 5.2, SGD: 0.345, NOK: 2.21, SEK: 2.37, DKK: 1.61, RUB: 19.2, ZAR: 3.79, TRY: 2.18, AED: 0.943 },
  RUB: { USD: 0.0133, EUR: 0.0113, GBP: 0.0097, JPY: 1.47, CAD: 0.0167, AUD: 0.0180, CHF: 0.0122, CNY: 0.086, INR: 0.99, KRW: 15.7, BRL: 0.069, MXN: 0.27, SGD: 0.0180, NOK: 0.115, SEK: 0.122, DKK: 0.084, PLN: 0.052, ZAR: 0.197, TRY: 0.113, AED: 0.0489 },
  ZAR: { USD: 0.0676, EUR: 0.0575, GBP: 0.0492, JPY: 7.46, CAD: 0.0845, AUD: 0.0909, CHF: 0.0621, CNY: 0.435, INR: 5.03, KRW: 79.7, BRL: 0.357, MXN: 1.35, SGD: 0.0909, NOK: 0.581, SEK: 0.621, DKK: 0.426, PLN: 0.264, RUB: 5.08, TRY: 0.574, AED: 0.248 },
  TRY: { USD: 0.118, EUR: 0.100, GBP: 0.086, JPY: 13.0, CAD: 0.147, AUD: 0.159, CHF: 0.108, CNY: 0.758, INR: 8.76, KRW: 139, BRL: 0.613, MXN: 2.37, SGD: 0.159, NOK: 1.01, SEK: 1.08, DKK: 0.741, PLN: 0.459, RUB: 8.82, ZAR: 1.74, AED: 0.432 },
  AED: { USD: 0.272, EUR: 0.231, GBP: 0.199, JPY: 30.0, CAD: 0.340, AUD: 0.368, CHF: 0.250, CNY: 1.76, INR: 20.3, KRW: 321, BRL: 1.42, MXN: 5.47, SGD: 0.368, NOK: 2.35, SEK: 2.50, DKK: 1.71, PLN: 1.06, RUB: 20.4, ZAR: 4.03, TRY: 2.31 }
};

const currencies = [
  { code: 'USD', name: 'US Dollar', symbol: '$', flag: '🇺🇸' },
  { code: 'EUR', name: 'Euro', symbol: '€', flag: '🇪🇺' },
  { code: 'GBP', name: 'British Pound', symbol: '£', flag: '🇬🇧' },
  { code: 'JPY', name: 'Japanese Yen', symbol: '¥', flag: '🇯🇵' },
  { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$', flag: '🇨🇦' },
  { code: 'AUD', name: 'Australian Dollar', symbol: 'A$', flag: '🇦🇺' },
  { code: 'CHF', name: 'Swiss Franc', symbol: 'Fr', flag: '🇨🇭' },
  { code: 'CNY', name: 'Chinese Yuan', symbol: '¥', flag: '🇨🇳' },
  { code: 'INR', name: 'Indian Rupee', symbol: '₹', flag: '🇮🇳' },
  { code: 'KRW', name: 'South Korean Won', symbol: '₩', flag: '🇰🇷' },
  { code: 'BRL', name: 'Brazilian Real', symbol: 'R$', flag: '🇧🇷' },
  { code: 'MXN', name: 'Mexican Peso', symbol: '$', flag: '🇲🇽' },
  { code: 'SGD', name: 'Singapore Dollar', symbol: 'S$', flag: '🇸🇬' },
  { code: 'NOK', name: 'Norwegian Krone', symbol: 'kr', flag: '🇳🇴' },
  { code: 'SEK', name: 'Swedish Krona', symbol: 'kr', flag: '🇸🇪' },
  { code: 'DKK', name: 'Danish Krone', symbol: 'kr', flag: '🇩🇰' },
  { code: 'PLN', name: 'Polish Zloty', symbol: 'zł', flag: '🇵🇱' },
  { code: 'RUB', name: 'Russian Ruble', symbol: '₽', flag: '🇷🇺' },
  { code: 'ZAR', name: 'South African Rand', symbol: 'R', flag: '🇿🇦' },
  { code: 'TRY', name: 'Turkish Lira', symbol: '₺', flag: '🇹🇷' },
  { code: 'AED', name: 'UAE Dirham', symbol: 'د.إ', flag: '🇦🇪' }
];

const Index = () => {
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('EUR');
  const [amount, setAmount] = useState('1000');
  const [convertedAmount, setConvertedAmount] = useState('0');
  const [isSwapping, setIsSwapping] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  useEffect(() => {
    calculateConversion();
  }, [fromCurrency, toCurrency, amount]);

  const calculateConversion = () => {
    if (!amount || fromCurrency === toCurrency) {
      setConvertedAmount(amount || '0');
      return;
    }

    const rate = exchangeRates[fromCurrency]?.[toCurrency] || 1;
    const result = (parseFloat(amount) * rate).toFixed(2);
    setConvertedAmount(result);
  };

  const handleSwapCurrencies = () => {
    setIsSwapping(true);
    setTimeout(() => {
      setFromCurrency(toCurrency);
      setToCurrency(fromCurrency);
      setIsSwapping(false);
    }, 150);
  };

  const handleRefreshRates = () => {
    setLastUpdated(new Date());
    // In a real app, this would fetch new rates from an API
  };

  const handleClearAmount = () => {
    setAmount('');
    setConvertedAmount('0');
  };

  const getExchangeRate = () => {
    if (fromCurrency === toCurrency) return 1;
    return exchangeRates[fromCurrency]?.[toCurrency] || 1;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-700 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-2 animate-fade-in">Currency Exchange</h1>
            <p className="text-blue-100 text-lg animate-fade-in">
              Real-time currency conversion with live exchange rates
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Exchange Card */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="shadow-2xl border-0 bg-white/80 backdrop-blur-sm animate-scale-in">
              <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-t-lg">
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <TrendingUp className="h-6 w-6" />
                    Currency Converter
                  </span>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleClearAmount}
                      className="text-white hover:bg-white/20"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleRefreshRates}
                      className="text-white hover:bg-white/20"
                    >
                      <RefreshCw className="h-4 w-4" />
                    </Button>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8">
                <div className="space-y-6">
                  {/* From Currency */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">From</label>
                    <div className="flex gap-4">
                      <div className="flex-1">
                        <Input
                          type="number"
                          value={amount}
                          onChange={(e) => setAmount(e.target.value)}
                          className="text-2xl font-bold border-2 border-gray-200 focus:border-blue-500 transition-colors"
                          placeholder="Enter amount"
                        />
                      </div>
                      <div className="w-48">
                        <Select value={fromCurrency} onValueChange={setFromCurrency}>
                          <SelectTrigger className="border-2 border-gray-200 focus:border-blue-500">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {currencies.map((currency) => (
                              <SelectItem key={currency.code} value={currency.code}>
                                <span className="flex items-center gap-2">
                                  <span>{currency.flag}</span>
                                  <span>{currency.code}</span>
                                </span>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  {/* Swap Button */}
                  <div className="flex justify-center">
                    <Button
                      onClick={handleSwapCurrencies}
                      variant="outline"
                      size="lg"
                      className={`rounded-full border-2 border-blue-500 text-blue-600 hover:bg-blue-50 transition-all duration-200 ${
                        isSwapping ? 'animate-spin' : 'hover:scale-110'
                      }`}
                    >
                      <ArrowUpDown className="h-5 w-5" />
                    </Button>
                  </div>

                  {/* To Currency */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">To</label>
                    <div className="flex gap-4">
                      <div className="flex-1">
                        <div className="h-14 bg-gradient-to-r from-green-50 to-blue-50 border-2 border-green-200 rounded-md flex items-center px-4">
                          <span className="text-2xl font-bold text-green-700">
                            {convertedAmount}
                          </span>
                        </div>
                      </div>
                      <div className="w-48">
                        <Select value={toCurrency} onValueChange={setToCurrency}>
                          <SelectTrigger className="border-2 border-gray-200 focus:border-blue-500">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {currencies.map((currency) => (
                              <SelectItem key={currency.code} value={currency.code}>
                                <span className="flex items-center gap-2">
                                  <span>{currency.flag}</span>
                                  <span>{currency.code}</span>
                                </span>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  {/* Exchange Rate Info */}
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg border border-blue-200">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Exchange Rate</span>
                      <span className="font-bold text-blue-700">
                        1 {fromCurrency} = {getExchangeRate().toFixed(4)} {toCurrency}
                      </span>
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      Last updated: {lastUpdated.toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Bill Calculator */}
            <BillCalculator 
              fromCurrency={fromCurrency} 
              toCurrency={toCurrency} 
              exchangeRates={exchangeRates}
              currencies={currencies}
            />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Popular Currencies */}
            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-t-lg">
                <CardTitle className="text-lg">Popular Currencies</CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <div className="space-y-3">
                  {currencies.slice(0, 6).map((currency) => (
                    <CurrencyCard key={currency.code} currency={currency} />
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Exchange Rate Trend */}
            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader className="bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-t-lg">
                <CardTitle className="text-lg">Rate Trend</CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <ExchangeRateChart fromCurrency={fromCurrency} toCurrency={toCurrency} />
              </CardContent>
            </Card>

            {/* Top Currencies Chart */}
            <TopCurrenciesChart currencies={currencies} exchangeRates={exchangeRates} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
