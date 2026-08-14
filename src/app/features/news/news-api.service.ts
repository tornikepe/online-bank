import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";

/**
 * Financial news feed.
 *
 * The service the original build used (RapidAPI's "free-news") has been retired
 * and its key is no longer valid, so no credentials live in this repository. When
 * `environment.news` is left blank the page falls back to the bundled sample feed
 * in `assets/data/news.json`; fill the environment in to point it at a live API.
 */
@Injectable({
  providedIn: "root",
})
export class NewsAPIService {
  currentPagePopular = 1;
  currentPageRecent = 1;
  currentPageTrending = 1;

  private readonly fallbackUrl = "assets/data/news.json";

  constructor(private http: HttpClient) {}

  private get isConfigured(): boolean {
    return !!environment.news.url && !!environment.news.apiKey;
  }

  private request(topic: string, page: number): Observable<any> {
    if (!this.isConfigured) {
      return this.http.get<any>(this.fallbackUrl);
    }

    return this.http.get<any>(environment.news.url, {
      params: {
        q: topic,
        lang: "en",
        page: String(page),
        page_size: "20",
      },
      headers: {
        "x-api-key": environment.news.apiKey,
      },
    });
  }

  getPopularNews(_date?: string): Observable<any> {
    return this.request("popular", this.currentPagePopular);
  }

  getRecentNews(_date?: string): Observable<any> {
    return this.request("latest", this.currentPageRecent);
  }

  getTrendingNews(_date?: string): Observable<any> {
    return this.request("trending", this.currentPageTrending);
  }
}
