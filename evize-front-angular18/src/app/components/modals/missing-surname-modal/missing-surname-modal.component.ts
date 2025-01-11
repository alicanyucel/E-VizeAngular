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
  selector: "missing-surname-modal",
  templateUrl: "./missing-surname-modal.component.html",
})
export class MissingSurnameModalComponent implements OnInit, OnDestroy {
  @Input() public visible: any = false;
  @Output() visibleChange = new EventEmitter<boolean>();
  constructor(
    private cdr: ChangeDetectorRef,
    private languageService: LanguageService,
  ) { }
  private subscriptions = new Subscription();

  applicationSection: any;
  section: any;
  ngOnInit(): void {
    this.subscriptions.add(this.languageService.sectionData.subscribe((_: string) => {
      this.section = this.languageService.getSection("homepage");
      this.applicationSection =
        this.languageService.getSection("newApplication");
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
    this.visibleChange.emit(false);
    this.cdr.detectChanges();
  }
}
