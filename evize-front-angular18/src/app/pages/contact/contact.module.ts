import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { NgSelectModule } from "@ng-select/ng-select";
import { PhoneInputModule } from "../../components/inputs/phone-input/phone-input.module";
import { TextInputModule } from "../../components/inputs/text-input/text-input.module";
import { ContactConditionModalModule } from "../../components/modals/contact-conditions-modal/contact-condition-modal.module";
import { ContactErrorModalModule } from "../../components/modals/contact-error-modal/contact-error-modal.module";
import { ContactSuccessModalModule } from "../../components/modals/contact-success-modal/contact-success-modal.module";
import { ContactComponent } from "./contact.component";

@NgModule({
  declarations: [ContactComponent],
  imports: [
    CommonModule,
    FormsModule,
    NgSelectModule,
    TextInputModule,
    ContactConditionModalModule,
    TextInputModule,
    PhoneInputModule,
    ContactErrorModalModule,
    ContactSuccessModalModule,
    ReactiveFormsModule,
    RouterModule.forChild([
      {
        path: "",
        component: ContactComponent,
      },
    ]),
  ],
})
export class ContactModule {}
