import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { VisaResultSuccessModalComponent } from "./visa-result-success-modal.component";
@NgModule({
  declarations: [VisaResultSuccessModalComponent],
  imports: [CommonModule, RouterModule, FormsModule, ReactiveFormsModule],
  exports: [VisaResultSuccessModalComponent],
})
export class VisaResultSuccessModalModule {}
