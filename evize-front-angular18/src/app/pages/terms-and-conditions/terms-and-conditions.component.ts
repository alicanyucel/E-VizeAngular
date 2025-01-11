import { isPlatformBrowser } from "@angular/common";
import { Component, Inject, OnDestroy, OnInit, PLATFORM_ID } from "@angular/core";
import { Subscription } from "rxjs";
import { SpinnerService } from "../../components/spinner/spinner.service";
import { LanguageService } from "../../shared/language.service";

@Component({
  selector: "app-terms-and-conditions",
  templateUrl: "./terms-and-conditions.component.html",
})
export class TermsAndConditionsComponent implements OnInit, OnDestroy {
  constructor(
    private languageService: LanguageService,
    private spinnerService: SpinnerService,
    @Inject(PLATFORM_ID) private _platformId: Object
  ) { }
  private subscriptions = new Subscription();

  section: any;
  filterText = "";
  selectedIndex = 0;
  filteredContent: any;
  ngOnInit() {
    this.spinnerService.display(true);
    if (isPlatformBrowser(this._platformId)) {
      this.subscriptions.add(this.languageService.sectionData.subscribe(() => {
        this.section = this.languageService.getSection("terms_and_conditions");
        if (!this.section) return;
        this.spinnerService.display(false);
      }));
    }
  }
  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
