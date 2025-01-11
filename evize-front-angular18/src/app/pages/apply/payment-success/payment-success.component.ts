import { isPlatformBrowser } from "@angular/common";
import { HttpClient } from "@angular/common/http";
import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  Inject,
  OnDestroy,
  OnInit,
  PLATFORM_ID
} from "@angular/core";
import { Title } from "@angular/platform-browser";
import { Router } from "@angular/router";
import { Subscription } from "rxjs";
import { environment } from "../../../../environment/environment";
import { SpinnerService } from "../../../components/spinner/spinner.service";
import { LanguageService } from "../../../shared/language.service";
import { MemberService } from "../../../shared/member.service";
import { ApplicationService } from "../application.service";

@Component({
  selector: "app-apply-payment-success",
  templateUrl: "./payment-success.component.html",
})
export class ApplyPaymentSuccessComponent
  implements OnInit, AfterViewInit, OnDestroy {
  private subscriptions = new Subscription();
  constructor(
    private cdr: ChangeDetectorRef,
    private router: Router,
    private httpClient: HttpClient,
    private applicationService: ApplicationService,
    private memberService: MemberService,
    private titleService: Title,
    private languageService: LanguageService,
    private spinnerService: SpinnerService,
    @Inject(PLATFORM_ID) private _platformId: Object
  ) {

  }
  expiryYear() {
    if (!this.expiry.includes("/")) return "";
    return this.expiry.split("/")[1];
  }
  expiryMonth() {
    return this.expiry.split("/")[0];
  }
  visible = true;
  section: any;
  cardError: any = null;
  countries: any;
  models: any;
  travelDocuments: any;
  passportValidity: any;
  nationalities$: any;
  additionalVisa: any;
  additionalVisaValidity: any;
  notes = [
    "Lütfen Türkiye’ye giriş yapmayı öngördüğünüz tarihi ilgili alana yazın.",
    "E-Vizenizin geçerlilik süresi, ülkeye giriş yapacağınız tarih itibariyle başlayacaktır.",
    "Geçerlilik süresi, ikamet süresinden farklıdır. Geçerli bir e-Vizeye sahip olsanız dahi Türkiye’de solda belirtilen ikamet süresinden fazla süreyle kalabilmek için bulunduğunuz ildeki Emniyet Müdürlüğü’nün Yabancılar Şubesine başvurarak, ikamet tezkeresi almanız gerekmektedir.",
    "Türkiye’de bir girişte ikamet tezkeresi olmaksızın solda belirtilen ikamet süresinden fazla süreyle kaldığınız takdirde idari para cezasına çarptırılabilirsiniz ve Türkiye’ye girişiniz belirli bir süre için yasaklanabilir.",
    "E-Vize sistemi, Türkiye’de kaldığınız süreyi hesaplamamaktadır. Bu nedenle, e-Vizenizde öngörülen toplam ikamet süresini aşıp aşmadığınızı kontrol etmek sizin sorumluluğunuzdadır.",
  ];
  user: any = null;
  documentType: any = "";
  finalaggreement = false;
  environment = environment;
  modelConditions: any;
  aggreementModalToggle = false;
  travelDocumentGuid = "";
  conditions = false;
  payFormContent = "";
  ngAfterViewInit(): void { }

  selectedIndex = -1;
  setSelectedIndex(i: number) {
    this.selectedIndex = i;
    this.cardError = false;
    this.ccode = null;
  }
  paymentError: any = null;
  cardNumber = "";
  expiry = "";
  cvv = "";
  ccode: any = null;
  lang = "tr";
  popup = false;
  getPrice() {
    return (
      (this.applicationService.selectedModel?.regime.price.toFixed(2) ?? "") +
      " " +
      (this.applicationService.selectedModel?.regime.currency.code ?? "")
    );
  }
  getFee() {
    return (
      (this.applicationService.selectedModel?.regime.fee.toFixed(2) ?? "") +
      " " +
      (this.applicationService.selectedModel?.regime.currency.code ?? "")
    );
  }

  getTotal() {
    return (
      (
        this.applicationService.selectedModel?.regime.price +
        this.applicationService.selectedModel?.regime.fee
      ).toFixed(2) +
      " " +
      (this.applicationService.selectedModel?.regime.currency.code ?? "")
    );
  }
  togglePopup() {
    this.popup = !this.popup;

    const body = document.getElementsByTagName("body")[0];
    if (this.popup) {
      body.classList.add("modal-open");
    } else {
      body.classList.remove("modal-open");
    }
    this.cdr.detectChanges();
  }

  code: any = null;
  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
  ngOnInit(): void {
    this.languageService.sectionData.subscribe(() => {
      this.section = this.languageService.getSection("newApplication");
      if (this.section) this.titleService.setTitle(this.section?.payment?.title);
    });
    this.nationalities$ = this.httpClient.get(
      `${environment.apiUrl}/nationality/list?timestamp=${new Date().getTime()}`
    );
    this.httpClient
      .get(
        `${environment.apiUrl
        }/traveldocument/list?status=1&timestamp=${new Date().getTime()}`
      )
      .subscribe((data: any) => {
        this.travelDocuments = data.data;
      });
    this.httpClient
      .get(
        `${environment.apiUrl
        }/nationality/list?timestamp=${new Date().getTime()}`
      )
      .subscribe((data: any) => {
        this.countries = data.data;
      });

    if (isPlatformBrowser(this._platformId)) {
      this.subscriptions.add(this.memberService.member.subscribe((member: any) => {
        if (!member) this.router.navigate(["/"]);
        this.user = member;
        this.spinnerService.display(false);
        if (this.applicationService.application == null) {
          if (typeof localStorage !== "undefined") {
            localStorage?.removeItem("latestApplication");
            localStorage?.removeItem("applicationStatus");
          }
        }
      }));
    }
  }
}
