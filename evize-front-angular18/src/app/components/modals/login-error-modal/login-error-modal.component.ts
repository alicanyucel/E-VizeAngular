import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output
} from "@angular/core";
import { Subscription } from "rxjs";
import { LanguageService } from "../../../shared/language.service";
import { SpinnerService } from "../../spinner/spinner.service";

@Component({
  selector: "login-error-modal",
  templateUrl: "./login-error-modal.component.html",
})
export class LoginErrorModalComponent implements OnInit, OnDestroy {
  @Input() public visible: any = false;
  @Input() public error: string | null = "";
  @Output() visibleChange = new EventEmitter<boolean>();
  constructor(
    private cdr: ChangeDetectorRef,
    private languageService: LanguageService,
    private spinnerService: SpinnerService,
  ) { }
  private subscriptions = new Subscription();

  section: any;

  ngOnInit(): void {
    this.subscriptions.add(this.languageService.sectionData.subscribe((_: string) => {
      this.section = this.languageService.getSection("popups");
    }));
  }
  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
  getInput(key: string) {
    return this.languageService.getInput(key);
  }
  toggle() {
    this.visible = false;
    this.spinnerService.display(false);

    this.visibleChange.emit(false);
    this.cdr.detectChanges();
  }
}
