import React, { useState } from 'react';
import { Card, CardHeader, CardContent, Input, Button } from '@/components/ui';
import { 
  calculateCompoundInterest, 
  calculateCDB, 
  GLOBAL_POUPANCA, 
  GLOBAL_CDI, 
  formatCurrency 
} from '@/utils/finance';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Legend } from 'recharts';

export function CompareSimulator() {
  const [initialValue, setInitialValue] = useState('5000');
  const [monthlyContribution, setMonthlyContribution] = useState('500');
  const [period, setPeriod] = useState('60');
  
  const [data, setData] = useState<any[] | null>(null);

  const handleSimulate = (e: React.FormEvent) => {
    e.preventDefault();
    const val = Number(initialValue);
    const monthly = Number(monthlyContribution);
    const months = Number(period);

    const poupanca = calculateCompoundInterest(val, monthly, GLOBAL_POUPANCA, months);
    const cdi = calculateCompoundInterest(val, monthly, GLOBAL_CDI, months);
    const cdb = calculateCDB(val, monthly, 110, months); // CDB 110% CDI
    const tesouro = calculateCDB(val, monthly, 100, months); // Simula Tesouro Selic aproximado (100% cdi descontando IR)

    setData([
      { name: 'Poupança', finalAmount: poupanca.finalAmount, ir: 0, net: poupanca.finalAmount },
      { name: 'CDI (Sem IR)', finalAmount: cdi.finalAmount, ir: 0, net: cdi.finalAmount },
      { name: 'Tesouro (100% CDI)', finalAmount: tesouro.finalAmount, ir: tesouro.taxes, net: tesouro.netAmount },
      { name: 'CDB (110% CDI)', finalAmount: cdb.finalAmount, ir: cdb.taxes, net: cdb.netAmount },
    ].sort((a, b) => b.net! - a.net!));
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader 
          title="Comparador de Investimentos" 
          subtitle="Compare o mesmo cenário em diferentes produtos financeiros" 
        />
        <CardContent>
          <form onSubmit={handleSimulate} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                Comparar Rentabilidades
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {data && (
        <Card className="mt-8 animate-in fade-in slide-in-from-bottom-4">
          <CardHeader title="Ranking de Rentabilidade (Valor Líquido)" />
          <CardContent className="pt-0">
            <div className="h-96 w-full mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e5e7eb" />
                  <XAxis type="number" 
                    tickFormatter={(val) => `R$${(val/1000).toFixed(0)}k`}
                    stroke="#9ca3af"
                  />
                  <YAxis dataKey="name" type="category" width={120} stroke="#4b5563" fontWeight={500} />
                  <RechartsTooltip 
                    formatter={(value: number) => formatCurrency(value)}
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Legend />
                  <Bar dataKey="net" name="Valor Líquido" fill="#7e22ce" radius={[0, 4, 4, 0]} />
                  <Bar dataKey="ir" name="Imposto Retido" fill="#ef4444" radius={[0, 4, 4, 0]} stackId="a" opacity={0.6} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
