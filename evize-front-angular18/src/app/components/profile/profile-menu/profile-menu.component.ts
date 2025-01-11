import { Component, Input, OnDestroy, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { Subscription } from "rxjs";
import { environment } from "../../../../environment/environment";
import { LanguageService } from "../../../shared/language.service";

@Component({
  selector: "profile-menu",
  templateUrl: "./profile-menu.component.html",
})
export class ProfileMenuComponent implements OnInit, OnDestroy {
  @Input() public active: string = "profile";
  constructor(
    private languageService: LanguageService,
    private router: Router,
  ) { }
  private subscriptions = new Subscription();

  environment = environment;
  showVisaStatusModal = false;
  section: any;
  ngOnInit(): void {
    this.subscriptions.add(this.languageService.sectionData.subscribe((_: string) => {
      this.section = this.languageService.getSection("profile");
    }));
  }
  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
  apply() {
    if (typeof localStorage !== "undefined") {
      try {
        const json = JSON.parse(
          localStorage.getItem("latestApplication") ??
          "{application: null, selectedModel: null}"
        );
        if (json.application != null && json.selectedModel != null) {
          this.showVisaStatusModal = true;
          return;
        }
      } catch { }
    }
    localStorage.removeItem("applicationStatus");
    this.router.navigate(["/apply"]);
  }
}
