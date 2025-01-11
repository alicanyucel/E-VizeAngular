import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { SafeHtmlModule } from "../../shared/safeHtmlModule";
import { FaqComponent } from "./faq.component";

@NgModule({
  declarations: [FaqComponent],
  imports: [
    CommonModule,
    FormsModule,
    SafeHtmlModule,
    ReactiveFormsModule,
    RouterModule.forChild([
      {
        path: "",
        component: FaqComponent,
      },
    ]),
  ],
})
export class FaqModule {}
