import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class TokenService {
    private refreshing = false;
    private refreshSubject = new BehaviorSubject<string | null>(null);

    get isRefreshing(): boolean {
        return this.refreshing;
    }

    setRefreshing(state: boolean) {
        this.refreshing = state;
    }

    getRefreshSubject(): Observable<string | null> {
        return this.refreshSubject.asObservable();
    }

    notifyNewToken(token: string | null) {
        this.refreshSubject.next(token);
    }
}