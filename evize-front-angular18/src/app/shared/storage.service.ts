import { Injectable } from "@angular/core";
import { environment } from "../../environment/environment";

@Injectable({
  providedIn: "root",
})
export class StorageService {
  constructor() {}

  getLocalStorage() {
    if (typeof localStorage !== "undefined") {
      const config = localStorage.getItem(environment.localStorageKey);
      return JSON.parse(config ?? "{}");
    }
    return null;
  }
  setLocalStorage(key: string, value: string) {
    let ksConfig = JSON.parse(
      localStorage?.getItem(environment.localStorageKey) ?? "{}"
    );
    localStorage?.setItem(
      environment.localStorageKey,
      JSON.stringify({ ...ksConfig, [key]: value })
    );
  }
}
