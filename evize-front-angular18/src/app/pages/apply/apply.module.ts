import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { NgSelectModule } from "@ng-select/ng-select";
import { FlatpickrModule } from "angularx-flatpickr";
import { ApplicationStatusBarModule } from "../../components/application/application-status-bar/application-status-bar.module";
import { DateInputModule } from "../../components/inputs/date-input/date-input.module";
import { PhoneInputModule } from "../../components/inputs/phone-input/phone-input.module";
import { TextInputModule } from "../../components/inputs/text-input/text-input.module";
import { AggreementModalComponent } from "../../components/modals/aggreement-modal/aggreement-modal.component";
import { MissingInformationModalModule } from "../../components/modals/missing-information-modal/missing-information-modal.module";
import { MissingPassportModalModule } from "../../components/modals/missing-passport-modal/missing-passport-modal.module";
import { MissingProfileModalModule } from "../../components/modals/missing-profile-modal/missing-profile-modal.module";
import { MissingSurnameModalModule } from "../../components/modals/missing-surname-modal/missing-surname-modal.module";
import { PaymentErrorModalModule } from "../../components/modals/payment-error-modal/payment-error-modal.module";
import { PaymentFailModalModule } from "../../components/modals/payment-fail-modal/payment-fail-modal.module";
import { PaymentSuccessModalModule } from "../../components/modals/payment-success-modal/payment-success-modal.module";
import { ProfilePhotoErrorModalModule } from "../../components/modals/profile-photo-error-modal/profile-photo-error-modal.module";
import { StepVisaResultSuccessModalModule } from "../../components/modals/step-visa-result-success-modal/step-visa-result-success-modal.module";
import { VisaResultDateErrorModalModule } from "../../components/modals/visa-result-date-error-modal/visa-result-date-error-modal.module";
import { VisaResultErrorModalModule } from "../../components/modals/visa-result-error-modal/visa-result-error-modal.module";
import { VisaResultExemptModalModule } from "../../components/modals/visa-result-exempt-modal/visa-result-exempt-modal.module";
import { VisaResultModalModule } from "../../components/modals/visa-result-modal/visa-result-modal.module";
import { VisaResultSuccessModalModule } from "../../components/modals/visa-result-success-modal/visa-result-success-modal.module";
import { ApplyApplicantsComponent } from "./applicants/applicants.component";
import { ApplyPaymentErrorComponent } from "./payment-error/payment-error.component";
import { ApplyPaymentSuccessComponent } from "./payment-success/payment-success.component";
import { ApplyPaymentComponent } from "./payment/payment.component";
import { ApplyPrerequisitesComponent } from "./prerequisites/prerequisites.component";
import { ApplyStartComponent } from "./start/start.component";
import { SuccessComponent } from "./success/success.component";
import { VisaAddErrorModalModule } from "../../components/modals/visa-add-error-modal/visa-add-error-modal.module";
import { MissingInformationApplicantModalModule } from "../../components/modals/missing-information-applicant-modal/missing-information-applicant-modal.module";
import { CannotApplyModalModule } from "../../components/modals/cannot-apply-modal/cannot-apply-modal.module";

@NgModule({
  declarations: [
    AggreementModalComponent,
    ApplyStartComponent,
    ApplyApplicantsComponent,
    ApplyPrerequisitesComponent,
    ApplyPaymentComponent,
    ApplyPaymentSuccessComponent,
    ApplyPaymentErrorComponent,
  ],

  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgSelectModule,
    TextInputModule,
    DateInputModule,
    StepVisaResultSuccessModalModule,
    MissingPassportModalModule,
    MissingInformationModalModule,
    PaymentSuccessModalModule,
    PaymentErrorModalModule,
    PaymentFailModalModule,
    MissingProfileModalModule,
    PhoneInputModule,
    MissingSurnameModalModule,
    ProfilePhotoErrorModalModule,
    VisaResultErrorModalModule,
    MissingInformationApplicantModalModule,
    VisaAddErrorModalModule,
    CannotApplyModalModule,
    VisaResultDateErrorModalModule,
    VisaResultExemptModalModule,
    VisaResultSuccessModalModule,
    ApplicationStatusBarModule,
    VisaResultModalModule,
    FlatpickrModule.forRoot(),
    RouterModule.forChild([
      {
        path: "success",
        component: SuccessComponent,
      },
      {
        path: "payment/success",
        component: ApplyPaymentSuccessComponent,
      },
      {
        path: "payment/error",
        component: ApplyPaymentErrorComponent,
      },
      {
        path: "payment",
        component: ApplyPaymentComponent,
      },
      {
        path: "prerequisites",
        component: ApplyPrerequisitesComponent,
      },
      {
        path: "applicants",
        component: ApplyApplicantsComponent,
      },
      {
        path: "",
        component: ApplyStartComponent,
      },
    ]),
  ],
})
export class ApplyModule { }
