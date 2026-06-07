import React, { useRef } from 'react';
import { Card, CardHeader, CardContent, Button } from '@/components/ui';
import { SimulationSummary, formatCurrency } from '@/utils/finance';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Legend } from 'recharts';
import { Download, TrendingUp } from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

interface DashboardProps {
  summary: SimulationSummary;
  title?: string;
}

export function Dashboard({ summary, title = "Resultados da Simulação" }: DashboardProps) {
  const dashboardRef = useRef<HTMLDivElement>(null);

  const exportPDF = async () => {
    if (!dashboardRef.current) return;
    const canvas = await html2canvas(dashboardRef.current);
    const imgData = canvas.toDataURL('image/png');
    
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
    
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save('simulacao-investiragora.pdf');
  };

  const exportCSV = () => {
    const headers = ['Mês', 'Valor Investido', 'Juros Acumulados', 'Patrimônio Total'];
    const rows = summary.monthlyEvolution.map(point => [
      point.month.toString(),
      point.invested.toFixed(2),
      point.interest.toFixed(2),
      point.total.toFixed(2)
    ]);
    
    const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "simulacao-investiragora.csv");
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const profitability = ((summary.finalAmount - summary.totalInvested) / summary.totalInvested) * 100;

  return (
    <div className="space-y-6 mt-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
        <div className="flex gap-2 w-full sm:w-auto">
          <Button variant="outline" onClick={exportCSV} className="flex-1 sm:flex-none gap-2">
            <Download className="w-4 h-4" /> CSV
          </Button>
          <Button variant="primary" onClick={exportPDF} className="flex-1 sm:flex-none gap-2">
            <Download className="w-4 h-4" /> PDF
          </Button>
        </div>
      </div>

      <div ref={dashboardRef} className="space-y-6 bg-gray-50 pb-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-5">
              <p className="text-sm font-medium text-gray-500 mb-1">Valor Investido</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(summary.totalInvested)}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-5">
              <p className="text-sm font-medium text-gray-500 mb-1">Juros Ganhos</p>
              <p className="text-2xl font-bold text-green-600">+{formatCurrency(summary.totalInterest)}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-5 relative overflow-hidden">
              <p className="text-sm font-medium text-gray-500 mb-1">Patrimônio Final</p>
              <p className="text-2xl font-bold text-purple-700">{formatCurrency(summary.finalAmount)}</p>
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <TrendingUp className="w-12 h-12 text-purple-700" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-5">
              <p className="text-sm font-medium text-gray-500 mb-1">Rentabilidade Bruta</p>
              <p className="text-2xl font-bold text-gray-900">{profitability.toFixed(2)}%</p>
            </CardContent>
          </Card>
        </div>

        {summary.netAmount && summary.taxes !== undefined && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
             <Card>
              <CardContent className="p-5">
                <p className="text-sm font-medium text-gray-500 mb-1">Imposto de Renda Estimado</p>
                <p className="text-xl font-bold text-red-500">-{formatCurrency(summary.taxes)}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-5">
                <p className="text-sm font-medium text-gray-500 mb-1">Patrimônio Líquido Final</p>
                <p className="text-xl font-bold text-purple-700">{formatCurrency(summary.netAmount)}</p>
              </CardContent>
            </Card>
          </div>
        )}

        <Card>
          <CardHeader title="Evolução do Patrimônio" />
          <CardContent className="pt-2 h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={summary.monthlyEvolution} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                <XAxis 
                  dataKey="month" 
                  tickFormatter={(val) => `${val}m`}
                  stroke="#9ca3af"
                  fontSize={12}
                  tickMargin={10}
                />
                <YAxis 
                  tickFormatter={(val) => `R$${(val/1000).toFixed(0)}k`}
                  stroke="#9ca3af"
                  fontSize={12}
                  tickMargin={10}
                />
                <RechartsTooltip 
                  formatter={(value: number) => formatCurrency(value)}
                  labelFormatter={(label) => `Mês ${label}`}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Legend iconType="circle" />
                <Line type="monotone" name="Patrimônio Total" dataKey="total" stroke="#7e22ce" strokeWidth={3} dot={false} activeDot={{ r: 6 }} />
                <Line type="monotone" name="Valor Investido" dataKey="invested" stroke="#3b82f6" strokeWidth={3} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
