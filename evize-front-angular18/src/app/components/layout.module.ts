import { CommonModule, NgOptimizedImage } from "@angular/common";
import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { Routing } from "../pages/routing";
import { FooterModule } from "./footer/footer.module";
import { LayoutComponent } from "./layout.component";
import { NavbarModule } from "./navbar/navbar.module";
import { SpinnerComponent } from "./spinner/spinner.component";
import { SpinnerService } from "./spinner/spinner.service";

const routes: Routes = [
  {
    path: "",
    component: LayoutComponent,
    children: Routing,
  },
];

@NgModule({
  declarations: [LayoutComponent, SpinnerComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    NgOptimizedImage,
    FooterModule,
    NavbarModule,
  ],
  exports: [RouterModule],
  providers: [SpinnerService],
})
export class LayoutModule {}
