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

@Component({
  selector: "cannot-apply-modal",
  templateUrl: "./cannot-apply-modal.component.html",
})
export class CannotApplyModalComponent implements OnInit, OnDestroy {
  @Input() public visible: any = false;
  @Output() visibleChange = new EventEmitter<boolean>();
  @Input() public errors: any;

  constructor(
    private cdr: ChangeDetectorRef,
    private languageService: LanguageService
  ) { }
  private subscriptions = new Subscription();

  section: any;
  ngOnInit(): void {
  }
  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
  getInput(key: string) {
    return this.languageService.getInput(key);
  }
  toggle() {
    this.visible = false;
    this.visibleChange.emit(false);
    this.cdr.detectChanges();
  }
}
