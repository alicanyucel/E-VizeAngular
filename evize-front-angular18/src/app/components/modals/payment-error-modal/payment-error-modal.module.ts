import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { PaymentErrorModalComponent } from "./payment-error-modal.component";
@NgModule({
  declarations: [PaymentErrorModalComponent],
  imports: [CommonModule, RouterModule, FormsModule, ReactiveFormsModule],
  exports: [PaymentErrorModalComponent],
})
export class PaymentErrorModalModule {}
