import React, { useState } from 'react';
import { Card, CardHeader, CardContent, Input, Button } from '@/components/ui';
import { Dashboard } from '@/components/Dashboard';
import { calculateCompoundInterest, SimulationSummary } from '@/utils/finance';
import { useHistory } from '@/hooks/useHistory';

export function CompoundInterest() {
  const [initialValue, setInitialValue] = useState('1000');
  const [monthlyContribution, setMonthlyContribution] = useState('500');
  const [annualRate, setAnnualRate] = useState('10');
  const [period, setPeriod] = useState('5');
  const [periodType, setPeriodType] = useState<'years' | 'months'>('years');
  const [result, setResult] = useState<SimulationSummary | null>(null);
  
  const { addEntry } = useHistory();

  const handleSimulate = (e: React.FormEvent) => {
    e.preventDefault();
    const months = periodType === 'years' ? Number(period) * 12 : Number(period);
    const summary = calculateCompoundInterest(
      Number(initialValue),
      Number(monthlyContribution),
      Number(annualRate) / 100,
      months
    );
    setResult(summary);
    
    addEntry({
      type: 'COMPOUND',
      params: { initialValue, monthlyContribution, annualRate, period, periodType },
      result: summary
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader 
          title="Juros Compostos" 
          subtitle="Simule o crescimento do seu patrimônio ao longo do tempo" 
        />
        <CardContent>
          <form onSubmit={handleSimulate} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Valor Inicial (R$)"
                type="number"
                min="0"
                step="0.01"
                value={initialValue}
                onChange={e => setInitialValue(e.target.value)}
                required
              />
              <Input
                label="Aporte Mensal (R$)"
                type="number"
                min="0"
                step="0.01"
                value={monthlyContribution}
                onChange={e => setMonthlyContribution(e.target.value)}
                required
              />
              <Input
                label="Taxa de Juros Anual (%)"
                type="number"
                min="0"
                step="0.01"
                value={annualRate}
                onChange={e => setAnnualRate(e.target.value)}
                required
              />
              <div className="flex gap-2 items-end w-full">
                <div className="flex-1">
                  <Input
                    label="Período"
                    type="number"
                    min="1"
                    value={period}
                    onChange={e => setPeriod(e.target.value)}
                    required
                  />
                </div>
                <select 
                  className="mb-1 block rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-gray-900 shadow-sm focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
                  value={periodType}
                  onChange={e => setPeriodType(e.target.value as any)}
                >
                  <option value="years">Anos</option>
                  <option value="months">Meses</option>
                </select>
              </div>
            </div>
            
            <div className="flex justify-end pt-2">
              <Button type="submit" variant="primary" className="w-full sm:w-auto">
                Calcular Evolução
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {result && <Dashboard summary={result} />}
    </div>
  );
}
