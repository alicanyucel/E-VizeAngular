import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { BehaviorSubject, Observable } from "rxjs";
import { environment } from "../../environment/environment";

@Injectable({
  providedIn: "root",
})
export class MemberService {
  constructor(private httpClient: HttpClient, private router: Router) {
    const member = this.getLocalStorageMember();
    this.member?.next(
      JSON.stringify(member) == "{}" ? null : member
    );
    if (typeof window !== "undefined") {
      if (this.member?.value?.guid) {
        this.member.subscribe((x) => {
          if (!x || !x.guid) return;
          this.httpClient
            .get(
              `${environment.apiUrl}/member/get-website?timestamp=${new Date().getTime()}`
            )
            .subscribe({
              next: (v) => { },
              error: (e) => {
                this.logout();
              },
              complete: () => { },
            });
        });
      }
    }
  }
  public member: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  private authLocalStorageToken = `${environment.localStorageAuthKey}`;

  login(email: string, password: string) {
    return this.httpClient.post(`${environment.apiUrl}/member/login`, {
      username: email,
      password: password,
    });
  }

  logout() {
    localStorage.clear();
    this.member.next(null);
    this.router.navigate(["/"]);
  }
  checkSession() { }

  getLocalStorageMember() {
    if (typeof localStorage !== "undefined") {
      const config = localStorage.getItem("member");
      try {
        const json = JSON.parse(config ?? "{}");
        return json;
      } catch {
        this.logout();
        return null;
      }
    }
  }

  getLocalStorage() {
    if (typeof localStorage !== "undefined") {
      const config = localStorage.getItem(this.authLocalStorageToken);
      try {
        const json = JSON.parse(config ?? "{}");
        return json;
      } catch {
        this.logout();
        return null;
      }
    }
  }
  setLocalStorage(value: any) {
    localStorage?.setItem(this.authLocalStorageToken, JSON.stringify(value));
    this.httpClient
      .get(
        `${environment.apiUrl
        }/member/get-website`,
        {
          headers: {
            Authorization: `Bearer ${value?.data?.token}`
          }
        }
      )
      .subscribe((result: any) => {
        localStorage?.setItem("member", JSON.stringify(result?.data));
        this.member.next(
          JSON.stringify(this.getLocalStorageMember()) == "{}"
            ? null
            : this.getLocalStorageMember()
        );
      });
  }

  setLocalStorageMember(value: any) {
    localStorage?.setItem("member", JSON.stringify(value));
    this.member.next(value)
  }
  update(user: any): Observable<any> {
    return this.httpClient.put(environment.apiUrl + "/member/update-website", user);
  }
  updateParent(user: any): Observable<any> {
    return this.httpClient.put(environment.apiUrl + "/member/updateparent-website", user);
  }
  addParent(user: any): Observable<any> {
    return this.httpClient.post(environment.apiUrl + "/member/addParent-website", user);
  }
  addTravelDocument(document: any): Observable<any> {
    return this.httpClient.post(
      environment.apiUrl + "/traveldocumentmember/add-website",
      document
    );
  }
}
