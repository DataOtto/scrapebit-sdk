/**
 * Scrapebit SDK Error Classes
 */

import type { ApiError } from '../types';

/**
 * Base error class for all Scrapebit SDK errors
 */
export class ScrapebitError extends Error {
  public readonly code: string;
  public readonly statusCode?: number;
  public readonly details?: Record<string, unknown>;

  constructor(
    message: string,
    code: string = 'SCRAPEBIT_ERROR',
    statusCode?: number,
    details?: Record<string, unknown>
  ) {
    super(message);
    this.name = 'ScrapebitError';
    this.code = code;
    this.statusCode = statusCode;
    this.details = details;

    // Maintains proper stack trace for where error was thrown
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ScrapebitError);
    }
  }

  /**
   * Create error from API response
   */
  static fromApiError(error: ApiError, statusCode?: number): ScrapebitError {
    return new ScrapebitError(
      error.message,
      error.code,
      statusCode,
      error.details
    );
  }

  /**
   * Convert to JSON representation
   */
  toJSON(): Record<string, unknown> {
    return {
      name: this.name,
      message: this.message,
      code: this.code,
      statusCode: this.statusCode,
      details: this.details,
    };
  }
}

/**
 * Error thrown when authentication fails
 */
export class AuthenticationError extends ScrapebitError {
  constructor(message: string = 'Invalid or missing API key') {
    super(message, 'AUTHENTICATION_ERROR', 401);
    this.name = 'AuthenticationError';
  }
}

/**
 * Error thrown when authorization fails
 */
export class AuthorizationError extends ScrapebitError {
  constructor(message: string = 'Insufficient permissions') {
    super(message, 'AUTHORIZATION_ERROR', 403);
    this.name = 'AuthorizationError';
  }
}

/**
 * Error thrown when a resource is not found
 */
export class NotFoundError extends ScrapebitError {
  constructor(resource: string, id?: string) {
    const message = id
      ? `${resource} with ID '${id}' not found`
      : `${resource} not found`;
    super(message, 'NOT_FOUND', 404);
    this.name = 'NotFoundError';
  }
}

/**
 * Error thrown when validation fails
 */
export class ValidationError extends ScrapebitError {
  public readonly field?: string;

  constructor(message: string, field?: string) {
    super(message, 'VALIDATION_ERROR', 400, field ? { field } : undefined);
    this.name = 'ValidationError';
    this.field = field;
  }
}

/**
 * Error thrown when rate limit is exceeded
 */
export class RateLimitError extends ScrapebitError {
  public readonly retryAfter?: number;

  constructor(retryAfter?: number) {
    super(
      retryAfter
        ? `Rate limit exceeded. Retry after ${retryAfter} seconds.`
        : 'Rate limit exceeded.',
      'RATE_LIMIT_EXCEEDED',
      429,
      retryAfter ? { retryAfter } : undefined
    );
    this.name = 'RateLimitError';
    this.retryAfter = retryAfter;
  }
}

/**
 * Error thrown when user has insufficient credits
 */
export class InsufficientCreditsError extends ScrapebitError {
  public readonly creditsRequired: number;
  public readonly creditsRemaining: number;

  constructor(creditsRequired: number, creditsRemaining: number) {
    super(
      `Insufficient credits. Required: ${creditsRequired}, Remaining: ${creditsRemaining}`,
      'INSUFFICIENT_CREDITS',
      402,
      { creditsRequired, creditsRemaining }
    );
    this.name = 'InsufficientCreditsError';
    this.creditsRequired = creditsRequired;
    this.creditsRemaining = creditsRemaining;
  }
}

/**
 * Error thrown when request times out
 */
export class TimeoutError extends ScrapebitError {
  constructor(timeoutMs: number) {
    super(
      `Request timed out after ${timeoutMs}ms`,
      'TIMEOUT',
      408,
      { timeoutMs }
    );
    this.name = 'TimeoutError';
  }
}

/**
 * Error thrown when network request fails
 */
export class NetworkError extends ScrapebitError {
  constructor(message: string = 'Network request failed') {
    super(message, 'NETWORK_ERROR');
    this.name = 'NetworkError';
  }
}

/**
 * Error thrown when server returns 5xx error
 */
export class ServerError extends ScrapebitError {
  constructor(statusCode: number, message: string = 'Internal server error') {
    super(message, 'SERVER_ERROR', statusCode);
    this.name = 'ServerError';
  }
}
