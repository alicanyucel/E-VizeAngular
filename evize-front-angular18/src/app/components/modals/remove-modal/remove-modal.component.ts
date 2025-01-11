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
  selector: "remove-modal",
  templateUrl: "./remove-modal.component.html",
})
export class RemoveModalComponent implements OnInit, OnDestroy {
  @Input() public visible: any = false;
  @Input() public detail?: any = null;
  @Output() onDelete: EventEmitter<any> = new EventEmitter();
  @Output() visibleChange = new EventEmitter<boolean>();
  constructor(
    private cdr: ChangeDetectorRef,
    private languageService: LanguageService,
  ) { }
  private subscriptions = new Subscription();

  environment = environment;
  section: any;
  ngOnInit(): void {
    this.subscriptions.add(this.languageService.sectionData.subscribe((_: string) => {
      this.section = this.languageService.getSection("profile");
    }));
  }
  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
  getInput(key: string) {
    return this.languageService.getInput(key);
  }
  delete() {
    this.onDelete.emit();
  }
  toggle() {
    this.visible = false;
    this.visibleChange.emit(false);
    this.cdr.detectChanges();
  }
}
