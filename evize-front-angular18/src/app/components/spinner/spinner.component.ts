import { Component, Input, OnInit } from "@angular/core";

@Component({
  selector: "app-spinner",
  templateUrl: "./spinner.component.html",
})
export class SpinnerComponent implements OnInit {
  @Input() visible: any = true;

  constructor() {}

  ngOnInit(): void {}
}
