/**
 * Scrapebit SDK Types
 * @packageDocumentation
 */

// =============================================================================
// Configuration Types
// =============================================================================

/**
 * SDK configuration options
 */
export interface ScrapebitConfig {
  /**
   * Base URL for API requests
   * @default 'https://api.scrapebit.com/v1'
   */
  baseUrl?: string;

  /**
   * Request timeout in milliseconds
   * @default 30000
   */
  timeout?: number;

  /**
   * Number of retry attempts on failure
   * @default 3
   */
  retries?: number;

  /**
   * Custom headers to include in all requests
   */
  headers?: Record<string, string>;
}

// =============================================================================
// Common Types
// =============================================================================

/**
 * Pagination options for list requests
 */
export interface PaginationOptions {
  /**
   * Page number (1-indexed)
   * @default 1
   */
  page?: number;

  /**
   * Number of items per page
   * @default 20
   */
  limit?: number;
}

/**
 * Paginated response wrapper
 */
export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasMore: boolean;
  };
}

/**
 * API response wrapper
 */
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  error?: ApiError;
}

/**
 * API error details
 */
export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
}

// =============================================================================
// Scrape Types
// =============================================================================

/**
 * Options for scraping a URL
 */
export interface ScrapeOptions {
  /**
   * URL to scrape
   */
  url: string;

  /**
   * Natural language description of what to extract
   */
  prompt?: string;

  /**
   * Structured extraction schema
   */
  extract?: Record<string, string>;

  /**
   * Specific column names to extract
   */
  columns?: string[];

  /**
   * Pagination configuration for multi-page scraping
   *
   * @beta Pagination is a beta feature and requires a paid plan (Starter+).
   * The API may change in future versions.
   */
  pagination?: {
    /**
     * CSS selector for the next/load more button
     */
    nextButtonSelector?: string;

    /**
     * Maximum number of pages to scrape
     * @default 1
     */
    maxPages?: number;

    /**
     * Delay between page navigations in milliseconds
     * @default 1000
     */
    delayMs?: number;
  };

  /**
   * Wait for specific conditions before scraping
   */
  waitFor?: {
    /**
     * CSS selector to wait for
     */
    selector?: string;

    /**
     * Maximum wait time in milliseconds
     * @default 10000
     */
    timeout?: number;
  };

  /**
   * Execute JavaScript on the page before scraping
   */
  javascript?: string;
}

/**
 * Result of a scrape operation
 */
export interface ScrapeResult {
  /**
   * Whether the scrape was successful
   */
  success: boolean;

  /**
   * Extracted data as array of objects
   */
  data: Record<string, unknown>[];

  /**
   * Column headers detected/extracted
   */
  headers: string[];

  /**
   * Number of rows extracted
   */
  row_count: number;

  /**
   * Credits used for this scrape
   */
  credits_used: number;

  /**
   * Credits remaining after this scrape
   */
  credits_remaining: number;

  /**
   * Error message if failed
   */
  error?: string;

  /**
   * Human-readable error message
   */
  message?: string;
}

/**
 * Saved scrape metadata
 */
export interface SavedScrape {
  id: string;
  url: string;
  headers: string[];
  rowCount: number;
  createdAt: string;
  status: 'completed' | 'failed';
}

// =============================================================================
// PDF Types
// =============================================================================

/**
 * PDF page format
 */
export type PdfFormat = 'a4' | 'letter' | 'legal' | 'tabloid' | 'a3' | 'a5';

/**
 * PDF page orientation
 */
export type PdfOrientation = 'portrait' | 'landscape';

/**
 * Options for generating a PDF
 */
export interface PdfOptions {
  /**
   * URL to convert to PDF
   */
  url: string;

  /**
   * Page format
   * @default 'a4'
   */
  format?: PdfFormat;

  /**
   * Page orientation
   * @default 'portrait'
   */
  orientation?: PdfOrientation;

  /**
   * Page margins in pixels or CSS units
   */
  margin?: {
    top?: string | number;
    right?: string | number;
    bottom?: string | number;
    left?: string | number;
  };

  /**
   * Print background graphics
   * @default true
   */
  printBackground?: boolean;

  /**
   * Scale of the webpage rendering
   * @default 1
   */
  scale?: number;

  /**
   * Wait for page load before capture
   */
  waitFor?: {
    selector?: string;
    timeout?: number;
  };
}

/**
 * Result of PDF generation
 */
export interface PdfResult {
  /**
   * Unique identifier
   */
  id: string;

  /**
   * URL to download the PDF
   */
  pdfUrl: string;

  /**
   * File size in bytes
   */
  fileSize: number;

  /**
   * Number of pages
   */
  pageCount: number;

  /**
   * When the PDF was generated
   */
  generatedAt: string;

  /**
   * Credits used
   */
  creditsUsed: number;
}

// =============================================================================
// Screenshot Types
// =============================================================================

/**
 * Screenshot image format
 */
export type ScreenshotFormat = 'png' | 'jpeg' | 'webp';

/**
 * Options for capturing a screenshot
 */
export interface ScreenshotOptions {
  /**
   * URL to capture
   */
  url: string;

  /**
   * Image format
   * @default 'png'
   */
  format?: ScreenshotFormat;

  /**
   * Image quality (1-100, only for jpeg/webp)
   * @default 80
   */
  quality?: number;

  /**
   * Capture full page or viewport only
   * @default false
   */
  fullPage?: boolean;

  /**
   * Viewport dimensions
   */
  viewport?: {
    width: number;
    height: number;
  };

  /**
   * Wait conditions before capture
   */
  waitFor?: {
    selector?: string;
    timeout?: number;
  };

  /**
   * CSS selector to capture specific element
   */
  selector?: string;
}

/**
 * Result of screenshot capture
 */
export interface ScreenshotResult {
  /**
   * Unique identifier
   */
  id: string;

  /**
   * URL to download the screenshot
   */
  imageUrl: string;

  /**
   * File size in bytes
   */
  fileSize: number;

  /**
   * Image dimensions
   */
  dimensions: {
    width: number;
    height: number;
  };

  /**
   * When the screenshot was captured
   */
  capturedAt: string;

  /**
   * Credits used
   */
  creditsUsed: number;
}

// =============================================================================
// Schedule Types
// =============================================================================

/**
 * Schedule frequency
 */
export type ScheduleFrequency = 'once' | 'hourly' | 'daily' | 'weekly' | 'monthly';

/**
 * Type of scheduled task
 */
export type ScheduleTaskType = 'scrape' | 'pdf' | 'screenshot';

/**
 * Options for creating a scheduled task
 */
export interface ScheduleOptions {
  /**
   * URL to process
   */
  url: string;

  /**
   * Type of task
   */
  type: ScheduleTaskType;

  /**
   * When to run (ISO 8601 format)
   */
  scheduledAt: string;

  /**
   * Repeat frequency
   * @default 'once'
   */
  frequency?: ScheduleFrequency;

  /**
   * Task-specific options
   */
  options?: ScrapeOptions | PdfOptions | ScreenshotOptions;

  /**
   * Webhook URL to notify on completion
   */
  webhookUrl?: string;
}

/**
 * Scheduled task details
 */
export interface ScheduledTask {
  id: string;
  url: string;
  type: ScheduleTaskType;
  status: 'pending' | 'running' | 'completed' | 'failed';
  scheduledAt: string;
  frequency: ScheduleFrequency;
  lastRunAt?: string;
  nextRunAt?: string;
  resultId?: string;
  error?: string;
  createdAt: string;
}

// =============================================================================
// Credits Types
// =============================================================================

/**
 * User credits information
 */
export interface Credits {
  /**
   * Total credits remaining
   */
  remaining: number;

  /**
   * Credits allocated from subscription
   */
  subscription: number;

  /**
   * Purchased credits
   */
  purchased: number;

  /**
   * Total credits used
   */
  used: number;

  /**
   * When credits will refresh (for subscription)
   */
  refreshAt?: string;
}

// =============================================================================
// Webhook Types
// =============================================================================

/**
 * Webhook payload for scrape completion
 */
export interface WebhookScrapePayload {
  event: 'scrape.completed' | 'scrape.failed';
  timestamp: string;
  data: {
    id: string;
    url: string;
    status: 'completed' | 'failed';
    result?: ScrapeResult;
    error?: string;
  };
}

/**
 * Webhook payload for PDF completion
 */
export interface WebhookPdfPayload {
  event: 'pdf.completed' | 'pdf.failed';
  timestamp: string;
  data: {
    id: string;
    url: string;
    status: 'completed' | 'failed';
    result?: PdfResult;
    error?: string;
  };
}

/**
 * Webhook payload for screenshot completion
 */
export interface WebhookScreenshotPayload {
  event: 'screenshot.completed' | 'screenshot.failed';
  timestamp: string;
  data: {
    id: string;
    url: string;
    status: 'completed' | 'failed';
    result?: ScreenshotResult;
    error?: string;
  };
}

// =============================================================================
// Monitoring Types
// =============================================================================

/**
 * Monitor type - what aspect of the page to monitor
 */
export type MonitorType = 'full_page' | 'selector' | 'api_response';

/**
 * Check interval for monitoring
 */
export type CheckInterval = '5min' | '15min' | '30min' | 'hourly' | '6hours' | '12hours' | 'daily' | 'weekly';

/**
 * Monitor status
 */
export type MonitorStatus = 'active' | 'paused' | 'error';

/**
 * Alert channel type
 */
export type AlertChannelType = 'email' | 'slack' | 'webhook';

/**
 * Options for creating/configuring an alert channel
 */
export interface AlertChannelOptions {
  /**
   * Type of alert channel
   */
  type: AlertChannelType;

  /**
   * Email address (required for email type)
   */
  email?: string;

  /**
   * Slack webhook URL (required for slack type)
   */
  slackWebhookUrl?: string;

  /**
   * Webhook URL (required for webhook type)
   */
  webhookUrl?: string;

  /**
   * Custom headers for webhook
   */
  webhookHeaders?: Record<string, string>;
}

/**
 * Alert channel configuration
 */
export interface AlertChannel extends AlertChannelOptions {
  /**
   * Unique identifier
   */
  id: string;

  /**
   * Whether the channel is enabled
   */
  isEnabled: boolean;
}

/**
 * Options for creating a monitor
 */
export interface MonitorOptions {
  /**
   * Display name for the monitor
   */
  name: string;

  /**
   * URL to monitor
   */
  url: string;

  /**
   * Type of monitoring
   * @default 'full_page'
   */
  monitorType?: MonitorType;

  /**
   * CSS selector to monitor (for selector type)
   */
  selector?: string;

  /**
   * AI prompt for change detection
   */
  prompt?: string;

  /**
   * How often to check
   * @default 'hourly'
   */
  checkInterval?: CheckInterval;

  /**
   * Only send alerts when changes are detected
   * @default true
   */
  notifyOnlyOnChanges?: boolean;

  /**
   * Include screenshot with alerts
   * @default false
   */
  includeScreenshot?: boolean;

  /**
   * Alert channels to notify
   */
  alertChannels?: AlertChannelOptions[];
}

/**
 * Monitor configuration and status
 */
export interface Monitor {
  /**
   * Unique identifier
   */
  id: string;

  /**
   * Display name
   */
  name: string;

  /**
   * URL being monitored
   */
  url: string;

  /**
   * Type of monitoring
   */
  monitorType: MonitorType;

  /**
   * CSS selector (if applicable)
   */
  selector?: string;

  /**
   * AI prompt (if applicable)
   */
  prompt?: string;

  /**
   * Check frequency
   */
  checkInterval: CheckInterval;

  /**
   * Current status
   */
  status: MonitorStatus;

  /**
   * Last check timestamp
   */
  lastCheckAt?: string;

  /**
   * Next scheduled check
   */
  nextCheckAt?: string;

  /**
   * Number of consecutive errors
   */
  consecutiveErrors: number;

  /**
   * Last error message
   */
  lastError?: string;

  /**
   * Only alert on changes
   */
  notifyOnlyOnChanges: boolean;

  /**
   * Configured alert channels
   */
  alertChannels: AlertChannel[];

  /**
   * Count statistics
   */
  _count?: {
    checks: number;
    alerts: number;
  };

  /**
   * Creation timestamp
   */
  createdAt: string;
}

/**
 * Result of a monitor check
 */
export interface MonitorCheck {
  /**
   * Unique identifier
   */
  id: string;

  /**
   * Check status
   */
  status: 'success' | 'error';

  /**
   * Whether changes were detected
   */
  changeDetected: boolean;

  /**
   * Summary of changes (AI-generated)
   */
  changeSummary?: string;

  /**
   * When the check was performed
   */
  checkedAt: string;

  /**
   * Response time in milliseconds
   */
  responseTimeMs?: number;
}

/**
 * Alert sent from a monitor
 */
export interface MonitorAlert {
  /**
   * Unique identifier
   */
  id: string;

  /**
   * Alert channel type
   */
  channelType: AlertChannelType;

  /**
   * Whether the alert was sent successfully
   */
  success: boolean;

  /**
   * Error message if failed
   */
  error?: string;

  /**
   * When the alert was sent
   */
  sentAt: string;

  /**
   * Related check information
   */
  check?: {
    checkedAt: string;
    changeSummary?: string;
  };
}

/**
 * Webhook payload for monitor change detection
 */
export interface WebhookMonitorPayload {
  event: 'monitor.change_detected' | 'monitor.error';
  timestamp: string;
  data: {
    monitorId: string;
    monitorName: string;
    url: string;
    check: MonitorCheck;
  };
}
