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
import { Router } from "@angular/router";
import dayjs from "dayjs";
import { Subscription } from "rxjs";
import { environment } from "../../../../environment/environment";
import { SpinnerService } from "../../../components/spinner/spinner.service";
import { LanguageService } from "../../../shared/language.service";
import { MemberService } from "../../../shared/member.service";

@Component({
  selector: "app-profile-applications",
  templateUrl: "./applications.component.html",
})
export class ProfileApplicationsComponent
  implements OnInit, AfterViewInit, OnDestroy {
  constructor(
    private cdr: ChangeDetectorRef,
    private memberService: MemberService,
    private router: Router,
    private httpClient: HttpClient,
    private titleService: Title,
    private languageService: LanguageService,
    private spinnerService: SpinnerService,
    @Inject(PLATFORM_ID) private _platformId: Object
  ) { }
  private subscriptions = new Subscription();

  section: any;
  showRemoveSuccess = false;
  environment = environment;
  missingProfile = false;
  applications: any = null;
  member: any;
  ngAfterViewInit(): void { }

  formatDate(date: string) {
    return dayjs(date).format("DD.MM.YYYY HH:mm");
  }

  submit() { }
  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
  ngOnInit(): void {
    this.spinnerService.display(true);
    if (isPlatformBrowser(this._platformId)) {
      this.subscriptions.add(this.memberService.member.subscribe((member) => {
        if (!member) this.router.navigate(["/"]);
        this.member = member;
        if (isPlatformBrowser(this._platformId)) {
          this.httpClient
            .get(
              `${environment.apiUrl}/application/listmember-website?timestamp=${new Date().getTime()}`
            )
            .subscribe((y: any) => {
              this.applications = y.data;
              this.spinnerService.display(false);
            });
          if (
            member.photo == null ||
            member.motherName == "" ||
            member.fatherName == "" ||
            member.passportIssueDate == null ||
            member.passportIssueDate == "" ||
            member.passportNumber == "" ||
            member.passportNumber == null ||
            member.passportValidityDate == "" ||
            member.passportValidityDate == null
          )
            this.missingProfile = true;
        }
      }));
      this.subscriptions.add(this.languageService.sectionData.subscribe(() => {
        this.section = this.languageService.getSection("profile");
        if (this.section) this.titleService.setTitle(this.section.title);
      }));
    }
  }
  save() {
    this.togglePopup();
  }
  showRemove = false;
  toDelete: any;
  setRemoveDocument(guid: string) {
    this.toDelete = guid;
    this.showRemove = true;
  }
  delete() {
    this.spinnerService.display(true);
    this.showRemove = false;

    this.httpClient
      .put(`${environment.apiUrl}/application/status-website/${this.toDelete}/0`, {})
      .subscribe((data: any) => {
        this.httpClient
          .get(
            `${environment.apiUrl}/application/listmember-website?timestamp=${new Date().getTime()}`
          )
          .subscribe((y: any) => {
            this.applications = y.data;
            this.showRemoveSuccess = true;

            this.spinnerService.display(false);
          });
      });
  }
  popup = false;
  message = "";
  subject = "";
  getStatus(status: string) {
    return this.languageService.getVisaStatus(status);
  }
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
}
