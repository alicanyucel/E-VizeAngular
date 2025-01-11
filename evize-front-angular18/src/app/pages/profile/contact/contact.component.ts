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
import { DomSanitizer, Title } from "@angular/platform-browser";
import { Router } from "@angular/router";
import { Subscription } from "rxjs";
import { environment } from "../../../../environment/environment";
import { SpinnerService } from "../../../components/spinner/spinner.service";
import { LanguageService } from "../../../shared/language.service";
import { MemberService } from "../../../shared/member.service";
interface Error {
  title: string;
  message: string;
  condition: string;
  captcha: string;
}
@Component({
  selector: "app-profile-contact",
  templateUrl: "./contact.component.html",
})
export class ProfileContactComponent
  implements OnInit, AfterViewInit, OnDestroy {
  constructor(
    private cdr: ChangeDetectorRef,
    private memberService: MemberService,
    private router: Router,
    private titleService: Title,
    private httpClient: HttpClient,
    private sanitizer: DomSanitizer,
    private languageService: LanguageService,
    @Inject(PLATFORM_ID) private _platformId: Object,
    private spinnerService: SpinnerService
  ) { }
  private subscriptions = new Subscription();

  errors: Error = {
    title: "",
    message: "",
    condition: "",
    captcha: "",
  };
  section: any;
  conditionModal = false;
  ngAfterViewInit(): void { }

  submit() { }
  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
  ngOnInit(): void {
    this.spinnerService.display(true);
    if (isPlatformBrowser(this._platformId)) {
      this.subscriptions.add(this.languageService.sectionData.subscribe(() => {
        this.section = this.languageService.getSection("profile");
        if (!this.section) return;
        this.titleService.setTitle(this.section.title);
        this.spinnerService.display(false);
      }));
      this.subscriptions.add(this.memberService.member.subscribe((member) => {
        if (!member) this.router.navigate(["/contact"]);
        this.user = member;
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
    }
  }

  hasError() {
    return Object.values(this.errors).find((x: string) => x != "");
  }
  successPopup = false;
  errorPopup = false;
  user: any;
  popup = false;
  message = "";
  subject = "";
  condition = false;
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
  captchaId = "";
  captchaData: any;
  captchaCode = "";

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
  checkConditions() {
    this.condition = !this.condition;
    if (this.condition) this.conditionModal = true;
    this.errors.condition = "";
  }
  getErrorMessage(key: string) {
    return this.languageService.getError(key);
  }
  send() {
    if (!this.condition) this.errors.condition = "required";
    if (this.message == "") this.errors.message = "required";
    if (this.captchaCode == "") this.errors.captcha = "required";

    if (this.hasError()) return;

    this.spinnerService.display(true);
    this.httpClient
      .post(environment.apiUrl + "/contact/send", {
        captchaGuid: this.captchaId,
        captchaCode: this.captchaCode,

        name: this.user.firstName,
        surname: this.user.lastName,
        email: this.user.eMail,
        phone: this.user.phoneNumber,
        message: this.message,
      })
      .subscribe({
        next: (v: any) => {
          this.message = "";
          this.spinnerService.display(false);
          if (v.message == "CAPTCHA_ERROR_INCORRECT_CODE") {
            this.errors.captcha = "invalid";
          } else if (v.success) this.successPopup = true;
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
