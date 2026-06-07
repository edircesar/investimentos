import React, { useState } from 'react';
import { Card, CardHeader, CardContent, Input, Button } from '@/components/ui';
import { Dashboard } from '@/components/Dashboard';
import { calculateCompoundInterest, GLOBAL_CDI, SimulationSummary } from '@/utils/finance';
import { useHistory } from '@/hooks/useHistory';

export function CDISimulator() {
  const [initialValue, setInitialValue] = useState('10000');
  const [cdiPercent, setCdiPercent] = useState('100');
  const [period, setPeriod] = useState('12');
  const [result, setResult] = useState<SimulationSummary | null>(null);
  
  const { addEntry } = useHistory();

  const handleSimulate = (e: React.FormEvent) => {
    e.preventDefault();
    const annualRate = (Number(cdiPercent) / 100) * GLOBAL_CDI;
    
    const summary = calculateCompoundInterest(
      Number(initialValue),
      0, // sem aportes
      annualRate,
      Number(period)
    );
    setResult(summary);
    
    addEntry({
      type: 'CDI',
      params: { initialValue, cdiPercent, period },
      result: summary
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader 
          title="Simulador de CDI" 
          subtitle={`Simule o retorno com base no CDI atual (${(GLOBAL_CDI * 100).toFixed(2)}% ao ano)`} 
        />
        <CardContent>
          <form onSubmit={handleSimulate} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Input
                label="Valor Investido (R$)"
                type="number"
                min="0"
                step="0.01"
                value={initialValue}
                onChange={e => setInitialValue(e.target.value)}
                required
              />
              <Input
                label="Percentual do CDI (%)"
                type="number"
                min="0"
                step="0.1"
                value={cdiPercent}
                onChange={e => setCdiPercent(e.target.value)}
                required
              />
              <Input
                label="Tempo (Meses)"
                type="number"
                min="1"
                value={period}
                onChange={e => setPeriod(e.target.value)}
                required
              />
            </div>
            
            <div className="flex justify-end pt-2">
              <Button type="submit" variant="primary" className="w-full sm:w-auto">
                Calcular Rentabilidade
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {result && <Dashboard summary={result} title="Resultado (Bruto, sem IR)" />}
    </div>
  );
}
