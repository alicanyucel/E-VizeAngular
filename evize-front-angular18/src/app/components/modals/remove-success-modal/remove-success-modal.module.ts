import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { RemoveSuccessModalComponent } from "./remove-success-modal.component";
@NgModule({
  declarations: [RemoveSuccessModalComponent],
  imports: [CommonModule, RouterModule, FormsModule, ReactiveFormsModule],
  exports: [RemoveSuccessModalComponent],
})
export class RemoveSuccessModalModule {}
