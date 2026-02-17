/**
 * Content API - Web scraping and data extraction
 */

import type { HttpClient } from '../utils/http';
import type {
  ScrapeOptions,
  ScrapeResult,
  SavedScrape,
  PaginationOptions,
  PaginatedResponse,
} from '../types';

/**
 * Content API client for web scraping operations
 */
export class ContentApi {
  constructor(private readonly http: HttpClient) {}

  /**
   * Scrape a URL and extract data
   *
   * @example
   * ```typescript
   * const result = await scrapebit.content.scrape({
   *   url: 'https://example.com/products',
   *   prompt: 'Extract all product names and prices'
   * });
   * console.log(result.data);
   * console.log(`Extracted ${result.row_count} rows`);
   * console.log(`Credits remaining: ${result.credits_remaining}`);
   * ```
   */
  async scrape(options: ScrapeOptions): Promise<ScrapeResult> {
    return this.http.post<ScrapeResult>('/scrape', {
      url: options.url,
      prompt: options.prompt,
      columns: options.columns,
    });
  }

  /**
   * Extract structured data using AI
   *
   * @example
   * ```typescript
   * const result = await scrapebit.content.extract({
   *   url: 'https://example.com/team',
   *   extract: {
   *     name: 'Person name',
   *     role: 'Job title',
   *     bio: 'Short biography'
   *   }
   * });
   * ```
   */
  async extract(options: {
    url: string;
    prompt?: string;
    extract?: Record<string, string>;
    columns?: string[];
  }): Promise<ScrapeResult> {
    return this.http.post<ScrapeResult>('/extract', options);
  }

  /**
   * Scrape multiple URLs in batch
   *
   * @example
   * ```typescript
   * const results = await scrapebit.content.batchScrape({
   *   urls: [
   *     'https://example.com/page1',
   *     'https://example.com/page2',
   *   ],
   *   prompt: 'Extract article titles and dates'
   * });
   * ```
   */
  async batchScrape(options: {
    urls: string[];
    prompt?: string;
    extract?: Record<string, string>;
    columns?: string[];
  }): Promise<ScrapeResult[]> {
    return this.http.post<ScrapeResult[]>('/scrape/batch', options);
  }

  /**
   * Get a specific scrape result by ID
   *
   * @example
   * ```typescript
   * const result = await scrapebit.content.get('scrape_abc123');
   * ```
   */
  async get(id: string): Promise<ScrapeResult> {
    return this.http.get<ScrapeResult>(`/scrape/${id}`);
  }

  /**
   * List saved scrape results
   *
   * @example
   * ```typescript
   * const results = await scrapebit.content.list({ page: 1, limit: 20 });
   * ```
   */
  async list(options?: PaginationOptions): Promise<PaginatedResponse<SavedScrape>> {
    const params = new URLSearchParams();
    if (options?.page) params.set('page', options.page.toString());
    if (options?.limit) params.set('limit', options.limit.toString());

    const query = params.toString();
    return this.http.get<PaginatedResponse<SavedScrape>>(
      `/scrape${query ? `?${query}` : ''}`
    );
  }

  /**
   * Delete a scrape result
   *
   * @example
   * ```typescript
   * await scrapebit.content.delete('scrape_abc123');
   * ```
   */
  async delete(id: string): Promise<void> {
    await this.http.delete(`/scrape/${id}`);
  }

  /**
   * Export scrape result to CSV
   *
   * @example
   * ```typescript
   * const csvUrl = await scrapebit.content.exportCsv('scrape_abc123');
   * ```
   */
  async exportCsv(id: string): Promise<{ url: string }> {
    return this.http.get<{ url: string }>(`/scrape/${id}/export/csv`);
  }

  /**
   * Export scrape result to JSON
   *
   * @example
   * ```typescript
   * const jsonUrl = await scrapebit.content.exportJson('scrape_abc123');
   * ```
   */
  async exportJson(id: string): Promise<{ url: string }> {
    return this.http.get<{ url: string }>(`/scrape/${id}/export/json`);
  }
}
