import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgSelectModule } from "@ng-select/ng-select";
import { PhoneInputComponent } from "./phone-input.component";
@NgModule({
  declarations: [PhoneInputComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    FormsModule,
    NgSelectModule,
  ],
  exports: [PhoneInputComponent],
})
export class PhoneInputModule {}
