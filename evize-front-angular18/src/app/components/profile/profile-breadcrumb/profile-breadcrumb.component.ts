import { Component, Input, OnDestroy, OnInit } from "@angular/core";
import { Subscription } from "rxjs";
import { environment } from "../../../../environment/environment";
import { LanguageService } from "../../../shared/language.service";

@Component({
  selector: "profile-breadcrumb",
  templateUrl: "./profile-breadcrumb.component.html",
})
export class ProfileBreadcrumbComponent implements OnInit, OnDestroy {
  @Input() public active: string = "";
  constructor(private languageService: LanguageService) { }
  private subscriptions = new Subscription();

  environment = environment;
  section: any;
  ngOnInit(): void {
    this.subscriptions.add(this.languageService.sectionData.subscribe((_: string) => {
      this.section = this.languageService.getSection("profile");
    }));
  }
  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
