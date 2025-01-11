import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { ApplicationStatusModalModule } from "../../modals/application-status-modal/application-status-modal.module";
import { ProfileMenuComponent } from "./profile-menu.component";
@NgModule({
  declarations: [ProfileMenuComponent],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    ApplicationStatusModalModule,
  ],
  exports: [ProfileMenuComponent],
})
export class ProfileMenuModule {}
