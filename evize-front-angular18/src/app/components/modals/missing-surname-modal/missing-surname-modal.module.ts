import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MissingSurnameModalComponent } from "./missing-surname-modal.component";
@NgModule({
  declarations: [MissingSurnameModalComponent],
  imports: [CommonModule, RouterModule, FormsModule, ReactiveFormsModule],
  exports: [MissingSurnameModalComponent],
})
export class MissingSurnameModalModule {}
