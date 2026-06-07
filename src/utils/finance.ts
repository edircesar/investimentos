export const GLOBAL_CDI = 14.90 / 100; // 14.90% ao ano
export const GLOBAL_POUPANCA = 6.17 / 100; // Poupança aproximada
export const GLOBAL_INFLACAO = 4.5 / 100;

export interface SimulationResultPoint {
  month: number;
  invested: number;
  interest: number;
  total: number;
}

export interface SimulationSummary {
  initialAmount: number;
  totalInvested: number;
  totalInterest: number;
  finalAmount: number;
  netAmount?: number; // Válido para CDB/Tesouro descontado IR
  taxes?: number;
  monthlyEvolution: SimulationResultPoint[];
}

export function calculateCompoundInterest(
  initialValue: number,
  monthlyContribution: number,
  annualRate: number,
  months: number
): SimulationSummary {
  let currentTotal = initialValue;
  let totalInvested = initialValue;
  const monthlyRate = Math.pow(1 + annualRate, 1 / 12) - 1;
  const evolution: SimulationResultPoint[] = [];

  for (let i = 0; i <= months; i++) {
    if (i > 0) {
      currentTotal = currentTotal * (1 + monthlyRate) + monthlyContribution;
      totalInvested += monthlyContribution;
    }
    
    evolution.push({
      month: i,
      invested: totalInvested,
      interest: currentTotal - totalInvested,
      total: currentTotal,
    });
  }

  return {
    initialAmount: initialValue,
    totalInvested: totalInvested,
    totalInterest: currentTotal - totalInvested,
    finalAmount: currentTotal,
    monthlyEvolution: evolution,
  };
}

export function calculateIR(days: number): number {
  if (days <= 180) return 0.225;
  if (days <= 360) return 0.20;
  if (days <= 720) return 0.175;
  return 0.15;
}

export function calculateCDB(
  initialValue: number,
  monthlyContribution: number,
  cdbPercent: number, // e.g. 100 for 100% of CDI
  months: number
): SimulationSummary {
  const annualRate = (cdbPercent / 100) * GLOBAL_CDI;
  const rawSimulation = calculateCompoundInterest(initialValue, monthlyContribution, annualRate, months);
  
  const irRate = calculateIR(months * 30);
  const taxes = rawSimulation.totalInterest * irRate;
  const netAmount = rawSimulation.finalAmount - taxes;

  const adjustedEvolution = rawSimulation.monthlyEvolution.map(point => {
    const ptTaxes = point.interest * calculateIR(point.month * 30);
    return {
      ...point,
      total: point.total - ptTaxes,
      interest: point.interest - ptTaxes
    };
  });

  return {
    ...rawSimulation,
    taxes,
    netAmount,
    monthlyEvolution: adjustedEvolution
  };
}

export function calculateGoal(
  targetAmount: number,
  annualRate: number,
  months: number
): { requiredMonthly: number, initialNeeded: number } {
  const monthlyRate = Math.pow(1 + annualRate, 1 / 12) - 1;
  
  // Se quisermos apenas investir mensalmente partindo de 0
  // FV = PMT * (((1 + r)^n - 1) / r)
  // PMT = FV / (((1 + r)^n - 1) / r)
  
  let requiredMonthly = 0;
  if (monthlyRate > 0) {
    requiredMonthly = targetAmount / ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate);
  } else {
    requiredMonthly = targetAmount / months;
  }

  // Se quisermos investir tudo hoje (Aporte Único)
  const initialNeeded = targetAmount / Math.pow(1 + monthlyRate, months);

  return { requiredMonthly, initialNeeded };
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
}
