import { Injectable } from "@angular/core";

export interface Application {
  memberGuid?: string
  entryDate?: string | null
  arrivalDestinationAddress?: string
  flightInformation?: string | null
  ticketNumber?: string
  ticketReservationNumber?: string
  transitDestinationCountryGuid?: string | null
  travelDocumentGuid?: string | null
  travelDocumentMemberGuid?: string | null
  modelGuid?: string
  status: boolean
  travelDocument?: any
  applicationAdditionalInformation?: {
    additionalVisaFile?: string
    additionalVisaCountry?: string | null
    additionalVisaGuid?: string | null
    additionalVisaNumber?: string
    additionalVisaValidityDate?: string | null | Date
  } | null
}

@Injectable({
  providedIn: "root",
})
export class ApplicationService {
  constructor() { }
  visaTypeId?: 1 | 2
  step: "start" | "applicants" | "payment" = "start"
  selectedModel?: any
  application: Application = { status: true }
  additionalApplications: Application[] = []
  applicationGuid?: string
  aggreement: boolean = false;
  applicationCommission: any = null;
  applicationCurrency: any = null;
  admitFeeAmount: any = null;
  applicationPrice: any = null;
  applicationPriceDetail: any = null;
}
