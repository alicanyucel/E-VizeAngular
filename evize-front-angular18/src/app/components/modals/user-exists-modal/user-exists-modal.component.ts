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
  selector: "user-exists-modal",
  templateUrl: "./user-exists-modal.component.html",
})
export class UserExistsModalComponent implements OnInit, OnDestroy {
  @Input() visible: any = false;
  @Input() email: any = "";
  @Output() visibleChange = new EventEmitter<boolean>();
  constructor(
    private cdr: ChangeDetectorRef,
    private router: Router,
    private languageService: LanguageService,
  ) { }
  private subscriptions = new Subscription();

  section: any;
  environment = environment;

  ngOnInit(): void {
    this.subscriptions.add(this.languageService.sectionData.subscribe((_: string) => {
      this.section = this.languageService.getSection("register");
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
  forgotPassword() {
    this.toggle();
    this.router.navigate([
      "/reset-password/" + this.email.replaceAll(".", "%2022%"),
    ]);
  }
}
