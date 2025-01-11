import { isPlatformBrowser } from "@angular/common";
import { HttpClient } from "@angular/common/http";
import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  Inject,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
} from "@angular/core";
import { Title } from "@angular/platform-browser";
import { ActivatedRoute, Router } from "@angular/router";
import dayjs from "dayjs";
import { parsePhoneNumber } from "libphonenumber-js";
import { Subscription } from "rxjs";
import { environment } from "../../../../environment/environment";
import { SpinnerService } from "../../../components/spinner/spinner.service";
import { LanguageService } from "../../../shared/language.service";
import { MemberService } from "../../../shared/member.service";
import { Application, ApplicationService } from "../application.service";
interface Error {
  additionalVisaValidityDate: string;
  additionalVisaNumber: string;
  additionalVisaGuid: string;
  additionalVisaCountry: string;
  additionalVisaFile: string;
}
@Component({
  selector: "app-apply-applicants",
  templateUrl: "./applicants.component.html",
})
export class ApplyApplicantsComponent implements OnInit, AfterViewInit, OnDestroy {
  constructor(
    private cdr: ChangeDetectorRef,
    private router: Router,
    private httpClient: HttpClient,
    public applicationService: ApplicationService,
    private memberService: MemberService,
    private titleService: Title,
    private languageService: LanguageService,
    private spinnerService: SpinnerService,
    private activatedRoute: ActivatedRoute,
    @Inject(PLATFORM_ID) private _platformId: Object
  ) { }
  private subscriptions = new Subscription();

  section: any;
  profileSection: any;
  errors: Error = {
    additionalVisaValidityDate: "",
    additionalVisaNumber: "",
    additionalVisaGuid: "",
    additionalVisaCountry: "",
    additionalVisaFile: "",
  };
  additionalVisaTypeGuids() {

    return this.languageService.getAdditionalDocumentTypes();
  }
  additionalVisaCountries(matchingGuid: string) {

    if (this.additionalVisaTypeGuids().length > 0 && matchingGuid) {
      if (this.additionalVisaTypeGuids()[0].guid == matchingGuid) {
        return this.translatedNationalities.filter((x: any) => x.code == 1)
      }
      else {
        return this.translatedNationalities.filter((x: any) => x.code == 2)
      }
    }
    return []
  }
  cannotApplyModal = false;
  cannotApplyUser: any = []
  application: Application | null = null;
  additionalApplications: Application[] = []
  additionalVisa: any;
  additionalVisaValidity: any = "";
  visaTypeId: any = 1;
  nameErrors: any[] = [];
  apiUrl = environment.apiUrl;
  passportNumber = "";
  passportValidityDate = "";
  passportIssueDate = "";
  documentFileName = "";
  countries: any;
  user: any = null;
  environment = environment;
  additionalMembers: any = [];
  models: any;
  documentTypes: any;
  aggreementModalToggle = true;
  error = false;
  ngAfterViewInit(): void { }
  passportValidity: any;
  step1: any;
  fileErrors: any[] = [];
  transitErrors: any[] = [];
  additionalFiles: any[] = [];
  additionalInformation: any[] = [];
  missingErrors: any[] = [];
  selectedIndex = -1;
  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  ngOnInit(): void {
    this.spinnerService.display(true);
    if (isPlatformBrowser(this._platformId)) {
      this.subscriptions.add(this.languageService.sectionData.subscribe(() => {
        this.section = this.languageService.getSection("newApplication");
        if (!this.section) return;
        this.profileSection = this.languageService.getSection("profile");
        this.spinnerService.display(false);

        this.titleService.setTitle(this.section?.applicant?.title);

        this.translatedNationalities = [];
        if (this.additionalVisa)
          for (let nation of this.additionalVisa) {
            this.translatedNationalities.push({
              guid: nation.guid,
              name: this.getTranslation(nation.guid),
              code: nation.code
            });
          }
        this.translatedNationalities = this.translatedNationalities.sort(
          (x: any, y: any) => ("" + x.name).localeCompare(y.name)
        );

        this.spinnerService.display(false);
        this.cdr.detectChanges();


      }));

      this.httpClient
        .get(
          `${environment.apiUrl
          }/additionalvisa/list?timestamp=${new Date().getTime()}`
        )
        .subscribe((data: any) => {
          this.additionalVisa = data.data;

          this.translatedNationalities = [];
          if (this.additionalVisa)
            for (let nation of this.additionalVisa) {
              this.translatedNationalities.push({
                guid: nation.guid,
                name: this.getTranslation(nation.guid),
                code: nation.code
              });
            }
          this.translatedNationalities = this.translatedNationalities.sort(
            (x: any, y: any) => ("" + x.name).localeCompare(y.name)
          );
        });
      this.httpClient
        .get(
          `${environment.apiUrl
          }/nationality/list?isTurkiye=true&timestamp=${new Date().getTime()}`
        )
        .subscribe((data: any) => {
          this.countries = data.data;
        });

      this.subscriptions.add(this.memberService.member.subscribe((member) => {
        if (!member) this.router.navigate(["/login"]);
        this.user = member;

        if (typeof localStorage !== "undefined") {
          const config = localStorage.getItem("latestApplication");
          try {
            const json = JSON.parse(
              config ?? "{}"
            );

            this.applicationService = json;
            this.application = json.application;
            this.additionalApplications = json.additionalApplications;
            this.visaTypeId = json.visaTypeId;
            this.selectedModel = json.selectedModel;
            this.fileErrors = json.fileErrors ?? [];
            this.transitErrors = json.transitErrors ?? [];
            this.additionalFiles = json.additionalFiles ?? []
            this.additionalMembers = json.additionalMembers ?? []

          } catch (ex) { console.log(ex) }
        }
        if (
          this.application == null ||
          this.selectedModel == null
        ) {
          this.router.navigate(["/apply"]);
          return;
        }
        this.subscriptions.add(this.activatedRoute.queryParams.subscribe((params: any) => {
          if (params.guid && params.i) {
            this.additionalMembers[params.i] = params.guid;
            this.additionalFiles[params.i] = {
              additionalVisaGuid: null,
              additionalVisaCountry: null,
              additionalVisaNumber: "",
              additionalVisaValidityDate: "",
              additionalDoc: "",
            };
            this.fileErrors[params.i] = {
              additionalVisaCountry: "",
              additionalVisaGuid: "",
              additionalVisaNumber: "",
              additionalVisaValidityDate: "",
              additionalVisaFile: "",
            };
            this.transitErrors[params.i] = {
              flightInformation: "",
              ticketNumber: "",
              ticketReservationNumber: "",
            };
            this.additionalInformation[params.i] = {
              flightInformation: "",
              ticketNumber: "",
              ticketReservationNumber: "",
            };
          }
        }));
        this.httpClient
          .get(
            `${environment.apiUrl}/model/additionalvisavaliditydate/${this.selectedModel.guid}/${this.application.entryDate}`
          )
          .subscribe((data: any) => {
            this.additionalVisaValidity = new Date(data.data).toISOString();
            this.cdr.detectChanges();
          });


        this.httpClient
          .get(
            `${environment.apiUrl}/member/get-website?timestamp=${new Date().getTime()}`
          )
          .subscribe({
            next: (v: any) => {
              this.user = v.data;

              this.httpClient
                .get(`${environment.apiUrl}/member/listparent-website`)
                .subscribe(async (data: any) => {
                  for (let d of data.data) d.gender = d.gender.toString();
                  this.people = data.data;
                  this.cannotApplyUser = [];
                  for (let i = 0; i < this.additionalMembers.length; i++) {
                    const selectedPerson = this.getPerson(i);
                    if (selectedPerson == null) continue;

                    this.cdr.detectChanges();
                    this.eligible = null;

                    if (this.visaTypeId == 2 && selectedPerson?.travelDocumentMemberDtos[
                      selectedPerson.travelDocumentMemberDtos.length - 1
                    ]?.travelDocumentGuid != "90e32d6b-a5c6-4dbb-af79-e074ee6731af") {
                      this.additionalMembers[i] = null;
                      this.cannotApplyUser.push(selectedPerson.name + " " + (selectedPerson.secondName ? `${selectedPerson.secondName} ` : "") + (selectedPerson.surname ?? ""))
                      this.nameErrors.push(this.additionalMembers[i]);


                      continue;
                    }

                    await new Promise((resolve: any) => this.httpClient
                      .post(`${environment.apiUrl}/model/checkmember`, {
                        modelGuid: this.selectedModel.guid,
                        travelDocumentGuid:
                          selectedPerson?.travelDocumentMemberDtos[
                            selectedPerson.travelDocumentMemberDtos.length - 1
                          ]?.travelDocumentGuid,
                        memberGuid: this.additionalMembers[i],
                      })
                      .subscribe({
                        next: (v: any) => {
                          let passed = false;
                          if (
                            v.data.guid !=
                            "00000000-0000-0000-0000-000000000000"
                          ) {
                            passed = true;
                          }
                          if (!passed) {
                            this.cannotApplyUser.push(selectedPerson.name + " " + (selectedPerson.secondName ? `${selectedPerson.secondName} ` : "") + (selectedPerson.surname ?? ""))
                            this.additionalMembers[i] = null;
                            this.nameErrors.push(this.additionalMembers[i]);
                            //this.showErrorModal = true;
                          }
                          if (passed) {
                            if (
                              this.selectedModel.regime?.regimeVisaType.visaType
                                .code == 0
                            ) {
                              this.nameErrors.push(this.additionalMembers[i]);
                            } else {
                              this.httpClient
                                .get(
                                  `${environment.apiUrl}/model/passportvaliditydate/${this.selectedModel.guid}/${this.application?.entryDate}`
                                )
                                .subscribe((data: any) => {
                                  if (
                                    new Date(data.data) >
                                    new Date(
                                      selectedPerson?.travelDocumentMemberDtos[
                                        selectedPerson.travelDocumentMemberDtos
                                          .length - 1
                                      ]?.passportValidityDate
                                    )
                                  ) {
                                    this.nameErrors.push(
                                      this.additionalMembers[i]
                                    );
                                  } else {
                                  }
                                  this.spinnerService.display(false);
                                  this.cdr.detectChanges();
                                });
                              resolve(true);
                            }
                          }
                        },
                        error: (e) => {
                          resolve(true);
                          this.nameErrors.push(this.additionalMembers[i]);
                        },
                        complete: () => {
                          resolve(true);

                        },
                      }));
                  }
                  if (this.cannotApplyUser.length > 0) {
                    this.cannotApplyModal = true;
                    this.cdr.detectChanges();
                  }
                });

            },
            error: (e) => { },
            complete: () => { },
          });

      }));
    }
  }
  people: any;
  showImageError = false;
  showErrorModal = false;
  showSuccessModal = false;
  showExemptModal = false;
  showMissingInformation = false;
  eligible: any = true;
  selectedModel: any;
  selectedModelConditions: any;
  visaResultModal = false;
  showDateError = false;
  checkMember(i: number) {
    this.nameErrors = [];
    const selectedPerson = this.getPerson(i);
    this.cannotApplyUser = [];

    this.spinnerService.display(true);
    this.cdr.detectChanges();
    this.eligible = null;
    if (this.visaTypeId == 2 && selectedPerson?.travelDocumentMemberDtos[
      selectedPerson.travelDocumentMemberDtos.length - 1
    ]?.travelDocumentGuid != "90e32d6b-a5c6-4dbb-af79-e074ee6731af") {
      this.cannotApplyUser.push(selectedPerson.name + " " + (selectedPerson.secondName ? `${selectedPerson.secondName} ` : "") + (selectedPerson.surname ?? ""))
      this.additionalMembers[i] = null;
      this.nameErrors.push(this.additionalMembers[i]);
      //this.showErrorModal = true;
      this.cannotApplyModal = true;
      this.spinnerService.display(false);

      return;
    }
    this.httpClient
      .post(`${environment.apiUrl}/model/checkmember`, {
        travelDocumentGuid:
          selectedPerson?.travelDocumentMemberDtos[
            selectedPerson.travelDocumentMemberDtos.length - 1
          ]?.travelDocumentGuid,
        memberGuid: this.additionalMembers[i],
        modelGuid: this.selectedModel.guid,
      })
      .subscribe({
        next: (v: any) => {
          let passed = false;
          if (v.data.guid != "00000000-0000-0000-0000-000000000000") {
            passed = true;
          }
          this.selectedModelConditions = null;
          if (!this.selectedModel) {
            this.cannotApplyUser.push(selectedPerson.name + " " + (selectedPerson.secondName ? `${selectedPerson.secondName} ` : "") + (selectedPerson.surname ?? ""))
            this.additionalMembers[i] = null;
            this.cannotApplyModal = true;
            this.nameErrors.push(this.additionalMembers[i]);
            //this.showErrorModal = true;
          }
          if (this.selectedModel) {
            if (this.selectedModel.regime?.regimeVisaType.visaType.code == 0) {
              this.showExemptModal = true;
              this.additionalMembers[i] = null;

              this.selectedModelConditions =
                this.selectedModel.modelConditionDtos;
            } else {
              this.httpClient
                .get(
                  `${environment.apiUrl}/model/passportvaliditydate/${this.selectedModel.guid}/${this.application?.entryDate}`
                )
                .subscribe((data: any) => {
                  if (
                    new Date(data.data) >
                    new Date(
                      selectedPerson?.travelDocumentMemberDtos[
                        selectedPerson.travelDocumentMemberDtos.length - 1
                      ]?.passportValidityDate
                    )
                  ) {
                    //this.visaResultModal = true;
                    this.showDateError = true;
                    this.additionalMembers[i] = null;
                    this.nameErrors.push(this.additionalMembers[i]);
                    this.cdr.detectChanges();

                    this.spinnerService.display(false);
                    return;
                  }
                  if (this.eligible != null) {
                    this.visaResultModal = true;
                    this.cdr.detectChanges();
                    this.spinnerService.display(false);
                  }
                });
            }
          }
          if (this.eligible != null) {
            this.visaResultModal = true;
          }
        },
        error: (e) => {
          this.spinnerService.display(false);
          //this.additionalMembers[i] = null;
          this.nameErrors.push(this.additionalMembers[i]);
          this.visaResultModal = true;
        },
        complete: () => {
          this.spinnerService.display(false);
        },
      });
  }
  getPerson(i: number) {
    return this.people?.find((x: any) => x.guid == this.additionalMembers[i]);
  }
  getPersonTravelDocument(i: number) {
    return this.getPerson(i).travelDocumentMemberDtos[
      this.getPerson(i).travelDocumentMemberDtos.length - 1
    ];
  }
  getPeople(i: number) {
    return this.people?.filter(
      (x: any) =>
        x.guid == i ||
        (this.additionalMembers?.find((y: any) => y == x.guid) == null &&
          !this.additionalMembers.includes(x.guid))
    );
  }

  toProfile() {
    this.router.navigate(["/profile"], {
      queryParams: { retUrl: "/apply/applicants" },
    });
  }
  toPerson(i: number) {
    this.router.navigate(["/profile/people"], {
      queryParams: {
        retUrl: "/apply/applicants",
        guid: this.additionalMembers[i],
      },
    });
  }
  toNewPerson(i: number) {
    if (typeof localStorage !== "undefined") {
      const additionalApplications: any = []

      for (let i = 0; i < this.additionalMembers.length; i++) {
        if (this.getPerson(i) == null)
          continue;
        const newApplication = { ...this.application };
        newApplication.memberGuid = this.additionalMembers[i];
        newApplication.travelDocumentMemberGuid = this.getPerson(i)?.travelDocumentMemberDtos[this.getPerson(i)?.travelDocumentMemberDtos.length - 1]?.guid
        newApplication.travelDocumentGuid = this.getPerson(i).travelDocumentMemberDtos[this.getPerson(i).travelDocumentMemberDtos.length - 1]?.guid
        newApplication.flightInformation = this.additionalInformation[i].flightInformation
        newApplication.ticketNumber = this.additionalInformation[i].ticketNumber
        if (this.application?.applicationAdditionalInformation) newApplication.applicationAdditionalInformation = this.additionalFiles[i];
        additionalApplications.push(newApplication)
      }
      localStorage?.setItem(
        "latestApplication",
        JSON.stringify({
          ...this.applicationService, step: "prerequisites", aggreement: false, applicationGuid: undefined, fileErrors: this.fileErrors, transitErrors: this.transitErrors,
          additionalFiles: this.additionalFiles,
          additionalApplications: additionalApplications,
          additionalMembers: this.additionalMembers
        })
      );
    }

    this.router.navigate(["/profile/people"], {
      queryParams: { retUrl: "/apply/applicants", new: "true", i: i },
    });
  }
  addPerson() {
    if (this.additionalMembers.length >= 10) return;
    this.additionalFiles.push({
      additionalVisaGuid: null,
      additionalVisaCountry: null,
      additionalVisaNumber: "",
      additionalVisaValidityDate: "",
      additionalDoc: "",
    });
    this.fileErrors.push({
      additionalVisaCountry: "",
      additionalVisaGuid: "",
      additionalVisaNumber: "",
      additionalVisaValidityDate: "",
      additionalVisaFile: "",
    });
    this.transitErrors.push({
      flightInformation: "",
      ticketNumber: "",
      ticketReservationNumber: "",
    });
    this.additionalInformation.push({
      flightInformation: "",
      ticketNumber: "",
      ticketReservationNumber: "",
    });
    this.nameErrors = [];
    this.additionalMembers.push(null);
    this.selectedIndex = this.additionalMembers.length - 1;
  }
  setRemovePerson(obj: any, i: number) {
    this.additionalMembers.splice(i, 1);
    this.fileErrors.splice(i, 1);
    this.additionalFiles.splice(i, 1);
    this.additionalInformation.splice(i, 1);
    this.transitErrors.splice(i, 1);
    this.selectedIndex = -1;
    this.nameErrors = [];
  }
  getPersonError(guid: string) {
    return this.nameErrors.includes(guid);
  }
  formatPhone(number: any) {
    try {
      const countryCode = this.countries?.find(
        (x: any) => x.guid == number.phoneCodeGuid
      )?.phoneCode;
      const phoneNumber = parsePhoneNumber(countryCode + number.phone);
      if (phoneNumber) {
        return phoneNumber.formatInternational();
      }
    } catch (ex) { }
    return number.phone;
  }
  files: File[] = [];
  status: "initial" | "uploading" | "success" | "fail" = "initial";
  photoError: any = null;
  translatedNationalities: any;
  getErrorMessage(key: string) {
    return this.languageService.getError(key);
  }
  getInput(key: string) {
    return this.languageService.getInput(key);
  }
  getAdditionalDocument(key: string) {
    return this.languageService.getAdditionalDocuments(key);
  }
  getGender(key: string) {
    return this.languageService.getGender(key);
  }
  getNationality(nationality: string) {
    return this.languageService.getNationality(nationality);
  }

  getNotes() {
    return this.visaTypeId == 2
      ? this.section?.applicant?.notes?.notesHtv
      : this.section?.applicant?.notes?.notes;
  }
  getFlightInformation(flightInformation: string) {
    return this.languageService.getFlightInformation(flightInformation);
  }

  onAssetChange(event: any) {
    const files = event.target.files;

    this.spinnerService.display(true);
    if (files.length) {
      this.status = "initial";
      this.files = files;

      const formData = new FormData();

      [...this.files].forEach((file) => {
        formData.append("file", file, file.name);
      });

      const upload$ = this.httpClient.post(
        `${environment.apiUrl}/upload/add`,
        formData
      );
      this.status = "uploading";

      upload$.subscribe({
        next: (v: any) => {
          this.application!.applicationAdditionalInformation!.additionalVisaFile = v.message;
          this.status = "success";
          this.spinnerService.display(false);
          this.errors.additionalVisaFile = "";
          this.cdr.detectChanges();
        },
        error: (e) => {
          this.spinnerService.display(false);
          this.status = "fail";
        },
        complete: () => { },
      });
    }
  }
  getTravelDocument() {
    const a: any = null;
    return a;
  }

  onPeopleAssetChange(event: any, i: number) {
    const files = event.target.files;

    if (files.length) {
      this.status = "initial";
      this.files = files;

      const formData = new FormData();

      [...this.files].forEach((file) => {
        formData.append("file", file, file.name);
      });

      const upload$ = this.httpClient.post(
        `${environment.apiUrl}/upload/add`,
        formData
      );
      this.status = "uploading";

      upload$.subscribe({
        next: (v: any) => {
          this.additionalFiles[i].additionalDoc = v.message;
          this.status = "success";
          this.fileErrors[i].additionalVisaFile = "";
          this.cdr.detectChanges();
        },
        error: (e) => {
          this.status = "fail";
        },
        complete: () => { },
      });
    }
  }

  getResidencePeriod() {
    return this.selectedModel.regime.residencePeriod;
  }
  getPeriodValidity() {
    return this.selectedModel.regime.periodValidity;
  }
  back() {
    this.router.navigate(["/apply"]);
  }
  hasError() {
    return Object.values(this.errors).find((x: string) => x != "");
  }
  formatDate(date: string) {
    return dayjs(date).format("DD.MM.YYYY");
  }

  getTranslation(guid: string) {
    return this.languageService.getTranslation(guid);
  }

  nextStep() {
    this.nameErrors = []
    this.missingErrors = []
    this.additionalMembers = this.additionalMembers.filter((x: any) => x != null)
    for (let i = 0; i < this.additionalMembers.length; i++) {

      const subErrors: any = []
      if (this.visaTypeId == 2) {
        if (this.additionalInformation[i].flightInformation == "") {
          this.transitErrors[i].flightInformation = "invalid";
          if (
            !subErrors.includes(
              this.getInput("flightInformation")?.label
            )
          )
            subErrors.push(this.getInput("flightInformation")?.label);
        }

        if (this.additionalInformation[i].flightInformation == 1) {
          if (
            this.additionalInformation[i].ticketNumber == "" ||
            this.additionalInformation[i].ticketNumber == null
          ) {
            this.transitErrors[i].ticketNumber = "invalid";
            if (
              !subErrors.includes(
                this.getInput("ticketInformation")?.label
              )
            )
              subErrors.push(
                this.getInput("ticketInformation")?.label
              );
          }
        }
        if (this.additionalInformation[i].flightInformation == 2) {
          if (
            this.additionalInformation[i].ticketReservationNumber == "" ||
            this.additionalInformation[i].ticketReservationNumber == null
          ) {
            this.transitErrors[i].ticketReservationNumber = "invalid";
            if (
              !subErrors.includes(
                this.getInput("reservationNumber")?.label
              )
            )
              subErrors.push(
                this.getInput("reservationNumber")?.label
              );
          }
        }
      }

      if (this.additionalMembers[i] == "" || this.additionalMembers[i] == null)
        this.nameErrors.push(this.additionalMembers[i]);
      if (
        (this.additionalFiles[i].additionalVisaCountry == "" ||
          this.additionalFiles[i].additionalVisaCountry == null) &&
        this.selectedModel?.regime
          .isApplicationAdditionalInformation
      ) {
        this.fileErrors[i].additionalVisaCountry = "required";
        if (
          !subErrors.includes(this.getInput("additionalVisaCountry"))
        )
          subErrors.push(this.getInput("additionalVisaCountry"));
      }
      if (
        (this.additionalFiles[i].additionalVisaGuid == "" ||
          this.additionalFiles[i].additionalVisaGuid == null) &&
        this.selectedModel?.regime
          .isApplicationAdditionalInformation
      ) {
        this.fileErrors[i].additionalVisaGuid = "required";
        if (
          !subErrors.includes(
            this.getInput("additionalVisaType")?.label
          )
        )
          subErrors.push(this.getInput("additionalVisaType")?.label);
      }
      if (
        (this.additionalFiles[i].additionalVisaValidityDate == "" ||
          this.additionalFiles[i].additionalVisaValidityDate == null) &&
        this.selectedModel?.regime
          .isApplicationAdditionalInformation
      ) {
        this.fileErrors[i].additionalVisaValidityDate = "required";
        if (
          !subErrors.includes(
            this.getInput("additionalVisaValidityDate")?.label
          )
        )
          subErrors.push(
            this.getInput("additionalVisaValidityDate")?.label
          );
      }
      if (
        (this.additionalFiles[i].additionalVisaNumber == "" ||
          this.additionalFiles[i].additionalVisaNumber == null) &&
        this.selectedModel?.regime
          .isApplicationAdditionalInformation
      ) {
        this.fileErrors[i].additionalVisaNumber = "required";
        if (
          !subErrors.includes(
            this.getInput("additionalVisaNumber")?.label
          )
        )
          subErrors.push(this.getInput("additionalVisaNumber")?.label);
      }

      if (
        (this.additionalFiles[i].additionalDoc == "" ||
          this.additionalFiles[i].additionalDoc == null) &&
        this.selectedModel?.regime
          .isApplicationAdditionalInformation
      ) {
        this.fileErrors[i].additionalVisaFile = "required";
        if (
          !subErrors.includes(
            this.getInput("additionalVisaDocument")?.label
          )
        )
          subErrors.push(
            this.getInput("additionalVisaDocument")?.label
          );
      }

      if (subErrors.length > 0) {
        const error = {
          name: this.getPerson(i).name + " " + (this.getPerson(i).secondName ? `${this.getPerson(i).secondName} ` : "") + (this.getPerson(i).surname ?? ""),
          subErrors: subErrors
        }
        this.missingErrors.push(error)
      }
    }

    const personErrors: any = []
    if (
      this.additionalMembers.includes(null) ||
      this.additionalMembers.includes("") ||
      this.nameErrors.length > 0
    ) {
      if (Object.values(this.additionalMembers).indexOf("") != -1)
        this.selectedIndex = Object.values(this.additionalMembers).indexOf("");
      else if (Object.values(this.additionalMembers).indexOf(null) != -1)
        this.selectedIndex = Object.values(this.additionalMembers).indexOf(
          null
        );

      personErrors.push(
        this.section?.applications?.additionalPersonTitle
      );
    }
    if (
      (this.application?.applicationAdditionalInformation?.additionalVisaGuid == "" || this.application?.applicationAdditionalInformation?.additionalVisaGuid == null) &&
      this.selectedModel?.regime
        .isApplicationAdditionalInformation
    ) {
      this.errors.additionalVisaGuid = "required";
      if (
        !personErrors.includes(this.getInput("additionalVisaType")?.label)
      )
        personErrors.push(this.getInput("additionalVisaType")?.label);
    }
    if (
      (this.application?.applicationAdditionalInformation?.additionalVisaCountry == "" ||
        this.application?.applicationAdditionalInformation?.additionalVisaCountry == null) &&
      this.selectedModel?.regime
        .isApplicationAdditionalInformation
    ) {
      this.errors.additionalVisaCountry = "required";
      if (!personErrors.includes(this.getInput("additionalVisaCountry")))
        personErrors.push(this.getInput("additionalVisaCountry"));
    }
    if (
      (this.application?.applicationAdditionalInformation?.additionalVisaValidityDate == "" ||
        this.application?.applicationAdditionalInformation?.additionalVisaValidityDate == null) &&
      this.selectedModel?.regime
        .isApplicationAdditionalInformation
    ) {
      this.errors.additionalVisaValidityDate = "required";
      if (
        !personErrors.includes(
          this.getInput("additionalVisaValidityDate")?.label
        )
      )
        personErrors.push(
          this.getInput("additionalVisaValidityDate")?.label
        );
    }
    if (
      (this.application?.applicationAdditionalInformation?.additionalVisaNumber == "" || this.application?.applicationAdditionalInformation?.additionalVisaNumber == null) &&
      this.selectedModel?.regime
        .isApplicationAdditionalInformation
    ) {
      this.errors.additionalVisaNumber = "required";
      if (
        !personErrors.includes(
          this.getInput("additionalVisaNumber")?.label
        )
      )
        personErrors.push(this.getInput("additionalVisaNumber")?.label);
    }

    if (
      (this.application?.applicationAdditionalInformation?.additionalVisaFile == "" || this.application?.applicationAdditionalInformation?.additionalVisaFile == null) &&
      this.selectedModel?.regime
        .isApplicationAdditionalInformation
    ) {
      this.errors.additionalVisaFile = "required";
      if (
        !personErrors.includes(
          this.getInput("additionalVisaDocument")?.label
        )
      )
        personErrors.push(this.getInput("additionalVisaDocument")?.label);
    }

    if (personErrors.length > 0) {
      const error = {
        name: this.user.name + " " + (this.user.secondName ? `${this.user.secondName} ` : "") + (this.user.surname ?? ""),
        subErrors: personErrors
      }
      this.missingErrors.push(error)
    }

    if (this.hasError() || personErrors.length > 0 || this.missingErrors.length > 0) {
      this.showMissingInformation = true;
      setTimeout(() => {
        const el =
          document.querySelector(".error")?.parentElement?.parentElement;
        if (el) {
          const y = el?.getBoundingClientRect().top + window.scrollY - 80;
          window.scroll({
            top: y,
          });
        }
      }, 100);
      return;
    }
    /*this.applicationService.application.step = 3;
  
    this.applicationService.application.passportNumber = this.passportNumber;
    this.applicationService.application.passportIssueDate =
      this.passportIssueDate;
    this.applicationService.application.passportValidityDate =
      this.passportValidityDate;
    if (
      this.selectedModel?.regime
        ?.isApplicationAdditionalInformation
    )
      this.applicationService.application.applicationAdditionalInformation = {
        additionalVisaFile: this.additionalDoc,
        additionalVisaGuid: this.additionalVisaGuid,
        additionalVisaValidityDate: this.additionalVisaValidityDate,
        additionalVisaCountry: this.additionalVisaCountry,
        additionalVisaNumber: this.additionalVisaNumber,
      };
      */
    if (typeof localStorage !== "undefined") {
      const additionalApplications: any = []

      for (let i = 0; i < this.additionalMembers.length; i++) {
        const newApplication = { ...this.application };
        newApplication.memberGuid = this.additionalMembers[i];
        newApplication.travelDocumentMemberGuid = this.getPerson(i).travelDocumentMemberDtos[this.getPerson(i).travelDocumentMemberDtos.length - 1]?.guid
        newApplication.travelDocumentGuid = this.getPerson(i).travelDocumentMemberDtos[this.getPerson(i).travelDocumentMemberDtos.length - 1]?.guid
        newApplication.flightInformation = this.additionalInformation[i].flightInformation
        newApplication.ticketNumber = this.additionalInformation[i].flightInformation
        if (this.application?.applicationAdditionalInformation) newApplication.applicationAdditionalInformation = this.additionalFiles[i];
        additionalApplications.push(newApplication)
      }
      localStorage?.setItem(
        "latestApplication",
        JSON.stringify({
          ...this.applicationService, step: "prerequisites", aggreement: false, applicationGuid: undefined, fileErrors: this.fileErrors, transitErrors: this.transitErrors,
          additionalFiles: this.additionalFiles,
          additionalApplications: additionalApplications, additionalMembers: this.additionalMembers

        })
      );
      localStorage?.setItem("applicationStatus", "prerequisites");

    }

    this.router.navigate(["/apply/prerequisites"]);
  }
}
