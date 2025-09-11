import { Component, OnInit, OnDestroy, ChangeDetectorRef, NgZone } from '@angular/core';
import { BehaviorSubject, Observable, Subject, combineLatest, of, forkJoin } from 'rxjs';
import { switchMap, takeUntil, catchError, map, debounceTime, distinctUntilChanged, tap } from 'rxjs/operators';
import { DashboardService } from '../services/dashboard.service';
import {
   Distributor,
   HistoricalPerformance,
   KpiResponse,
   SrPerformance,
   DistributorReport
} from '../../../core/models/dashboard.model';
import { kpiIcons } from './kpi-icons';
import { isEqual } from 'lodash-es';

@Component({
   selector: 'app-dashboard-page',
   templateUrl: './dashboard-page.component.html',
   styleUrls: ['./dashboard-page.component.scss']
})
export class DashboardPageComponent implements OnInit, OnDestroy {
   // --- FILTERS ---
   public selectedDistributorCode$ = new BehaviorSubject<string | null>(null);
   public selectedDateRange$ = new BehaviorSubject<{ start: string; end: string } | null>(null);
   public hasInitialFilters$!: Observable<boolean>;
   private destroy$ = new Subject<void>();

   // --- ICONS ---
   public icons = kpiIcons;

   // --- LOADING FLAGS ---
   public isLoading = {
       kpis: false,
       historicalData: false,
       srPerformance: false,
       distributorReport: false
   };

   // --- DATA STREAMS ---
   public distributors$!: Observable<Distributor[]>;
   public historicalData$ = new BehaviorSubject<HistoricalPerformance[] | null>(null);
   public kpiData$ = new BehaviorSubject<any>(null);
   public srPerformance$ = new BehaviorSubject<SrPerformance[] | null>(null);
   public distributorReport$ = new BehaviorSubject<DistributorReport[] | null>(null);


   constructor(
       private dashboardService: DashboardService,
       private cdr: ChangeDetectorRef,
       private zone: NgZone
   ) {}

   ngOnInit(): void {
       this.hasInitialFilters$ = this.selectedDistributorCode$.pipe(map(code => !!code));

       this.distributors$ = this.dashboardService.getDistributors().pipe(
           catchError(() => of([]))
       );
      
       this.initializeDataStreams();
   }
  
   private initializeDataStreams(): void {
       // --- STREAM 1: Handles data dependent ONLY on the distributor code ---
       this.selectedDistributorCode$.pipe(
           debounceTime(100),
           distinctUntilChanged(),
           tap(code => {
               this.clearAllData();
               if (code) {
                 this.setLoading('historicalData', true);
                 this.setLoading('srPerformance', true);
                 this.setLoading('kpis', true);
               }
           }),
           switchMap(code => {
               if (!code) return of(null);
              
               return forkJoin({
                   historical: this.dashboardService.getHistoricalPerformance(code).pipe(catchError(() => of(null))),
                   sr: this.dashboardService.getSrPerformance(code).pipe(catchError(() => of(null))),
                   imsInvoiced: this.dashboardService.getImsInvoiced(code).pipe(catchError(() => of(null))),
                   currentStock: this.dashboardService.getCurrentStock(code).pipe(catchError(() => of(null))),
                   totalActiveCustomers: this.dashboardService.getTotalActiveCustomers(code).pipe(catchError(() => of(null))),
                   totalInvoicedCustomers: this.dashboardService.getTotalInvoicedCustomers(code).pipe(catchError(() => of(null)))
               });
           }),
           takeUntil(this.destroy$)
       ).subscribe(result => {
           if (result) {
               this.historicalData$.next(result.historical);
               this.srPerformance$.next(result.sr);
               this.kpiData$.next({
                   imsInvoiced: result.imsInvoiced,
                   currentStock: result.currentStock,
                   totalActiveCustomers: result.totalActiveCustomers,
                   totalInvoicedCustomers: result.totalInvoicedCustomers
               });
           }
           this.setLoading('historicalData', false);
           this.setLoading('srPerformance', false);
       });

       // --- STREAM 2: Handles data dependent on BOTH distributor code and date range ---
       combineLatest([this.selectedDistributorCode$, this.selectedDateRange$]).pipe(
           debounceTime(300),
           distinctUntilChanged(isEqual),
           switchMap(([code, range]) => {
               if (!code || !range) {
                   this.clearDateDependentKpis();
                   this.setLoading('kpis', false);
                   return of(null);
               }

               this.setLoading('distributorReport', true);
               const params = { distributorCode: code, startDate: range.start, endDate: range.end };

               return forkJoin({
                   report: this.dashboardService.getDistributorReport(params).pipe(catchError(() => of(null))),
                   liftingTarget: this.dashboardService.getLiftingTarget(params).pipe(catchError(() => of(null))),
                   purchaseAmount: this.dashboardService.getPurchaseAmount(params).pipe(catchError(() => of(null))),
                   imsTarget: this.dashboardService.getImsTarget(params).pipe(catchError(() => of(null))),
                   monthlyCollection: this.dashboardService.getMonthlyCollection(params).pipe(catchError(() => of(null))),
                   primaryOrder: this.dashboardService.getPrimaryOrder(params).pipe(catchError(() => of(null))),
                   secondaryOrder: this.dashboardService.getSecondaryOrder(params).pipe(catchError(() => of(null))),
               });
           }),
           takeUntil(this.destroy$)
       ).subscribe(result => {
           if (result) {
               this.distributorReport$.next(result.report);
               const { report, ...dateKpis } = result;
               const currentKpis = this.kpiData$.getValue();
               this.kpiData$.next({ ...currentKpis, ...dateKpis });
           }
           this.setLoading('distributorReport', false);
           this.setLoading('kpis', false);
       });
   }

   private setLoading(key: keyof typeof this.isLoading, value: boolean): void {
       this.zone.run(() => {
           this.isLoading[key] = value;
           this.cdr.markForCheck();
       });
   }

   private clearAllData(): void {
       this.distributorReport$.next(null);
       this.kpiData$.next(null);
       this.historicalData$.next(null);
       this.srPerformance$.next(null);
   }

   private clearDateDependentKpis(): void {
       const currentKpis = this.kpiData$.getValue();
       if (currentKpis) {
           this.kpiData$.next({
               ...currentKpis,
               liftingTarget: null, purchaseAmount: null, imsTarget: null,
               monthlyCollection: null, primaryOrder: null, secondaryOrder: null
           });
       }
   }

   // --- EVENT HANDLERS (Definitive Fix) ---
   onDistributorChange(distributor: Distributor | null): void {
       const newCode = distributor?.code ?? null;
      
       // This is the core fix. We update the distributor code...
       this.selectedDistributorCode$.next(newCode);

       // ...then, if a date range already exists, we re-emit it. This forces
       // Stream 2 to re-evaluate with the new distributor code, fixing the bug.
       const currentDateRange = this.selectedDateRange$.getValue();
       if (newCode && currentDateRange) {
           this.selectedDateRange$.next(currentDateRange);
       }
   }

   onDateRangeChange(start: string, end: string): void {
       if (start && end) {
           this.selectedDateRange$.next({ start, end });
       } else {
           this.selectedDateRange$.next(null);
       }
   }

   customSearchFn(term: string, item: Distributor): boolean {
       term = term.toLowerCase();
       const name = item.name.toLowerCase();
       const code = item.code.toLowerCase();
       return name.includes(term) || code.includes(term);
   }
  
   ngOnDestroy(): void {
       this.destroy$.next();
       this.destroy$.complete();
   }
}