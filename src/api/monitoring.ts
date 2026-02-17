/**
 * Monitoring API - Website change monitoring
 */

import type { HttpClient } from '../utils/http';
import type {
  MonitorOptions,
  Monitor,
  MonitorCheck,
  MonitorAlert,
  AlertChannelOptions,
  AlertChannel,
  PaginationOptions,
  PaginatedResponse,
} from '../types';

/**
 * Monitoring API client for website change detection
 */
export class MonitoringApi {
  constructor(private readonly http: HttpClient) {}

  /**
   * Create a new monitor
   *
   * @example
   * ```typescript
   * const monitor = await scrapebit.monitoring.create({
   *   name: 'Price Monitor',
   *   url: 'https://example.com/product',
   *   monitorType: 'selector',
   *   selector: '.price',
   *   checkInterval: 'hourly',
   *   alertChannels: [
   *     { type: 'email', email: 'user@example.com' }
   *   ]
   * });
   * ```
   */
  async create(options: MonitorOptions): Promise<Monitor> {
    const response = await this.http.post<{ data: Monitor }>('/monitoring', options);
    return response.data;
  }

  /**
   * Get a monitor by ID
   *
   * @example
   * ```typescript
   * const monitor = await scrapebit.monitoring.get('mon_abc123');
   * ```
   */
  async get(id: string): Promise<Monitor> {
    const response = await this.http.get<{ data: Monitor }>(`/monitoring/${id}`);
    return response.data;
  }

  /**
   * List all monitors
   *
   * @example
   * ```typescript
   * const monitors = await scrapebit.monitoring.list({ page: 1, limit: 20 });
   * ```
   */
  async list(options?: PaginationOptions & {
    status?: 'active' | 'paused' | 'error';
  }): Promise<PaginatedResponse<Monitor>> {
    const params = new URLSearchParams();
    if (options?.page) params.set('page', options.page.toString());
    if (options?.limit) params.set('limit', options.limit.toString());
    if (options?.status) params.set('status', options.status);

    const query = params.toString();
    return this.http.get<PaginatedResponse<Monitor>>(
      `/monitoring${query ? `?${query}` : ''}`
    );
  }

  /**
   * Update a monitor
   *
   * @example
   * ```typescript
   * const monitor = await scrapebit.monitoring.update('mon_abc123', {
   *   checkInterval: 'daily',
   *   status: 'paused'
   * });
   * ```
   */
  async update(id: string, options: Partial<Omit<MonitorOptions, 'alertChannels'>> & {
    status?: 'active' | 'paused';
  }): Promise<Monitor> {
    const response = await this.http.patch<{ data: Monitor }>(`/monitoring/${id}`, options);
    return response.data;
  }

  /**
   * Delete a monitor
   *
   * @example
   * ```typescript
   * await scrapebit.monitoring.delete('mon_abc123');
   * ```
   */
  async delete(id: string): Promise<void> {
    await this.http.delete(`/monitoring/${id}`);
  }

  /**
   * Pause a monitor
   *
   * @example
   * ```typescript
   * await scrapebit.monitoring.pause('mon_abc123');
   * ```
   */
  async pause(id: string): Promise<void> {
    await this.http.post(`/monitoring/${id}/pause`);
  }

  /**
   * Resume a paused monitor
   *
   * @example
   * ```typescript
   * const monitor = await scrapebit.monitoring.resume('mon_abc123');
   * ```
   */
  async resume(id: string): Promise<Monitor> {
    const response = await this.http.post<{ data: Monitor }>(`/monitoring/${id}/resume`);
    return response.data;
  }

  /**
   * Trigger an immediate check
   *
   * @example
   * ```typescript
   * const result = await scrapebit.monitoring.checkNow('mon_abc123');
   * console.log(result.changeDetected);
   * ```
   */
  async checkNow(id: string): Promise<MonitorCheck> {
    const response = await this.http.post<{ data: MonitorCheck }>(`/monitoring/${id}/check-now`);
    return response.data;
  }

  /**
   * Get check history for a monitor
   *
   * @example
   * ```typescript
   * const history = await scrapebit.monitoring.getChecks('mon_abc123', {
   *   changesOnly: true
   * });
   * ```
   */
  async getChecks(id: string, options?: PaginationOptions & {
    changesOnly?: boolean;
  }): Promise<PaginatedResponse<MonitorCheck>> {
    const params = new URLSearchParams();
    if (options?.page) params.set('page', options.page.toString());
    if (options?.limit) params.set('limit', options.limit.toString());
    if (options?.changesOnly) params.set('changesOnly', 'true');

    const query = params.toString();
    return this.http.get<PaginatedResponse<MonitorCheck>>(
      `/monitoring/${id}/checks${query ? `?${query}` : ''}`
    );
  }

  /**
   * Get alert history for a monitor
   *
   * @example
   * ```typescript
   * const alerts = await scrapebit.monitoring.getAlerts('mon_abc123');
   * ```
   */
  async getAlerts(id: string, options?: PaginationOptions): Promise<PaginatedResponse<MonitorAlert>> {
    const params = new URLSearchParams();
    if (options?.page) params.set('page', options.page.toString());
    if (options?.limit) params.set('limit', options.limit.toString());

    const query = params.toString();
    return this.http.get<PaginatedResponse<MonitorAlert>>(
      `/monitoring/${id}/alerts${query ? `?${query}` : ''}`
    );
  }

  // ==========================================================================
  // Alert Channels
  // ==========================================================================

  /**
   * Add an alert channel to a monitor
   *
   * @example
   * ```typescript
   * const channel = await scrapebit.monitoring.addChannel('mon_abc123', {
   *   type: 'slack',
   *   slackWebhookUrl: 'https://hooks.slack.com/...'
   * });
   * ```
   */
  async addChannel(monitorId: string, options: AlertChannelOptions): Promise<AlertChannel> {
    const response = await this.http.post<{ data: AlertChannel }>(
      `/monitoring/${monitorId}/channels`,
      options
    );
    return response.data;
  }

  /**
   * Update an alert channel
   *
   * @example
   * ```typescript
   * const channel = await scrapebit.monitoring.updateChannel(
   *   'mon_abc123',
   *   'ch_xyz789',
   *   { isEnabled: false }
   * );
   * ```
   */
  async updateChannel(
    monitorId: string,
    channelId: string,
    options: Partial<AlertChannelOptions> & { isEnabled?: boolean }
  ): Promise<AlertChannel> {
    const response = await this.http.patch<{ data: AlertChannel }>(
      `/monitoring/${monitorId}/channels/${channelId}`,
      options
    );
    return response.data;
  }

  /**
   * Delete an alert channel
   *
   * @example
   * ```typescript
   * await scrapebit.monitoring.deleteChannel('mon_abc123', 'ch_xyz789');
   * ```
   */
  async deleteChannel(monitorId: string, channelId: string): Promise<void> {
    await this.http.delete(`/monitoring/${monitorId}/channels/${channelId}`);
  }
}
