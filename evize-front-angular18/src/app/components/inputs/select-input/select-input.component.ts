import { isPlatformBrowser } from "@angular/common";
import {
  Component,
  EventEmitter,
  Inject,
  Input,
  Output,
  PLATFORM_ID,
} from "@angular/core";

@Component({
  selector: "select-input",
  templateUrl: "./select-input.component.html",
})
export class SelectInputComponent {
  @Input() value: any = null;
  @Input() label: string = "";
  @Input() placeholder: string = "";
  @Input() error: string = "";
  @Input() required: boolean = false;
  @Input() values: any = null;
  @Input() light: boolean = false;
  @Output() valueChange = new EventEmitter<string>();
  @Output() errorChange = new EventEmitter<string>();

  constructor(@Inject(PLATFORM_ID) private _platformId: Object) {}
  isClient() {
    return isPlatformBrowser(this._platformId);
  }

  reset() {
    this.valueChange.emit(this.value);
    this.errorChange.emit("");
  }
}
