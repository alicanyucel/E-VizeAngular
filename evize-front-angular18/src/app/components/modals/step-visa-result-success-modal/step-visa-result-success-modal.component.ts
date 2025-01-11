import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output
} from "@angular/core";
import { Router } from "@angular/router";
import { Subscription } from "rxjs";
import { environment } from "../../../../environment/environment";
import { LanguageService } from "../../../shared/language.service";

@Component({
  selector: "step-visa-result-success-modal",
  templateUrl: "./step-visa-result-success-modal.component.html",
})
export class StepVisaResultSuccessModalComponent implements OnInit, OnDestroy {
  @Input() public visible: any = false;
  @Input() public selectedModel: any;
  @Input() public arrivalDate: any;
  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() onCancel: EventEmitter<any> = new EventEmitter();
  constructor(
    private cdr: ChangeDetectorRef,
    private languageService: LanguageService,
    private router: Router,
  ) { }
  private subscriptions = new Subscription();

  environment = environment;
  section: any;
  applySection: any;
  ngOnInit(): void {
    this.subscriptions.add(this.languageService.sectionData.subscribe((_: string) => {
      this.section = this.languageService.getSection("homepage");
      this.applySection = this.languageService.getSection("newApplication");
    }));
  }
  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
  toggle() {
    this.visible = false;
    this.visibleChange.emit(false);
    this.cdr.detectChanges();
  }
  getDate1() {
    return new Date(this.arrivalDate).toLocaleDateString("tr-TR", {
      year: "numeric",
      month: "numeric",
      day: "numeric",
    });
  }
  getDate2() {
    const d = new Date(this.arrivalDate);
    d.setDate(d.getDate() + this.getPeriodValidity());
    return d.toLocaleDateString("tr-TR", {
      year: "numeric",
      month: "numeric",
      day: "numeric",
    });
  }
  getResidencePeriod() {
    return this.selectedModel.regime.residencePeriod;
  }
  getPrice() {
    return this.selectedModel.regime.price;
  }
  getAdmitPrice() {
    return this.selectedModel.regime.admitFee;
  }
  getFee() {
    return this.selectedModel.regime.fee;
  }
  getPeriodValidity() {
    return this.selectedModel.regime.periodValidity;
  }

  getEntryType() {
    return this.selectedModel.regime.regimeVisaType.visaEntryType.code == 1
      ? this.applySection.single
      : this.applySection.multi;
  }
  getInput(key: string) {
    return this.languageService.getInput(key);
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
        ` <span class="font-semibold text-[#205FD9]">${this.getPeriodValidity()}</span>`
      )
      .replace(
        "{residence}",
        ` <span class="font-semibold text-[#205FD9]">${this.getResidencePeriod()}</span>`
      );
  }
  apply() {
    this.router.navigate(["/apply/applicants"]);
  }
  cancel() {
    this.onCancel.emit();
    this.toggle();
  }
}
