import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { VisaResultModalComponent } from "./visa-result-modal.component";
@NgModule({
  declarations: [VisaResultModalComponent],
  imports: [CommonModule, RouterModule, FormsModule, ReactiveFormsModule],
  exports: [VisaResultModalComponent],
})
export class VisaResultModalModule {}
