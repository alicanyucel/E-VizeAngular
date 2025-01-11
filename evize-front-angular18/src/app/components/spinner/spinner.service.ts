import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class SpinnerService {
  public status: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);

  display(value: boolean) {
    this.status.next(value);
  }
}
