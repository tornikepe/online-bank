import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
@Injectable({
  providedIn: "root",
})
export class NewsAPIService {
  currentPagePopular = 1;
  currentPageRecent = 1;
  currentPageTrending = 1;

  constructor(private http: HttpClient) {}

  key = "REDACTED-RAPIDAPI-KEY";
  url = "https://free-news.p.rapidapi.com/v1/search";
  recentOptions = {
    method: "GET",
    url: "https://free-news.p.rapidapi.com/v1/search",
    topic: "tech",
    params: {
      q: "latest",
      lang: "en",
      page: `${this.currentPageRecent}`,
      page_size: "20",
    },

    headers: {
      "x-rapidapi-key": this.key,
      "x-rapidapi-host": "free-news.p.rapidapi.com",
    },
  };
  trendingOptions = {
    method: "GET",
    url: "https://free-news.p.rapidapi.com/v1/search",
    topic: "tech",
    params: {
      q: "trending",
      lang: "en",
      page: `${this.currentPageTrending}`,
      page_size: "20",
    },

    headers: {
      "x-rapidapi-key": this.key,
      "x-rapidapi-host": "free-news.p.rapidapi.com",
    },
  };
  popularOptions = {
    method: "GET",
    url: "https://free-news.p.rapidapi.com/v1/search",
    topic: "tech",
    params: {
      q: "popular",
      lang: "en",
      page: `${this.currentPagePopular}`,
      page_size: "20",
    },

    headers: {
      "x-rapidapi-key": this.key,
      "x-rapidapi-host": "free-news.p.rapidapi.com",
    },
  };

  getPopularNews(date: string) {
    return this.http.get(this.url, this.popularOptions);
  }

  getRecentNews(date: string) {
    return this.http.get(this.url, this.recentOptions);
  }
  getTrendingNews(date: string) {
    return this.http.get(this.url, this.trendingOptions);
  }
}
