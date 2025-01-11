import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { MissingInformationApplicantModalComponent } from "./missing-information-applicant-modal.component";
@NgModule({
  declarations: [MissingInformationApplicantModalComponent],
  imports: [CommonModule, RouterModule, FormsModule, ReactiveFormsModule],
  exports: [MissingInformationApplicantModalComponent],
})
export class MissingInformationApplicantModalModule { }
