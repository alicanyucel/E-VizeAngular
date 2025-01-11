import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { MissingProfileModalComponent } from "./missing-profile-modal.component";
@NgModule({
  declarations: [MissingProfileModalComponent],
  imports: [CommonModule, RouterModule, FormsModule, ReactiveFormsModule],
  exports: [MissingProfileModalComponent],
})
export class MissingProfileModalModule {}
