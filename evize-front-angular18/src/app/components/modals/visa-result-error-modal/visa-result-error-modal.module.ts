import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { VisaResultErrorModalComponent } from "./visa-result-error-modal.component";
@NgModule({
  declarations: [VisaResultErrorModalComponent],
  imports: [CommonModule, RouterModule, FormsModule, ReactiveFormsModule],
  exports: [VisaResultErrorModalComponent],
})
export class VisaResultErrorModalModule {}
