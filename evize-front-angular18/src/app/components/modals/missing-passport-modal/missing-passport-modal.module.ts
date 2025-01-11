import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { MissingPassportModalComponent } from "./missing-passport-modal.component";
@NgModule({
  declarations: [MissingPassportModalComponent],
  imports: [CommonModule, RouterModule, FormsModule, ReactiveFormsModule],
  exports: [MissingPassportModalComponent],
})
export class MissingPassportModalModule {}
