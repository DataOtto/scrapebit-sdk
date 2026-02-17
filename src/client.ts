/**
 * Scrapebit SDK Client
 *
 * The main entry point for interacting with the Scrapebit API.
 *
 * @example
 * ```typescript
 * import { Scrapebit } from '@scrapebit/sdk';
 *
 * const scrapebit = new Scrapebit('YOUR_API_KEY');
 *
 * // Scrape a webpage
 * const result = await scrapebit.content.scrape({
 *   url: 'https://example.com',
 *   prompt: 'Extract all product data'
 * });
 * ```
 *
 * @packageDocumentation
 */

import type { ScrapebitConfig } from './types';
import { HttpClient } from './utils/http';
import { ContentApi } from './api/content';
import { PdfApi } from './api/pdf';
import { ScreenshotApi } from './api/screenshot';
import { ScheduleApi } from './api/schedule';
import { CreditsApi } from './api/credits';
import { MonitoringApi } from './api/monitoring';
import { DeepResearchApi } from './api/deepResearch';
import { UsageApi } from './api/usage';
import { ValidationError } from './utils/errors';

/**
 * The main Scrapebit SDK client
 *
 * @example
 * ```typescript
 * // Initialize with API key
 * const scrapebit = new Scrapebit('sb_live_abc123...');
 *
 * // With custom configuration
 * const scrapebit = new Scrapebit('sb_live_abc123...', {
 *   timeout: 60000,
 *   retries: 5
 * });
 * ```
 */
export class Scrapebit {
  /**
   * SDK version
   */
  public readonly version = '1.0.0';

  /**
   * Content API for web scraping and data extraction
   */
  public readonly content: ContentApi;

  /**
   * PDF API for generating PDFs from web pages
   */
  public readonly pdf: PdfApi;

  /**
   * Screenshot API for capturing screenshots
   */
  public readonly screenshot: ScreenshotApi;

  /**
   * Schedule API for managing scheduled tasks
   */
  public readonly schedule: ScheduleApi;

  /**
   * Credits API for checking balance and usage
   */
  public readonly credits: CreditsApi;

  /**
   * Monitoring API for website change detection
   */
  public readonly monitoring: MonitoringApi;

  /**
   * Deep Research API for AI-powered research and analysis
   * @beta This feature is in beta
   */
  public readonly deepResearch: DeepResearchApi;

  /**
   * Usage API for checking credits and plan information
   */
  public readonly usage: UsageApi;

  private readonly http: HttpClient;

  /**
   * Create a new Scrapebit client
   *
   * @param apiKey - Your Scrapebit API key
   * @param config - Optional configuration options
   *
   * @throws {ValidationError} If API key is missing or invalid
   */
  constructor(apiKey: string, config: ScrapebitConfig = {}) {
    if (!apiKey) {
      throw new ValidationError('API key is required');
    }

    if (typeof apiKey !== 'string') {
      throw new ValidationError('API key must be a string');
    }

    if (!apiKey.startsWith('sb_live_')) {
      console.warn(
        'Warning: API key does not start with "sb_live_". ' +
        'Make sure you are using a valid Scrapebit API key.'
      );
    }

    this.http = new HttpClient(apiKey, config);

    // Initialize API modules
    this.content = new ContentApi(this.http);
    this.pdf = new PdfApi(this.http);
    this.screenshot = new ScreenshotApi(this.http);
    this.schedule = new ScheduleApi(this.http);
    this.credits = new CreditsApi(this.http);
    this.monitoring = new MonitoringApi(this.http);
    this.deepResearch = new DeepResearchApi(this.http);
    this.usage = new UsageApi(this.http);
  }

  /**
   * Quick scrape helper - scrape a URL with minimal configuration
   *
   * @example
   * ```typescript
   * const data = await scrapebit.scrape('https://example.com/products');
   * ```
   */
  async scrape(url: string, prompt?: string) {
    return this.content.scrape({ url, prompt });
  }

  /**
   * Quick PDF helper - generate a PDF from a URL
   *
   * @example
   * ```typescript
   * const pdf = await scrapebit.toPdf('https://example.com/report');
   * ```
   */
  async toPdf(url: string) {
    return this.pdf.generate({ url });
  }

  /**
   * Quick screenshot helper - capture a screenshot from a URL
   *
   * @example
   * ```typescript
   * const screenshot = await scrapebit.toScreenshot('https://example.com');
   * ```
   */
  async toScreenshot(url: string) {
    return this.screenshot.capture({ url });
  }
}

/**
 * Create a Scrapebit client instance
 *
 * @param apiKey - Your Scrapebit API key
 * @param config - Optional configuration
 * @returns Scrapebit client instance
 *
 * @example
 * ```typescript
 * import { createClient } from '@scrapebit/sdk';
 *
 * const scrapebit = createClient('sb_live_abc123...');
 * ```
 */
export function createClient(apiKey: string, config?: ScrapebitConfig): Scrapebit {
  return new Scrapebit(apiKey, config);
}
