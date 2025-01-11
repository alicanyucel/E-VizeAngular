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
import { environment } from "../../../../environment/environment";
import { LanguageService } from "../../../shared/language.service";

@Component({
  selector: "contact-conditions-modal",
  templateUrl: "./contact-conditions-modal.component.html",
})
export class ContactConditionsModalComponent implements OnInit, OnDestroy {
  @Input() public visible: any = false;
  @Input() public eligible: any;
  @Input() public conditions: any;
  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() revert = new EventEmitter<any>();
  constructor(
    private cdr: ChangeDetectorRef,
    private languageService: LanguageService,
  ) { }
  private subscriptions = new Subscription();

  environment = environment;
  section: any;
  user: any = null;
  getInput(key: string) {
    return this.languageService.getInput(key);
  }
  ngOnInit(): void {
    this.subscriptions.add(this.languageService.sectionData.subscribe((_: string) => {
      this.section = this.languageService.getSection("contact");
      if (!this.section) return;
    }));
  }
  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
  getValue(condition: any) {
    return Object.values(condition)[0];
  }
  cancel() {
    this.revert.emit();
    this.toggle();
  }
  toggle() {
    this.visible = false;
    this.visibleChange.emit(false);
    this.cdr.detectChanges();
  }
}
