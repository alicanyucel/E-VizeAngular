import { isPlatformBrowser } from "@angular/common";
import {
  Component,
  EventEmitter,
  Inject,
  Input,
  OnDestroy,
  OnInit,
  Output,
  PLATFORM_ID,
} from "@angular/core";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { Arabic } from "flatpickr/dist/l10n/ar.js";
import { German } from "flatpickr/dist/l10n/de.js";
import { english } from "flatpickr/dist/l10n/default";
import { Spanish } from "flatpickr/dist/l10n/es.js";
import { French } from "flatpickr/dist/l10n/fr.js";
import { Dutch } from "flatpickr/dist/l10n/nl.js";
import { Polish } from "flatpickr/dist/l10n/pl.js";
import { Turkish } from "flatpickr/dist/l10n/tr.js";
import { Mandarin } from "flatpickr/dist/l10n/zh.js";
import { Subscription } from "rxjs";
import { LanguageService } from "../../../shared/language.service";
dayjs.extend(customParseFormat);

@Component({
  selector: "date-input",
  templateUrl: "./date-input.component.html",
})
export class DateInputComponent implements OnInit, OnDestroy {
  @Input() value: any = null;
  @Input() key: string = "";
  @Input() error: string = "";
  @Input() required: boolean = false;
  @Input() light: boolean = false;
  @Input() minDate: any;
  @Input() maxDate: any = new Date(2999, 1, 1);
  @Output() valueChange = new EventEmitter<string | null>();
  @Output() errorChange = new EventEmitter<string>();
  locale: any = english;
  private subscriptions = new Subscription();

  currentValue: Date | null = null;
  section = {
    label: "",
    placeholder: "",
  };
  constructor(
    @Inject(PLATFORM_ID) private _platformId: Object,
    private languageService: LanguageService
  ) { }
  ngOnInit() {
    console.log("min", this.minDate)
    if (isPlatformBrowser(this._platformId))
      this.currentValue = new Date(this.value?.toString().split("T")[0] ?? "");
    this.subscriptions.add(this.languageService.currentLanguageCode.subscribe((x: string) => {
      if (x.toLowerCase() == "en") {
        this.locale = english;
      } else if (x.toLowerCase() == "tr") {
        this.locale = Turkish;
      } else if (x.toLowerCase() == "de") {
        this.locale = German;
      } else if (x.toLowerCase() == "pl") {
        this.locale = Polish;
      } else if (x.toLowerCase() == "ar") {
        this.locale = Arabic;
      } else if (x.toLowerCase() == "es") {
        this.locale = Spanish;
      } else if (x.toLowerCase() == "fr") {
        this.locale = French;
      } else if (x.toLowerCase() == "nl") {
        this.locale = Dutch;
      } else if (x.toLowerCase() == "cn") {
        this.locale = Mandarin;
      }
    }));
    if (this.key) {
      this.subscriptions.add(this.languageService.sectionData.subscribe(() => {
        const tempSection = this.languageService.getInput(this.key);
        if (tempSection) this.section = tempSection;
      }));
    }
  }
  ngOnDestroy(): void {
    console.log("min", this.minDate)

    this.subscriptions.unsubscribe();
  }
  getErrorMessage(key: string) {
    return this.languageService.getError(key);
  }

  isClient() {
    return isPlatformBrowser(this._platformId);
  }
  reset() {
    setTimeout(() => {
      if (this.currentValue == null) {
        this.valueChange.emit(null);
      }
      this.valueChange.emit(
        dayjs(new Date(this.currentValue ?? "")?.toISOString() ?? "").format(
          "YYYY-MM-DD"
        )
      );
      this.errorChange.emit("");
    }, 50);
  }
}
