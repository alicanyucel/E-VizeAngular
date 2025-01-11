import { isPlatformBrowser } from "@angular/common";
import {
  AfterViewInit,
  Component,
  EventEmitter,
  Inject,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
} from "@angular/core";
import { Router } from "@angular/router";
import { environment } from "../../../../environment/environment";
import { SpinnerService } from "../../../components/spinner/spinner.service";
import { ApplicationService } from "../application.service";

@Component({
  selector: "app-apply-success",
  templateUrl: "./success.component.html",
})
export class SuccessComponent implements OnInit, AfterViewInit, OnDestroy {
  constructor(
    private router: Router,
    private spinnerService: SpinnerService,
    @Inject(PLATFORM_ID) private _platformId: Object
  ) {}
  user: any = null;
  documentType: any = "";
  arrivalDate: any = "";
  applicationGuid: any = "";
  environment = environment;
  models: any;
  documentTypes: any;
  aggreementModalToggle = false;
  reloadEvent: EventEmitter<boolean> = new EventEmitter();
  errors: null | string = null;
  cardDetails: any;
  ngAfterViewInit(): void {}

  ngOnDestroy(): void {
    this.reloadEvent.unsubscribe();
  }
  ngOnInit(): void {
    if (isPlatformBrowser(this._platformId)) this.spinnerService.display(false);
  }

  nextStep() {
    this.router.navigate(["/"]);
  }
}
