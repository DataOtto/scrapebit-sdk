/**
 * Usage API - Credit usage, plan info, and rate limits
 *
 * Get information about your current credit balance, plan limits,
 * and API usage.
 */

import type { HttpClient } from '../utils/http';

// =============================================================================
// Types
// =============================================================================

/**
 * Current plan information
 */
export interface PlanInfo {
  /**
   * Plan display name (e.g., "Starter", "Pro", "Business")
   */
  name: string;

  /**
   * Plan identifier slug
   */
  slug: string;

  /**
   * Monthly credit allocation
   */
  credits_per_month: number;

  /**
   * API rate limit per day (null = unlimited)
   */
  api_rate_limit_per_day: number | null;

  /**
   * Maximum scheduled jobs allowed (null = unlimited)
   */
  max_scheduled_jobs: number | null;

  /**
   * Maximum monitors allowed (null = unlimited)
   */
  max_monitors: number | null;

  /**
   * Whether integrations (webhook, notion, etc.) are available
   */
  has_integrations: boolean;

  /**
   * Whether pagination is available (paid feature)
   */
  has_pagination: boolean;
}

/**
 * Subscription status
 */
export interface SubscriptionInfo {
  /**
   * Subscription status
   */
  status: 'active' | 'cancelled' | 'past_due' | 'trialing';

  /**
   * When the current billing period ends
   */
  current_period_end: string;
}

/**
 * Full usage information
 */
export interface UsageInfo {
  /**
   * Total credits remaining
   */
  credits_remaining: number;

  /**
   * Credits used this month
   */
  credits_used_this_month: number;

  /**
   * Credits from subscription (resets monthly)
   */
  subscription_credits: number;

  /**
   * Purchased credits (never expire)
   */
  purchased_credits: number;

  /**
   * Current plan details
   */
  plan: PlanInfo;

  /**
   * Subscription info (null if no subscription)
   */
  subscription: SubscriptionInfo | null;

  /**
   * API requests made today
   */
  api_requests_today: number;
}

/**
 * Rate limit information from response headers
 */
export interface RateLimitInfo {
  /**
   * Maximum requests per day
   */
  limit: number | 'unlimited';

  /**
   * Requests remaining today
   */
  remaining: number | 'unlimited';

  /**
   * When the rate limit resets
   */
  resetsAt: string;
}

// =============================================================================
// Usage API
// =============================================================================

/**
 * Usage API client for checking credits and plan information
 *
 * @example
 * ```typescript
 * // Check your current usage
 * const usage = await scrapebit.usage.get();
 * console.log(`Credits remaining: ${usage.credits_remaining}`);
 * console.log(`Plan: ${usage.plan.name}`);
 * ```
 */
export class UsageApi {
  constructor(private readonly http: HttpClient) {}

  /**
   * Get current usage, credits, and plan information
   *
   * @example
   * ```typescript
   * const usage = await scrapebit.usage.get();
   *
   * console.log(`Credits: ${usage.credits_remaining}`);
   * console.log(`Plan: ${usage.plan.name}`);
   * console.log(`API requests today: ${usage.api_requests_today}`);
   *
   * if (usage.plan.api_rate_limit_per_day) {
   *   const remaining = usage.plan.api_rate_limit_per_day - usage.api_requests_today;
   *   console.log(`API requests remaining: ${remaining}`);
   * }
   * ```
   */
  async get(): Promise<UsageInfo> {
    return this.http.get<UsageInfo>('/usage');
  }

  /**
   * Check if you have enough credits for an operation
   *
   * @example
   * ```typescript
   * const hasCredits = await scrapebit.usage.hasCredits(5);
   * if (!hasCredits) {
   *   console.log('Not enough credits!');
   * }
   * ```
   */
  async hasCredits(required: number = 1): Promise<boolean> {
    const usage = await this.get();
    return usage.credits_remaining >= required;
  }

  /**
   * Check if a specific feature is available on your plan
   *
   * @example
   * ```typescript
   * if (await scrapebit.usage.hasFeature('pagination')) {
   *   // Use pagination
   * }
   *
   * if (await scrapebit.usage.hasFeature('integrations')) {
   *   // Use webhooks, Notion, etc.
   * }
   * ```
   */
  async hasFeature(
    feature: 'pagination' | 'integrations' | 'api' | 'scheduling' | 'monitoring'
  ): Promise<boolean> {
    const usage = await this.get();

    switch (feature) {
      case 'pagination':
        return usage.plan.has_pagination;
      case 'integrations':
        return usage.plan.has_integrations;
      case 'api':
        return usage.plan.api_rate_limit_per_day !== 0;
      case 'scheduling':
        return usage.plan.max_scheduled_jobs !== 0;
      case 'monitoring':
        return usage.plan.max_monitors !== 0;
      default:
        return false;
    }
  }

  /**
   * Get the number of API requests remaining today
   *
   * @returns Number of requests remaining, or -1 if unlimited
   *
   * @example
   * ```typescript
   * const remaining = await scrapebit.usage.getApiRequestsRemaining();
   * if (remaining === -1) {
   *   console.log('Unlimited API access');
   * } else {
   *   console.log(`${remaining} API requests remaining today`);
   * }
   * ```
   */
  async getApiRequestsRemaining(): Promise<number> {
    const usage = await this.get();

    // null means unlimited
    if (usage.plan.api_rate_limit_per_day === null) {
      return -1;
    }

    return Math.max(0, usage.plan.api_rate_limit_per_day - usage.api_requests_today);
  }
}
