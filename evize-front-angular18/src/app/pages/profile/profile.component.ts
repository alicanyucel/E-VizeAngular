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
import { environment } from "../../../environment/environment";
import { SpinnerService } from "../../components/spinner/spinner.service";
import { LanguageService } from "../../shared/language.service";
import { MemberService } from "../../shared/member.service";
interface Errors {
  name: string;
  surname: string;
  birthDay: string;
  nationalityGuid: string;
  gender: string;
  fatherName: string;
  motherName: string;
  address: string;
  phoneNumber: string;
  eMail: string;
}
@Component({
  selector: "app-profile",
  templateUrl: "./profile.component.html",
})
export class ProfileComponent implements OnInit, AfterViewInit, OnDestroy {
  constructor(
    private cdr: ChangeDetectorRef,
    private router: Router,
    private httpClient: HttpClient,
    private memberService: MemberService,
    private titleService: Title,
    private languageService: LanguageService,
    private spinnerService: SpinnerService,
    private activateRoute: ActivatedRoute,
    @Inject(PLATFORM_ID) private _platformId: Object
  ) { }
  private subscriptions = new Subscription();

  retUrl: string | null = null;
  showUpdateSuccess = false;
  showImageError = false;
  apiUrl = environment.apiUrl;
  section: any;
  imageError = "";
  translatedNationalities: any;
  translatedNationalitiesPhone: any;
  errors: Errors = {
    name: "",
    surname: "",
    birthDay: "",
    nationalityGuid: "",
    gender: "",
    fatherName: "",
    motherName: "",
    address: "",
    phoneNumber: "",
    eMail: "",
  };
  isBrowser() {
    return isPlatformBrowser(this._platformId);
  }

  ngAfterViewInit(): void { }
  nationalities$: any;
  nationalitiesPhone$: any;
  travelDocuments: any;
  countries$: any;
  user: any = null;
  environment = environment;
  error: any;
  success: any;
  files: File[] = [];
  status: "initial" | "uploading" | "success" | "fail" = "initial";
  photoError: any = null;
  today = new Date();
  minBirthday = new Date(1900, 1, 1);
  missingProfile = false;
  showMissingInformation = false;
  missingPassport = false;
  missingErrors: any[] = [];
  memberTravelDocuments: any;

  onAssetChange(event: any) {
    const files = event.target.files;

    if (files.length) {
      this.status = "initial";
      this.files = files;

      const formData = new FormData();

      [...this.files].forEach((file) => {
        formData.append("file", file, file.name);
      });
      this.spinnerService.display(true);

      const upload$ = this.httpClient.post(
        `${environment.apiUrl}/upload/add?memberGuid=${this.user.guid}`,
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
                    this.user.photo = z.message;
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
  numbersOnlyValidator(event: any) {
    const pattern = /^[0-9\-]*$/;
    if (!pattern.test(event.target.value)) {
      event.target.value = event.target.value.replace(/[^0-9\-]/g, "");
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
  getInput(key: string) {
    return this.languageService.getInput(key);
  }
  ngOnInit(): void {
    this.spinnerService.display(true);
    if (isPlatformBrowser(this._platformId)) {
      this.subscriptions.add(this.activateRoute.queryParams.subscribe((params: any) => {
        if (params.retUrl) this.retUrl = params.retUrl;
      }));

      this.subscriptions.add(this.languageService.sectionData.subscribe(() => {
        this.section = this.languageService.getSection("profile");
        if (this.section == null || this.user == null) return;
        this.translatedNationalities = [];
        if (this.nationalities$)
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

        this.translatedNationalitiesPhone = [];
        if (this.nationalities$)
          for (let nation of this.nationalitiesPhone$) {
            this.translatedNationalitiesPhone.push({
              guid: nation.guid,
              name: this.languageService.getTranslation(nation.guid),
              phoneCode: nation.phoneCode,
            });
          }

        this.translatedNationalitiesPhone =
          this.translatedNationalitiesPhone.sort((x: any, y: any) =>
            ("" + x.name).localeCompare(y.name)
          );

        this.titleService.setTitle(this.section.title);

        this.spinnerService.display(false);
      }));

      this.subscriptions.add(this.memberService.member.subscribe((member) => {
        if (!member) {
          this.router.navigate(["/login"]);
          return;
        }
        this.httpClient
          .get(
            `${environment.apiUrl
            }/traveldocumentmember/list-website/${member.guid}?status=1&timestamp=${new Date().getTime()}`
          )
          .subscribe((data: any) => {
            this.memberTravelDocuments = data.data;
            if (
              member.photo == null ||
              member.address == "" ||
              member.address == null ||
              member.phone == "" ||
              member.phone == null
            )
              this.missingProfile = true;
            else if (this.memberTravelDocuments.length == 0)
              this.missingPassport = true;
          });

        this.user = {
          ...member,
          gender: member.gender ? member.gender.toString() : null,
        };
        if (!member) this.router.navigate(["/"]);
        if (this.user) this.user.birthDay = this.user?.birthDay?.split("T")[0];
        if (this.section == null || this.user == null) return;
        this.spinnerService.display(false);
      }));

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
          this.nationalities$ = data.data;
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
        });

      this.httpClient
        .get(
          `${environment.apiUrl
          }/nationality/list?isTurkiye=true&timestamp=${new Date().getTime()}`
        )
        .subscribe((data: any) => {
          this.nationalitiesPhone$ = data.data;
          this.translatedNationalitiesPhone = [];
          for (let nation of this.nationalitiesPhone$) {
            this.translatedNationalitiesPhone.push({
              guid: nation.guid,
              name: this.languageService.getTranslation(nation.guid),
              phoneCode: nation.phoneCode,
            });
          }
          this.translatedNationalitiesPhone =
            this.translatedNationalitiesPhone.sort((x: any, y: any) =>
              ("" + x.name).localeCompare(y.name)
            );
        });
    }
  }
  getGender(key: string) {
    return this.languageService.getGender(key);
  }

  hasError() {
    return (
      Object.values(this.errors).find((x: string) => x != "") || this.photoError
    );
  }

  asYouType(event: any) {
    this.user.phoneNumber = new AsYouType().input(event.target.value);
    this.cdr.detectChanges();
  }
  validateEmail() {
    const validRegex =
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

    if (!this.user.eMail.match(validRegex) && this.errors.eMail == "") {
      this.errors.eMail = "invalid";
      this.missingErrors.push(this.getInput("email")?.label);
    }
  }
  refresh() {
    this.spinnerService.display(true);
    window.location.reload();
  }

  save() {
    this.missingErrors = [];
    this.photoError = null;
    if (this.user.photo == "" || this.user.photo == null) {
      this.missingErrors.push(this.section?.imageError);
      this.photoError = true;
    }
    if (this.user.name == "") {
      this.errors.name = "required";
      this.missingErrors.push(this.getInput("firstName")?.label);
    }
    if (this.user.birthDay == "" || this.user.birthDay == null) {
      this.errors.birthDay = "required";
      this.missingErrors.push(this.getInput("birthday")?.label);
    }
    if (this.user.nationalityGuid == "") {
      this.errors.nationalityGuid = "required";
      this.missingErrors.push(this.getInput("nationality")?.label);
    }
    if (this.user.gender == "") {
      this.errors.gender = "required";
      this.missingErrors.push(this.getInput("gender")?.label);
    }
    if (this.user.address == "") {
      this.errors.address = "required";
      this.missingErrors.push(this.getInput("address")?.label);
    }
    if (this.user.phoneNumber == "") {
      this.errors.phoneNumber = "required";
      this.missingErrors.push(this.getInput("phoneNumber")?.label);
    }
    if (this.user.eMail == "") {
      this.errors.eMail = "required";
      this.missingErrors.push(this.getInput("email")?.label);
    }
    if (!isValidPhoneNumber(this.translatedNationalitiesPhone?.find(
      (x: any) => x.guid == this.user.phoneCodeGuid
    )?.phoneCode + this.user.phone)) {

      this.errors.phoneNumber = "invalid";
      if (!this.missingErrors.includes(this.getInput("phoneNumber")?.label))
        this.missingErrors.push(this.getInput("phoneNumber")?.label);
    }
    this.validateEmail();
    if (this.hasError() || this.photoError) {
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
    this.spinnerService.display(true);
    this.memberService.update(this.user).subscribe({
      next: (v) => {
        if (v.success)
          this.memberService.setLocalStorageMember(this.user);
        this.spinnerService.display(false);
        this.showUpdateSuccess = true;
      },
      error: (e) => {
        this.error = this.languageService.getError(e.error);
        this.spinnerService.display(false);
        this.cdr.detectChanges();
      },
      complete: () => {
        this.spinnerService.display(false);
      },
    });
  }
  getNationality(nationality: string) {
    return this.languageService.getNationality(nationality);
  }
  getErrorMessage(key: string) {
    return this.languageService.getError(key);
  }
}
