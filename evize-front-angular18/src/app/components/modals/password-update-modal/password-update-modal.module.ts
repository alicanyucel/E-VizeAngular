import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { PasswordUpdateModalComponent } from "./password-update-modal.component";
@NgModule({
  declarations: [PasswordUpdateModalComponent],
  imports: [CommonModule, RouterModule, FormsModule, ReactiveFormsModule],
  exports: [PasswordUpdateModalComponent],
})
export class PasswordUpdateModalModule {}
