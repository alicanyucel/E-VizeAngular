import {
  Component,
  OnDestroy,
  OnInit
} from "@angular/core";
import { Subscription } from "rxjs";
import { environment } from "../../../environment/environment";
import { LanguageService } from "../../shared/language.service";

@Component({
  selector: "app-footer",
  templateUrl: "./footer.component.html",
})
export class FooterComponent implements OnInit, OnDestroy {
  constructor(private languageService: LanguageService) { }
  private subscriptions = new Subscription();

  apiUrl = environment.apiUrl;
  section: any;

  ngOnInit() {
    this.subscriptions.add(this.languageService.sectionData.subscribe((_: string) => {
      this.section = this.languageService.getSection("footer");
    }));
  }
  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
