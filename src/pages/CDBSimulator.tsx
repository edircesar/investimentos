import React, { useState } from 'react';
import { Card, CardHeader, CardContent, Input, Button } from '@/components/ui';
import { Dashboard } from '@/components/Dashboard';
import { calculateCDB, GLOBAL_CDI, SimulationSummary } from '@/utils/finance';
import { useHistory } from '@/hooks/useHistory';

export function CDBSimulator() {
  const [initialValue, setInitialValue] = useState('10000');
  const [monthlyContribution, setMonthlyContribution] = useState('0');
  const [cdiPercent, setCdiPercent] = useState('110');
  const [period, setPeriod] = useState('24');
  const [result, setResult] = useState<SimulationSummary | null>(null);
  
  const { addEntry } = useHistory();

  const handleSimulate = (e: React.FormEvent) => {
    e.preventDefault();
    
    const summary = calculateCDB(
      Number(initialValue),
      Number(monthlyContribution),
      Number(cdiPercent),
      Number(period)
    );
    setResult(summary);
    
    addEntry({
      type: 'CDB',
      params: { initialValue, monthlyContribution, cdiPercent, period },
      result: summary
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader 
          title="Simulador de CDB" 
          subtitle="Projete seus ganhos em CDB já descontando o Imposto de Renda regressivo" 
        />
        <CardContent>
          <form onSubmit={handleSimulate} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
                label="Rentabilidade (% do CDI)"
                type="number"
                min="0"
                step="0.1"
                value={cdiPercent}
                onChange={e => setCdiPercent(e.target.value)}
                required
              />
              <Input
                label="Prazo (Meses)"
                type="number"
                min="1"
                value={period}
                onChange={e => setPeriod(e.target.value)}
                required
              />
            </div>
            
            <div className="flex justify-end pt-2">
              <Button type="submit" variant="primary" className="w-full sm:w-auto">
                Calcular Líquido
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {result && <Dashboard summary={result} title="Resultado CDB" />}
    </div>
  );
}
