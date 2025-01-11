import { CommonModule, DOCUMENT } from "@angular/common";
import { HttpClient } from "@angular/common/http";
import { ChangeDetectorRef, Component, Inject, OnInit } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { environment } from "../environment/environment";
import { LanguageService } from "./shared/language.service";
import { StorageService } from "./shared/storage.service";

@Component({
  selector: "app-root",
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: "./app.component.html",
})
export class AppComponent implements OnInit {
  constructor(
    private httpClient: HttpClient,
    @Inject(DOCUMENT) private serverDocument: any,
    private storageService: StorageService,
    private languageService: LanguageService,
    private cdr: ChangeDetectorRef
  ) {
    let domain = this.serverDocument?.location?._href
      ?.split("//")[1]
      ?.split("/")[0];

    if (environment.testUrl != "") domain = environment.testUrl;

    this.httpClient
      .get(
        `${environment.apiUrl
        }/website/getdomain/${domain}?timestamp=${new Date().getTime()}`
      )
      .subscribe((webSiteResult: any) => {
        if (webSiteResult?.data.guid) {
          const websiteGuid = webSiteResult.data.guid;
          this.httpClient
            .get(
              `${environment.apiUrl}/sectioncontent/list/${webSiteResult.data.guid
              }?timestamp=${new Date().getTime()}`
            )
            .subscribe((result: any) => {
              result = result.data.filter(
                (x: any) =>
                  x.sectionContentWebsiteDtos[0]?.websiteGuid == websiteGuid
              );
              let sections = result;
              let pageTitle = "";
              const siteSettings = sections?.find(
                (x: any) =>
                  x.sectionName === "Site Ayarları" &&
                  JSON.parse(x.content)?.lang ===
                  (this.storageService.getLocalStorage()?.currentLanguage ??
                    "tr")
              );
              if (siteSettings) {
                pageTitle = JSON.parse(siteSettings.content)?.data?.title ?? "";
              }

              this.httpClient
                .get(
                  `${environment.apiUrl
                  }/translate/list?timestamp=${new Date().getTime()}`
                )
                .subscribe((result: any) => {
                  this.languageService.setTranslateData(
                    result?.data?.reverse()
                  );
                  this.languageService.setSectionData(sections?.reverse());
                  this.cdr.detectChanges();
                });
            });
        }
      });
  }
  ngOnInit(): void { }
}
