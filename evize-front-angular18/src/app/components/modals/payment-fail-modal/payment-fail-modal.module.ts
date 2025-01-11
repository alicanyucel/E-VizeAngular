import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { PaymentFailModalComponent } from "./payment-fail-modal.component";
@NgModule({
  declarations: [PaymentFailModalComponent],
  imports: [CommonModule, RouterModule, FormsModule, ReactiveFormsModule],
  exports: [PaymentFailModalComponent],
})
export class PaymentFailModalModule {}
