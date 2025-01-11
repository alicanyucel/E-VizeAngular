import { CommonModule, NgOptimizedImage } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { PasswordInputModule } from "../../components/inputs/password-input/password-input.module";
import { TextInputModule } from "../../components/inputs/text-input/text-input.module";
import { LoginErrorModalModule } from "../../components/modals/login-error-modal/login-error-modal.module";
import { MissingInformationModalModule } from "../../components/modals/missing-information-modal/missing-information-modal.module";
import { UserVerifiedModalModule } from "../../components/modals/user-verified-modal/user-verified-modal.module";
import { LoginComponent } from "./login.component";

@NgModule({
  declarations: [LoginComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgOptimizedImage,
    MissingInformationModalModule,
    LoginErrorModalModule,
    PasswordInputModule,
    UserVerifiedModalModule,
    TextInputModule,
    RouterModule.forChild([
      {
        path: "",
        component: LoginComponent,
      },
    ]),
  ],
})
export class LoginModule {}
