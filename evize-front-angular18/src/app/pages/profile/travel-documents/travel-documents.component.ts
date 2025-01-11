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
import dayjs from "dayjs";
import { Subscription } from "rxjs";
import { environment } from "../../../../environment/environment";
import { SpinnerService } from "../../../components/spinner/spinner.service";
import { LanguageService } from "../../../shared/language.service";
import { MemberService } from "../../../shared/member.service";
interface Errors {
  name: string;
  surname: string;
  birthDay: string;
  nationalityGuid: string;
  gender: string;
  fatherName: string;
  motherName: string;
  address: string;
  passportNumber: string;
  passportIssueDate: string;
  passportValidityDate: string;
  phoneNumber: string;
  travelDocumentGuid: string;
  eMail: string;
}
@Component({
  selector: "app-travel-documents",
  templateUrl: "./travel-documents.component.html",
})
export class TravelDocumentsComponent
  implements OnInit, AfterViewInit, OnDestroy {
  constructor(
    private cdr: ChangeDetectorRef,
    private router: Router,
    private httpClient: HttpClient,
    private memberService: MemberService,
    private titleService: Title,
    private languageService: LanguageService,
    private spinnerService: SpinnerService,
    @Inject(PLATFORM_ID) private _platformId: Object
  ) { }
  private subscriptions = new Subscription();

  ngAfterViewInit(): void { }
  nationalities$: any;
  removeDetail: any;

  selectedIndex: any = -1;
  setSelectedIndex(i: number) {
    this.selectedIndex = i;
  }
  translatedNationalities: any = [];
  newDocument = false;
  showErrorModal = false;
  showExemptModal = false;
  conditions: any[] = [];
  people: any;
  section: any;
  user: any = null;
  environment = environment;
  error: any;
  success: any;
  files: File[] = [];
  photoError: any = null;
  countries$: any;
  detail: any;
  apiUrl = environment.apiUrl;
  showRemoveSuccess = false;
  new: any = {
    travelDocumentGuid: null,
    passportNumber: "",
    passportIssueDate: "",
    passportValidityDate: "",
    status: true,
  };
  errors: Errors = {
    name: "",
    surname: "",
    birthDay: "",
    nationalityGuid: "",
    gender: "",
    fatherName: "",
    motherName: "",
    address: "",
    passportNumber: "",
    passportIssueDate: "",
    passportValidityDate: "",
    phoneNumber: "",
    travelDocumentGuid: "",
    eMail: "",
  };
  minBirthday = new Date(1900, 1, 1);
  isNew = false;
  today = new Date();
  travelDocuments: any;
  memberTravelDocuments: any = [];
  toDelete = "";
  showRemove = false;
  setRemoveDocument(guid: string) {
    this.toDelete = guid;
    const doc = this.memberTravelDocuments.find((x: any) => x.guid == guid);
    this.removeDetail =
      this.getTranslation(doc.travelDocumentGuid) +
      " (" +
      doc?.passportNumber +
      ")";

    this.showRemove = true;
  }
  delete() {
    this.spinnerService.display(true);
    this.showRemove = false;

    this.httpClient
      .put(
        `${environment.apiUrl}/traveldocumentmember/status-website/${this.user.guid}/${this.toDelete}/0`,
        {}
      )
      .subscribe((data: any) => {
        this.httpClient
          .get(
            `${environment.apiUrl
            }/traveldocumentmember/list-website/${this.user.guid}?status=1&timestamp=${new Date().getTime()}`
          )
          .subscribe((data: any) => {
            this.memberTravelDocuments = data.data;
            if (data.data.length == 0) this.isNew = true;
            this.spinnerService.display(false);
            this.showRemoveSuccess = true;
          });
      });
  }
  submit() {
    if (
      this.user.motherName == "" ||
      this.user.fatherName == "" ||
      this.user.address == "" ||
      this.user.photo == ""
    ) {
      this.error = "Lütfen tüm bilgileri doldurun!";
      this.cdr.detectChanges();
      return;
    }
    this.subscriptions.add(this.memberService.update(this.user).subscribe((x: any) => {
      this.router.navigate(["/apply"]);
    }));
  }

  hasError() {
    return (
      Object.values(this.errors).find((x: string) => x != "") || this.photoError
    );
  }
  getInput(key: string) {
    return this.languageService.getInput(key);
  }
  refresh() {
    window.location.reload();
  }
  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
  getErrorMessage(key: string) {
    return this.languageService.getError(key);
  }
  getTranslation(guid: string) {
    return this.languageService.getTranslation(guid);
  }

  ngOnInit(): void {
    if (isPlatformBrowser(this._platformId)) {
      this.subscriptions.add(this.languageService.sectionData.subscribe(() => {
        this.spinnerService.display(true);
        this.memberService.member.subscribe((member) => {
          this.user = member;
          if (!member) this.router.navigate(["/"]);
          this.section = this.languageService.getSection("profile");
          if (!this.section) return;
          if (this.section) this.titleService.setTitle(this.section.title);

          this.httpClient
            .get(
              `${environment.apiUrl
              }/traveldocumentmember/list-website/${this.user.guid}?status=1&timestamp=${new Date().getTime()}`
            )
            .subscribe((data: any) => {
              this.memberTravelDocuments = data.data;
              if (data.data.length == 0) this.isNew = true;
              this.spinnerService.display(false);
            });
        });
      }));

      this.httpClient
        .get(
          `${environment.apiUrl
          }/traveldocument/list?timestamp=${new Date().getTime()}`
        )
        .subscribe((data: any) => {
          this.travelDocuments = data.data;
        });
    }
  }
  formatDate(date: string) {
    return dayjs(date).format("DD.MM.YYYY");
  }

  addPerson() {
    this.isNew = true;

    this.errors = {
      name: "",
      surname: "",
      birthDay: "",
      nationalityGuid: "",
      gender: "",
      fatherName: "",
      motherName: "",
      address: "",
      passportNumber: "",
      passportIssueDate: "",
      passportValidityDate: "",
      phoneNumber: "",
      travelDocumentGuid: "",
      eMail: "",
    };

    this.new = {
      travelDocumentGuid: null,
      passportNumber: "",
      passportIssueDate: "",
      passportValidityDate: "",
      status: true,
    };
  }
  save() {
    if (this.new.travelDocumentGuid == null)
      this.errors.travelDocumentGuid = "required";
    if (this.new.passportNumber == "") this.errors.passportNumber = "required";
    if (this.new.passportIssueDate == "" || this.new.passportIssueDate == null)
      this.errors.passportIssueDate = "required";
    if (
      this.new.passportValidityDate == "" ||
      this.new.passportValidityDate == null
    )
      this.errors.passportValidityDate = "required";
    if (this.hasError()) return;
    this.spinnerService.display(true);
    this.new.memberGuid = this.user.guid;
    this.detail = this.getTranslation(this.new.travelDocumentGuid);
    this.httpClient
      .post(`${environment.apiUrl}/model/check`, {
        entryDate: dayjs().format("YYYY-MM-DD"),
        nationalityGuid: this.user.nationalityGuid,
        travelDocumentGuid: this.new.travelDocumentGuid,
      })
      .subscribe({
        next: (v: any) => {
          if (v.data.guid != "00000000-0000-0000-0000-000000000000") {
            if (v.data.regime?.regimeVisaType.visaType.code == 0) {
              this.showExemptModal = true;
              this.conditions = v.data.modelConditionDtos;
            } else {
              this.memberService.addTravelDocument(this.new).subscribe({
                next: (v) => {
                  if (v.success) {
                    this.showUpdateSuccess = true;
                    this.isNew = false;

                    this.httpClient
                      .get(
                        `${environment.apiUrl
                        }/traveldocumentmember/list-website/${this.user.guid}?status=1&timestamp=${new Date().getTime()}`
                      )
                      .subscribe((data: any) => {
                        this.memberTravelDocuments = data.data;
                        if (data.data.length == 0) this.isNew = true;
                        this.spinnerService.display(false);
                      });
                  }
                },
                error: (e) => {
                  this.error = this.languageService.getError(e.error);
                  this.cdr.detectChanges();
                },
                complete: () => { },
              });
            }
          } else {
            this.showErrorModal = true;
          }

          this.spinnerService.display(false);
          this.cdr.detectChanges();
        },
        error: (e) => { },
        complete: () => { },
      });
  }
  showUpdateSuccess = false;
}
