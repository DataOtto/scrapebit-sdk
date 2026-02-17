/**
 * HTTP client utility for making API requests
 */

import type { ApiResponse, ScrapebitConfig } from '../types';
import {
  ScrapebitError,
  AuthenticationError,
  AuthorizationError,
  NotFoundError,
  RateLimitError,
  InsufficientCreditsError,
  TimeoutError,
  NetworkError,
  ServerError,
} from './errors';

/**
 * HTTP request options
 */
export interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  body?: unknown;
  headers?: Record<string, string>;
  timeout?: number;
}

/**
 * HTTP client for API requests
 */
export class HttpClient {
  private readonly apiKey: string;
  private readonly baseUrl: string;
  private readonly timeout: number;
  private readonly retries: number;
  private readonly customHeaders: Record<string, string>;

  constructor(apiKey: string, config: ScrapebitConfig = {}) {
    this.apiKey = apiKey;
    this.baseUrl = config.baseUrl || 'https://api.scrapebit.com/v1';
    this.timeout = config.timeout || 30000;
    this.retries = config.retries || 3;
    this.customHeaders = config.headers || {};
  }

  /**
   * Make an HTTP request to the API
   */
  async request<T>(
    endpoint: string,
    options: RequestOptions = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const method = options.method || 'GET';
    const timeout = options.timeout || this.timeout;

    const headers: Record<string, string> = {
      'Authorization': `Bearer ${this.apiKey}`,
      'Content-Type': 'application/json',
      'User-Agent': 'scrapebit-sdk-node/1.0.0',
      ...this.customHeaders,
      ...options.headers,
    };

    let lastError: Error | null = null;

    for (let attempt = 0; attempt <= this.retries; attempt++) {
      try {
        const response = await this.fetchWithTimeout(url, {
          method,
          headers,
          body: options.body ? JSON.stringify(options.body) : undefined,
        }, timeout);

        return await this.handleResponse<T>(response);
      } catch (error) {
        lastError = error as Error;

        // Don't retry on client errors (4xx)
        if (error instanceof ScrapebitError && error.statusCode && error.statusCode < 500) {
          throw error;
        }

        // Don't retry on last attempt
        if (attempt === this.retries) {
          throw error;
        }

        // Exponential backoff
        const delay = Math.min(1000 * Math.pow(2, attempt), 10000);
        await this.sleep(delay);
      }
    }

    throw lastError || new ScrapebitError('Request failed after retries');
  }

  /**
   * GET request
   */
  async get<T>(endpoint: string, options?: Omit<RequestOptions, 'method' | 'body'>): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'GET' });
  }

  /**
   * POST request
   */
  async post<T>(endpoint: string, body?: unknown, options?: Omit<RequestOptions, 'method' | 'body'>): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'POST', body });
  }

  /**
   * PUT request
   */
  async put<T>(endpoint: string, body?: unknown, options?: Omit<RequestOptions, 'method' | 'body'>): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'PUT', body });
  }

  /**
   * PATCH request
   */
  async patch<T>(endpoint: string, body?: unknown, options?: Omit<RequestOptions, 'method' | 'body'>): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'PATCH', body });
  }

  /**
   * DELETE request
   */
  async delete<T>(endpoint: string, options?: Omit<RequestOptions, 'method' | 'body'>): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'DELETE' });
  }

  /**
   * Fetch with timeout
   */
  private async fetchWithTimeout(
    url: string,
    options: RequestInit,
    timeout: number
  ): Promise<Response> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
      });
      return response;
    } catch (error) {
      if ((error as Error).name === 'AbortError') {
        throw new TimeoutError(timeout);
      }
      throw new NetworkError((error as Error).message);
    } finally {
      clearTimeout(timeoutId);
    }
  }

  /**
   * Handle API response
   */
  private async handleResponse<T>(response: Response): Promise<T> {
    let data: ApiResponse<T> | { error?: string; message?: string; code?: string };

    try {
      data = await response.json() as ApiResponse<T> | { error?: string; message?: string; code?: string };
    } catch {
      if (!response.ok) {
        throw new ServerError(response.status, `HTTP ${response.status}: ${response.statusText}`);
      }
      // Return empty object for successful responses without body
      return {} as T;
    }

    if (!response.ok) {
      const errorData = data as { error?: string; message?: string; code?: string };
      this.handleErrorResponse(response.status, errorData);
    }

    // Return data directly if it matches expected format
    if ('success' in data && 'data' in data) {
      return data.data as T;
    }

    return data as T;
  }

  /**
   * Handle error responses
   */
  private handleErrorResponse(
    statusCode: number,
    data: { error?: string; message?: string; code?: string; [key: string]: unknown }
  ): never {
    const message = data.error || data.message || 'Unknown error';
    const code = data.code as string | undefined;

    switch (statusCode) {
      case 401:
        throw new AuthenticationError(message);

      case 402:
        throw new InsufficientCreditsError(
          (data.creditsRequired as number) || 1,
          (data.creditsRemaining as number) || 0
        );

      case 403:
        throw new AuthorizationError(message);

      case 404:
        throw new NotFoundError('Resource');

      case 429:
        const retryAfter = parseInt(data.retryAfter as string, 10) || undefined;
        throw new RateLimitError(retryAfter);

      default:
        if (statusCode >= 500) {
          throw new ServerError(statusCode, message);
        }
        throw new ScrapebitError(message, code || 'API_ERROR', statusCode);
    }
  }

  /**
   * Sleep utility
   */
  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
