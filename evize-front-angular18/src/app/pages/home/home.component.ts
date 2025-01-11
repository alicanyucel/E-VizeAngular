import { isPlatformBrowser } from "@angular/common";
import { HttpClient } from "@angular/common/http";
import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  Inject,
  OnDestroy,
  PLATFORM_ID,
} from "@angular/core";
import { Title } from "@angular/platform-browser";
import { Router } from "@angular/router";
import dayjs from "dayjs";
import { Subscription } from "rxjs";
import { environment } from "../../../environment/environment";
import { SpinnerService } from "../../components/spinner/spinner.service";
import { LanguageService } from "../../shared/language.service";
import { MemberService } from "../../shared/member.service";

export interface Error {
  visaTypeId: string;
  transitDestinationCountryGuid: string;
  travelDocumentGuid: string;
  nationality: string;
}
@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
})
export class HomeComponent implements AfterViewInit, OnDestroy {
  constructor(
    private languageService: LanguageService,
    private httpClient: HttpClient,
    private memberService: MemberService,
    private cdr: ChangeDetectorRef,
    private titleService: Title,
    private spinnerService: SpinnerService,
    private router: Router,
    @Inject(PLATFORM_ID) private _platformId: Object
  ) { }
  private subscriptions = new Subscription();

  showMissingInformation = false;
  missingErrors: any[] = [];
  visaTypeId: any = null;
  nationality: any = null;
  nationalities$: any;
  translatedNationalities: any;
  showVisaStatusModal = false;
  transitNationalities$: any;
  translatedTransitNationalities: any;

  transitSourceNationalities$: any;
  translatedTransitSourceNationalities: any;

  eligible: string | null = null;
  conditions: any;
  visaResultModal = false;
  showSuccessModal = false;
  showErrorModal = false;
  showExemptModal = false;
  section: any = [];

  coverImages: string[] = [];
  coverClass1 = "opacity-100";
  coverClass2 = "opacity-0";
  coverImageSrc1: any = null;
  coverImageSrc2: any = null;
  currentCoverImageIndex = 1;
  user: any = null;
  errors: Error = {
    visaTypeId: "",
    transitDestinationCountryGuid: "",
    travelDocumentGuid: "",
    nationality: "",
  };

  getVisaType(visaType: string) {
    return this.languageService.getVisaType(visaType);
  }

  getTranslation(guid: string) {
    return this.languageService.getTranslation(guid);
  }

  ngOnInit() {
    this.spinnerService.display(true);
    if (isPlatformBrowser(this._platformId)) {
      this.subscriptions.add(this.memberService.member.subscribe((member: any) => {
        if (member) this.user = member;
      }));

      this.subscriptions.add(this.languageService.sectionData.subscribe(() => {
        this.section = this.languageService.getSection("homepage");
        if (this.section == null) return;
        this.translatedNationalities = [];
        if (this.nationalities$)
          for (let nation of this.nationalities$) {
            this.translatedNationalities.push({
              guid: nation.guid,
              name: this.getTranslation(nation.guid),
            });
          }
        this.translatedNationalities = this.translatedNationalities.sort(
          (x: any, y: any) => ("" + x.name).localeCompare(y.name)
        );

        this.translatedTransitNationalities = [];
        if (this.transitNationalities$)
          for (let nation of this.transitNationalities$) {
            this.translatedTransitNationalities.push({
              guid: nation.guid,
              name: this.languageService.getTranslation(nation.guid),
            });
          }

        this.section?.slider?.forEach((asset: any) => {
          this.coverImages.push(asset.asset);
        });
        const startIndex = Math.floor(Math.random() * this.coverImages.length);

        const nextIndex = (startIndex + 1) % this.coverImages.length;

        this.coverImageSrc1 = this.coverImages[startIndex];
        this.coverImageSrc2 = this.coverImages[nextIndex];
        if (!this.section) return;
        this.titleService.setTitle(this.section.og.title);
        this.spinnerService.display(false);

        this.httpClient
          .get(
            `${environment.apiUrl}/nationality/list?isTransitDestinations=true`
          )
          .subscribe((data: any) => {
            this.transitNationalities$ = data.data;
            this.translatedTransitNationalities = [];
            for (let nation of this.transitNationalities$) {
              this.translatedTransitNationalities.push({
                guid: nation.guid,
                name: this.languageService.getTranslation(nation.guid),
              });
            }
          });

        this.httpClient
          .get(`${environment.apiUrl}/nationality/list?isTransitSources=true`)
          .subscribe((data: any) => {
            this.transitSourceNationalities$ = data.data;
            this.translatedTransitSourceNationalities = [];
            for (let nation of this.transitSourceNationalities$) {
              this.translatedTransitSourceNationalities.push({
                guid: nation.guid,
                name: this.languageService.getTranslation(nation.guid),
              });
            }
          });

        this.httpClient
          .get(`${environment.apiUrl}/nationality/list`)
          .subscribe((data: any) => {
            this.nationalities$ = data.data;
            this.translatedNationalities = [];
            for (let nation of this.nationalities$) {
              this.translatedNationalities.push({
                guid: nation.guid,
                name: this.languageService.getTranslation(nation.guid),
              });
            }
            this.translatedNationalities = this.translatedNationalities.sort(
              (x: any, y: any) => ("" + x.name).localeCompare(y.name)
            );
          });
      }));
      this.httpClient
        .get(`${environment.apiUrl}/traveldocument/list?status=1`)
        .subscribe((data: any) => {
          this.travelDocuments = data.data;
        });

      setInterval(() => {
        if (this.coverClass1.startsWith("opacity-100")) {
          this.currentCoverImageIndex =
            (this.currentCoverImageIndex + 1) % this.coverImages.length;
          this.coverClass1 =
            "opacity-0 transition-all ease-out duration-[5000ms]";
          this.coverClass2 =
            "opacity-100 transition-all ease-out duration-[5000ms]";
          setTimeout(() => {
            this.coverImageSrc1 = this.coverImages[this.currentCoverImageIndex];
          }, 5000);
        } else {
          this.currentCoverImageIndex =
            (this.currentCoverImageIndex + 1) % this.coverImages.length;
          this.coverClass1 =
            "opacity-100 transition-all ease-out duration-[5000ms]";
          this.coverClass2 =
            "opacity-0 transition-all ease-out duration-[5000ms]";
          setTimeout(() => {
            this.coverImageSrc2 = this.coverImages[this.currentCoverImageIndex];
          }, 5000);
        }
      }, 10000);
    }
  }
  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
  getInput(key: string) {
    return this.languageService.getInput(key);
  }

  models: any;

  environment = environment;

  travelDocuments: any;
  travelDocumentsFiltered: any;
  travelDocumentGuid = null;

  transitDestinationCountryGuid = null;
  countries: any;

  updateVisaType() {
    if (this.visaTypeId == 1) {
      this.travelDocumentsFiltered = this.travelDocuments.filter((x: any) =>
        x.travelDocumentVisaTypeDtos.find((y: any) => y.visaTypeDto?.code == 1)
      );
    } else if (this.visaTypeId == 2) {
      this.travelDocumentsFiltered = this.travelDocuments.filter((x: any) =>
        x.travelDocumentVisaTypeDtos.find((y: any) => y.visaTypeDto?.code == 5)
      );
    }
  }
  getErrorMessage(key: string) {
    return this.languageService.getError(key);
  }
  hasError() {
    return Object.values(this.errors).find((x: string) => x != "");
  }

  checkVisa() {
    this.errors = {
      visaTypeId: "",
      transitDestinationCountryGuid: "",
      travelDocumentGuid: "",
      nationality: "",
    };
    this.missingErrors = [];
    if (this.visaTypeId == null) {
      this.errors.visaTypeId = "required";
      this.missingErrors.push(this.getInput("visaType")?.label);
    }
    if (this.nationality == null) {
      this.missingErrors.push(this.getInput("nationality")?.label);
      this.errors.nationality = "required";
    }
    if (this.travelDocumentGuid == null) {
      this.errors.travelDocumentGuid = "required";
      this.missingErrors.push(this.getInput("passportType")?.label);
    }
    if (this.visaTypeId == 2)
      if (
        this.transitDestinationCountryGuid == "" ||
        this.transitDestinationCountryGuid == null
      ) {
        this.errors.transitDestinationCountryGuid = "required";
        this.missingErrors.push(this.getInput("targetCountry")?.label);
      }

    if (this.hasError()) {
      this.showMissingInformation = true;
      return;
    }
    let selectedModel: any = null;

    this.spinnerService.display(true);

    this.httpClient
      .post(`${environment.apiUrl}/model/check`, {
        entryDate: dayjs().format("YYYY-MM-DD"),
        nationalityGuid: this.nationality,
        travelDocumentGuid: this.travelDocumentGuid,
        visaTypeId: this.visaTypeId,
        transitDestinationCountryGuid: this.transitDestinationCountryGuid,
      })
      .subscribe({
        next: (v: any) => {
          if (v.data.guid != "00000000-0000-0000-0000-000000000000") {
            selectedModel = v.data;
          }
          this.conditions = null;
          if (!selectedModel) this.showErrorModal = true;
          if (selectedModel) {
            if (selectedModel.regime?.regimeVisaType.visaType.code == 0) {
              this.showExemptModal = true;
              this.conditions = selectedModel.modelConditionDtos;
            } else {
              this.showSuccessModal = true;
            }
          }
          this.spinnerService.display(false);
          this.cdr.detectChanges();
        },
        error: (e) => {
          this.spinnerService.display(false);

          this.showErrorModal = true;
        },
        complete: () => { },
      });
  }
  ngAfterViewInit(): void { }
  selectModel(event: any) {
    this.visaTypeId = event;
    this.eligible = null;
    this.errors = {
      visaTypeId: "",
      transitDestinationCountryGuid: "",
      travelDocumentGuid: "",
      nationality: "",
    };
  }
  apply() {
    if (this.user) {
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
    } else {
      this.router.navigate(["/login"]);
    }
  }
}
