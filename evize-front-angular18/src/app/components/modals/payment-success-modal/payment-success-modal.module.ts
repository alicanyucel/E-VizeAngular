import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { PaymentSuccessModalComponent } from "./payment-success-modal.component";
@NgModule({
  declarations: [PaymentSuccessModalComponent],
  imports: [CommonModule, RouterModule, FormsModule, ReactiveFormsModule],
  exports: [PaymentSuccessModalComponent],
})
export class PaymentSuccessModalModule {}
