import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { MissingInformationModalComponent } from "./missing-information-modal.component";
@NgModule({
  declarations: [MissingInformationModalComponent],
  imports: [CommonModule, RouterModule, FormsModule, ReactiveFormsModule],
  exports: [MissingInformationModalComponent],
})
export class MissingInformationModalModule {}
