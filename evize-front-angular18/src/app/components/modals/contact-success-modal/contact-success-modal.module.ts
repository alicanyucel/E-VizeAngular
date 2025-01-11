import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { ContactSuccessModalComponent } from "./contact-success-modal.component";
@NgModule({
  declarations: [ContactSuccessModalComponent],
  imports: [CommonModule, RouterModule, FormsModule, ReactiveFormsModule],
  exports: [ContactSuccessModalComponent],
})
export class ContactSuccessModalModule {}
