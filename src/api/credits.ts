/**
 * Credits API - Credit balance and usage
 */

import type { HttpClient } from '../utils/http';
import type { Credits, PaginationOptions, PaginatedResponse } from '../types';

/**
 * Credit usage record
 */
export interface CreditUsage {
  id: string;
  type: 'scrape' | 'pdf' | 'screenshot' | 'schedule';
  amount: number;
  resourceId: string;
  url?: string;
  createdAt: string;
}

/**
 * Credits API client for managing credits
 */
export class CreditsApi {
  constructor(private readonly http: HttpClient) {}

  /**
   * Get current credit balance
   *
   * @example
   * ```typescript
   * const credits = await scrapebit.credits.getBalance();
   * console.log(`Remaining: ${credits.remaining}`);
   * ```
   */
  async getBalance(): Promise<Credits> {
    return this.http.get<Credits>('/credits');
  }

  /**
   * Get credit usage history
   *
   * @example
   * ```typescript
   * const usage = await scrapebit.credits.getUsage({
   *   page: 1,
   *   limit: 50
   * });
   * ```
   */
  async getUsage(options?: PaginationOptions & {
    type?: 'scrape' | 'pdf' | 'screenshot' | 'schedule';
    startDate?: string;
    endDate?: string;
  }): Promise<PaginatedResponse<CreditUsage>> {
    const params = new URLSearchParams();
    if (options?.page) params.set('page', options.page.toString());
    if (options?.limit) params.set('limit', options.limit.toString());
    if (options?.type) params.set('type', options.type);
    if (options?.startDate) params.set('startDate', options.startDate);
    if (options?.endDate) params.set('endDate', options.endDate);

    const query = params.toString();
    return this.http.get<PaginatedResponse<CreditUsage>>(
      `/credits/usage${query ? `?${query}` : ''}`
    );
  }

  /**
   * Get usage summary for a time period
   *
   * @example
   * ```typescript
   * const summary = await scrapebit.credits.getSummary({
   *   period: 'month'
   * });
   * ```
   */
  async getSummary(options?: {
    period?: 'day' | 'week' | 'month' | 'year';
    startDate?: string;
    endDate?: string;
  }): Promise<{
    totalUsed: number;
    byType: {
      scrape: number;
      pdf: number;
      screenshot: number;
      schedule: number;
    };
    period: {
      start: string;
      end: string;
    };
  }> {
    const params = new URLSearchParams();
    if (options?.period) params.set('period', options.period);
    if (options?.startDate) params.set('startDate', options.startDate);
    if (options?.endDate) params.set('endDate', options.endDate);

    const query = params.toString();
    return this.http.get(`/credits/summary${query ? `?${query}` : ''}`);
  }
}
