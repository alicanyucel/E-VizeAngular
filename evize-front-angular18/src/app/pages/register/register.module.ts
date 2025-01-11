import { CommonModule, NgOptimizedImage } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { NgSelectModule } from "@ng-select/ng-select";
import { FlatpickrModule } from "angularx-flatpickr";
import { DateInputModule } from "../../components/inputs/date-input/date-input.module";
import { PasswordInputModule } from "../../components/inputs/password-input/password-input.module";
import { SelectInputModule } from "../../components/inputs/select-input/select-input.module";
import { TextInputModule } from "../../components/inputs/text-input/text-input.module";
import { LoginErrorModalModule } from "../../components/modals/login-error-modal/login-error-modal.module";
import { MissingInformationModalModule } from "../../components/modals/missing-information-modal/missing-information-modal.module";
import { RegisterSuccessModalComponent } from "../../components/modals/register-success-modal/register-success-modal.component";
import { UserExistsModalComponent } from "../../components/modals/user-exists-modal/user-exists-modal.component";
import { RegisterComponent } from "./register.component";

@NgModule({
  declarations: [
    RegisterComponent,
    UserExistsModalComponent,
    RegisterSuccessModalComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgSelectModule,
    NgOptimizedImage,
    DateInputModule,
    TextInputModule,
    MissingInformationModalModule,
    PasswordInputModule,
    SelectInputModule,
    LoginErrorModalModule,
    FlatpickrModule.forRoot(),
    RouterModule.forChild([
      {
        path: "",
        component: RegisterComponent,
      },
    ]),
  ],
})
export class RegisterModule {}
