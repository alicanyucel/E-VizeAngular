import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { NgSelectModule } from "@ng-select/ng-select";
import { FlatpickrModule } from "angularx-flatpickr";
import { DateInputModule } from "../../components/inputs/date-input/date-input.module";
import { PhoneInputModule } from "../../components/inputs/phone-input/phone-input.module";
import { TextInputModule } from "../../components/inputs/text-input/text-input.module";
import { ContactConditionModalModule } from "../../components/modals/contact-conditions-modal/contact-condition-modal.module";
import { ContactErrorModalModule } from "../../components/modals/contact-error-modal/contact-error-modal.module";
import { ContactSuccessModalModule } from "../../components/modals/contact-success-modal/contact-success-modal.module";
import { MissingInformationModalModule } from "../../components/modals/missing-information-modal/missing-information-modal.module";
import { ProfilePhotoErrorModalModule } from "../../components/modals/profile-photo-error-modal/profile-photo-error-modal.module";
import { ProfileUpdateSuccessModalModule } from "../../components/modals/profile-update-modal/profile-update-success-modal.module";
import { RemoveModalModule } from "../../components/modals/remove-modal/remove-modal.module";
import { RemoveSuccessModalModule } from "../../components/modals/remove-success-modal/remove-success-modal.module";
import { VisaResultErrorModalModule } from "../../components/modals/visa-result-error-modal/visa-result-error-modal.module";
import { VisaResultExemptModalModule } from "../../components/modals/visa-result-exempt-modal/visa-result-exempt-modal.module";
import { ProfileBreadcrumbModule } from "../../components/profile/profile-breadcrumb/profile-breadcrumb.module";
import { ProfileMenuModule } from "../../components/profile/profile-menu/profile-menu.module";
import { ProfileApplicationsComponent } from "./applications/applications.component";
import { ProfileContactComponent } from "./contact/contact.component";
import { ProfilePeopleComponent } from "./people/people.component";
import { ProfileComponent } from "./profile.component";
import { TravelDocumentsComponent } from "./travel-documents/travel-documents.component";

@NgModule({
  declarations: [
    ProfileComponent,
    ProfilePeopleComponent,
    ProfileContactComponent,
    ProfileApplicationsComponent,
    TravelDocumentsComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    NgSelectModule,
    TextInputModule,
    PhoneInputModule,
    ContactConditionModalModule,
    DateInputModule,
    RemoveSuccessModalModule,
    ProfileUpdateSuccessModalModule,
    ProfileMenuModule,
    RemoveModalModule,
    VisaResultExemptModalModule,
    VisaResultErrorModalModule,
    MissingInformationModalModule,
    ProfileBreadcrumbModule,
    ContactErrorModalModule,
    ContactSuccessModalModule,
    ProfilePhotoErrorModalModule,
    FlatpickrModule.forRoot(),
    RouterModule.forChild([
      {
        path: "travel-documents",
        component: TravelDocumentsComponent,
      },
      {
        path: "applications",
        component: ProfileApplicationsComponent,
      },
      {
        path: "contact",
        component: ProfileContactComponent,
      },
      {
        path: "people",
        component: ProfilePeopleComponent,
      },
      {
        path: "",
        component: ProfileComponent,
      },
    ]),
  ],
})
export class ProfileModule {}
