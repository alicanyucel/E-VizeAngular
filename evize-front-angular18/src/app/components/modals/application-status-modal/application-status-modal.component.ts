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
  selector: "application-status-modal",
  templateUrl: "./application-status-modal.component.html",
})
export class ApplicationStatusModalComponent implements OnInit, OnDestroy {
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
  reset() {
    localStorage.removeItem("latestApplication");
    this.router.navigate(["/apply"]);
    this.toggle();
  }
  continue() {
    this.router.navigate([
      "/apply/" + (localStorage.getItem("applicationStatus") ?? ""),
    ]);
    this.toggle();
  }
  getInput(key: string) {
    return this.languageService.getInput(key);
  }
}
