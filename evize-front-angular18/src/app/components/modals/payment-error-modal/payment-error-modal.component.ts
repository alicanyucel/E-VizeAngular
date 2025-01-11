import { isPlatformBrowser } from "@angular/common";
import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Inject,
  Input,
  OnDestroy,
  OnInit,
  Output,
  PLATFORM_ID,
} from "@angular/core";
import { Router } from "@angular/router";
import { Subscription } from "rxjs";
import { environment } from "../../../../environment/environment";
import { LanguageService } from "../../../shared/language.service";
import { MemberService } from "../../../shared/member.service";

@Component({
  selector: "payment-error-modal",
  templateUrl: "./payment-error-modal.component.html",
})
export class PaymentErrorModalComponent implements OnInit, OnDestroy {
  @Input() public visible: any = false;
  @Input() public paymentError: any = "";
  @Output() visibleChange = new EventEmitter<boolean>();
  constructor(
    private cdr: ChangeDetectorRef,
    private languageService: LanguageService,
    private memberService: MemberService,
    private router: Router,
    @Inject(PLATFORM_ID) private _platformId: Object
  ) { }
  private subscriptions = new Subscription();

  environment = environment;
  section: any;
  user: any;
  ngOnInit(): void {
    if (isPlatformBrowser(this._platformId)) {
      this.subscriptions.add(this.memberService.member.subscribe((member: any) => {
        if (member) this.user = member;
      }));
    }
    this.subscriptions.add(this.languageService.sectionData.subscribe((_: string) => {
      this.section = this.languageService.getSection("newApplication");
    }));

  }
  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
  getErrorMessage(key: string) {
    return this.languageService.getError(key);
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
    if (this.user) {
      this.router.navigate(["/apply"]);
    } else {
      this.router.navigate(["/login"]);
    }
  }
}
