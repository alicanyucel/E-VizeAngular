import { isPlatformBrowser } from "@angular/common";
import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  Inject,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
  Renderer2,
  ViewChild,
} from "@angular/core";
import { Router } from "@angular/router";
import { Subscription } from "rxjs";
import { environment } from "../../../environment/environment";
import { LanguageService } from "../../shared/language.service";
import { MemberService } from "../../shared/member.service";
import { SpinnerService } from "../spinner/spinner.service";

@Component({
  selector: "app-navbar",
  templateUrl: "./navbar.component.html",
})
export class NavbarComponent implements OnInit, OnDestroy {
  @ViewChild("languageToggleButton") languageToggleButton:
    | ElementRef
    | undefined;
  @ViewChild("languageToggleText") languageToggleText: ElementRef | undefined;
  @ViewChild("toggleButton") toggleButton: ElementRef | undefined;
  @ViewChild("toggleButtonText") toggleButtonText: ElementRef | undefined;
  @ViewChild("toggleButtonIcon") toggleButtonIcon: ElementRef | undefined;
  @ViewChild("menu") menu: ElementRef | undefined;

  constructor(
    private memberService: MemberService,
    private renderer: Renderer2,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private languageService: LanguageService,
    private spinnerService: SpinnerService,
    @Inject(PLATFORM_ID) private _platformId: Object
  ) { }
  private subscriptions = new Subscription();

  showVisaStatusModal = false;
  currentLanguageName = "";
  languages: any;
  apiUrl = environment.apiUrl;
  section: any = null;
  user: any;
  languageMenuToggler = false;
  menuToggler = false;

  toggleMenu() {
    if (this.user) {
      this.menuToggler = !this.menuToggler;
      this.cdr.detectChanges();
    } else {
      this.router.navigate(["/login"]);
    }
  }
  toggleLanguageMenu() {
    this.languageMenuToggler = !this.languageMenuToggler;
    this.cdr.detectChanges();
  }

  logout() {
    this.memberService.logout();
    this.spinnerService.display(true);
    this.router.navigate(["/"]);
    this.spinnerService.display(false);
  }

  ngOnInit(): void {
    this.subscriptions.add(this.languageService.sectionData.subscribe(() => {
      this.section = this.languageService.getSection("navbar");
    }));

    if (isPlatformBrowser(this._platformId)) {
      this.currentLanguageName = this.languageService.currentLanguageName.value;
      this.subscriptions.add(this.languageService.currentLanguageName.subscribe((newLanguage: string) => {
        this.currentLanguageName = newLanguage;
      }
      ));
      this.subscriptions.add(this.memberService.member.subscribe((member) => {
        this.user = member;
      }));
      this.renderer.listen("window", "click", (e: Event) => {
        if (
          e.target != this.toggleButtonText?.nativeElement &&
          e.target != this.toggleButtonIcon?.nativeElement &&
          e.target !== this.toggleButton?.nativeElement &&
          e.target !== this.menu?.nativeElement
        ) {
          this.menuToggler = false;
        }
        if (
          e.target != this.languageToggleButton?.nativeElement &&
          e.target != this.languageToggleText?.nativeElement
        ) {
          this.languageMenuToggler = false;
        }
      });
    }
  }
  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
  setLanguage(code: string, name: string, rtl: boolean) {
    this.spinnerService.display(true);
    setTimeout(() => {
      this.languageService.changeLanguage(code, name, rtl);
      this.spinnerService.display(false);
      this.cdr.detectChanges();
    }, 100);
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
