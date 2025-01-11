import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { catchError, from, Observable, switchMap, take } from 'rxjs';
import { environment } from '../../environment/environment';
import { isPlatformBrowser } from '@angular/common';
import { TokenService } from './token.service';

@Injectable()
export class SampleInterceptor implements HttpInterceptor {
    constructor(
        @Inject(PLATFORM_ID) private _platformId: Object,
        private tokenService: TokenService
    ) { }

    intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
        if (isPlatformBrowser(this._platformId)) {
            const authStorage = localStorage?.getItem(environment.localStorageAuthKey);
            try {
                if (authStorage) {
                    const parsedAuthStorage = JSON.parse(authStorage);
                    if (new Date().getTime() > new Date(parsedAuthStorage?.data?.expiration).getTime()) {
                        if (!this.tokenService.isRefreshing) {
                            this.tokenService.setRefreshing(true);
                            return from(
                                this.refreshToken(parsedAuthStorage?.data?.token, parsedAuthStorage?.data?.guid, parsedAuthStorage?.data?.refreshToken)
                            ).pipe(
                                switchMap((newToken) => {
                                    this.tokenService.setRefreshing(false);
                                    this.tokenService.notifyNewToken(newToken);
                                    if (!newToken) {
                                        localStorage.clear();
                                        return next.handle(request);
                                    }
                                    const clonedRequest = request.clone({
                                        setHeaders: {
                                            Authorization: `Bearer ${newToken}`,
                                        },
                                    });
                                    return next.handle(clonedRequest);
                                }),
                                catchError((error) => {
                                    this.tokenService.setRefreshing(false);
                                    console.error('Token refresh failed:', error);
                                    return next.handle(request);
                                })
                            );
                        } else {
                            // Wait for the token refresh to complete
                            return this.tokenService.getRefreshSubject().pipe(
                                take(1),
                                switchMap((newToken) => {
                                    if (!newToken) {
                                        return next.handle(request);
                                    }
                                    const clonedRequest = request.clone({
                                        setHeaders: {
                                            Authorization: `Bearer ${newToken}`,
                                        },
                                    });
                                    return next.handle(clonedRequest);
                                })
                            );
                        }
                    } else {
                        const clonedRequest = request.clone({
                            setHeaders: {
                                Authorization: `Bearer ${parsedAuthStorage?.data?.token}`,
                            },
                        });
                        return next.handle(clonedRequest);
                    }
                }
            } catch (error) {
                console.error('Error parsing auth storage:', error);
            }
        }

        return next.handle(request);
    }

    private async refreshToken(token: string, guid: string, refreshToken: string): Promise<string | null> {
        const response = await fetch(`${environment.apiUrl}/member/refresh`, {
            method: 'POST',
            body: JSON.stringify({
                guid: guid,
                refreshToken: refreshToken,
            }),
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            return null;
        }

        const refreshedToken = await response.json();
        if (refreshedToken && refreshedToken.token) {
            localStorage.setItem(
                environment.localStorageAuthKey, JSON.stringify({ data: refreshedToken })
            );
            return refreshedToken.token;
        }
        return null;
    }
}
