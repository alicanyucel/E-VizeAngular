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
import { Subscription } from "rxjs";
import { environment } from "../../../environment/environment";
import { SpinnerService } from "../../components/spinner/spinner.service";
import { LanguageService } from "../../shared/language.service";
import { MemberService } from "../../shared/member.service";
interface Error {
  email: string;
  password: string;
  passwordConfirm: string;
  verificationCode: string;
}
@Component({
  selector: "app-reset-password",
  templateUrl: "./reset-password.component.html",
})
export class ResetPasswordComponent
  implements OnInit, AfterViewInit, OnDestroy {
  constructor(
    private cdr: ChangeDetectorRef,
    private router: Router,
    private http: HttpClient,
    private memberService: MemberService,
    private route: ActivatedRoute,
    private languageService: LanguageService,
    private spinnerService: SpinnerService,
    private titleService: Title,
    @Inject(PLATFORM_ID) private _platformId: Object
  ) { }
  private subscriptions = new Subscription();

  resetPasswordSection: any;
  showUpdateModal = false;
  registerSection: any;
  environment = environment;
  nationalities$: any;
  nationality = "";
  travelDocumentGuid = "";
  models: any;
  travelDocuments: any;
  error: null | string = null;
  email = "";
  errors: Error = {
    email: "",
    password: "",
    passwordConfirm: "",
    verificationCode: "",
  };
  state = 1;
  code = "";
  password = "";
  passwordConfirm = "";
  ngAfterViewInit() { }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
  ngOnInit(): void {
    this.spinnerService.display(true);
    if (isPlatformBrowser(this._platformId)) {
      this.subscriptions.add(this.memberService.member.subscribe((member) => {
        if (member) this.router.navigate(["/"]);
      }));

      this.subscriptions.add(this.languageService.sectionData.subscribe(() => {
        this.resetPasswordSection =
          this.languageService.getSection("forgot_password");
        if (!this.resetPasswordSection) return;
        this.registerSection = this.languageService.getSection("register");
        this.titleService.setTitle(this.resetPasswordSection.og.title);
        this.spinnerService.display(false);
      }));

      let token = this.route.snapshot.paramMap.get("email");
      if (token) {
        token = token?.replaceAll("%2022%", ".");
        this.email = token;
        this.cdr.detectChanges();
      }
    }
  }
  submitted = false;
  validatePassword() {
    const symbolRegex = /[.!#$%&'*+/=?^_`{|}~-]/;
    const lowerCaseRegex = /[a-z]/;
    const upperCaseRegex = /[A-Z]/;
    const digitRegex = /[0-9]/;
    if (
      !this.password.match(symbolRegex) ||
      !this.password.match(lowerCaseRegex) ||
      !this.password.match(upperCaseRegex) ||
      !this.password.match(digitRegex) ||
      this.password.length < 8
    ) {
      if (this.errors.password == "") this.errors.password = "invalid";
    }
  }

  hasError() {
    if (this.state == 1) {
      if (this.email == "") this.errors.email = "required";
      const regexEmail = /\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/;

      if (this.errors.email == "" && !regexEmail.test(this.email)) {
        this.errors.email = "invalid";
      }
    }
    if (this.state == 2) {
      if (this.password == "") this.errors.password = "required";
      if (this.code == "") this.errors.verificationCode = "required";
      if (this.passwordConfirm == "") this.errors.passwordConfirm = "required";
      if (this.password != this.passwordConfirm)
        this.errors.passwordConfirm = "invalid";
      this.validatePassword();
    }

    return Object.values(this.errors).find((x: string) => x != "");
  }
  getErrorMessage(key: string) {
    return this.languageService.getError(key);
  }

  nextStep() {
    if (this.hasError()) return;
    if (this.state == 1) {
      this.spinnerService.display(true);
      this.cdr.detectChanges();
      this.http
        .get(
          environment.apiUrl +
          "/member/forgotpassword/" +
          this.email +
          `/${this.languageService.currentLanguageCode.value
          }?timestamp=${new Date().getTime()}`
        )
        .subscribe({
          next: (v) => {
            this.spinnerService.display(false);

            this.state = 2;
            this.cdr.detectChanges();
          },
          error: (e) => {
            this.spinnerService.display(false);
            this.errors.email = "notFound";
          },
          complete: () => { },
        });
    } else if (this.state == 2) {
      this.submitted = true;
      this.spinnerService.display(true);
      this.http
        .put(environment.apiUrl + "/member/repassword", {
          email: this.email,
          code: this.code,
          password: this.password,
          language: this.languageService.currentLanguageCode.value,
        })
        .subscribe({
          next: (v) => {
            this.showUpdateModal = true;
            this.submitted = false;
            this.cdr.detectChanges();
            this.spinnerService.display(false);
          },
          error: (e) => {
            this.errors.verificationCode = "invalid";
            this.submitted = false;
            this.cdr.detectChanges();
            this.spinnerService.display(false);
          },
          complete: () => {
            this.submitted = false;
            this.cdr.detectChanges();
          },
        });
    }
    //this.router.navigate(["/reset-password" + this.email]);
  }
}
