import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { ProfileUpdateSuccessModalComponent } from "./profile-update-success-modal.component";
@NgModule({
  declarations: [ProfileUpdateSuccessModalComponent],
  imports: [CommonModule, RouterModule, FormsModule, ReactiveFormsModule],
  exports: [ProfileUpdateSuccessModalComponent],
})
export class ProfileUpdateSuccessModalModule {}
