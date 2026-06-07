import { SimulationSummary } from "./utils/finance";

export type SimulatorType = 'COMPOUND' | 'CDI' | 'CDB' | 'GOAL' | 'COMPARE';

export interface HistoryEntry {
  id: string;
  date: number;
  type: SimulatorType;
  params: any;
  result: SimulationSummary | any;
}
