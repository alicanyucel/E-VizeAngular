import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { CannotApplyModalComponent } from "./cannot-apply-modal.component";
@NgModule({
  declarations: [CannotApplyModalComponent],
  imports: [CommonModule, RouterModule, FormsModule, ReactiveFormsModule],
  exports: [CannotApplyModalComponent],
})
export class CannotApplyModalModule { }
