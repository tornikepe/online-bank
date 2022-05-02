import { Component, OnDestroy, OnInit } from "@angular/core";
import { NewsAPIService } from "./news-api.service";
@Component({
  selector: "app-news",
  templateUrl: "./news.component.html",
  styleUrls: ["./news.component.scss"],
})
export class NewsComponent implements OnInit, OnDestroy {
  constructor(private newsAPI: NewsAPIService) { }

  dateString: any;
  singleArticleObj: any;
  news: any;
  popularNewsArray: any = [];
  trendingNewsArray: any = [];
  recentNewsArray: any = [];
  popular: boolean = false;
  latest: boolean = true;
  trending: boolean = false;

  tabClicked(e: any) {
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
      this.news.articles.forEach((element: any) => {
        this.popularNewsArray.push(element);
      });
    });
    this.newsAPI.currentPagePopular++;
  }
  loadRecentNews() {
    this.newsAPI.getRecentNews(this.dateString).subscribe((data) => {
      this.news = data;
      this.singleArticleObj = this.news.articles[0];
      this.news.articles.forEach((element: any) => {
        this.recentNewsArray.push(element);
      });
    });
    this.newsAPI.currentPageRecent++;
  }
  loadTrendingNews() {
    this.newsAPI.getTrendingNews(this.dateString).subscribe((data) => {
      this.news = data;
      this.news.articles.forEach((element: any) => {
        this.trendingNewsArray.push(element);
      });
    });
    this.newsAPI.currentPageTrending++;
  }

  //right side article
  singleArticle(obj: any) {
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
