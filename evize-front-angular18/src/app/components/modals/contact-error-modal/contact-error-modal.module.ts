import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { ContactErrorModalComponent } from "./contact-error-modal.component";
@NgModule({
  declarations: [ContactErrorModalComponent],
  imports: [CommonModule, RouterModule, FormsModule, ReactiveFormsModule],
  exports: [ContactErrorModalComponent],
})
export class ContactErrorModalModule {}
