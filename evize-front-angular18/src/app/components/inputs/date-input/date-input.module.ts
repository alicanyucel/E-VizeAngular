import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { FlatpickrModule } from "angularx-flatpickr";
import { DateInputComponent } from "./date-input.component";
@NgModule({
  declarations: [DateInputComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    FlatpickrModule.forRoot(),
  ],
  exports: [DateInputComponent],
})
export class DateInputModule {}
