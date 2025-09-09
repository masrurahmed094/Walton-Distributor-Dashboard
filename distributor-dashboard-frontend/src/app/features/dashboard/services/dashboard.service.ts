import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import {
    Distributor,
    DistributorReport,
    HistoricalPerformance,
    KpiResponse,
    SrPerformance
} from '../../../core/models/dashboard.model';

interface KpiParams {
  distributorCode: string;
  startDate: string;
  endDate: string;
}

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private apiUrl = environment.apiUrl + '/dashboard';

  constructor(private http: HttpClient) { }

  /**
   * A private helper to gracefully handle HTTP errors.
   * If a 404 Not Found error is received, it returns a safe "empty" value.
   * This prevents the console from showing errors when no data is found for a query.
   * @param emptyValue The value to return on a 404 error (e.g., [] for an array, null for an object).
   */
  private handleError<T>(emptyValue: T) {
    return (error: HttpErrorResponse): Observable<T> => {
      if (error.status === 404) {
        // Return a safe, empty value so the UI can handle it gracefully.
        return of(emptyValue);
      }
      // For all other errors (like 500, 401, etc.), log them and re-throw.
      console.error(`API Error: ${error.status}. Body:`, error.error);
      throw error;
    };
  }

  getDistributors(): Observable<Distributor[]> {
    return this.http.get<Distributor[]>(`${this.apiUrl}/distributors`)
      .pipe(catchError(this.handleError<Distributor[]>([])));
  }

  getLiftingTarget(params: KpiParams): Observable<KpiResponse | null> {
    const httpParams = new HttpParams()
      .set('distributorCode', params.distributorCode)
      .set('startDate', params.startDate)
      .set('endDate', params.endDate);
    return this.http.get<KpiResponse>(`${this.apiUrl}/kpis/lifting-target`, { params: httpParams })
      .pipe(catchError(this.handleError<KpiResponse | null>(null)));
  }

  getPurchaseAmount(params: KpiParams): Observable<KpiResponse | null> {
    const httpParams = new HttpParams()
      .set('distributorCode', params.distributorCode)
      .set('startDate', params.startDate)
      .set('endDate', params.endDate);
    return this.http.get<KpiResponse>(`${this.apiUrl}/kpis/purchase-amount`, { params: httpParams })
      .pipe(catchError(this.handleError<KpiResponse | null>(null)));
  }

  getImsTarget(params: KpiParams): Observable<KpiResponse | null> {
    const httpParams = new HttpParams()
      .set('distributorCode', params.distributorCode)
      .set('startDate', params.startDate)
      .set('endDate', params.endDate);
    return this.http.get<KpiResponse>(`${this.apiUrl}/kpis/ims-target`, { params: httpParams })
      .pipe(catchError(this.handleError<KpiResponse | null>(null)));
  }

  getImsInvoiced(distributorCode: string): Observable<KpiResponse | null> {
    const httpParams = new HttpParams().set('distributorCode', distributorCode);
    return this.http.get<KpiResponse>(`${this.apiUrl}/kpis/ims-invoiced`, { params: httpParams })
      .pipe(catchError(this.handleError<KpiResponse | null>(null)));
  }

  getMonthlyCollection(params: KpiParams): Observable<KpiResponse | null> {
    const httpParams = new HttpParams()
      .set('distributorCode', params.distributorCode)
      .set('startDate', params.startDate)
      .set('endDate', params.endDate);
    return this.http.get<KpiResponse>(`${this.apiUrl}/kpis/monthly-collection`, { params: httpParams })
      .pipe(catchError(this.handleError<KpiResponse | null>(null)));
  }

  getPrimaryOrder(params: KpiParams): Observable<KpiResponse | null> {
    const httpParams = new HttpParams()
      .set('distributorCode', params.distributorCode)
      .set('startDate', params.startDate)
      .set('endDate', params.endDate);
    return this.http.get<KpiResponse>(`${this.apiUrl}/kpis/primary-order`, { params: httpParams })
      .pipe(catchError(this.handleError<KpiResponse | null>(null)));
  }

  getTotalActiveCustomers(distributorCode: string): Observable<KpiResponse | null> {
    const httpParams = new HttpParams().set('distributorCode', distributorCode);
    return this.http.get<KpiResponse>(`${this.apiUrl}/kpis/total-active-customers`, { params: httpParams })
      .pipe(catchError(this.handleError<KpiResponse | null>(null)));
  }

  getTotalInvoicedCustomers(distributorCode: string): Observable<KpiResponse | null> {
    const httpParams = new HttpParams().set('distributorCode', distributorCode);
    return this.http.get<KpiResponse>(`${this.apiUrl}/kpis/total-invoiced-customers`, { params: httpParams })
      .pipe(catchError(this.handleError<KpiResponse | null>(null)));
  }

  getSecondaryOrder(params: KpiParams): Observable<KpiResponse | null> {
    const httpParams = new HttpParams()
      .set('distributorCode', params.distributorCode)
      .set('startDate', params.startDate)
      .set('endDate', params.endDate);
    return this.http.get<KpiResponse>(`${this.apiUrl}/kpis/secondary-order`, { params: httpParams })
      .pipe(catchError(this.handleError<KpiResponse | null>(null)));
  }

  getCurrentStock(distributorCode: string): Observable<KpiResponse | null> {
    const httpParams = new HttpParams().set('distributorCode', distributorCode);
    return this.http.get<KpiResponse>(`${this.apiUrl}/kpis/current-stock`, { params: httpParams })
      .pipe(catchError(this.handleError<KpiResponse | null>(null)));
  }

  getHistoricalPerformance(distributorCode: string): Observable<HistoricalPerformance[]> {
    const httpParams = new HttpParams().set('distributorCode', distributorCode);
    return this.http.get<HistoricalPerformance[]>(`${this.apiUrl}/history`, { params: httpParams })
      .pipe(catchError(this.handleError<HistoricalPerformance[]>([])));
  }

  getSrPerformance(distributorCode: string): Observable<SrPerformance[]> {
    const httpParams = new HttpParams().set('distributorCode', distributorCode);
    return this.http.get<SrPerformance[]>(`${this.apiUrl}/sr-performance`, { params: httpParams })
      .pipe(catchError(this.handleError<SrPerformance[]>([])));
  }

  getDistributorReport(params: KpiParams): Observable<DistributorReport[]> {
    const httpParams = new HttpParams()
      .set('distributorCode', params.distributorCode)
      .set('startDate', params.startDate)
      .set('endDate', params.endDate);
    return this.http.get<DistributorReport[]>(`${this.apiUrl}/distributor-report`, { params: httpParams })
      .pipe(catchError(this.handleError<DistributorReport[]>([])));
  }
}

