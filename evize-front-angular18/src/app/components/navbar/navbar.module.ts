import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { ApplicationStatusModalModule } from "../modals/application-status-modal/application-status-modal.module";
import { LogoutModalModule } from "../modals/logout-modal/logout-modal.module";
import { NavbarComponent } from "./navbar.component";
@NgModule({
  declarations: [NavbarComponent],
  imports: [
    CommonModule,
    RouterModule,
    LogoutModalModule,
    ApplicationStatusModalModule,
  ],
  exports: [NavbarComponent],
})
export class NavbarModule {}
