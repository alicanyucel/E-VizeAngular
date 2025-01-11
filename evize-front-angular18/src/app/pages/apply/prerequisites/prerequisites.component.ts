import { isPlatformBrowser } from "@angular/common";
import { HttpClient } from "@angular/common/http";
import {
  AfterViewInit,
  Component,
  Inject,
  OnDestroy,
  OnInit,
  PLATFORM_ID
} from "@angular/core";
import { Title } from "@angular/platform-browser";
import { Router } from "@angular/router";
import { Subscription } from "rxjs";
import { environment } from "../../../../environment/environment";
import { SpinnerService } from "../../../components/spinner/spinner.service";
import { LanguageService } from "../../../shared/language.service";
import { MemberService } from "../../../shared/member.service";
import { ApplicationService } from "../application.service";

@Component({
  selector: "app-apply-prerequisites",
  templateUrl: "./prerequisites.component.html",
})
export class ApplyPrerequisitesComponent implements OnInit, AfterViewInit, OnDestroy {
  constructor(
    private router: Router,
    private http: HttpClient,
    private applicationService: ApplicationService,
    private memberService: MemberService,
    private titleService: Title,
    private languageService: LanguageService,
    private spinnerService: SpinnerService,
    @Inject(PLATFORM_ID) private _platformId: Object
  ) { }
  private subscriptions = new Subscription()
  getCondition(id: string) {
    return this.languageService.getCondition(id);
  }
  getConditionTranslation(condition: any) {
    return this.languageService.getConditionTranslation(condition);
  }
  section: any;

  user: any = null;
  aggreement = false;
  documentType: any = "";
  finalaggreement = false;
  visaTypeId: number = 1;
  environment = environment;
  modelConditions: any;
  aggreementModalToggle = false;
  selectedModel: any;
  application: any = null;
  travelDocumentGuid = "";
  conditions = false;
  ngAfterViewInit(): void { }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
  getNotes() {
    return this?.visaTypeId == 2
      ? this.section?.conditions?.notes?.notesHtv
      : this.section?.conditions?.notes?.notes;
  }

  ngOnInit(): void {
    if (isPlatformBrowser(this._platformId)) {
      this.subscriptions.add(this.languageService.sectionData.subscribe(() => {
        this.section = this.languageService.getSection("newApplication");
        if (!this.section) return;
        this.titleService.setTitle(this.section?.conditions?.title);
        this.spinnerService.display(false);
      }));
      this.subscriptions.add(this.memberService.member.subscribe((member: any) => {
        if (!member) this.router.navigate(["/"]);
        if (typeof localStorage !== "undefined") {
          const config = localStorage.getItem("latestApplication");
          try {
            const json = JSON.parse(
              config ?? "{application: null, selectedModel: null}"
            );
            if (json.application == null || json.selectedModel == null) {
              if (!member) {
                this.router.navigate(["/apply"]);
                return;
              }
            }
            this.applicationService = json;
            this.aggreement = json.aggreement;
            this.visaTypeId = json.visaTypeId;
            this.application = json.application;
            this.selectedModel = json.selectedModel;
          } catch { }
        }
        if (
          this.application == null ||
          this.selectedModel == null
        ) {
          this.router.navigate(["/apply"]);
          return;
        }
        this.finalaggreement = this?.aggreement;
        this.http
          .get(
            `${environment.apiUrl}/modelcondition/list?modelGuid=${this.selectedModel?.guid}`
          )
          .subscribe((data: any) => {
            this.modelConditions = data.data.modelConditions;

            if (this?.aggreement) {
              for (let condition of this.modelConditions)
                condition.checked = true;
              this.finalaggreement = true;
            }
            this.checkConditions();

          });
      }));

    }
  }
  checkConditions() {
    if (
      this.modelConditions?.find((x: any) => !x.checked) ||
      !this.finalaggreement
    )
      this.conditions = false;
    else this.conditions = true;
  }
  back() {
    this.router.navigate(["/apply/applicants"]);
  }
  nextStep() {
    if (
      this.modelConditions?.find((x: any) => !x.checked) ||
      !this.finalaggreement
    )
      return;
    if (typeof localStorage !== "undefined") {
      localStorage?.setItem(
        "latestApplication",
        JSON.stringify({
          ...this.applicationService, aggreement: true, step: "payment"
        })
      );
      localStorage?.setItem("applicationStatus", "payment");
    }

    this.router.navigate(["/apply/payment"]);
  }
}
