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
import { AsYouType } from "libphonenumber-js";
import { Subscription } from "rxjs";
import { LanguageService } from "../../../shared/language.service";

@Component({
  selector: "phone-input",
  templateUrl: "./phone-input.component.html",
})
export class PhoneInputComponent implements OnInit, OnDestroy {
  @Input() value: any = null;
  @Input() phoneCodeCountryGuid: any = null;
  @Input() maxLength?: number | null = 20;
  @Input() key: string = "";
  @Input() placeholder: string = "";
  @Input() onlyAlphaNumeric: boolean = false;
  @Input() error: string = "";
  @Input() required: boolean = false;
  @Input() disabled: boolean = false;
  @Input() translatedCountries: any = null;
  @Input() mode: "normal" | "captcha" | "light" = "normal";
  @Output() valueChange = new EventEmitter<string>();
  @Output() phoneCodeCountryGuidChange = new EventEmitter<string>();
  @Output() errorChange = new EventEmitter<string>();

  displayedValue = this.value;
  countryCode: string | null = null;
  countryGuid: string | null = null;
  section: any = {
    label: "",
    placeholder: "",
  };
  constructor(
    private languageService: LanguageService,
    private cdr: ChangeDetectorRef,
    @Inject(PLATFORM_ID) private _platformId: Object
  ) { }
  private subscriptions = new Subscription();

  updateCountryCode(event: any) {
    this.countryCode = this.translatedCountries?.find(
      (x: any) => x.guid == event
    )?.phoneCode;
    this.phoneCodeCountryGuidChange.next(event ?? "");

    try {
      const asYouType = new AsYouType();
      this.displayedValue = asYouType
        .input(this.countryCode + this.value)
        .replace(this.countryCode ?? "++", "")
        .trim();
    } catch (ex) { }
    this.valueChange.emit(this.displayedValue.replace(this.countryCode, ""));

    this.errorChange.emit("");
    this.cdr.detectChanges();
  }
  ngOnInit() {
    if (isPlatformBrowser(this._platformId)) {
      try {
        this.countryGuid = this.phoneCodeCountryGuid;
        this.countryCode = this.translatedCountries?.find(
          (x: any) => x.guid == this.countryGuid
        )?.phoneCode;
        const asYouType = new AsYouType();
        this.displayedValue = asYouType
          .input(this.countryCode + this.value)
          .replace(this.countryCode ?? "++", "")
          .trim();
      } catch (ex) { }

      if (this.key) {
        this.subscriptions.add(this.languageService.sectionData.subscribe(() => {
          const tempSection = this.languageService.getInput(this.key);
          if (tempSection) this.section = tempSection;
        }));
      }
    }
  }
  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
  getErrorMessage(key: string) {
    return this.languageService.getError(key);
  }
  getInput(key: string) {
    return this.languageService.getInput(key);
  }
  reset(e: any) {
    this.countryCode = this.translatedCountries.find(
      (x: any) => x.guid == this.countryGuid
    )?.phoneCode;
    e.target.value = e.target.value.replace(/[^0-9 ]/g, "");

    if (this.maxLength && e.target.value.length > this.maxLength) {
      e.target.value = e.target.value.substr(0, this.maxLength);
    }
    const asYouType = new AsYouType();
    try {
      this.displayedValue = asYouType
        .input(this.countryCode + this.displayedValue)
        .replace(this.countryCode ?? "++", "")
        .trim();
    } catch { }

    this.valueChange.emit(this.displayedValue.replace(this.countryCode, ""));
    this.errorChange.emit("");
    this.cdr.detectChanges();
  }
}
