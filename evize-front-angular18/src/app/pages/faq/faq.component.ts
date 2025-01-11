import { Component, Inject, OnDestroy, OnInit, PLATFORM_ID } from "@angular/core";
import { Title } from "@angular/platform-browser";
import { SpinnerService } from "../../components/spinner/spinner.service";
import { LanguageService } from "../../shared/language.service";
import { Subscription } from "rxjs";

@Component({
  selector: "app-faq",
  templateUrl: "./faq.component.html",
})
export class FaqComponent implements OnInit, OnDestroy {
  constructor(
    private languageService: LanguageService,
    private titleService: Title,
    private spinnerService: SpinnerService,
  ) { }
  private subscriptions = new Subscription();

  section: any;
  filterText = "";
  selectedIndex = 0;
  filteredContent: any;
  ngOnInit() {
    this.spinnerService.display(true);
    this.subscriptions.add(this.languageService.sectionData.subscribe(() => {
      this.section = this.languageService.getSection("faq");
      if (!this.section) return;
      this.filterContent();
      this.titleService.setTitle(this.section.og.title);
      this.spinnerService.display(false);
    }));
  }
  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
  setSelectedIndex(index: number) {
    this.selectedIndex = this.selectedIndex == index ? -1 : index;
  }
  filterContent() {
    var items: any = [];
    for (let i = 0; i < this.section?.content?.length; i++) {
      const item = this.section?.content[i];
      const regex = new RegExp(
        `(${this.filterText.replace(/e/, "e[-]?")})`,
        "gi"
      );
      let found = false;
      const highlightedAnswer = item?.answer.replace(
        /(<[^>]*>|[^<]*)/g,
        (match: any) => {
          if (match.startsWith("<")) return match;
          const newText = match.replace(regex, (m: any) => {
            found = true;
            return `<span style="background-color: yellow;">${m}</span>`;
          });
          return newText;
        }
      );
      const highlightedQuestion = item?.question?.replace(
        regex,
        (match: any) => {
          return `<span class="highlight">${match}</span>`;
        }
      );

      if (
        this.filterText == "" ||
        this.filterText == null ||
        item?.question
          ?.replaceAll("-", "")
          .toLowerCase()
          .includes(this.filterText.toLowerCase()) ||
        found
      ) {
        items.push({
          question: highlightedQuestion,
          answer: highlightedAnswer,
        });
      }
    }
    this.filteredContent = items;
  }
}
