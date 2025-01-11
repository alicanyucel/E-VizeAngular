import { isPlatformBrowser } from "@angular/common";
import { HttpClient } from "@angular/common/http";
import {
  ChangeDetectorRef,
  Component,
  Inject,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
} from "@angular/core";
import { DomSanitizer, Title } from "@angular/platform-browser";
import { AsYouType } from "libphonenumber-js";
import { Subscription } from "rxjs";
import { environment } from "../../../environment/environment";
import { SpinnerService } from "../../components/spinner/spinner.service";
import { LanguageService } from "../../shared/language.service";
import { MemberService } from "../../shared/member.service";

interface Error {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  conditions: string;
  message: string;
  captcha: string;
}
@Component({
  selector: "app-contact",
  templateUrl: "./contact.component.html",
})
export class ContactComponent implements OnInit, OnDestroy {
  constructor(
    private spinnerService: SpinnerService,
    private memberService: MemberService,
    private httpClient: HttpClient,
    private sanitizer: DomSanitizer,
    private languageService: LanguageService,
    private titleService: Title,
    @Inject(PLATFORM_ID) private _platformId: Object,
    private cdr: ChangeDetectorRef
  ) { }
  private subscriptions = new Subscription();

  numbersOnlyValidator(event: any) {
    const pattern = /^[0-9\-]*$/;
    if (!pattern.test(event.target.value)) {
      event.target.value = event.target.value.replace(/[^0-9\-]/g, "");
    }
  }

  refreshCaptcha() {
    if (isPlatformBrowser(this._platformId)) {
      this.httpClient
        .get<Blob>(environment.apiUrl + "/contact/getcaptcha", {
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
  errors: Error = {
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    conditions: "",
    message: "",
    captcha: "",
  };
  translatedNationalities: any = [];
  nationalities$: any;

  errorPopup = false;
  successPopup = false;

  conditions = false;
  conditionModal = false;
  section: any;
  user: any = null;
  environment = environment;
  captchaId = "";
  captchaData: any;
  captchaCode = "";
  member: any;
  name = "";
  surname = "";
  email = "";
  phone = "";
  message = "";
  nation: any;
  getErrorMessage(key: string) {
    return this.languageService.getError(key);
  }
  ngOnInit(): void {
    if (isPlatformBrowser(this._platformId)) {
      this.subscriptions.add(this.languageService.sectionData.subscribe(() => {
        this.section = this.languageService.getSection("contact");
        if (!this.section) return;
        if (this.section) this.titleService.setTitle(this.section.og.title);
        if (this.nationalities$) {
          this.translatedNationalities = [];
          for (let nation of this.nationalities$) {
            this.translatedNationalities.push({
              guid: nation.guid,
              name: this.languageService.getTranslation(nation.guid),
              phoneCode: nation.phoneCode,
            });
          }
        }
        this.translatedNationalities = this.translatedNationalities.sort(
          (x: any, y: any) => ("" + x.name).localeCompare(y.name)
        );

        this.memberService.member.subscribe((member) => {
          this.user = member;
          this.member = member;
          this.spinnerService.display(false);
        });
      }));

      this.httpClient
        .get<Blob>(environment.apiUrl + "/contact/getcaptcha", {
          responseType: "blob" as "json",
          observe: "response",
        })
        .subscribe((resp) => {
          this.captchaId = resp.headers.get("X-Captcha-Id")?.toString() ?? "";
          let objectURL = URL.createObjectURL(resp.body!);
          this.captchaData = this.sanitizer.bypassSecurityTrustUrl(objectURL);
        });
      this.httpClient
        .get(
          `${environment.apiUrl
          }/nationality/list?isTurkiye=true&timestamp=${new Date().getTime()}`
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
    }
  }
  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
  getInput(key: string) {
    return this.languageService.getInput(key);
  }

  checkConditions() {
    this.conditions = !this.conditions;
    if (this.conditions) this.conditionModal = true;
    this.errors.conditions = "";
  }
  hasError() {
    return Object.values(this.errors).find((x: string) => x != "");
  }
  validateEmail() {
    const validRegex =
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

    if (!this.email.match(validRegex) && this.errors.email == "") {
      this.errors.email = "invalid";
    }
  }

  asYouType(event: any) {
    this.phone = new AsYouType().input(event.target.value);
    this.cdr.detectChanges();
  }

  send() {
    if (this.name == "") this.errors.firstName = "required";
    if (this.surname == "") this.errors.lastName = "required";
    if (this.phone == "") this.errors.phoneNumber = "required";
    if (this.email == "") this.errors.email = "required";
    if (!this.conditions) this.errors.conditions = "required";
    if (this.message == "") this.errors.message = "required";
    if (this.captchaCode == "") this.errors.captcha = "required";
    this.validateEmail();

    if (this.hasError()) return;

    this.spinnerService.display(true);
    this.httpClient
      .post(environment.apiUrl + "/contact/send", {
        captchaGuid: this.captchaId,
        captchaCode: this.captchaCode,
        email: this.email,
        message: this.message,
        name: this.name,
        phone: "string",
        surname: this.surname,
      })
      .subscribe({
        next: (v: any) => {
          this.name = "";
          this.surname = "";
          this.email = "";
          this.phone = "";
          this.conditions = false;
          this.message = "";
          this.spinnerService.display(false);
          if (v.success) this.successPopup = true;
          else this.errorPopup = true;
          this.refreshCaptcha();
        },

        error: (e) => {
          if (e.error?.message == "CAPTCHA_ERROR_INCORRECT_CODE") {
            this.errors.captcha = "invalid";
          } else this.errorPopup = true;
          this.refreshCaptcha();
          this.spinnerService.display(false);
        },
        complete: () => { },
      });
  }
}
