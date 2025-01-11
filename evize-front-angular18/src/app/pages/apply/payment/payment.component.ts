import { isPlatformBrowser } from "@angular/common";
import { HttpClient } from "@angular/common/http";
import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  Inject,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
} from "@angular/core";
import { Title } from "@angular/platform-browser";
import { ActivatedRoute, Router } from "@angular/router";
import dayjs from "dayjs";
import { environment } from "../../../../environment/environment";
import { SpinnerService } from "../../../components/spinner/spinner.service";
import { LanguageService } from "../../../shared/language.service";
import { MemberService } from "../../../shared/member.service";
import { ApplicationService } from "../application.service";
import { Subscription } from "rxjs";
interface Error {
  cardNumber: string;
  cvv: string;
  skt: string;
}
@Component({
  selector: "app-apply-payment",
  templateUrl: "./payment.component.html",
})
export class ApplyPaymentComponent implements OnInit, AfterViewInit, OnDestroy {
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
  ) { }
  private subscriptions = new Subscription();

  months = [
    "01",
    "02",
    "03",
    "04",
    "05",
    "06",
    "07",
    "08",
    "09",
    "10",
    "11",
    "12",
  ];
  paymentTimeLeft = "";
  years: any[] = [];
  applicationPrice = 0;
  applicationPriceDetail = "";
  admitFeeAmount = 0;
  applicationCommission = 0;
  applicationCurrency = "";
  visaError = false;
  visaSuccess = false;
  section: any;
  cardError: any = null;
  countries: any;
  visaAddError = false;
  visaAddErrors: any[] = [];
  models: any;
  travelDocuments: any;
  passportValidity: any;
  nationalities$: any;
  additionalVisa: any;
  additionalVisaValidity: any;
  submitted = false;
  user: any = null;
  documentType: any = "";
  finalaggreement = false;
  environment = environment;
  modelConditions: any;
  aggreementModalToggle = false;
  memdata: any;
  travelDocumentGuid = "";
  conditions = false;
  payFormContent = "";
  errors: Error = {
    cardNumber: "",
    cvv: "",
    skt: "",
  };
  ngAfterViewInit(): void { }
  getNotes() {
    return this.applicationService?.visaTypeId == 2
      ? this.section?.payment?.notes?.notesHtv
      : this.section?.payment?.notes?.notes;
  }

  selectedIndex = -1;
  setSelectedIndex(i: number) {
    this.selectedIndex = i;
    this.cardError = false;
    this.ccode = null;
  }
  initial = false;
  cardExpiryMonth: any = null;
  cardExpiryYear: any = null;
  paymentError: any = null;
  cardNumber = "";
  cvv = "";
  ccode: any = null;
  lang = "tr";
  popup = false;
  getPrice() {
    if (isNaN(this.applicationPrice)) return "";
    return (
      Number(this.applicationPrice ?? 0).toFixed(2) +
      " " +
      this.applicationCurrency
    );
  }
  getPriceDetail() {
    return this.applicationPriceDetail ?? "";
  }
  getAdmitFee() {
    if (isNaN(this.admitFeeAmount)) return "";
    return (
      Number(this.admitFeeAmount ?? 0).toFixed(2) +
      " " +
      this.applicationCurrency
    );
  }
  back() {
    this.router.navigate(["/apply/prerequisites"]);
  }
  getFee() {
    if (isNaN(this.applicationPrice)) return "";
    return (
      Number(this.applicationCommission ?? 0).toFixed(2) +
      " " +
      this.applicationCurrency
    );
  }

  getTotal() {
    if (isNaN(this.applicationPrice)) return "";
    return (
      Number(
        this.applicationPrice + this.applicationCommission + this.admitFeeAmount
      ).toFixed(2) +
      " " +
      this.applicationCurrency
    );
  }

  code: any = null;
  getErrorMessage(key: string) {
    return this.languageService.getError(key);
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
  ngOnInit(): void {
    this.spinnerService.display(true)

    this.years = [];
    for (let i = 0; i < 20; i++)
      this.years.push((new Date().getFullYear() + i).toString().replace("20", ""));
    this.nationalities$ = this.httpClient.get(
      `${environment.apiUrl
      }/nationality/list?timestamp=${new Date().getTime()}`
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
      this.subscriptions.add(this.languageService.sectionData.subscribe(() => {
        this.section = this.languageService.getSection("newApplication");
        if (!this.section) return;
        this.titleService.setTitle(this.section?.payment?.title);
        if (this.applicationService.applicationGuid)
          this.spinnerService.display(false);

        this.cdr.detectChanges();
        if (!this.initial) {
          this.memberService.member.subscribe((member: any) => {
            if (!member) this.router.navigate(["/"]);
            this.initial = true;
            this.user = member;

            const config = localStorage.getItem("latestApplication");
            try {
              const json = JSON.parse(
                config ?? "{application: null, selectedModel: null}"
              );
              if (json.application == null || json.selectedModel == null) {
                if (!member) {
                  this.router.navigate(["/apply"]);
                  this.spinnerService.display(false);
                  return;
                }
              }
              this.applicationPrice = json.applicationPrice;
              this.admitFeeAmount = json.admitFeeAmount;

              this.applicationCommission = json.applicationCommission;
              this.applicationCurrency = json.applicationCurrency;

              this.applicationService = json;
              /*  this.applicationService.peopleNames = json.peopleNames;
                this.applicationService.application = json.application;
                this.applicationService.selectedModel = json.selectedModel;
                this.applicationService.additionalMembers =
                  json.additionalMembers;
                  */



            } catch { }
            this.cdr.detectChanges();

            if (
              this.applicationService.application == null ||
              this.applicationService.selectedModel == null
            ) {
              this.spinnerService.display(false);
              this.router.navigate(["/apply"]);
              return;
            }
            if (!this.applicationService.applicationGuid) {

              if (this.applicationService.additionalApplications.length > 0) {
                this.httpClient
                  .get(`${environment.apiUrl}/member/listparent-website`)
                  .subscribe((memdata: any) => {
                    this.memdata = memdata.data;
                    if (!this.applicationService.applicationGuid) {
                      const additionalApplications: any = []
                      this.applicationService.application.modelGuid = this.applicationService.selectedModel.guid
                      additionalApplications.push(this.applicationService.application)
                      for (let app of this.applicationService.additionalApplications)
                        additionalApplications.push({ ...app, modelGuid: this.applicationService.selectedModel.guid })
                      setTimeout(() => this.spinnerService.display(true), 100);
                      this.httpClient
                        .post(`${environment.apiUrl}/application/addfamily-website`, additionalApplications)
                        .subscribe(
                          {
                            next: (v: any) => {
                              this.httpClient
                                .get(`${environment.apiUrl}/paymentcreditcard/getamountandfee/${v.data[0].applicationGroupGuid}`)
                                .subscribe((priceData: any) => {
                                  if (v) {
                                    this.applicationService.applicationGuid =
                                      v.data[0].applicationGroupGuid;
                                    this.applicationPriceDetail =
                                      priceData.data.amountDetail;
                                    this.applicationPrice = priceData.data.amount;
                                    this.applicationCommission =
                                      priceData.data.commissionAmount;
                                    this.applicationCurrency = priceData.data.currency;
                                    this.admitFeeAmount = priceData.data.admitFeeAmount;

                                    this.applicationService.applicationPriceDetail = this.applicationPriceDetail;
                                    this.applicationService.applicationCommission = this.applicationCommission;
                                    this.applicationService.applicationCurrency = this.applicationCurrency;
                                    this.applicationService.admitFeeAmount = this.admitFeeAmount;
                                    this.applicationService.applicationPrice = this.applicationPrice;

                                    if (typeof localStorage !== "undefined") {
                                      localStorage?.setItem(
                                        "latestApplication",
                                        JSON.stringify({ ...this.applicationService, step: "payment" })
                                      );
                                    }
                                  }
                                  if (priceData.data.amount == 0) {
                                    this.router.navigate(["/apply/payment/success"]);
                                    return;
                                  }

                                  this.spinnerService.display(false);
                                  this.cdr.detectChanges();
                                });
                            },
                            error: (e) => {

                              setTimeout(() => this.spinnerService.display(false), 500);
                              this.visaAddErrors = []
                              for (const data of e.error.data) {
                                if (data.applicationDto.member)
                                  this.visaAddErrors.push(data.member.name + " " + (data.member.secondName ? `${data.member.secondName} ` : "") + data.member.surname)
                              }
                              this.visaAddError = true;
                              this.cdr.detectChanges();
                            },
                            complete: () => {
                              this.spinnerService.display(false);
                            },

                          });
                    }
                  });
              }
              else {
                setTimeout(() => this.spinnerService.display(true), 100);
                this.httpClient
                  .post(
                    `${environment.apiUrl}/application/add-website`,
                    { ...this.applicationService.application, modelGuid: this.applicationService.selectedModel.guid },
                  )
                  .subscribe({
                    next: (v: any) => {
                      this.httpClient
                        .get(
                          `${environment.apiUrl}/paymentcreditcard/getamountandfee/${v.data[0].applicationGroupGuid}`
                        )
                        .subscribe((priceData: any) => {
                          if (v.success) {
                            this.applicationService.applicationGuid =
                              v.data[0].applicationGroupGuid;
                            if (typeof localStorage !== "undefined") {
                              this.applicationPrice = priceData.data.amount;
                              this.admitFeeAmount = priceData.data.admitFeeAmount;
                              this.applicationPriceDetail = priceData.data.amountDetail;

                              this.applicationCommission =
                                priceData.data.commissionAmount;
                              this.applicationCurrency = priceData.data.currency;

                              this.applicationService.applicationPriceDetail = this.applicationPriceDetail;
                              this.applicationService.applicationCommission = this.applicationCommission;
                              this.applicationService.applicationCurrency = this.applicationCurrency;
                              this.applicationService.admitFeeAmount = this.admitFeeAmount;
                              this.applicationService.applicationPrice = this.applicationPrice;

                              if (typeof localStorage !== "undefined") {
                                localStorage?.setItem(
                                  "latestApplication",
                                  JSON.stringify({ ...this.applicationService, step: "payment" })
                                );
                              }
                            }
                            if (priceData.data.amount == 0) {
                              this.router.navigate(["/apply/payment/success"]);
                              return;
                            }

                          }


                          setTimeout(() => this.spinnerService.display(false), 500);
                          this.cdr.detectChanges();
                        });
                    },
                    error: (e) => {

                      setTimeout(() => this.spinnerService.display(false), 500);
                      this.visaAddErrors = []
                      for (const data of e.error.data) {
                        if (data.applicationDto.member)
                          this.visaAddErrors.push(data.member.name + " " + (data.member.secondName ? `${data.member.secondName} ` : "") + data.member.surname)
                      }
                      this.visaAddError = true;
                      this.cdr.detectChanges();
                    },
                    complete: () => {
                      this.spinnerService.display(false);
                    },
                  });
              }
            }
            else {
              setTimeout(() => this.spinnerService.display(false), 1000);

            }
          });
        }
      }));
    }
  }

  luhnCheck = (): boolean => {
    if (!this.cardNumber.length) {
      return false;
    }

    const checkedCardNumber = this.cardNumber.replace(/\s/g, "");

    const lastDigit = Number(checkedCardNumber[checkedCardNumber.length - 1]);

    const reverseCardNumber = checkedCardNumber
      .slice(0, checkedCardNumber.length - 1)
      .split("")
      .reverse()
      .map((x) => Number(x));

    let sum = 0;

    for (let i = 0; i <= reverseCardNumber.length - 1; i += 2) {
      reverseCardNumber[i] = reverseCardNumber[i] * 2;
      if (reverseCardNumber[i] > 9) {
        reverseCardNumber[i] = reverseCardNumber[i] - 9;
      }
    }

    sum = reverseCardNumber.reduce((acc, currValue) => acc + currValue, 0);

    return (sum + lastDigit) % 10 === 0;
  };
  hasError() {
    return Object.values(this.errors).find((x: string) => x != "");
  }
  getInput(key: string) {
    return this.languageService.getInput(key);
  }
  submitPay(formId: string) {
    if (formId == "CC") {
      if (!this.luhnCheck()) {
        this.errors.cardNumber = "invalid";
      }
      if (
        Number(this.cardExpiryMonth ?? "0") < 1 ||
        Number(this.cardExpiryMonth ?? "0") > 12
      ) {
        this.errors.skt = "invalid";
      }

      if (Number(this.cardExpiryYear ?? "0") < Number(dayjs().format("YY"))) {
        this.errors.skt = "invalid";
      }
      if (this.cvv == "" || this.cvv == null) this.errors.cvv = "invalid";
      if (!this.luhnCheck()) {
        this.errors.cardNumber = "invalid";
      }
    }

    if (this.hasError()) return;
    if (this.submitted) return;
    this.submitted = true;
    var keyValuePairs = [
      {
        Key: "lang",
        Value: this.lang,
      },
    ];
    if (formId == "CC") {
      this.cardError = false;

      if (
        this.cardNumber == "" ||
        this.cvv.length < 3 ||
        this.cardExpiryYear == null ||
        this.cardExpiryMonth == null
      ) {
        this.cardError = true;
        this.submitted = false;
        return;
      }
      keyValuePairs.push({
        Key: "pan",
        Value: this.cardNumber,
      });
      keyValuePairs.push({
        Key: "cv2",
        Value: this.cvv,
      });
      keyValuePairs.push({
        Key: "Ecom_Payment_Card_ExpDate_Year",
        Value: this.cardExpiryYear,
      });
      keyValuePairs.push({
        Key: "Ecom_Payment_Card_ExpDate_Month",
        Value: this.cardExpiryMonth,
      });
    } else if (formId == "GIROGATE_SOFORT") {
      if (this.ccode == null) {
        this.submitted = false;
        return;
      }
      keyValuePairs.push({
        Key: "paymentType",
        Value: "GIROGATE_SOFORT",
      });
      keyValuePairs.push({
        Key: "ccode",
        Value: this.ccode,
      });
    } else if (formId == "GIROGATE_IDEAL") {
      keyValuePairs.push({
        Key: "paymentType",
        Value: "GIROGATE_IDEAL",
      });
      keyValuePairs.push({
        Key: "ccode",
        Value: "NL",
      });
    } else if (formId == "GIROGATE_BANCONTACT") {
      keyValuePairs.push({
        Key: "paymentType",
        Value: "GIROGATE_BANCONTACT",
      });
      keyValuePairs.push({
        Key: "ccode",
        Value: "BE",
      });
      keyValuePairs.push({
        Key: "cardholdername",
        Value: "undisclosed",
      });
    } else if (formId == "GIROGATE_P24") {
      keyValuePairs.push({
        Key: "paymentType",
        Value: "GIROGATE_P24",
      });
      keyValuePairs.push({
        Key: "girogateemail",
        Value: this.user?.eMail,
      });
      keyValuePairs.push({
        Key: "cardholdername",
        Value: "undisclosed",
      });
      keyValuePairs.push({
        Key: "ccode",
        Value: "PL",
      });
    } else if (formId == "UPAY") {
      keyValuePairs.push({
        Key: "paymentType",
        Value: "UPOP",
      });
      keyValuePairs.push({
        Key: "merId",
        Value: "700321123123",
      });
    } else if (formId == "GIROGATE_ALIPAY") {
      keyValuePairs.push({
        Key: "paymentType",
        Value: "GIROGATE_ALIPAY",
      });
      keyValuePairs.push({
        Key: "ccode",
        Value: "CN",
      });
    } else if (formId == "GIROGATE_PAYU") {
      if (this.ccode == null) {
        this.submitted = false;
        return;
      }
      keyValuePairs.push({
        Key: "paymentType",
        Value: "GIROGATE_PAYU",
      });
      keyValuePairs.push({
        Key: "ccode",
        Value: this.ccode,
      });
    } else if (formId == "GIROGATE_EPS") {
      keyValuePairs.push({
        Key: "paymentType",
        Value: "GIROGATE_EPS",
      });
      keyValuePairs.push({
        Key: "ccode",
        Value: "AT",
      });
    }
    this.spinnerService.display(true);
    this.cdr.detectChanges();
    this.httpClient
      .post(`${environment.apiUrl}/paymentcreditcard/gethash`, {
        applicationGroupGuid: this.applicationService.applicationGuid,
        okUrl: environment.siteUrl + "payment-result",
        failUrl: environment.siteUrl + "payment-result",
        callbackUrl: environment.siteUrl + "payment-result",
        keyValuePairs: keyValuePairs,
      })
      .subscribe({
        next: (v) => {
          //@ts-ignore
          document.getElementById("payform").innerHTML = v.data.form;
          this.submitted = false;
          this.cdr.detectChanges();
          setTimeout(() => {
            //@ts-ignore
            document.getElementById("payform")?.submit();
          }, 500);
          setTimeout(() => {
            this.cdr.detectChanges();
          }, 1000);
        },
        error: (e) => {
          setTimeout(() => {
            this.spinnerService.display(false);
            this.cdr.detectChanges();
          }, 1000);


          this.submitted = false;

          let errMsg = this.getErrorMessage(e.error?.message.split("|")[0])
          if (e.error?.message.split("|")[0].length > 0) errMsg = errMsg.replaceAll("{{time}}", e.error?.message.split("|")[1])
          this.paymentError = errMsg

          this.visaError = true;
        },
        complete: () => {
          this.submitted = false;
        },
      });
  }
}
