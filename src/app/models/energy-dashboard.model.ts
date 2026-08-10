export interface PlantSummaryDto {
  totalConsumptionMMBtu: number;
  dcqLimitMMBtu: number; // Daily Contracted Quantity
  dcqUtilizationPercentage: number;
  currentPressureBar: number;
  avgGcv: number; // Gross Calorific Value
  billingCycleStatus: string;
}

export interface TrendDataPoint {
  date: string;
  consumptionMMBtu: number;
  targetMMBtu: number;
}