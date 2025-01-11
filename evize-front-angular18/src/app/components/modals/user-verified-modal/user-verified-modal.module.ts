import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { UserVerifiedModalComponent } from "./user-verified-modal.component";
@NgModule({
  declarations: [UserVerifiedModalComponent],
  imports: [CommonModule, RouterModule, FormsModule, ReactiveFormsModule],
  exports: [UserVerifiedModalComponent],
})
export class UserVerifiedModalModule {}
