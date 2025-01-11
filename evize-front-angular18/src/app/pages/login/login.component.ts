import { isPlatformBrowser } from "@angular/common";
import { HttpClient } from "@angular/common/http";
import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Inject,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
} from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
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
}
@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
})
export class LoginComponent implements OnInit, AfterViewInit, OnDestroy {
  constructor(
    private spinnerService: SpinnerService,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private memberService: MemberService,
    private languageService: LanguageService,
    private titleService: Title,
    private httpClient: HttpClient,
    private cdr: ChangeDetectorRef,
    @Inject(PLATFORM_ID) private _platformId: Object
  ) { }
  private subscriptions = new Subscription();

  section: any;
  loginErrorModal = false;
  showMissingInformation = false;
  missingErrors: any[] = [];
  passwordHidden = true;

  environment = environment;
  returnUrl: string | undefined;
  loginForm: FormGroup | undefined;
  showVerifiedModal = false;
  defaultAuth: any = {
    email: "",
    password: "",
  };

  errors: Error = {
    password: "",
    email: "",
  };
  error: string | null = null;

  ngAfterViewInit(): void { }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
  ngOnInit(): void {
    if (isPlatformBrowser(this._platformId)) {
      const token = this.route.snapshot.paramMap.get("token");
      if (token) {
        this.httpClient
          .get(`${environment.apiUrl}/member/verify/${token}`)
          .subscribe((user: any) => {
            this.memberService.setLocalStorage(user);
            this.showVerifiedModal = true;
          });
      } else {
        this.subscriptions.add(this.memberService.member.subscribe((member) => {
          if (member) this.router.navigate(["/profile"]);
        }));
      }
      this.subscriptions.add(this.languageService.sectionData.subscribe(() => {
        this.section = this.languageService.getSection("login");
        if (!this.section) return;
        this.titleService.setTitle(this.section.og.title);
        this.spinnerService.display(false);
      }));
      this.returnUrl =
        this.route.snapshot.queryParams["returnUrl".toString()] || "/";
    }
  }
  hasError() {
    return Object.values(this.errors).find((x: string) => x != "");
  }

  getInput(key: string) {
    return this.languageService.getInput(key);
  }
  submit() {
    this.missingErrors = [];
    if (this.defaultAuth.email == "") {
      this.missingErrors.push(this.getInput("email")?.label);
      this.errors.email = "required";
    }
    if (this.defaultAuth.password == "") {
      this.missingErrors.push(this.getInput("password")?.label);
      this.errors.password = "required";
    }
    if (this.hasError()) {
      this.showMissingInformation = true;
      return;
    }
    this.spinnerService.display(true);
    this.memberService
      .login(this.defaultAuth.email, this.defaultAuth.password)
      .subscribe({
        next: (v) => {
          this.memberService.setLocalStorage(v);
          this.router.navigate(["/profile"]);
          //this.spinnerService.display(false);
        },
        error: (e) => {
          this.error = this.languageService.getError(e.error.message);
          this.loginErrorModal = true;
          this.spinnerService.display(false);
          this.cdr.detectChanges();
        },
        complete: () => { },
      });
  }
}
