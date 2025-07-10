
import { useState, useEffect } from 'react';
import { Calculator, Receipt } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Currency {
  code: string;
  name: string;
  symbol: string;
  flag: string;
}

interface BillCalculatorProps {
  fromCurrency: string;
  toCurrency: string;
  exchangeRates: Record<string, Record<string, number>>;
  currencies: Currency[];
}

export const BillCalculator = ({ fromCurrency, toCurrency, exchangeRates, currencies }: BillCalculatorProps) => {
  const [billAmount, setBillAmount] = useState('');
  const [paidAmount, setPaidAmount] = useState('');
  const [billCurrency, setBillCurrency] = useState(fromCurrency);
  const [leftToPay, setLeftToPay] = useState({ original: 0, converted: 0 });

  useEffect(() => {
    setBillCurrency(fromCurrency);
  }, [fromCurrency]);

  useEffect(() => {
    calculateLeftToPay();
  }, [billAmount, paidAmount, billCurrency, toCurrency, exchangeRates]);

  const calculateLeftToPay = () => {
    if (!billAmount || !paidAmount) {
      setLeftToPay({ original: 0, converted: 0 });
      return;
    }

    const bill = parseFloat(billAmount);
    const paid = parseFloat(paidAmount);
    const remaining = bill - paid;

    let convertedRemaining = remaining;
    if (billCurrency !== toCurrency) {
      const rate = exchangeRates[billCurrency]?.[toCurrency] || 1;
      convertedRemaining = remaining * rate;
    }

    setLeftToPay({
      original: remaining,
      converted: convertedRemaining
    });
  };

  const getCurrencySymbol = (currencyCode: string) => {
    return currencies.find(c => c.code === currencyCode)?.symbol || currencyCode;
  };

  return (
    <Card className="shadow-2xl border-0 bg-white/80 backdrop-blur-sm animate-scale-in">
      <CardHeader className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-t-lg">
        <CardTitle className="flex items-center gap-2">
          <Calculator className="h-6 w-6" />
          Bill Calculator
        </CardTitle>
      </CardHeader>
      <CardContent className="p-8">
        <div className="space-y-6">
          {/* Bill Amount */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Total Bill Amount</label>
            <div className="flex gap-4">
              <div className="flex-1">
                <Input
                  type="number"
                  value={billAmount}
                  onChange={(e) => setBillAmount(e.target.value)}
                  className="text-xl font-semibold border-2 border-gray-200 focus:border-emerald-500 transition-colors"
                  placeholder="Enter bill amount"
                />
              </div>
              <div className="w-32">
                <Select value={billCurrency} onValueChange={setBillCurrency}>
                  <SelectTrigger className="border-2 border-gray-200 focus:border-emerald-500">
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

          {/* Amount Paid */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Amount You Paid</label>
            <div className="flex gap-4">
              <div className="flex-1">
                <Input
                  type="number"
                  value={paidAmount}
                  onChange={(e) => setPaidAmount(e.target.value)}
                  className="text-xl font-semibold border-2 border-gray-200 focus:border-emerald-500 transition-colors"
                  placeholder="Enter paid amount"
                />
              </div>
              <div className="w-32 flex items-center">
                <span className="text-lg font-semibold text-gray-600">
                  {getCurrencySymbol(billCurrency)} {billCurrency}
                </span>
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="bg-gradient-to-r from-emerald-50 to-teal-50 p-6 rounded-lg border border-emerald-200">
            <div className="flex items-center gap-2 mb-4">
              <Receipt className="h-5 w-5 text-emerald-600" />
              <span className="text-lg font-semibold text-emerald-800">Payment Summary</span>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Left to pay in {billCurrency}:</span>
                <span className="text-xl font-bold text-emerald-700">
                  {getCurrencySymbol(billCurrency)} {leftToPay.original.toFixed(2)}
                </span>
              </div>
              
              {billCurrency !== toCurrency && (
                <div className="flex justify-between items-center pt-2 border-t border-emerald-200">
                  <span className="text-sm text-gray-600">Left to pay in {toCurrency}:</span>
                  <span className="text-xl font-bold text-teal-700">
                    {getCurrencySymbol(toCurrency)} {leftToPay.converted.toFixed(2)}
                  </span>
                </div>
              )}
              
              {leftToPay.original <= 0 && billAmount && paidAmount && (
                <div className="text-center pt-2">
                  <span className="text-lg font-bold text-green-600">
                    {leftToPay.original === 0 ? '✅ Bill Fully Paid!' : '🎉 Overpaid!'}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
