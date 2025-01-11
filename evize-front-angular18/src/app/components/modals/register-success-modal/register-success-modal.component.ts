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
  selector: "register-success-modal",
  templateUrl: "./register-success-modal.component.html",
})
export class RegisterSuccessModalComponent implements OnInit, OnDestroy {
  @Input() visible: any = false;
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
  getInput(key: string) {
    return this.languageService.getInput(key);
  }
  toggle() {
    this.visible = false;
    this.visibleChange.emit(false);
    this.router.navigate(["/login"]);
    this.cdr.detectChanges();
  }
  forgotPassword() {
    this.toggle();
  }
}
