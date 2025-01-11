import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { NgSelectModule } from "@ng-select/ng-select";
import { PasswordInputModule } from "../../components/inputs/password-input/password-input.module";
import { TextInputModule } from "../../components/inputs/text-input/text-input.module";
import { PasswordUpdateModalModule } from "../../components/modals/password-update-modal/password-update-modal.module";
import { ResetPasswordComponent } from "./reset-password.component";

@NgModule({
  declarations: [ResetPasswordComponent],
  imports: [
    CommonModule,
    FormsModule,
    NgSelectModule,
    TextInputModule,
    PasswordUpdateModalModule,
    PasswordInputModule,
    RouterModule.forChild([
      {
        path: ":email",
        component: ResetPasswordComponent,
      },
      {
        path: "",
        component: ResetPasswordComponent,
      },
    ]),
  ],
})
export class ResetPasswordModule {}
