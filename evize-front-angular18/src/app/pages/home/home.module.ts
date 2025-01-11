import { CommonModule, NgOptimizedImage } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { NgSelectModule } from "@ng-select/ng-select";
import { ApplicationStatusModalModule } from "../../components/modals/application-status-modal/application-status-modal.module";
import { MissingInformationModalModule } from "../../components/modals/missing-information-modal/missing-information-modal.module";
import { VisaResultErrorModalModule } from "../../components/modals/visa-result-error-modal/visa-result-error-modal.module";
import { VisaResultExemptModalModule } from "../../components/modals/visa-result-exempt-modal/visa-result-exempt-modal.module";
import { VisaResultModalModule } from "../../components/modals/visa-result-modal/visa-result-modal.module";
import { VisaResultSuccessModalModule } from "../../components/modals/visa-result-success-modal/visa-result-success-modal.module";
import { SafeHtmlModule } from "../../shared/safeHtmlModule";
import { HomeComponent } from "./home.component";

@NgModule({
  declarations: [HomeComponent],
  imports: [
    CommonModule,
    NgSelectModule,
    FormsModule,
    NgOptimizedImage,
    VisaResultSuccessModalModule,
    VisaResultErrorModalModule,
    VisaResultExemptModalModule,
    ApplicationStatusModalModule,
    VisaResultModalModule,
    MissingInformationModalModule,
    SafeHtmlModule,
    ReactiveFormsModule,
    RouterModule.forChild([
      {
        path: "",
        component: HomeComponent,
      },
    ]),
  ],
})
export class HomeModule {}
