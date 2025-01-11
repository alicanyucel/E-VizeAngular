import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from "@angular/core";
import { Subscription } from "rxjs";
import { LanguageService } from "../../../shared/language.service";

@Component({
  selector: "password-input",
  templateUrl: "./password-input.component.html",
})
export class PasswordInputComponent implements OnInit, OnDestroy {
  @Input() value: any = null;
  @Input() error: string = "";
  @Input() key: string = "";
  @Input() required: boolean = false;
  @Input() showPasswordHint: boolean = false;
  @Input() hint: string = "";
  @Input() light: boolean = true;
  @Output() valueChange = new EventEmitter<string>();
  @Output() errorChange = new EventEmitter<string>();

  constructor(private languageService: LanguageService) { }
  section: any = {
    label: "",
    placeholder: "",
  };
  private subscriptions = new Subscription();

  passwordHidden = true;
  ngOnInit() {
    if (this.key) {
      this.subscriptions.add(this.languageService.sectionData.subscribe(() => {
        const tempSection = this.languageService.getInput(this.key);
        if (tempSection) this.section = tempSection;
      }));
    }
  }
  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
  getErrorMessage(key: string) {
    return this.languageService.getError(key);
  }

  reset() {
    this.valueChange.emit(this.value);
    this.errorChange.emit("");
  }
  togglePasswordVisibility() {
    this.passwordHidden = !this.passwordHidden;
  }
}
