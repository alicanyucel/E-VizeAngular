import { Component, OnDestroy, OnInit } from "@angular/core";
import { Subscription } from "rxjs";
import { SpinnerService } from "../../components/spinner/spinner.service";
import { LanguageService } from "../../shared/language.service";

@Component({
  selector: "app-privacy-policy",
  templateUrl: "./privacy-policy.component.html",
})
export class PrivacyPolicyComponent implements OnInit, OnDestroy {
  constructor(
    private languageService: LanguageService,
    private spinnerService: SpinnerService,
  ) { }
  private subscriptions = new Subscription();

  section: any;
  filterText = "";
  selectedIndex = 0;
  filteredContent: any;
  ngOnInit() {
    this.spinnerService.display(true);
    this.subscriptions.add(this.languageService.sectionData.subscribe(() => {
      this.section = this.languageService.getSection("privacy_policy");
      if (!this.section) return;
      this.spinnerService.display(false);
    }));
  }
  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
