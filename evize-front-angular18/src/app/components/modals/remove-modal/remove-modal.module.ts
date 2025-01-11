import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { RemoveModalComponent } from "./remove-modal.component";
@NgModule({
  declarations: [RemoveModalComponent],
  imports: [CommonModule, RouterModule, FormsModule, ReactiveFormsModule],
  exports: [RemoveModalComponent],
})
export class RemoveModalModule {}
