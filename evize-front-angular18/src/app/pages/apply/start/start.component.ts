import { isPlatformBrowser } from "@angular/common";
import { HttpClient } from "@angular/common/http";
import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  Inject,
  OnDestroy,
  OnInit,
  PLATFORM_ID
} from "@angular/core";
import { Title } from "@angular/platform-browser";
import { Router } from "@angular/router";
import dayjs from "dayjs";
import { Subscription } from "rxjs";
import { environment } from "../../../../environment/environment";
import { SpinnerService } from "../../../components/spinner/spinner.service";
import { LanguageService } from "../../../shared/language.service";
import { MemberService } from "../../../shared/member.service";
import { Application, ApplicationService } from "../application.service";
interface Error {
  flightInformation: string;
  ticketReservationNumber: string;
  ticketNumber: string;
  address: string;
  transitDestinationCountryGuid: string;
  visaTypeId: string;
  arrivalDate: string;
  travelDocumentGuid: string;
}
@Component({
  selector: "app-apply-start",
  templateUrl: "./start.component.html",
})
export class ApplyStartComponent implements OnInit, AfterViewInit, OnDestroy {
  constructor(
    private cdr: ChangeDetectorRef,
    private router: Router,
    private http: HttpClient,
    private applicationService: ApplicationService,
    private memberService: MemberService,
    private titleService: Title,
    private languageService: LanguageService,
    private spinnerService: SpinnerService,
    @Inject(PLATFORM_ID) private _platformId: Object
  ) { }
  private subscriptions = new Subscription();

  application: Application = { status: true }
  visaTypeId: any = null;
  selectedModel: any = null;

  minArrivalDate = new Date();

  showSuccessModal = false;
  showExemptModal = false;
  showErrorModal = false;
  canApplyTransit = false;

  memberTravelDocuments: any;

  errors: Error = {
    flightInformation: "",
    ticketReservationNumber: "",
    ticketNumber: "",
    address: "",
    transitDestinationCountryGuid: "",
    visaTypeId: "",
    arrivalDate: "",
    travelDocumentGuid: "",
  };
  section: any;
  missingProfile = false;
  missingPassport = false;
  error = false;
  aggreement = false;
  showMissingInformation = false;
  missingErrors: any[] = [];

  missingPassportDetail: any = null;
  translatedDestinationCountries: any = [];
  transitDestinationCountries: any;
  travelDocuments: any;
  countries: any;
  user: any = null;
  environment = environment;
  models: any;
  documentTypes: any;
  ngAfterViewInit(): void { }
  showDateError = false;
  getNotes() {
    return this.visaTypeId == 2
      ? this.section?.visaType?.notes?.notesHtv
      : this.section?.visaType?.notes?.notes;
  }
  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
  ngOnInit(): void {
    this.spinnerService.display(true);
    if (isPlatformBrowser(this._platformId)) {
      this.subscriptions.add(this.memberService.member.subscribe((member) => {
        if (!member) {
          this.router.navigate(["/login"]);
        }
        this.user = member;

        if (
          member.photo == null ||
          member.address == "" ||
          member.address == null ||
          member.phone == "" ||
          member.phone == null
        )
          this.missingProfile = true;

        this.http
          .post(`${environment.apiUrl}/model/check`, {
            entryDate: dayjs().format("YYYY-MM-DD"),
            nationalityGuid: this.user.nationalityGuid,
            memberGuid: this.user.guid,
            visaTypeId: 2,
          })
          .subscribe({
            next: (v: any) => {
              if (v.data.guid != "00000000-0000-0000-0000-000000000000") {
                this.canApplyTransit = true;
              }
            },
            error: (e) => { },
            complete: () => { },
          });

        this.http.get(`${environment.apiUrl}/traveldocumentmember/list-website/${this.user.guid}?status=1&timestamp=${new Date().getTime()}`).subscribe((data: any) => {
          this.memberTravelDocuments = data.data;
          if (this.memberTravelDocuments.length == 0 && !this.missingProfile)
            this.missingPassport = true;
        });

        if (typeof localStorage !== "undefined") {
          const config = localStorage.getItem("latestApplication");
          try {
            const json = JSON.parse(config ?? "{}");
            if (json.selectedModel == null) {
              this.router.navigate(["/apply"]);
              return;
            }
            this.applicationService = json;
            this.application = json.application;
            this.visaTypeId = json.visaTypeId;
            this.selectedModel = json.selectedModel;

            localStorage?.setItem("applicationStatus", "");
          } catch { }
        }
      }));

      this.subscriptions.add(this.languageService.sectionData.subscribe((_: string) => {
        this.section = this.languageService.getSection("newApplication");
        if (!this.section) return;
        this.titleService.setTitle(this.section?.visaType?.title);

        this.http.get(`${environment.apiUrl}/nationality/list?isTransitDestinations=true`).subscribe((data: any) => {
          this.countries = data.data;
          this.translatedDestinationCountries = [];
          if (this.countries)
            for (let nation of this.countries) {
              this.translatedDestinationCountries.push({
                guid: nation.guid,
                name: this.languageService.getTranslation(nation.guid),
              });
            }
          this.http.get(`${environment.apiUrl}/traveldocument/list?status=1&timestamp=${new Date().getTime()}`).subscribe((data: any) => {
            this.travelDocuments = data.data;
            this.spinnerService.display(false);
          });
        });
      }));
    }
  }
  getTranslation(guid: string) {
    return this.languageService.getTranslation(guid);
  }
  getMemberTravelDocuments() {
    if (this.visaTypeId == 2) {
      return this.memberTravelDocuments?.filter(
        (x: any) => x.travelDocumentDto.code == "UMP"
      );
    } else return this.memberTravelDocuments;
  }
  cancel() {
    this.selectedModel = null;
    this.application.travelDocumentGuid = null;
    this.visaTypeId = null;
    this.application.transitDestinationCountryGuid = null;
    this.application.flightInformation = null;
    this.application.ticketReservationNumber = "";
    this.application.ticketNumber = "";
    this.application.arrivalDestinationAddress = "";
    this.application.entryDate = null;
    this.cdr.detectChanges();
  }
  formatDate(date: string) {
    return new Date(date.split("T")[0] ?? "").toLocaleDateString("tr-TR", {
      year: "numeric",
      month: "numeric",
      day: "numeric",
    });
  }
  setAggreement() {
    this.error = false;
    this.aggreement = !this.aggreement;
    if (this.aggreement) this.togglePopup();
  }
  getTravelDocuments() {
    return this.models?.filter(
      (x: any) => x.nationalityGuid == this.user?.nationalityGuid
    );
  }

  getResidencePeriod() {
    return this.selectedModel.regime.residencePeriod;
  }
  getPrice() {
    return this.selectedModel.regime.price;
  }
  getPeriodValidity() {
    return this.selectedModel.regime.periodValidity;
  }

  getEntryType() {
    return this.selectedModel.regime.regimeVisaType
      .visaEntryType.code == 1
      ? this.section.single
      : this.section.multi;
  }
  getInput(key: string) {
    return this.languageService.getInput(key);
  }

  getDate1() {
    return new Date(this.application.entryDate!).toLocaleDateString("tr-TR", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }
  getDate2() {
    const d = new Date(this.application.entryDate!);
    d.setDate(d.getDate() + this.getPeriodValidity());
    return d.toLocaleDateString("tr-TR", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }
  toProfile() {
    this.spinnerService.display(true);
    this.router.navigate(["/profile"]);
  }
  popup = false;
  togglePopup() {
    this.popup = !this.popup;

    const body = document.getElementsByTagName("body")[0];
    if (this.popup) {
      body.classList.add("modal-open");
    } else {
      body.classList.remove("modal-open");
    }
    this.cdr.detectChanges();
  }

  transit = false;

  surnamePopup = false;
  selectModel() {
    if (this.visaTypeId == 2) {
      if (this.memberTravelDocuments?.filter((x: any) => x.travelDocumentGuid == "90e32d6b-a5c6-4dbb-af79-e074ee6731af")?.length == 0) {
        this.missingPassport = true;
        this.missingPassportDetail = this.getTranslation("90e32d6b-a5c6-4dbb-af79-e074ee6731af");
      }
      if (this.user.surname == "" || this.user.surname == null) {
        this.surnamePopup = true;
        return;
      }
    }
    this.selectedModel = null;
    this.application.travelDocumentGuid = null;
    this.application.entryDate = "";
    this.application.transitDestinationCountryGuid = null;
    this.application.flightInformation = null;
    this.application.ticketReservationNumber = "";
    this.application.ticketNumber = "";
    this.application.arrivalDestinationAddress = "";
    this.application.applicationAdditionalInformation = null;
    this.errors.visaTypeId = "";
    this.errors = {
      flightInformation: "",
      ticketNumber: "",
      ticketReservationNumber: "",
      address: "",
      transitDestinationCountryGuid: "",
      visaTypeId: "",
      arrivalDate: "",
      travelDocumentGuid: "",
    };
  }
  eligible: any = null;
  conditions: any;
  hasError() {
    return Object.values(this.errors).find((x: string) => x != "");
  }

  nextStep() {
    this.errors.ticketNumber = "";
    this.errors.ticketReservationNumber = "";
    this.missingErrors = [];
    if (this.visaTypeId == null) {
      this.errors.visaTypeId = "required";
      this.missingErrors.push(this.getInput("visaType")?.label);
    }
    else {
      if (this.application.travelDocumentGuid == "" || this.application.travelDocumentGuid == null) {
        this.errors.travelDocumentGuid = "required";
        this.missingErrors.push(this.getInput("passportType")?.label);
      }
      if (this.application.entryDate == "" || this.application.entryDate == null) {
        this.errors.arrivalDate = "required";
        this.missingErrors.push(this.getInput("arrivalDate")?.label);
      }

      if (this.visaTypeId == 2) {
        if (this.application.flightInformation == "" || this.application.flightInformation == null) {
          this.missingErrors.push(this.getInput("flightInformation")?.label);

          this.errors.flightInformation = "required";
        }
        if (this.application.flightInformation == "1") {
          if (this.application.ticketNumber == "") {
            this.missingErrors.push(this.getInput("ticketInformation")?.label);

            this.errors.ticketNumber = "required";
          }
        } else if (this.application.flightInformation == "2") {
          if (this.application.ticketReservationNumber == "") {
            this.missingErrors.push(this.getInput("reservationNumber")?.label);

            this.errors.ticketReservationNumber = "required";
          }
        }
        if (this.application.arrivalDestinationAddress == "") {
          this.errors.address = "required";
          this.missingErrors.push(this.getInput("destinationAddress")?.label);
        }

        if (this.visaTypeId == 2 && this.application.transitDestinationCountryGuid == null) {
          this.errors.transitDestinationCountryGuid = "required";
          this.missingErrors.push(this.getInput("targetCountry")?.label);
        }
      }

    }

    if (this.hasError()) {
      this.showMissingInformation = true;
      document.querySelector(".error")?.scrollIntoView({ behavior: "smooth" });
      return;
    }
    let selectedModel: any = null;

    this.spinnerService.display(true);
    this.http
      .post(`${environment.apiUrl}/model/check`, {
        entryDate: dayjs().format("YYYY-MM-DD"),
        nationalityGuid: this.user.nationalityGuid,
        travelDocumentGuid: this.memberTravelDocuments.find(
          (x: any) => x.guid == this.application.travelDocumentGuid
        ).travelDocumentGuid,
        memberGuid: this.user.guid,
        visaTypeId: this.visaTypeId,
        transitDestinationCountryGuid: this.application.transitDestinationCountryGuid,
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
              this.conditions = selectedModel.modelConditionDtos;
              this.showExemptModal = true;
            } else {
              this.selectedModel = selectedModel;
              this.application.memberGuid = this.user.guid;

              this.http
                .get(
                  `${environment.apiUrl}/model/passportvaliditydate/${this.selectedModel.guid}/${this.application.entryDate}`
                )
                .subscribe((data: any) => {
                  if (
                    new Date(data.data) >
                    new Date(
                      this.memberTravelDocuments.find(
                        (x: any) => x.guid == this.application.travelDocumentGuid
                      )?.passportValidityDate
                    )
                  ) {
                    this.showDateError = true;
                    this.spinnerService.display(false);
                    return;
                  } else {
                    this.application.travelDocument = this.memberTravelDocuments.find(
                      (x: any) => x.guid == this.application.travelDocumentGuid
                    )

                    this.application.travelDocumentMemberGuid = this.memberTravelDocuments.find(
                      (x: any) => x.guid == this.application.travelDocumentGuid
                    ).guid;

                    if (this.selectedModel?.regime
                      .isApplicationAdditionalInformation) {
                      this.application.applicationAdditionalInformation = {
                        additionalVisaCountry: null,
                        additionalVisaFile: "",
                        additionalVisaGuid: null,
                        additionalVisaNumber: "",
                        additionalVisaValidityDate: null
                      }
                    }

                    this.showSuccessModal = true;
                  }
                  if (typeof localStorage !== "undefined") {
                    this.applicationService.selectedModel = this.selectedModel;
                    this.applicationService.visaTypeId = this.visaTypeId;
                    this.applicationService.application = this.application;
                    this.applicationService
                    localStorage?.setItem(
                      "latestApplication",
                      JSON.stringify(this.applicationService)
                    );
                    localStorage?.setItem("applicationStatus", "applicants");

                  }
                  this.spinnerService.display(false);
                });
            }
          }
          this.spinnerService.display(false);
        },
        error: (e) => {
          this.spinnerService.display(false);
          this.showErrorModal = true;
        },
        complete: () => { },
      });
  }
  getVisaType(visaType: string) {
    return this.languageService.getVisaType(visaType);
  }

  getFlightInformation(flightInformation: string) {
    return this.languageService.getFlightInformation(flightInformation);
  }
  getErrorMessage(key: string) {
    return this.languageService.getError(key);
  }

  getDescription() {
    return this.section?.visaType?.description
      ?.replace(
        "{startDate}",
        ` <span class="font-semibold">${this.getDate1()}</span>`
      )
      .replace(
        "{endDate}",
        ` <span class="font-semibold">${this.getDate2()}</span>`
      )
      .replace(
        "{validity}",
        ` <span class="font-semibold italic text-[#E34545]">${this.getPeriodValidity()}</span>`
      )
      .replace(
        "{residence}",
        ` <span class="font-semibold italic text-[#E34545]">${this.getResidencePeriod()}</span>`
      );
  }
}
