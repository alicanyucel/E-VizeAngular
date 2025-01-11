import { Component, OnDestroy, OnInit } from "@angular/core";
import { NavigationStart, Router } from "@angular/router";
import { Subscription } from "rxjs";
import { MemberService } from "../shared/member.service";
import { SpinnerService } from "./spinner/spinner.service";
@Component({
  selector: "app-layout",
  templateUrl: "./layout.component.html",
})
export class LayoutComponent implements OnInit, OnDestroy {
  constructor(
    private memberService: MemberService,
    private spinnerService: SpinnerService,
    private router: Router
  ) { }
  private subscriptions = new Subscription();

  user: any = null;
  spinnerVisible = false;
  url = "";
  ngOnInit() {
    this.subscriptions.add(this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        if (this.url != "" && this.url != event.url) {
          this.spinnerService.display(true);
        }
        this.url = event.url;
      }
    }));
    this.subscriptions.add(this.memberService.member.subscribe((member) => {
      this.user = member;
    }));
    this.subscriptions.add(this.spinnerService.status.subscribe((status) => {
      this.spinnerVisible = status;
    }));
  }
  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}
