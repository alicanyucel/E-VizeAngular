import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { VisaAddErrorModalComponent } from "./visa-add-error-modal.component";
@NgModule({
  declarations: [VisaAddErrorModalComponent],
  imports: [CommonModule, RouterModule, FormsModule, ReactiveFormsModule],
  exports: [VisaAddErrorModalComponent],
})
export class VisaAddErrorModalModule { }
