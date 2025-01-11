import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { ProfileBreadcrumbComponent } from "./profile-breadcrumb.component";
@NgModule({
  declarations: [ProfileBreadcrumbComponent],
  imports: [CommonModule, RouterModule, FormsModule, ReactiveFormsModule],
  exports: [ProfileBreadcrumbComponent],
})
export class ProfileBreadcrumbModule {}
