import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { ProfilePhotoErrorModalComponent } from "./profile-photo-error-modal.component";
@NgModule({
  declarations: [ProfilePhotoErrorModalComponent],
  imports: [CommonModule, RouterModule, FormsModule, ReactiveFormsModule],
  exports: [ProfilePhotoErrorModalComponent],
})
export class ProfilePhotoErrorModalModule {}
