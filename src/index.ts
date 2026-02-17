/**
 * Scrapebit SDK for Node.js
 *
 * Official SDK for the Scrapebit API - AI-powered web scraping.
 *
 * @example
 * ```typescript
 * import { Scrapebit } from '@scrapebit/sdk';
 *
 * const scrapebit = new Scrapebit('sb_live_YOUR_API_KEY');
 *
 * // Scrape a webpage
 * const result = await scrapebit.content.scrape({
 *   url: 'https://example.com/products',
 *   prompt: 'Extract all product names and prices'
 * });
 *
 * console.log(result.data);
 * ```
 *
 * @packageDocumentation
 */

// Main client
export { Scrapebit, createClient } from './client';

// API modules
export { ContentApi } from './api/content';
export { PdfApi, type SavedPdf } from './api/pdf';
export { ScreenshotApi, type SavedScreenshot } from './api/screenshot';
export { ScheduleApi } from './api/schedule';
export { CreditsApi, type CreditUsage } from './api/credits';
export { MonitoringApi } from './api/monitoring';
export { DeepResearchApi, type DeepResearchSession, type DeepResearchItem, type ChatMessage, type ChatResponse, type AnalysisResult } from './api/deepResearch';
export { UsageApi, type UsageInfo, type PlanInfo, type SubscriptionInfo } from './api/usage';

// Types
export type {
  // Configuration
  ScrapebitConfig,

  // Common
  PaginationOptions,
  PaginatedResponse,
  ApiResponse,
  ApiError,

  // Scrape
  ScrapeOptions,
  ScrapeResult,
  SavedScrape,

  // PDF
  PdfFormat,
  PdfOrientation,
  PdfOptions,
  PdfResult,

  // Screenshot
  ScreenshotFormat,
  ScreenshotOptions,
  ScreenshotResult,

  // Schedule
  ScheduleFrequency,
  ScheduleTaskType,
  ScheduleOptions,
  ScheduledTask,

  // Credits
  Credits,

  // Monitoring
  MonitorType,
  CheckInterval,
  MonitorStatus,
  AlertChannelType,
  AlertChannelOptions,
  AlertChannel,
  MonitorOptions,
  Monitor,
  MonitorCheck,
  MonitorAlert,

  // Webhooks
  WebhookScrapePayload,
  WebhookPdfPayload,
  WebhookScreenshotPayload,
  WebhookMonitorPayload,
} from './types';

// Errors
export {
  ScrapebitError,
  AuthenticationError,
  AuthorizationError,
  NotFoundError,
  ValidationError,
  RateLimitError,
  InsufficientCreditsError,
  TimeoutError,
  NetworkError,
  ServerError,
} from './utils/errors';

// Default export
export { Scrapebit as default } from './client';
