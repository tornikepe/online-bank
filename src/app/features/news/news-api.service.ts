import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, of } from "rxjs";
import { catchError } from "rxjs/operators";
import { environment } from "src/environments/environment";

/**
 * Financial news feed.
 *
 * The service the original build used (RapidAPI's "free-news") has been retired
 * and its key revoked, so no credentials live in this repository. Publisher RSS
 * is free and keyless but browsers cannot read it — the feeds send no CORS
 * header — so `GET /api/news` fetches and reshapes it server-side.
 *
 * Setting `environment.news` still points the page at a keyed third-party API
 * if you would rather use one. If neither is reachable — running against a bare
 * json-server, say — the bundled sample feed keeps every screen populated.
 */
/** One story as the page renders it, whatever feed it came from. */
export interface Article {
  title: string;
  published_date: string;
  summary: string;
  /** Thumbnail URL; empty when the feed carries no image for the item. */
  media: string;
  link?: string;
}

export interface NewsResponse {
  status: string;
  topic?: string;
  articles: Article[];
}

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

  private request(topic: string, page: number): Observable<NewsResponse> {
    if (this.isConfigured) {
      return this.http
        .get<NewsResponse>(environment.news.url, {
          params: {
            q: topic,
            lang: "en",
            page: String(page),
            page_size: "20",
          },
          headers: {
            "x-api-key": environment.news.apiKey,
          },
        })
        .pipe(catchError(() => this.bundled()));
    }

    return this.http
      .get<NewsResponse>(`${environment.BaseUrl}news`, { params: { topic } })
      .pipe(
        /* An empty result is as useless to the page as a failed one. */
        catchError(() => this.bundled())
      );
  }

  private bundled(): Observable<NewsResponse> {
    return this.http
      .get<NewsResponse>(this.fallbackUrl)
      .pipe(catchError(() => of({ status: "ok", articles: [] })));
  }

  getPopularNews(_date?: string): Observable<NewsResponse> {
    return this.request("popular", this.currentPagePopular);
  }

  getRecentNews(_date?: string): Observable<NewsResponse> {
    return this.request("latest", this.currentPageRecent);
  }

  getTrendingNews(_date?: string): Observable<NewsResponse> {
    return this.request("trending", this.currentPageTrending);
  }
}
