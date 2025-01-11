import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from "@angular/core";
import { Subscription } from "rxjs";
import { LanguageService } from "../../../shared/language.service";

@Component({
  selector: "text-input",
  templateUrl: "./text-input.component.html",
})
export class TextInputComponent implements OnInit, OnDestroy {
  @Input() value: any = null;
  @Input() max?: any = null;
  @Input() key: string = "";
  @Input() placeholder: string = "";
  @Input() onlyAlphaNumeric: boolean = false;
  @Input() error: string = "";
  @Input() required: boolean = false;
  @Input() disabled: boolean = false;
  @Input() mode: "normal" | "captcha" | "light" = "normal";
  @Output() valueChange = new EventEmitter<string>();
  @Output() errorChange = new EventEmitter<string>();

  section: any = {
    label: "",
    placeholder: "",
  };
  constructor(
    private languageService: LanguageService,
    private cdr: ChangeDetectorRef
  ) { }
  private subscriptions = new Subscription();

  ngOnInit() {
    if (this.key) {
      this.subscriptions.add(this.languageService.sectionData.subscribe(() => {
        const tempSection = this.languageService.getInput(this.key);
        if (tempSection) this.section = tempSection;
      }));
    }
  }
  ngOnDestroy(): void {
    this.subscriptions.unsubscribe()
  }
  getErrorMessage(key: string) {
    return this.languageService.getError(key);
  }
  reset(e: any) {
    if (this.onlyAlphaNumeric) {
      e.target.value = e.target.value.replace(/[^a-zA-ZğüşöçİĞÜŞÖÇ ]/g, "");
    }
    if (this.max && e.target.value.length > Number(this.max)) {
      e.target.value = e.target.value.substr(0, this.max);
    }
    this.value = e.target.value;
    this.valueChange.emit(e.target.value);
    this.errorChange.emit("");
    this.cdr.detectChanges();
  }
}
