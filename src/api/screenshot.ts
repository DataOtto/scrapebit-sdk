/**
 * Screenshot API - Screenshot capture from web pages
 */

import type { HttpClient } from '../utils/http';
import type {
  ScreenshotOptions,
  ScreenshotResult,
  PaginationOptions,
  PaginatedResponse,
} from '../types';

/**
 * Saved screenshot metadata
 */
export interface SavedScreenshot {
  id: string;
  url: string;
  imageUrl: string;
  fileSize: number;
  dimensions: {
    width: number;
    height: number;
  };
  format: string;
  createdAt: string;
}

/**
 * Screenshot API client for capturing screenshots from web pages
 */
export class ScreenshotApi {
  constructor(private readonly http: HttpClient) {}

  /**
   * Capture a screenshot from a URL
   *
   * @example
   * ```typescript
   * const result = await scrapebit.screenshot.capture({
   *   url: 'https://example.com',
   *   format: 'png',
   *   fullPage: true
   * });
   * console.log(result.imageUrl);
   * ```
   */
  async capture(options: ScreenshotOptions): Promise<ScreenshotResult> {
    return this.http.post<ScreenshotResult>('/screenshot', options);
  }

  /**
   * Capture screenshots from multiple URLs in batch
   *
   * @example
   * ```typescript
   * const results = await scrapebit.screenshot.batchCapture({
   *   urls: [
   *     'https://example.com/page1',
   *     'https://example.com/page2',
   *   ],
   *   format: 'jpeg',
   *   quality: 80
   * });
   * ```
   */
  async batchCapture(options: {
    urls: string[];
    format?: ScreenshotOptions['format'];
    quality?: number;
    fullPage?: boolean;
    viewport?: ScreenshotOptions['viewport'];
  }): Promise<ScreenshotResult[]> {
    return this.http.post<ScreenshotResult[]>('/screenshot/batch', options);
  }

  /**
   * Capture a specific element on a page
   *
   * @example
   * ```typescript
   * const result = await scrapebit.screenshot.captureElement({
   *   url: 'https://example.com',
   *   selector: '.chart-container'
   * });
   * ```
   */
  async captureElement(options: {
    url: string;
    selector: string;
    format?: ScreenshotOptions['format'];
    quality?: number;
    waitFor?: ScreenshotOptions['waitFor'];
  }): Promise<ScreenshotResult> {
    return this.http.post<ScreenshotResult>('/screenshot/element', options);
  }

  /**
   * Get a specific screenshot by ID
   *
   * @example
   * ```typescript
   * const screenshot = await scrapebit.screenshot.get('ss_abc123');
   * ```
   */
  async get(id: string): Promise<ScreenshotResult> {
    return this.http.get<ScreenshotResult>(`/screenshot/${id}`);
  }

  /**
   * List captured screenshots
   *
   * @example
   * ```typescript
   * const screenshots = await scrapebit.screenshot.list({ page: 1, limit: 20 });
   * ```
   */
  async list(options?: PaginationOptions): Promise<PaginatedResponse<SavedScreenshot>> {
    const params = new URLSearchParams();
    if (options?.page) params.set('page', options.page.toString());
    if (options?.limit) params.set('limit', options.limit.toString());

    const query = params.toString();
    return this.http.get<PaginatedResponse<SavedScreenshot>>(
      `/screenshot${query ? `?${query}` : ''}`
    );
  }

  /**
   * Delete a screenshot
   *
   * @example
   * ```typescript
   * await scrapebit.screenshot.delete('ss_abc123');
   * ```
   */
  async delete(id: string): Promise<void> {
    await this.http.delete(`/screenshot/${id}`);
  }

  /**
   * Get download URL for a screenshot
   *
   * @example
   * ```typescript
   * const { url } = await scrapebit.screenshot.getDownloadUrl('ss_abc123');
   * ```
   */
  async getDownloadUrl(id: string): Promise<{ url: string; expiresAt: string }> {
    return this.http.get<{ url: string; expiresAt: string }>(`/screenshot/${id}/download`);
  }
}
