import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { StepVisaResultSuccessModalComponent } from "./step-visa-result-success-modal.component";
@NgModule({
  declarations: [StepVisaResultSuccessModalComponent],
  imports: [CommonModule, RouterModule, FormsModule, ReactiveFormsModule],
  exports: [StepVisaResultSuccessModalComponent],
})
export class StepVisaResultSuccessModalModule {}
