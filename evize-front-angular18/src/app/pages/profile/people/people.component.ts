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
import { ActivatedRoute, Router } from "@angular/router";
import { AsYouType, isValidPhoneNumber } from "libphonenumber-js";
import { Subscription } from "rxjs";
import { environment } from "../../../../environment/environment";
import { SpinnerService } from "../../../components/spinner/spinner.service";
import { LanguageService } from "../../../shared/language.service";
import { MemberService } from "../../../shared/member.service";
interface Errors {
  name: string;
  surname: string;
  birthDay: string;
  nationalityGuid: string;
  gender: string;
  fatherName: string;
  motherName: string;
  address: string;
  passportNumber: string;
  passportIssueDate: string;
  passportValidityDate: string;
  phoneNumber: string;
  travelDocumentGuid: string;
  eMail: string;
}
@Component({
  selector: "app-profile-people",
  templateUrl: "./people.component.html",
})
export class ProfilePeopleComponent
  implements OnInit, AfterViewInit, OnDestroy {
  constructor(
    private cdr: ChangeDetectorRef,
    private router: Router,
    private httpClient: HttpClient,
    private memberService: MemberService,
    private titleService: Title,
    private languageService: LanguageService,
    private spinnerService: SpinnerService,
    @Inject(PLATFORM_ID) private _platformId: Object,
    private activatedRoute: ActivatedRoute
  ) { }
  private subscriptions = new Subscription();

  ngAfterViewInit(): void { }
  nationalities$: any;

  selectedIndex: any = -1;
  setSelectedIndex(i: number) {
    this.selectedIndex = i;

    this.personTravelDocument = {
      ...this.people[this.selectedIndex]?.travelDocumentMemberDtos[
      this.people[this.selectedIndex]?.travelDocumentMemberDtos.length - 1
      ],
    };
    this.oldPersonTravelDocument = {
      ...this.people[this.selectedIndex]?.travelDocumentMemberDtos[
      this.people[this.selectedIndex]?.travelDocumentMemberDtos.length - 1
      ],
    };
  }
  removeDetail: any;
  personTravelDocument: any;
  oldPersonTravelDocument: any;
  detail: any;
  missingErrors: any[] = [];
  showUpdateSuccess = false;
  showImageError = false;
  showMissingInformation = false;
  translatedNationalities: any = [];
  translatedCountries: any = [];
  imageError = "";
  translatedCountriesPhone: any = [];
  newPerson: any = {
    parentGuid: "",
    nationalityGuid: "",
    name: "",
    secondName: "",
    surname: "",
    eMail: "",
    phone: "",
    address: "",
    birthDay: "",
    motherName: "",
    phoneCodeGuid: null,
    fatherName: "",
    status: true,
    photo: null,
    gender: null,
    passportNumber: "",
    travelDocumentGuid: null,
    passportIssueDate: null,
    passportValidityDate: null,
    title: "",
  };
  newGuid: null | string = null;
  i: null | string = null;
  people: any;
  section: any;
  toDelete: any;
  showRemove = false;
  user: any = null;
  environment = environment;
  error: any;
  success: any;
  files: File[] = [];
  status: "initial" | "uploading" | "success" | "fail" = "initial";
  photoError: any = null;
  countries$: any;
  countriesPhone$: any;
  showRemoveSuccess = false;
  apiUrl = environment.apiUrl;
  errors: Errors = {
    name: "",
    surname: "",
    birthDay: "",
    nationalityGuid: "",
    gender: "",
    fatherName: "",
    motherName: "",
    address: "",
    passportNumber: "",
    passportIssueDate: "",
    passportValidityDate: "",
    phoneNumber: "",
    travelDocumentGuid: "",
    eMail: "",
  };
  minBirthday = new Date(1900, 1, 1);
  isNew = false;
  today = new Date();
  travelDocuments: any;
  onAssetChange(event: any) {
    const files = event.target.files;
    this.photoError = false;

    if (files.length) {
      this.spinnerService.display(true);
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
        next: (z: any) => {

          if (!z.success) {
            this.imageError = z.message == "" ? null : this.getErrorMessage(z.message)
            this.showImageError = true;
            this.cdr.detectChanges();
          } else {
            this.httpClient
              .get(`${environment.apiUrl}/upload/detectface/` + z.message, {
                responseType: "text",
              })
              .subscribe({
                next: (v: any) => {
                  if (v == "true") {
                    this.isNew
                      ? (this.newPerson.photo = z.message)
                      : (this.people[this.selectedIndex].photo = z.message);
                  } else {
                    this.imageError = v.message == "" ? null : this.getErrorMessage(v.message)
                    this.showImageError = true;
                    this.cdr.detectChanges();
                  }
                  this.spinnerService.display(false);
                },
                error: (e) => {
                  this.imageError = e.error.message == "" ? null : this.getErrorMessage(e.error.message)
                  this.showImageError = true;
                  this.spinnerService.display(false);
                  this.cdr.detectChanges();
                },
                complete: () => {
                  this.spinnerService.display(false);
                },
              });
          }
          this.spinnerService.display(false);
          this.cdr.detectChanges();
        },
        error: (e) => {
          this.spinnerService.display(false);
          this.error = this.languageService.getError(e.error);

          this.imageError = e.error.message == "" ? null : this.getErrorMessage(e.error.message)
          this.showImageError = true;

          this.cdr.detectChanges();
        },
        complete: () => {
          this.spinnerService.display(false);
        },
      })
    }
  }
  setRemoveDocument(guid: string) {
    this.toDelete = guid;
    const selectedPerson = this.people.find((x: any) => x.guid == guid);
    this.removeDetail =
      this.section?.breadcrumb?.registeredUsers +
      " (" +
      selectedPerson.name +
      (selectedPerson.surname ? " " + selectedPerson.surname : "") +
      ")";

    this.showRemove = true;
  }
  delete() {
    this.spinnerService.display(true);
    this.showRemove = false;

    this.httpClient
      .put(`${environment.apiUrl}/member/statusparent-website/${this.toDelete}/0`, {})
      .subscribe((data: any) => {
        this.httpClient
          .get(`${environment.apiUrl}/member/listparent-website`)
          .subscribe((data: any) => {
            for (let d of data.data) d.gender = d.gender.toString();
            this.people = data.data;
            this.spinnerService.display(false);
            this.showRemoveSuccess = true;
            this.cdr.detectChanges();
          });
      });
  }

  asYouType(event: any) {
    this.people[this.selectedIndex].phoneNumber = new AsYouType().input(
      event.target.value
    );
    this.cdr.detectChanges();
  }
  validateEmail() {
    const validRegex =
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

    if (this.isNew) {
      if (!this.newPerson.eMail.match(validRegex) && this.errors.eMail == "") {
        this.errors.eMail = "invalid";
      }
    } else {
      if (
        !this.people[this.selectedIndex].eMail.match(validRegex) &&
        this.errors.eMail == ""
      ) {
        if (!this.missingErrors.includes(this.getInput("email")?.label))
          this.missingErrors.push(this.getInput("email")?.label);

        this.errors.eMail = "invalid";
      }
    }
  }

  submit() {
    if (
      this.user.motherName == "" ||
      this.user.fatherName == "" ||
      this.user.address == "" ||
      this.user.photo == ""
    ) {
      this.error = "Lütfen tüm bilgileri doldurun!";
      this.cdr.detectChanges();
      return;
    }
    this.subscriptions.add(this.memberService.update(this.user).subscribe((x: any) => {
      this.router.navigate(["/apply"]);
    }));
  }
  getGender(key: string) {
    return this.languageService.getGender(key);
  }

  hasError() {
    return (
      Object.values(this.errors).find((x: string) => x != "") || this.photoError
    );
  }
  getInput(key: string) {
    return this.languageService.getInput(key);
  }
  refresh() {
    if (this.retUrl) {
      this.router.navigate([this.retUrl]);
      return;
    }

    this.spinnerService.display(true);
    this.httpClient
      .get(`${environment.apiUrl}/member/listparent-website`)
      .subscribe((data: any) => {
        this.selectedIndex = -1;
        for (let d of data.data) d.gender = d.gender.toString();
        this.people = data.data;
        this.spinnerService.display(false);
        this.cdr.detectChanges();
      });
  }
  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
  getErrorMessage(key: string) {
    return this.languageService.getError(key);
  }
  getTranslation(guid: string) {
    return this.languageService.getTranslation(guid);
  }

  retUrl: string | null = null;
  ngOnInit(): void {
    this.spinnerService.display(true);
    if (isPlatformBrowser(this._platformId)) {
      this.memberService.member.subscribe((member) => {
        this.user = member;
        if (!member) this.router.navigate(["/"]);
      });
      this.httpClient
        .get(
          `${environment.apiUrl
          }/traveldocument/list?status=1&timestamp=${new Date().getTime()}`
        )
        .subscribe((data: any) => {
          this.travelDocuments = data.data;
        });
      this.httpClient
        .get(
          `${environment.apiUrl
          }/nationality/list?timestamp=${new Date().getTime()}`
        )
        .subscribe((data: any) => {
          this.countries$ = data.data;
          if (this.countries$) {
            for (let nation of this.countries$) {
              this.translatedCountries.push({
                guid: nation.guid,
                name: this.languageService.getTranslation(nation.guid),
                phoneCode: nation.phoneCode,
              });
            }
            this.cdr.detectChanges();
          }
        });

      this.httpClient
        .get(
          `${environment.apiUrl
          }/nationality/list?isTurkiye=true&timestamp=${new Date().getTime()}`
        )
        .subscribe((data: any) => {
          this.countriesPhone$ = data.data;
          if (this.countriesPhone$) {
            for (let nation of this.countriesPhone$) {
              this.translatedCountriesPhone.push({
                guid: nation.guid,
                name: this.languageService.getTranslation(nation.guid),
                phoneCode: nation.phoneCode,
              });
            }
            this.cdr.detectChanges();
          }
        });

      this.httpClient
        .get(
          `${environment.apiUrl
          }/nationality/list?timestamp=${new Date().getTime()}`
        )
        .subscribe((data: any) => {
          this.nationalities$ = data.data;
          if (this.nationalities$) {
            for (let nation of this.nationalities$) {
              this.translatedNationalities.push({
                guid: nation.guid,
                name: this.languageService.getTranslation(nation.guid),
                phoneCode: nation.phoneCode,
              });
            }
            this.translatedNationalities = this.translatedNationalities.sort(
              (x: any, y: any) => ("" + x.name).localeCompare(y.name)
            );
          }
        });

      this.subscriptions.add(this.languageService.sectionData.subscribe(() => {
        this.section = this.languageService.getSection("profile");
        if (this.section) this.titleService.setTitle(this.section.title);
        if (this.countries$) {
          this.translatedCountries = [];
          for (let nation of this.countries$) {
            this.translatedCountries.push({
              guid: nation.guid,
              name: this.languageService.getTranslation(nation.guid),
              phoneCode: nation.phoneCode,
            });
          }
          this.translatedCountries = this.translatedCountries.sort(
            (x: any, y: any) => ("" + x.name).localeCompare(y.name)
          );
        }

        if (this.countries$) {
          this.translatedCountriesPhone = [];
          for (let nation of this.countriesPhone$) {
            this.translatedCountriesPhone.push({
              guid: nation.guid,
              name: this.languageService.getTranslation(nation.guid),
              phoneCode: nation.phoneCode,
            });
          }
          this.translatedCountriesPhone = this.translatedCountriesPhone.sort(
            (x: any, y: any) => ("" + x.name).localeCompare(y.name)
          );
        }
        if (this.nationalities$) {
          this.translatedNationalities = [];
          for (let nation of this.nationalities$) {
            this.translatedNationalities.push({
              guid: nation.guid,
              name: this.languageService.getTranslation(nation.guid),
              phoneCode: nation.phoneCode,
            });
          }
          this.translatedNationalities = this.translatedNationalities.sort(
            (x: any, y: any) => ("" + x.name).localeCompare(y.name)
          );
        }

        if (this.people) {
          this.spinnerService.display(false);
          this.cdr.detectChanges();
        }
      }));
      this.httpClient
        .get(`${environment.apiUrl}/member/listparent-website`)
        .subscribe((data: any) => {
          for (let d of data.data) d.gender = d.gender.toString();
          this.people = data.data;
          if (data.data.length == 0) this.isNew = true;
          this.activatedRoute.queryParams.subscribe((params: any) => {
            if (params.i) this.i = params.i;
            if (params.retUrl) this.retUrl = params.retUrl;
            if (params.new) this.isNew = true;
            if (params.guid) {
              for (let i = 0; i < this.people.length; i++) {
                if (this.people[i].guid == params.guid)
                  this.setSelectedIndex(i);
              }
            }
          });

          if (this.section) {
            this.spinnerService.display(false);
            this.cdr.detectChanges();
          }
        });
    }
  }
  addPerson() {
    this.isNew = true;
    this.newPerson = {
      parentGuid: this.user.guid,
      nationalityGuid: this.user.nationalityGuid,
      name: "",
      secondName: "",
      surname: "",
      eMail: "",
      phone: "",
      address: "",
      birthDay: "",
      motherName: "",
      fatherName: "",
      status: true,
      photo: null,
      gender: null,
      passportNumber: "",
      travelDocumentGuid: null,
      passportIssueDate: null,
      passportValidityDate: null,
      title: "",
    };
  }
  cancel() {
    if (this.retUrl) {
      this.router.navigate([this.retUrl]);
      return;
    }
    if (this.people.length == 0) {
      this.newPerson = {
        parentGuid: this.user.guid,
        nationalityGuid: this.user.nationalityGuid,
        name: "",
        secondName: "",
        surname: "",
        eMail: "",
        phone: "",
        address: "",
        birthDay: "",
        motherName: "",
        fatherName: "",
        status: true,
        photo: null,
        gender: null,
        passportNumber: "",
        travelDocumentGuid: null,
        passportIssueDate: null,
        passportValidityDate: null,
        title: "",
      };
    } else {
      this.isNew = false;
    }
  }
  save() {
    this.photoError = null;
    this.missingErrors = [];
    const selectedPerson = this.isNew
      ? this.newPerson
      : this.people[this.selectedIndex];
    if (this.isNew) {
      this.newPerson.nationalityGuid = this.user.nationalityGuid;
    }
    selectedPerson.parentGuid = this.user.guid;
    if (selectedPerson.photo == "" || selectedPerson.photo == null) {
      this.photoError = true;
      this.missingErrors.push(this.section?.imageError);
    }
    if (selectedPerson.name == "") {
      this.errors.name = "required";
      this.missingErrors.push(this.getInput("firstName")?.label);
    }
    if (selectedPerson.birthDay == "" || selectedPerson.birthDay == null) {
      this.errors.birthDay = "required";
      this.missingErrors.push(this.getInput("birthday")?.label);
    }
    if (selectedPerson.nationalityGuid == "") {
      this.errors.nationalityGuid = "required";
      this.missingErrors.push(this.getInput("nationality")?.label);
    }
    if (selectedPerson.gender == "" || selectedPerson.gender == null) {
      this.errors.gender = "required";
      this.missingErrors.push(this.getInput("gender")?.label);
    }
    if (this.isNew) {
      if (selectedPerson.passportNumber == "") {
        this.errors.passportNumber = "required";
        this.missingErrors.push(this.getInput("passportNumber")?.label);
      }
      if (
        selectedPerson.travelDocumentGuid == "" ||
        selectedPerson.travelDocumentGuid == null
      ) {
        this.missingErrors.push(this.getInput("passportType")?.label);
        this.errors.travelDocumentGuid = "required";
      }
      if (
        selectedPerson.passportIssueDate == "" ||
        selectedPerson.passportIssueDate == null
      ) {
        this.missingErrors.push(this.getInput("passportIssueDate")?.label);
        this.errors.passportIssueDate = "required";
      }
      if (
        selectedPerson.passportValidityDate == "" ||
        selectedPerson.passportValidityDate == null
      ) {
        this.missingErrors.push(this.getInput("passportValidityDate")?.label);
        this.errors.passportValidityDate = "required";
      }
    } else {
      if (this.personTravelDocument.passportNumber == "") {
        this.errors.passportNumber = "required";
        this.missingErrors.push(this.getInput("passportNumber")?.label);
      }
      if (
        this.personTravelDocument.travelDocumentGuid == "" ||
        this.personTravelDocument.travelDocumentGuid == null
      ) {
        this.missingErrors.push(this.getInput("passportType")?.label);
        this.errors.travelDocumentGuid = "required";
      }
      if (
        this.personTravelDocument.passportIssueDate == "" ||
        this.personTravelDocument.passportIssueDate == null
      ) {
        this.missingErrors.push(this.getInput("passportIssueDate")?.label);
        this.errors.passportIssueDate = "required";
      }
      if (
        this.personTravelDocument.passportValidityDate == "" ||
        this.personTravelDocument.passportValidityDate == null
      ) {
        this.missingErrors.push(this.getInput("passportValidityDate")?.label);
        this.errors.passportValidityDate = "required";
      }
    }

    if (selectedPerson.address == "") {
      this.errors.address = "required";
      this.missingErrors.push(this.getInput("address")?.label);
    }
    if (selectedPerson.phone == "") {
      this.errors.phoneNumber = "required";
      this.missingErrors.push(this.getInput("phoneNumber")?.label);
    }
    if (selectedPerson.eMail == "") {
      this.errors.eMail = "required";
      this.missingErrors.push(this.getInput("email")?.label);
    }
    if (!isValidPhoneNumber(this.translatedCountriesPhone?.find(
      (x: any) => x.guid == selectedPerson.phoneCodeGuid
    )?.phoneCode + selectedPerson.phone)) {
      this.errors.phoneNumber = "invalid";
      if (!this.missingErrors.includes(this.getInput("phoneNumber")?.label))
        this.missingErrors.push(this.getInput("phoneNumber")?.label);
    }
    this.validateEmail();
    if (this.hasError() || this.photoError) {
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

      this.showMissingInformation = true;
      return;
    }
    if (this.isNew) {
      this.newPerson.parentGuid = this.user.guid;
      this.newPerson.nationalityGuid = this.user.nationalityGuid;

      this.detail =
        this.section?.breadcrumb?.registeredUsers +
        " (" +
        this.newPerson.name +
        (this.newPerson.surname ? " " + this.newPerson.surname : "") +
        ")";
      this.memberService.addParent(selectedPerson).subscribe({
        next: (v) => {
          this.newGuid = v.message;
          if (v.success) {
            this.showUpdateSuccess = true;
            const guid = v.message;
            this.memberService
              .addTravelDocument({
                memberGuid: guid,
                travelDocumentGuid: this.newPerson.travelDocumentGuid,
                passportNumber: this.newPerson.passportNumber,
                passportIssueDate: this.newPerson.passportIssueDate,
                passportValidityDate: this.newPerson.passportValidityDate,
                status: true,
              })
              .subscribe({
                next: (v) => {
                  if (v.success) {
                    this.showUpdateSuccess = true;
                    this.isNew = false;

                    this.httpClient
                      .get(
                        `${environment.apiUrl
                        }/traveldocumentmember/list-website/${guid}?status=1&timestamp=${new Date().getTime()}`
                      )
                      .subscribe((data: any) => {
                        this.httpClient
                          .get(
                            `${environment.apiUrl}/member/listparent-website`
                          )
                          .subscribe((data: any) => {
                            for (let d of data.data)
                              d.gender = d.gender.toString();
                            this.people = data.data;
                            if (data.data.length == 0) this.isNew = true;

                            this.spinnerService.display(false);
                            this.cdr.detectChanges();
                          });
                      });
                  }
                },
                error: (e) => {
                  this.error = this.languageService.getError(e.error);
                  this.cdr.detectChanges();
                },
                complete: () => { },
              });
          }
        },
        error: (e) => {
          this.error = this.languageService.getError(e.error);
          this.cdr.detectChanges();
        },
        complete: () => { },
      });
    } else {
      this.detail =
        this.section?.breadcrumb?.registeredUsers +
        " (" +
        selectedPerson.name +
        (selectedPerson.surname ? " " + selectedPerson.surname : "") +
        ")";

      this.memberService.updateParent(selectedPerson).subscribe({
        next: (v) => {
          if (v.success) {
            if (
              JSON.stringify(this.personTravelDocument) !=
              JSON.stringify(this.oldPersonTravelDocument)
            ) {
              this.memberService
                .addTravelDocument(this.personTravelDocument)
                .subscribe({
                  next: (d) => {
                    if (d.success) {
                      this.showUpdateSuccess = true;
                      this.isNew = false;
                      this.oldPersonTravelDocument = {
                        ...this.personTravelDocument,
                      };
                      this.spinnerService.display(false);
                    }
                  },
                  error: (e) => {
                    this.error = this.languageService.getError(e.error);
                    this.cdr.detectChanges();
                  },
                  complete: () => { },
                });
            } else {
              this.showUpdateSuccess = true;
              this.isNew = false;
            }
          }
        },
        error: (e) => {
          this.error = this.languageService.getError(e.error);
          this.cdr.detectChanges();
        },
        complete: () => { },
      });
    }
  }
}
