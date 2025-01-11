import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { PrivacyPolicyComponent } from "./privacy-policy.component";
import { SafeHtmlModule } from "../../shared/safeHtmlModule";

@NgModule({
  declarations: [PrivacyPolicyComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SafeHtmlModule,
    RouterModule.forChild([
      {
        path: "",
        component: PrivacyPolicyComponent,
      },
    ]),
  ],
})
export class PrivacyPolicyModule {}
