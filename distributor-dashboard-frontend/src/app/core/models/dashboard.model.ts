export interface KpiResponse {
  distributorCode: string;
  distributorName: string;
  amount: number;
}

export interface Distributor {
  code: string;
  name: string;
}

export interface HistoricalPerformance {
  distributorCode: string;
  distributorName: string;
  sales4MonthsAgo: number;
  sales3MonthsAgo: number;
  sales2MonthsAgo: number;
  salesLastMonth: number;
}

export interface SrPerformance {
  dbCode: string;
  dbName: string;
  userName: string;
  userId: string;
  totalInvoicedAmount: number;
}

export interface DistributorReport {
  name: string;
  totalSalesAmount: number;
  totalCollectionAmount: number;
  durationDue: number;
}