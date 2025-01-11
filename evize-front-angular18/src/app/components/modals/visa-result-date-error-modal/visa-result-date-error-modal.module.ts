import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { VisaResultDateErrorModalComponent } from "./visa-result-date-error-modal.component";
@NgModule({
  declarations: [VisaResultDateErrorModalComponent],
  imports: [CommonModule, RouterModule, FormsModule, ReactiveFormsModule],
  exports: [VisaResultDateErrorModalComponent],
})
export class VisaResultDateErrorModalModule {}
