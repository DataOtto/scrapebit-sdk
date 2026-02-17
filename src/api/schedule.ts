/**
 * Schedule API - Scheduled scraping tasks
 */

import type { HttpClient } from '../utils/http';
import type {
  ScheduleOptions,
  ScheduledTask,
  PaginationOptions,
  PaginatedResponse,
} from '../types';

/**
 * Schedule API client for managing scheduled tasks
 */
export class ScheduleApi {
  constructor(private readonly http: HttpClient) {}

  /**
   * Create a scheduled task
   *
   * @example
   * ```typescript
   * const task = await scrapebit.schedule.create({
   *   url: 'https://example.com/prices',
   *   type: 'scrape',
   *   scheduledAt: '2024-01-15T09:00:00Z',
   *   frequency: 'daily',
   *   options: {
   *     prompt: 'Extract all product prices'
   *   }
   * });
   * ```
   */
  async create(options: ScheduleOptions): Promise<ScheduledTask> {
    return this.http.post<ScheduledTask>('/schedule', options);
  }

  /**
   * Get a scheduled task by ID
   *
   * @example
   * ```typescript
   * const task = await scrapebit.schedule.get('sch_abc123');
   * ```
   */
  async get(id: string): Promise<ScheduledTask> {
    return this.http.get<ScheduledTask>(`/schedule/${id}`);
  }

  /**
   * List scheduled tasks
   *
   * @example
   * ```typescript
   * const tasks = await scrapebit.schedule.list({ page: 1, limit: 20 });
   * ```
   */
  async list(options?: PaginationOptions & {
    status?: 'pending' | 'running' | 'completed' | 'failed';
    type?: 'scrape' | 'pdf' | 'screenshot';
  }): Promise<PaginatedResponse<ScheduledTask>> {
    const params = new URLSearchParams();
    if (options?.page) params.set('page', options.page.toString());
    if (options?.limit) params.set('limit', options.limit.toString());
    if (options?.status) params.set('status', options.status);
    if (options?.type) params.set('type', options.type);

    const query = params.toString();
    return this.http.get<PaginatedResponse<ScheduledTask>>(
      `/schedule${query ? `?${query}` : ''}`
    );
  }

  /**
   * Update a scheduled task
   *
   * @example
   * ```typescript
   * const task = await scrapebit.schedule.update('sch_abc123', {
   *   scheduledAt: '2024-01-16T10:00:00Z',
   *   frequency: 'weekly'
   * });
   * ```
   */
  async update(id: string, options: Partial<Omit<ScheduleOptions, 'url' | 'type'>>): Promise<ScheduledTask> {
    return this.http.patch<ScheduledTask>(`/schedule/${id}`, options);
  }

  /**
   * Delete a scheduled task
   *
   * @example
   * ```typescript
   * await scrapebit.schedule.delete('sch_abc123');
   * ```
   */
  async delete(id: string): Promise<void> {
    await this.http.delete(`/schedule/${id}`);
  }

  /**
   * Pause a scheduled task
   *
   * @example
   * ```typescript
   * const task = await scrapebit.schedule.pause('sch_abc123');
   * ```
   */
  async pause(id: string): Promise<ScheduledTask> {
    return this.http.post<ScheduledTask>(`/schedule/${id}/pause`);
  }

  /**
   * Resume a paused scheduled task
   *
   * @example
   * ```typescript
   * const task = await scrapebit.schedule.resume('sch_abc123');
   * ```
   */
  async resume(id: string): Promise<ScheduledTask> {
    return this.http.post<ScheduledTask>(`/schedule/${id}/resume`);
  }

  /**
   * Trigger a scheduled task to run immediately
   *
   * @example
   * ```typescript
   * const task = await scrapebit.schedule.triggerNow('sch_abc123');
   * ```
   */
  async triggerNow(id: string): Promise<ScheduledTask> {
    return this.http.post<ScheduledTask>(`/schedule/${id}/trigger`);
  }

  /**
   * Get execution history for a scheduled task
   *
   * @example
   * ```typescript
   * const history = await scrapebit.schedule.getHistory('sch_abc123');
   * ```
   */
  async getHistory(id: string, options?: PaginationOptions): Promise<PaginatedResponse<{
    id: string;
    status: 'completed' | 'failed';
    startedAt: string;
    completedAt: string;
    resultId?: string;
    error?: string;
  }>> {
    const params = new URLSearchParams();
    if (options?.page) params.set('page', options.page.toString());
    if (options?.limit) params.set('limit', options.limit.toString());

    const query = params.toString();
    return this.http.get(`/schedule/${id}/history${query ? `?${query}` : ''}`);
  }
}
