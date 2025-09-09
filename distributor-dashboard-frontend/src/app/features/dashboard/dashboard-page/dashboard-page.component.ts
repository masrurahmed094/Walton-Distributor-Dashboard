import { Component, OnInit, OnDestroy, ChangeDetectorRef, NgZone } from '@angular/core';
import { BehaviorSubject, Observable, Subject, combineLatest, of } from 'rxjs';
import { switchMap, takeUntil, catchError, finalize, map } from 'rxjs/operators';
import { DashboardService } from '../services/dashboard.service';
import {
    Distributor,
    HistoricalPerformance,
    KpiResponse,
    SrPerformance,
    DistributorReport
} from '../../../core/models/dashboard.model';

@Component({
    selector: 'app-dashboard-page',
    templateUrl: './dashboard-page.component.html',
    styleUrls: ['./dashboard-page.component.scss']
})
export class DashboardPageComponent implements OnInit, OnDestroy {
    public selectedDistributorCode$ = new BehaviorSubject<string | null>(null);
    public selectedDateRange$ = new BehaviorSubject<{ start: string; end: string } | null>(null);
    public hasInitialFilters$!: Observable<boolean>;
    private destroy$ = new Subject<void>();

    // Explicit loading flags for each data stream
    public isLoading = {
        liftingTarget: false,
        purchaseAmount: false,
        imsTarget: false,
        imsInvoiced: false,
        monthlyCollection: false,
        primaryOrder: false,
        secondaryOrder: false,
        currentStock: false,
        totalActiveCustomers: false,
        totalInvoicedCustomers: false,
        historicalData: false,
        srPerformance: false,
        distributorReport: false
    };

    // Observables for dashboard data
    distributors$!: Observable<Distributor[]>;
    historicalData$!: Observable<HistoricalPerformance[] | null>;
    liftingTarget$!: Observable<KpiResponse | null>;
    purchaseAmount$!: Observable<KpiResponse | null>;
    imsTarget$!: Observable<KpiResponse | null>;
    imsInvoiced$!: Observable<KpiResponse | null>;
    monthlyCollection$!: Observable<KpiResponse | null>;
    primaryOrder$!: Observable<KpiResponse | null>;
    secondaryOrder$!: Observable<KpiResponse | null>;
    currentStock$!: Observable<KpiResponse | null>;
    totalActiveCustomers$!: Observable<KpiResponse | null>;
    totalInvoicedCustomers$!: Observable<KpiResponse | null>;
    srPerformance$!: Observable<SrPerformance[] | null>;
    distributorReport$!: Observable<DistributorReport[] | null>;

    constructor(
        private dashboardService: DashboardService,
        private cdr: ChangeDetectorRef,
        private zone: NgZone // Inject NgZone for guaranteed UI updates
    ) {}

    ngOnInit(): void {
        const filters$ = combineLatest([
            this.selectedDistributorCode$,
            this.selectedDateRange$
        ]);

        this.hasInitialFilters$ = filters$.pipe(
            map(([code, range]) => !!code && !!range)
        );

        this.distributors$ = this.dashboardService.getDistributors().pipe(
            catchError(err => {
                console.error('Error fetching distributors:', err);
                return of([]);
            })
        );
        
        // --- Initialize Data Streams with definitive loading logic ---
        this.initializeDataStreams(filters$);
    }
    
    private initializeDataStreams(filters$: Observable<[string | null, { start: string; end: string; } | null]>): void {
        this.liftingTarget$ = filters$.pipe(
            switchMap(([code, range]) => {
                if (!code || !range) return of(null);
                this.setLoading('liftingTarget', true);
                return this.dashboardService.getLiftingTarget({ distributorCode: code, startDate: range.start, endDate: range.end }).pipe(
                    catchError(err => {
                        console.error('Error fetching Lifting Target:', err);
                        return of(null);
                    }),
                    finalize(() => this.setLoading('liftingTarget', false))
                );
            }), takeUntil(this.destroy$)
        );

        this.purchaseAmount$ = filters$.pipe(
            switchMap(([code, range]) => {
                if (!code || !range) return of(null);
                this.setLoading('purchaseAmount', true);
                return this.dashboardService.getPurchaseAmount({ distributorCode: code, startDate: range.start, endDate: range.end }).pipe(
                    catchError(err => {
                        console.error('Error fetching Purchase Amount:', err);
                        return of(null);
                    }),
                    finalize(() => this.setLoading('purchaseAmount', false))
                );
            }), takeUntil(this.destroy$)
        );

        this.imsTarget$ = filters$.pipe(
             switchMap(([code, range]) => {
                if (!code || !range) return of(null);
                this.setLoading('imsTarget', true);
                return this.dashboardService.getImsTarget({ distributorCode: code, startDate: range.start, endDate: range.end }).pipe(
                    catchError(err => {
                        console.error('Error fetching IMS Target:', err);
                        return of(null);
                    }),
                    finalize(() => this.setLoading('imsTarget', false))
                );
            }), takeUntil(this.destroy$)
        );
        
        this.imsInvoiced$ = this.selectedDistributorCode$.pipe(
            switchMap(code => {
                if (!code) return of(null);
                this.setLoading('imsInvoiced', true);
                return this.dashboardService.getImsInvoiced(code).pipe(
                    catchError(err => {
                        console.error('Error fetching IMS Invoiced:', err);
                        return of(null);
                    }),
                    finalize(() => this.setLoading('imsInvoiced', false))
                );
            }), takeUntil(this.destroy$)
        );
        
        // --- Repeat for all other data streams ---
        this.monthlyCollection$ = filters$.pipe(
            switchMap(([code, range]) => {
                if (!code || !range) return of(null);
                this.setLoading('monthlyCollection', true);
                return this.dashboardService.getMonthlyCollection({ distributorCode: code, startDate: range.start, endDate: range.end }).pipe(
                    catchError(err => { console.error('Error fetching Monthly Collection:', err); return of(null); }),
                    finalize(() => this.setLoading('monthlyCollection', false))
                );
            }), takeUntil(this.destroy$)
        );

        this.primaryOrder$ = filters$.pipe(
            switchMap(([code, range]) => {
                if (!code || !range) return of(null);
                this.setLoading('primaryOrder', true);
                return this.dashboardService.getPrimaryOrder({ distributorCode: code, startDate: range.start, endDate: range.end }).pipe(
                    catchError(err => { console.error('Error fetching Primary Order:', err); return of(null); }),
                    finalize(() => this.setLoading('primaryOrder', false))
                );
            }), takeUntil(this.destroy$)
        );

        this.secondaryOrder$ = filters$.pipe(
            switchMap(([code, range]) => {
                if (!code || !range) return of(null);
                this.setLoading('secondaryOrder', true);
                return this.dashboardService.getSecondaryOrder({ distributorCode: code, startDate: range.start, endDate: range.end }).pipe(
                    catchError(err => { console.error('Error fetching Secondary Order:', err); return of(null); }),
                    finalize(() => this.setLoading('secondaryOrder', false))
                );
            }), takeUntil(this.destroy$)
        );

        this.currentStock$ = this.selectedDistributorCode$.pipe(
            switchMap(code => {
                if (!code) return of(null);
                this.setLoading('currentStock', true);
                return this.dashboardService.getCurrentStock(code).pipe(
                    catchError(err => { console.error('Error fetching Current Stock:', err); return of(null); }),
                    finalize(() => this.setLoading('currentStock', false))
                );
            }), takeUntil(this.destroy$)
        );

        this.totalActiveCustomers$ = this.selectedDistributorCode$.pipe(
            switchMap(code => {
                if (!code) return of(null);
                this.setLoading('totalActiveCustomers', true);
                return this.dashboardService.getTotalActiveCustomers(code).pipe(
                    catchError(err => { console.error('Error fetching Total Active Customers:', err); return of(null); }),
                    finalize(() => this.setLoading('totalActiveCustomers', false))
                );
            }), takeUntil(this.destroy$)
        );

        this.totalInvoicedCustomers$ = this.selectedDistributorCode$.pipe(
            switchMap(code => {
                if (!code) return of(null);
                this.setLoading('totalInvoicedCustomers', true);
                return this.dashboardService.getTotalInvoicedCustomers(code).pipe(
                    catchError(err => { console.error('Error fetching Total Invoiced Customers:', err); return of(null); }),
                    finalize(() => this.setLoading('totalInvoicedCustomers', false))
                );
            }), takeUntil(this.destroy$)
        );

        this.historicalData$ = this.selectedDistributorCode$.pipe(
            switchMap(code => {
                if (!code) return of(null);
                this.setLoading('historicalData', true);
                return this.dashboardService.getHistoricalPerformance(code).pipe(
                    catchError(err => { console.error('Error fetching Historical Performance:', err); return of(null); }),
                    finalize(() => this.setLoading('historicalData', false))
                );
            }), takeUntil(this.destroy$)
        );

        this.srPerformance$ = this.selectedDistributorCode$.pipe(
            switchMap(code => {
                if (!code) return of(null);
                this.setLoading('srPerformance', true);
                return this.dashboardService.getSrPerformance(code).pipe(
                    catchError(err => { console.error('Error fetching SR Performance:', err); return of(null); }),
                    finalize(() => this.setLoading('srPerformance', false))
                );
            }), takeUntil(this.destroy$)
        );

        this.distributorReport$ = filters$.pipe(
            switchMap(([code, range]) => {
                if (!code || !range) return of(null);
                this.setLoading('distributorReport', true);
                return this.dashboardService.getDistributorReport({ distributorCode: code, startDate: range.start, endDate: range.end }).pipe(
                    catchError(err => { console.error('Error fetching Distributor Report:', err); return of(null); }),
                    finalize(() => this.setLoading('distributorReport', false))
                );
            }), takeUntil(this.destroy$)
        );
    }
    
    private setLoading(key: keyof typeof this.isLoading, value: boolean): void {
        this.zone.run(() => {
            this.isLoading[key] = value;
            this.cdr.markForCheck(); // Explicitly tell Angular to check for changes
        });
    }

    onDistributorChange(distributor: Distributor | null): void {
        const code = distributor ? distributor.code : null;
        this.selectedDistributorCode$.next(code);
    }

    onDateRangeChange(start: string, end: string): void {
        if (start && end) {
            this.selectedDateRange$.next({ start, end });
        }
    }

    customSearchFn(term: string, item: Distributor) {
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
