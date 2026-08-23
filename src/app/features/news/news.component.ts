import { Component, OnDestroy, OnInit, ChangeDetectorRef} from "@angular/core";
import { Article, NewsAPIService, NewsResponse } from "./news-api.service";
@Component({
  standalone: false,
  selector: "app-news",
  templateUrl: "./news.component.html",
  styleUrls: ["./news.component.scss"],
})
export class NewsComponent implements OnInit, OnDestroy {
  constructor(private newsAPI: NewsAPIService, private cdr: ChangeDetectorRef) { }

  /* The feed is not paged by date; the service ignores this. */
  dateString?: string;
  singleArticleObj?: Article;
  news?: NewsResponse;
  popularNewsArray: Article[] = [];
  trendingNewsArray: Article[] = [];
  recentNewsArray: Article[] = [];
  popular: boolean = false;
  latest: boolean = true;
  trending: boolean = false;

  tabClicked(e: string) {
    if (e === "Latest News") {
      this.latest = true;
      this.popular = false;
      this.trending = false;
    } else if (e === "Trending News") {
      this.trending = true;
      this.loadTrendingNews();
      this.popular = false;
      this.latest = false;
    } else if (e === "Most Popular") {
      this.popular = true;
      this.loadPopularNews();
      this.trending = false;
      this.latest = false;
    }
  }
  ngOnInit(): void {
    this.loadRecentNews();
    this.singleArticle(this.singleArticleObj);
  }
  loadPopularNews() {
    this.newsAPI.getPopularNews(this.dateString).subscribe((data) => {
      this.news = data;
      this.popularNewsArray.push(...data.articles);
          this.cdr.markForCheck();
    });
    this.newsAPI.currentPagePopular++;
  }
  loadRecentNews() {
    this.newsAPI.getRecentNews(this.dateString).subscribe((data) => {
      this.news = data;
      this.singleArticleObj = data.articles[0];
      this.recentNewsArray.push(...data.articles);
          this.cdr.markForCheck();
    });
    this.newsAPI.currentPageRecent++;
  }
  loadTrendingNews() {
    this.newsAPI.getTrendingNews(this.dateString).subscribe((data) => {
      this.news = data;
      this.trendingNewsArray.push(...data.articles);
          this.cdr.markForCheck();
    });
    this.newsAPI.currentPageTrending++;
  }

  //right side article
  singleArticle(obj?: Article) {
    this.singleArticleObj = obj;
  }
  //defalut values to load from begining
  ngOnDestroy(): void {
    this.trendingNewsArray = [];
    this.popularNewsArray = [];
    this.recentNewsArray = [];
    this.newsAPI.currentPagePopular = 1;
    this.newsAPI.currentPageRecent = 1;
    this.newsAPI.currentPageTrending = 1;
  }
}
