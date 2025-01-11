import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { SafeHtmlModule } from "../../shared/safeHtmlModule";
import { TermsAndConditionsComponent } from "./terms-and-conditions.component";

@NgModule({
  declarations: [TermsAndConditionsComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SafeHtmlModule,
    RouterModule.forChild([
      {
        path: "",
        component: TermsAndConditionsComponent,
      },
    ]),
  ],
})
export class TermsAndConditionsModule {}
