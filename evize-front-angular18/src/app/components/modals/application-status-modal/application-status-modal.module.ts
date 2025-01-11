import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { ApplicationStatusModalComponent } from "./application-status-modal.component";
@NgModule({
  declarations: [ApplicationStatusModalComponent],
  imports: [CommonModule, RouterModule, FormsModule, ReactiveFormsModule],
  exports: [ApplicationStatusModalComponent],
})
export class ApplicationStatusModalModule {}
