import { Component, Input, OnDestroy, OnInit } from "@angular/core";
import { Subscription } from "rxjs";
import { LanguageService } from "../../../shared/language.service";

@Component({
  selector: "app-application-status-bar",
  templateUrl: "./application-status-bar.component.html",
})
export class ApplicationStatusBarComponent implements OnInit, OnDestroy {
  @Input() public step: number = 5;
  private subscriptions = new Subscription();

  constructor(private languageService: LanguageService) { }
  section: any;
  ngOnInit() {
    this.subscriptions.add(this.languageService.sectionData.subscribe((newLanguage: string) => {
      this.section = this.languageService.getSection("newApplication");
    }));
  }
  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}
