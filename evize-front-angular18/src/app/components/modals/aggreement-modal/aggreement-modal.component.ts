import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from "@angular/core";
import { Router } from "@angular/router";
import { environment } from "../../../../environment/environment";

@Component({
  selector: "aggreement-modal",
  templateUrl: "./aggreement-modal.component.html",
})
export class AggreementModalComponent implements OnInit {
  @Input() public user: any;
  @Input() public visible: any = false;
  @Input() public application: any;
  @Output() visibleChange = new EventEmitter<boolean>();
  constructor(private cdr: ChangeDetectorRef, private router: Router) {}

  environment = environment;
  ngOnInit(): void {}
  back() {
    this.router.navigate(["/apply"]);
  }
  toggle() {
    this.visible = false;
    this.visibleChange.emit(false);
    this.cdr.detectChanges();
  }
}
