import { isPlatformBrowser } from "@angular/common";
import { HttpClient } from "@angular/common/http";
import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Inject,
  OnDestroy,
  OnInit,
  PLATFORM_ID
} from "@angular/core";
import { DomSanitizer, Title } from "@angular/platform-browser";
import { Router } from "@angular/router";
import { Subscription } from "rxjs";
import { environment } from "../../../environment/environment";
import { SpinnerService } from "../../components/spinner/spinner.service";
import { LanguageService } from "../../shared/language.service";
import { MemberService } from "../../shared/member.service";
interface Error {
  firstName: string;
  lastName: string;
  birthday: string;
  nationality: string;
  gender: string;
  email: string;
  password: string;
  captcha: string;
}
@Component({
  selector: "app-register",
  templateUrl: "./register.component.html",
})
export class RegisterComponent implements OnInit, OnDestroy {
  constructor(
    private cdr: ChangeDetectorRef,
    private router: Router,
    private httpClient: HttpClient,
    private sanitizer: DomSanitizer,
    private memberService: MemberService,
    public languageService: LanguageService,
    private titleService: Title,
    @Inject(PLATFORM_ID) private _platformId: Object,
    private spinnerService: SpinnerService
  ) { }
  private subscriptions = new Subscription();
  environment = environment;
  refreshCaptcha() {
    this.member.captcha = "";

    this.httpClient
      .get<Blob>(environment.apiUrl + "/captcha/getcaptcha", {
        responseType: "blob" as "json",
        observe: "response",
      })
      .subscribe((resp) => {
        this.captchaId = resp.headers.get("X-Captcha-Id")?.toString() ?? "";
        let objectURL = URL.createObjectURL(resp.body!);
        this.captchaData = this.sanitizer.bypassSecurityTrustUrl(objectURL);
        this.cdr.detectChanges();
      });
  }
  loginErrorModal = false;
  minBirthday = new Date(1900, 1, 1);
  today = new Date();
  section: any;
  nationalities: any;
  translatedNationalities: any = [];
  country = "";
  missingErrors: any = [];
  showMissingInformation = false;
  member: any = {
    captchaCode: "",
    nationalityGuid: null,
    name: "",
    secondName: "",
    lastName: "",
    eMail: "",
    phone: "",
    address: "",
    birthDay: "",
    motherName: "",
    fatherName: "",
    password: "",
    isEMailVerification: false,
    status: true,
    gender: null,
  };
  errors: Error = {
    firstName: "",
    lastName: "",
    birthday: "",
    nationality: "",
    gender: "",
    email: "",
    password: "",
    captcha: "",
  };
  userExistsModal = false;
  registeredModal = false;
  error: null | string = null;
  reloadEvent: EventEmitter<boolean> = new EventEmitter();
  captchaId = "";
  captchaData: any;
  submitted = false;

  ngOnInit(): void {
    if (isPlatformBrowser(this._platformId)) {
      this.subscriptions.add(this.languageService.sectionData.subscribe(() => {
        this.section = this.languageService.getSection("register");
        if (!this.section) return;
        this.titleService.setTitle(this.section.og.title);
        this.spinnerService.display(false);

        this.translatedNationalities = [];
        if (this.nationalities)
          for (let nation of this.nationalities) {
            this.translatedNationalities.push({
              guid: nation.guid,
              name: this.languageService.getTranslation(nation.guid),
            });
          }
      }));

      this.httpClient
        .get(
          `${environment.apiUrl
          }/nationality/list?timestamp=${new Date().getTime()}`
        )
        .subscribe((data: any) => {
          this.nationalities = data.data;
          this.translatedNationalities = [];
          if (this.nationalities)
            for (let nation of this.nationalities) {
              this.translatedNationalities.push({
                guid: nation.guid,
                name: this.languageService.getTranslation(nation.guid),
              });
            }
        });
      this.subscriptions.add(this.memberService.member.subscribe((member) => {
        if (member) this.router.navigate(["/"]);
      }));

      this.httpClient
        .get<Blob>(environment.apiUrl + "/captcha/getcaptcha", {
          responseType: "blob" as "json",
          observe: "response",
        })
        .subscribe((resp) => {
          this.captchaId = resp.headers.get("X-Captcha-Id")?.toString() ?? "";
          let objectURL = URL.createObjectURL(resp.body!);
          this.captchaData = this.sanitizer.bypassSecurityTrustUrl(objectURL);
        });
    }
  }
  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
  getInput(key: string) {
    return this.languageService.getInput(key);
  }
  getGender(key: string) {
    return this.languageService.getGender(key);
  }
  validatePassword() {
    const symbolRegex = /[.!#$%&'*+/=?^_`{|}~-]/;
    const lowerCaseRegex = /[a-z]/;
    const upperCaseRegex = /[A-Z]/;
    const digitRegex = /[0-9]/;
    if (
      !this.member.password.match(symbolRegex) ||
      !this.member.password.match(lowerCaseRegex) ||
      !this.member.password.match(upperCaseRegex) ||
      !this.member.password.match(digitRegex) ||
      this.member.password.length < 8
    ) {
      if (this.errors.password == "") {
        this.errors.password = "invalid";
        this.missingErrors.push(this.getInput("password")?.label);
      }
    }
  }
  validateEmail() {
    const validRegex = /\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/;
    if (!this.member.eMail.match(validRegex) && this.errors.email == "") {
      this.errors.email = "invalid";
      this.missingErrors.push(this.getInput("email")?.label);
    }
  }

  hasError() {
    if (this.member.name == "") {
      this.errors.firstName = "required";
      this.missingErrors.push(this.getInput("firstName")?.label);
    }
    if (this.member.birthDay == "") {
      this.missingErrors.push(this.getInput("birthday")?.label);

      this.errors.birthday = "required";
    }
    if (
      this.member.nationalityGuid == "" ||
      this.member.nationalityGuid == null
    ) {
      this.errors.nationality = "required";
      this.missingErrors.push(this.getInput("nationality")?.label);
    }

    if (this.member.gender == "" || this.member.gender == null) {
      this.missingErrors.push(this.getInput("gender")?.label);

      this.errors.gender = "required";
    }

    if (this.member.eMail == "") {
      this.missingErrors.push(this.getInput("email")?.label);

      this.errors.email = "required";
    } else this.validateEmail();
    if (this.member.password == "") {
      this.missingErrors.push(this.getInput("password")?.label);
      this.errors.password = "required";
    } else this.validatePassword();
    if (this.member.captchaCode == "") {
      this.missingErrors.push(this.getInput("captcha")?.label);
      this.errors.captcha = "required";
    }
    return Object.values(this.errors).find((x: string) => x != "");
  }
  getErrorMessage(key: string) {
    return this.languageService.getError(key);
  }

  nextStep() {
    this.missingErrors = [];
    if (this.hasError()) {
      this.showMissingInformation = true;
      return;
    }
    this.member.surname = this.member.lastName;
    this.member.captchaGuid = this.captchaId;
    this.spinnerService.display(true);
    this.httpClient
      .post(
        environment.apiUrl + "/member/add",

        {
          ...this.member,
          lang: this.languageService.currentLanguageCode.value,
        },
        {
          responseType: "text",
        }
      )
      .subscribe({
        next: (v) => {
          this.refreshCaptcha();
          this.captchaData = "";
          this.cdr.detectChanges();
          this.httpClient
            .get<Blob>(environment.apiUrl + "/captcha/getcaptcha", {
              responseType: "blob" as "json",
              observe: "response",
            })
            .subscribe((resp) => {
              this.member.captchaCode = "";
              this.captchaId =
                resp.headers.get("X-Captcha-Id")?.toString() ?? "";
              let objectURL = URL.createObjectURL(resp.body!);
              this.captchaData =
                this.sanitizer.bypassSecurityTrustUrl(objectURL);
              this.cdr.detectChanges();
            });

          //this.memberService.setLocalStorage(v);
          this.registeredModal = true;
          this.spinnerService.display(false);

          this.cdr.detectChanges();
        },
        error: (e) => {
          this.refreshCaptcha();
          this.member.captchaCode = "";
          this.captchaData = "";
          this.httpClient
            .get<Blob>(environment.apiUrl + "/captcha/getcaptcha", {
              responseType: "blob" as "json",
              observe: "response",
            })
            .subscribe((resp) => {
              this.captchaId =
                resp.headers.get("X-Captcha-Id")?.toString() ?? "";
              let objectURL = URL.createObjectURL(resp.body!);
              this.captchaData =
                this.sanitizer.bypassSecurityTrustUrl(objectURL);
            });
          const errorMessage = this.languageService.getError(
            JSON.parse(e.error)?.message
          );
          this.spinnerService.display(false);
          if (errorMessage == "ENTER_VALID_EMAIL") {
            this.errors.email = "invalid";
            this.missingErrors.push(this.getInput("email")?.label);
            this.spinnerService.display(false);
            return;
          } else if (errorMessage == "RECORD_ALREADY_ADDED") {
            this.userExistsModal = true;
            return;
          }
          this.error = errorMessage;

          this.showMissingInformation = true;
        },
        complete: () => { },
      });
  }
}
