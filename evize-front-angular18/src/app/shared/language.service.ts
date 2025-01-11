import { isPlatformServer } from "@angular/common";
import { Inject, Injectable, PLATFORM_ID } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { StorageService } from "./storage.service";

@Injectable({
  providedIn: "root",
})
export class LanguageService {
  public currentLanguageCode: BehaviorSubject<string> =
    new BehaviorSubject<string>("en");
  public currentLanguageName: BehaviorSubject<string> =
    new BehaviorSubject<string>("English");
  constructor(
    private storageService: StorageService,
    @Inject(PLATFORM_ID) private _platformId: Object
  ) {
    const localStorageData = storageService.getLocalStorage();
    if (localStorageData && localStorageData.localization) {
      this.currentLanguageCode.next(
        JSON.parse(localStorageData.localization)?.code ?? "en"
      );
      this.currentLanguageName.next(
        JSON.parse(localStorageData.localization)?.name ?? "English"
      );
      document
        .querySelector("html")
        ?.setAttribute(
          "dir",
          JSON.parse(localStorageData.localization)?.rtl ? "rtl" : "ltr"
        );
    }
  }
  public headerText: BehaviorSubject<string> = new BehaviorSubject<string>("");

  public sectionData: BehaviorSubject<any> = new BehaviorSubject<any[]>([]);
  public translateData: any[] = [];
  sections: any[] = [];
  changeLanguage(languageCode: string, languageName: string, rtl: boolean) {
    rtl = languageCode.toLowerCase() == "ar";
    this.storageService.setLocalStorage(
      "localization",
      JSON.stringify({
        code: languageCode,
        name: languageName,
        rtl: rtl,
      })
    );
    this.currentLanguageCode.next(languageCode);
    this.currentLanguageName.next(languageName);
    document.querySelector("html")?.setAttribute("dir", rtl ? "rtl" : "ltr");
    if (this.sections == null) return;
    this.setSectionData(this.sections);
  }
  getAdditionalDocumentTypes() {
    const guid = "13571426-0489-453d-bcc6-624783830cbd";
    return this.translateData.filter(
      (x) =>
        x.guidKey == guid &&
        this.currentLanguageCode.value.toLowerCase() == x.language
    );
  }
  fillEmptyValuesWithEnglish(target: any, source: any) {
    for (let i = 0; i < Object.keys(target).length; i++) {
      const obj = target[Object.keys(target)[i]];
      const srcObj = source[Object.keys(target)[i]];
      if (typeof obj === "object" && typeof srcObj === "object") {
        this.fillEmptyValuesWithEnglish(obj, srcObj);
      } else {
        if (obj == "" || obj == null) {
          target[Object.keys(target)[i]] = source[Object.keys(target)[i]];
        }
      }
    }
  }

  setSectionData(sections: any[]) {
    this.sections = sections;
    for (
      let i = 0;
      i <
      this.sections.filter((x) => JSON.parse(x.content)?.lang != "en").length;
      i++
    ) {
      const section = this.sections.filter(
        (x) => JSON.parse(x.content)?.lang != "en"
      )[i];
      const sectionEn = this.sections.find(
        (x) =>
          JSON.parse(x.content)?.lang == "en" &&
          x.sectionHandle == section.sectionHandle
      );
      const targetJson = JSON.parse(section.content);
      if (sectionEn?.content) {
        const sourceJson = JSON.parse(sectionEn.content);
        this.fillEmptyValuesWithEnglish(targetJson?.data, sourceJson?.data);
        this.sections.filter((x) => JSON.parse(x.content)?.lang != "en")[
          i
        ].content = JSON.stringify(targetJson);
      }
    }
    this.sectionData.next(this.sections);
  }
  setTranslateData(sections: any[]) {
    this.translateData = sections;
  }
  getSection(name: string) {
    const section = this.sectionData?.value?.find(
      (x: any) =>
        x.sectionHandle == name &&
        JSON.parse(x.content ?? "[]")?.lang ==
          this.currentLanguageCode.value.toLowerCase()
    );
    return section ? JSON.parse(section.content)?.data : null;
  }
  getSections(name: string) {
    const sections = this.sectionData?.value.filter(
      (x: any) =>
        x.sectionHandle == name &&
        JSON.parse(x.content ?? "[]")?.lang ==
          this.currentLanguageCode.value.toLowerCase()
    );
    return sections ?? [];
  }
  getInput(key: string) {
    if (isPlatformServer(this._platformId))
      return { label: "", placeholder: "" };
    const sectionName = "form_elements";
    let section = this.sectionData?.value.find(
      (x: any) =>
        x.sectionHandle == sectionName &&
        JSON.parse(x.content ?? "[]")?.lang ==
          this.currentLanguageCode.value.toLowerCase()
    );
    if (!section)
      section = this.sectionData?.value.find(
        (x: any) =>
          x.sectionHandle == sectionName &&
          JSON.parse(x.content ?? "[]")?.lang == "en"
      );

    if (!section) {
      return {
        label: "",
        placeholder: "",
      };
    }
    return JSON.parse(section.content)?.data[key];
  }

  getTranslation(guid: string) {
    const translation = this.translateData.find(
      (x) =>
        x.language == this.currentLanguageCode.value.toLowerCase() &&
        x.guidKey == guid
    );
    if (translation) return translation.value;

    const original = this.translateData.find(
      (x) => x.language == "en" && x.guidKey == guid
    );
    if (original) return original.value;

    return "";
  }

  getError(name: string) {
    const messages: any[] = this.getSection("api_messages");
    const messagesDict = [
      { key: "EMAIL_VERIFY", value: "emailVerify" },
      { key: "USER_NOT_FOUND", value: "userNotFound" },
      { key: "USERNAME_OR_PASSWORD_ERROR", value: "usernameOrPasswordError" },
      { key: "OLD_PASSWORD_INCORRECT", value: "oldPasswordIncorrect" },
      { key: "APPLICATION_GROUP_NOT_FOUND", value: "applicationGroupNotFound" },
      {
        key: "CAPTCHA_ERROR_INCORRECT_CODE",
        value: "captchaErrorIncorrectCode",
      },
      { key: "PASSWORD_POLICY_VIOLATION", value: "passwordControl" },
      { key: "ONGOING_PAYMENT_CHARGE", value: "ongoingPayment" },
      { key: "required", value: "required" },
      { key: "invalid", value: "invalid" },
    ];
    const key = messagesDict.find((x) => x.key == name)?.value ?? "";
    if (messages) {
      if (Object.keys(messages).indexOf(key) != -1)
        return Object.values(messages)[Object.keys(messages).indexOf(key)];
      if (Object.keys(messages).indexOf(name) != -1)
        return Object.values(messages)[Object.keys(messages).indexOf(name)];
    }
    return name;
  }
  getCondition(id: string) {
    const messages: any[] = this.getSection("conditions")?.conditions;
    if (messages?.find((x) => x.conditionId == id.toString()))
      return messages?.find((x) => x.conditionId == id.toString()).translation;
    return null;
  }
  getConditionTranslation(condition: any) {
    const translation = condition?.translateDtos?.find(
      (x: any) => x.language == this.currentLanguageCode.value.toLowerCase()
    );
    if (translation) return translation.value;

    const original = condition?.translateDtos?.find(
      (x: any) => x.language == "en"
    );
    if (original) return original.value;
  }

  public getNationality(nationality: string) {
    const messages: any[] = this.getSection("nationalities")?.nationalities;
    if (messages?.find((x) => x.key == nationality))
      return messages?.find((x) => x.key == nationality).translation;
    return nationality;
  }

  public getVisaType(visaType: string) {
    const messages: any[] = this.getSection("visaTypes")?.visaTypes;
    if (messages?.find((x) => x.key == visaType))
      return messages?.find((x) => x.key == visaType).translation;

    return visaType;
  }
  public getFlightInformation(flightInformation: string) {
    const messages: any[] =
      this.getSection("flight_information")?.flightInformations;
    if (messages?.find((x) => x.key == flightInformation))
      return messages?.find((x) => x.key == flightInformation).translation;

    return flightInformation;
  }

  public getTravelDocument(travelDocument: string) {
    const messages: any[] =
      this.getSection("travel_documents")?.travelDocuments;
    if (messages?.find((x) => x.key == travelDocument))
      return messages?.find((x) => x.key == travelDocument).translation;

    return travelDocument;
  }

  public getAdditionalDocuments(additionalDoc: string) {
    const messages: any[] = this.getSection(
      "additional_documents"
    )?.additionalDocuments;
    if (messages?.find((x) => x.key == additionalDoc))
      return messages?.find((x) => x.key == additionalDoc).translation;

    return additionalDoc;
  }

  public getGender(gender: string) {
    const messages: any[] = this.getSection("genders")?.genders;
    if (messages?.find((x) => x.key == gender))
      return messages?.find((x) => x.key == gender).translation;

    return gender;
  }
  getVisaStatus(status: string) {
    const messages: any[] =
      this.getSection("profile")?.applications?.visaStatus;
    if (Object.keys(messages ?? {})?.indexOf(status) != -1)
      return Object.values(messages)[Object.keys(messages).indexOf(status)];
    return status;
  }
}
