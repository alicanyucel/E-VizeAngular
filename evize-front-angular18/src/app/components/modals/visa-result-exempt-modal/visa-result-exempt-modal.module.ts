import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { VisaResultExemptModalComponent } from "./visa-result-exempt-modal.component";
@NgModule({
  declarations: [VisaResultExemptModalComponent],
  imports: [CommonModule, RouterModule, FormsModule, ReactiveFormsModule],
  exports: [VisaResultExemptModalComponent],
})
export class VisaResultExemptModalModule {}
