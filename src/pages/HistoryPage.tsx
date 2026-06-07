import React from 'react';
import { Card, CardHeader, CardContent, Button } from '@/components/ui';
import { useHistory } from '@/hooks/useHistory';
import { formatCurrency } from '@/utils/finance';
import { Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export function HistoryPage() {
  const { history, removeEntry, clearHistory } = useHistory();

  const getTypeName = (type: string) => {
    switch (type) {
      case 'COMPOUND': return 'Juros Compostos';
      case 'CDI': return 'CDI';
      case 'CDB': return 'CDB';
      case 'GOAL': return 'Meta Financeira';
      default: return type;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Histórico de Simulações</h2>
        {history.length > 0 && (
          <Button variant="danger" onClick={clearHistory}>
            Limpar Histórico
          </Button>
        )}
      </div>

      {history.length === 0 ? (
        <Card className="bg-gray-50 border-dashed border-2">
          <CardContent className="p-12 text-center text-gray-500">
            Nenhuma simulação no histórico ainda. Faça sua primeira simulação!
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {history.map((entry) => (
            <Card key={entry.id}>
              <CardContent className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="bg-purple-100 text-purple-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                      {getTypeName(entry.type)}
                    </span>
                    <span className="text-sm text-gray-500">
                      {format(entry.date, "dd 'de' MMMM 'às' HH:mm", { locale: ptBR })}
                    </span>
                  </div>
                  
                  {/* Detalhes rápidos baseados no tipo */}
                  <div className="mt-2 text-sm text-gray-700">
                    {entry.type === 'GOAL' ? (
                      <p>
                        Objetivo: <span className="font-semibold">{formatCurrency(Number(entry.params.targetAmount))}</span> | 
                        Aporte Mensal Calculado: <span className="font-semibold text-purple-700">{formatCurrency(entry.result.requiredMonthly)}</span>
                      </p>
                    ) : (
                      <p>
                        Tempo: <span className="font-semibold">{entry.params.period} {entry.params.periodType === 'years' ? 'Anos' : 'Meses'}</span> | 
                        Final: <span className="font-semibold text-purple-700">{formatCurrency(entry.result.netAmount || entry.result.finalAmount)}</span>
                      </p>
                    )}
                  </div>
                </div>
                
                <button 
                  onClick={() => removeEntry(entry.id)}
                  className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors self-end sm:self-auto"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
