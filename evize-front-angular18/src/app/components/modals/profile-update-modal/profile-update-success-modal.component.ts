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
  selector: "profile-update-success-modal",
  templateUrl: "./profile-update-success-modal.component.html",
})
export class ProfileUpdateSuccessModalComponent implements OnInit, OnDestroy {
  @Input() public visible: any = false;
  @Input() public missingPassport?: boolean = false;
  @Input() public retUrl?: string | null = null;
  @Input() public i?: string | null = null;
  @Input() public newGuid?: string | null = null;
  @Input() public detail?: string | null = null;
  @Output() visibleChange = new EventEmitter<boolean>();
  constructor(
    private cdr: ChangeDetectorRef,
    private languageService: LanguageService,
    private router: Router,
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
  toggle() {
    this.visible = false;
    this.visibleChange.emit(false);
    this.cdr.detectChanges();
  }
  apply() {
    if (this.i)
      this.router.navigate([this.retUrl], {
        queryParams: {
          guid: this.newGuid ?? undefined,
          i: this.i ?? undefined,
        },
      });
    else if (this.retUrl) {
      this.router.navigate([this.retUrl]);
    } else this.router.navigate(["/apply"]);
  }
}
