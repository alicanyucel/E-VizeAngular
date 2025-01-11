import { isPlatformBrowser } from "@angular/common";
import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Inject,
  Input,
  OnDestroy,
  OnInit,
  Output,
  PLATFORM_ID,
} from "@angular/core";
import { Router } from "@angular/router";
import { Subscription } from "rxjs";
import { environment } from "../../../../environment/environment";
import { LanguageService } from "../../../shared/language.service";
import { MemberService } from "../../../shared/member.service";

@Component({
  selector: "visa-result-modal",
  templateUrl: "./visa-result-modal.component.html",
})
export class VisaResultModalComponent implements OnInit, OnDestroy {
  @Input() public visible: any = false;
  @Input() public eligible: any;
  @Input() public conditions: any;
  @Input() public selectedModel: any;
  @Input() public arrivalDate: any;
  @Output() visibleChange = new EventEmitter<boolean>();
  constructor(
    private cdr: ChangeDetectorRef,
    private router: Router,
    private languageService: LanguageService,
    private memberService: MemberService,
    @Inject(PLATFORM_ID) private _platformId: Object
  ) { }
  private subscriptions = new Subscription();

  environment = environment;
  section: any;
  user: any = null;
  applySection: any;
  ngOnInit(): void {
    if (isPlatformBrowser(this._platformId)) {
      this.subscriptions.add(this.memberService.member.subscribe((member: any) => {
        if (member) this.user = member;
      }));
    }
    this.subscriptions.add(this.languageService.sectionData.subscribe((_: string) => {
      this.section = this.languageService.getSection("homepage");
      this.applySection = this.languageService.getSection("newApplication");
    }));
  }
  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
  getCondition(id: string) {
    return this.languageService.getCondition(id);
  }

  back() {
    this.router.navigate(["/apply"]);
  }
  toggle() {
    this.visible = false;
    this.visibleChange.emit(false);
    this.cdr.detectChanges();
  }
  getDate1() {
    return new Date(this.arrivalDate).toLocaleDateString("tr-TR", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }
  getDate2() {
    const d = new Date(this.arrivalDate);
    d.setDate(d.getDate() + this.getPeriodValidity());
    return d.toLocaleDateString("tr-TR", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }
  getResidencePeriod() {
    return this.selectedModel.regime.residencePeriod;
  }
  getPrice() {
    return this.selectedModel.regime.price;
  }
  getPeriodValidity() {
    return this.selectedModel.regime.periodValidity;
  }

  getEntryType() {
    if (this.selectedModel.regime.regimeVisaType.visaEntryType.code == 0)
      this.applySection.single
    if (this.selectedModel.regime.regimeVisaType.visaEntryType.code == 1)
      this.applySection.multi
    if (this.selectedModel.regime.regimeVisaType.visaEntryType.code == 2)
      this.applySection.transit
    return "";
  }
  getDescription() {
    return this.applySection?.visaType?.description
      ?.replace(
        "{startDate}",
        ` <span class="font-semibold">${this.getDate1()}</span>`
      )
      .replace(
        "{endDate}",
        ` <span class="font-semibold">${this.getDate2()}</span>`
      )
      .replace(
        "{validity}",
        ` <span class="font-semibold italic text-[#E34545]">${this.getPeriodValidity()}</span>`
      )
      .replace(
        "{residence}",
        ` <span class="font-semibold italic text-[#E34545]">${this.getResidencePeriod()}</span>`
      );
  }
  continue() {
    this.router.navigate(["/apply/applicants"]);
  }
}
