import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { ApplicationStatusBarComponent } from "./application-status-bar.component";
@NgModule({
  declarations: [ApplicationStatusBarComponent],
  imports: [CommonModule, RouterModule, FormsModule, ReactiveFormsModule],
  exports: [ApplicationStatusBarComponent],
})
export class ApplicationStatusBarModule {}
