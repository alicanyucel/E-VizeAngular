import { NgModule } from '@angular/core';
import { PasswordInputComponent } from './password-input.component';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
@NgModule({
  declarations: [PasswordInputComponent],
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  exports: [PasswordInputComponent],
})
export class PasswordInputModule {}
