import React, { useState } from 'react';
import { Card, CardHeader, CardContent, Input, Button } from '@/components/ui';
import { calculateGoal, formatCurrency } from '@/utils/finance';
import { useHistory } from '@/hooks/useHistory';

export function GoalSimulator() {
  const [targetAmount, setTargetAmount] = useState('100000');
  const [period, setPeriod] = useState('60');
  const [annualRate, setAnnualRate] = useState('10');
  const [result, setResult] = useState<{ requiredMonthly: number, initialNeeded: number } | null>(null);
  
  const { addEntry } = useHistory();

  const handleSimulate = (e: React.FormEvent) => {
    e.preventDefault();
    
    const calculation = calculateGoal(
      Number(targetAmount),
      Number(annualRate) / 100,
      Number(period)
    );
    setResult(calculation);
    
    addEntry({
      type: 'GOAL',
      params: { targetAmount, annualRate, period },
      result: calculation
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader 
          title="Meta Financeira" 
          subtitle="Descubra quanto precisa poupar para atingir seus objetivos" 
        />
        <CardContent>
          <form onSubmit={handleSimulate} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Input
                label="Quanto deseja acumular? (R$)"
                type="number"
                min="0"
                step="0.01"
                value={targetAmount}
                onChange={e => setTargetAmount(e.target.value)}
                required
              />
              <Input
                label="Em quanto tempo? (Meses)"
                type="number"
                min="1"
                value={period}
                onChange={e => setPeriod(e.target.value)}
                required
              />
              <Input
                label="Taxa de retorno esperada (% a.a.)"
                type="number"
                min="0"
                step="0.01"
                value={annualRate}
                onChange={e => setAnnualRate(e.target.value)}
                required
              />
            </div>
            
            <div className="flex justify-end pt-2">
              <Button type="submit" variant="primary" className="w-full sm:w-auto">
                Calcular Plano
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {result && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8 animate-in fade-in slide-in-from-bottom-4">
          <Card className="bg-purple-900 text-white border-none shadow-lg">
            <CardContent className="p-8 text-center space-y-4">
              <p className="text-purple-200 font-medium tracking-wide">Para chegar lá investindo por mês</p>
              <p className="text-4xl md:text-5xl font-bold">{formatCurrency(result.requiredMonthly)}</p>
              <p className="text-purple-300 text-sm">Aporte mensal necessário</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-8 text-center space-y-4 flex flex-col justify-center h-full">
              <p className="text-gray-500 font-medium">Ou se preferir investir tudo hoje</p>
              <p className="text-3xl font-bold text-gray-900">{formatCurrency(result.initialNeeded)}</p>
              <p className="text-gray-400 text-sm">Aporte único hoje</p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
