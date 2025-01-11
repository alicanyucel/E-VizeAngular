import { Component, Input } from "@angular/core";

@Component({
  selector: "success-icon",
  templateUrl: "./success-icon.component.html",
})
export class SuccessIconComponent {
  @Input() value: any = null;

  constructor() {}
  ngOnInit() {}
}
