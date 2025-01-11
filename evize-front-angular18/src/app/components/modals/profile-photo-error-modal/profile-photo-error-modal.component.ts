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
  selector: "profile-photo-error-modal",
  templateUrl: "./profile-photo-error-modal.component.html",
})
export class ProfilePhotoErrorModalComponent implements OnInit, OnDestroy {
  @Input() public visible: any = false;
  @Input() public error: any;
  @Output() visibleChange = new EventEmitter<boolean>();
  constructor(
    private cdr: ChangeDetectorRef,
    private languageService: LanguageService,
  ) { }
  private subscriptions = new Subscription();

  environment = environment;
  section: any;
  profileSection: any;
  ngOnInit(): void {
    this.subscriptions.add(this.languageService.sectionData.subscribe((_: string) => {
      this.section = this.languageService.getSection("homepage");
      this.profileSection = this.languageService.getSection("profile");
    }));

  }
  getErrorMessage(key: string) {
    return this.languageService.getError(key);
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
