/**
 * Deep Research API - AI-powered research and analysis
 *
 * Deep Research allows you to create research sessions, add data sources
 * (scraped content, documents, custom text), and have AI-powered conversations
 * about your collected data.
 *
 * @beta This feature is in beta and may change
 */

import type { HttpClient } from '../utils/http';

// =============================================================================
// Types
// =============================================================================

/**
 * Deep Research session
 */
export interface DeepResearchSession {
  /**
   * Unique session identifier
   */
  id: string;

  /**
   * Session name
   */
  name: string;

  /**
   * Optional description
   */
  description?: string;

  /**
   * Number of items in the session
   */
  itemCount: number;

  /**
   * When the session was created
   */
  createdAt: string;

  /**
   * When the session was last updated
   */
  updatedAt: string;
}

/**
 * Item in a Deep Research session
 */
export interface DeepResearchItem {
  /**
   * Unique item identifier
   */
  id: string;

  /**
   * Type of content
   */
  type: 'scrape_result' | 'document' | 'custom_text';

  /**
   * Item title/name
   */
  title: string;

  /**
   * Source URL (if applicable)
   */
  sourceUrl?: string;

  /**
   * Content preview
   */
  preview?: string;

  /**
   * When the item was added
   */
  addedAt: string;
}

/**
 * Chat message in a Deep Research session
 */
export interface ChatMessage {
  /**
   * Message role
   */
  role: 'user' | 'assistant';

  /**
   * Message content
   */
  content: string;

  /**
   * When the message was sent
   */
  timestamp: string;

  /**
   * Sources cited (for assistant messages)
   */
  sources?: Array<{
    itemId: string;
    title: string;
    excerpt: string;
  }>;
}

/**
 * Options for creating a session
 */
export interface CreateSessionOptions {
  /**
   * Session name
   */
  name?: string;

  /**
   * Optional description
   */
  description?: string;
}

/**
 * Options for adding custom text
 */
export interface AddTextOptions {
  /**
   * Title for the text content
   */
  title: string;

  /**
   * The text content to add
   */
  content: string;
}

/**
 * Chat response
 */
export interface ChatResponse {
  /**
   * AI response message
   */
  message: string;

  /**
   * Sources cited in the response
   */
  sources?: Array<{
    itemId: string;
    title: string;
    excerpt: string;
  }>;
}

/**
 * Analysis result
 */
export interface AnalysisResult {
  /**
   * Generated analysis/report
   */
  analysis: string;

  /**
   * Analysis type
   */
  type: 'summary' | 'comparison' | 'trends' | 'custom';

  /**
   * Sources used
   */
  sources: Array<{
    itemId: string;
    title: string;
  }>;

  /**
   * When the analysis was generated
   */
  generatedAt: string;
}

// =============================================================================
// Deep Research API
// =============================================================================

/**
 * Deep Research API client
 *
 * @beta This feature is in beta and may change
 *
 * @example
 * ```typescript
 * // Create a research session
 * const session = await scrapebit.deepResearch.createSession({
 *   name: 'Market Research Q1 2024'
 * });
 *
 * // Add scraped content to the session
 * await scrapebit.deepResearch.addScrapeResult(session.id, 'scrape_abc123');
 *
 * // Chat with your research data
 * const response = await scrapebit.deepResearch.chat(session.id, {
 *   message: 'What are the main trends across these articles?'
 * });
 * ```
 */
export class DeepResearchApi {
  constructor(private readonly http: HttpClient) {}

  /**
   * List all research sessions
   *
   * @example
   * ```typescript
   * const sessions = await scrapebit.deepResearch.listSessions();
   * console.log(`You have ${sessions.data.length} research sessions`);
   * ```
   */
  async listSessions(): Promise<{
    data: DeepResearchSession[];
    sessionLimitReached: boolean;
    currentSessionCount: number;
    maxSessionsAllowed: number | null;
  }> {
    return this.http.get('/deep-research/sessions');
  }

  /**
   * Create a new research session
   *
   * @example
   * ```typescript
   * const session = await scrapebit.deepResearch.createSession({
   *   name: 'Competitor Analysis',
   *   description: 'Research on top 5 competitors'
   * });
   * ```
   */
  async createSession(options?: CreateSessionOptions): Promise<DeepResearchSession> {
    const response = await this.http.post<{ data: DeepResearchSession }>(
      '/deep-research/sessions',
      options
    );
    return response.data;
  }

  /**
   * Get a specific session with its items
   *
   * @example
   * ```typescript
   * const session = await scrapebit.deepResearch.getSession('session_abc123');
   * console.log(`Session has ${session.items.length} items`);
   * ```
   */
  async getSession(sessionId: string): Promise<{
    session: DeepResearchSession;
    items: DeepResearchItem[];
  }> {
    const response = await this.http.get<{
      data: { session: DeepResearchSession; items: DeepResearchItem[] };
    }>(`/deep-research/sessions/${sessionId}`);
    return response.data;
  }

  /**
   * Delete a research session
   *
   * @example
   * ```typescript
   * await scrapebit.deepResearch.deleteSession('session_abc123');
   * ```
   */
  async deleteSession(sessionId: string): Promise<void> {
    await this.http.delete(`/deep-research/sessions/${sessionId}`);
  }

  /**
   * Add a scrape result to a session
   *
   * @example
   * ```typescript
   * await scrapebit.deepResearch.addScrapeResult('session_abc123', 'scrape_xyz789');
   * ```
   */
  async addScrapeResult(sessionId: string, scrapeResultId: string): Promise<DeepResearchItem> {
    const response = await this.http.post<{ data: DeepResearchItem }>(
      `/deep-research/sessions/${sessionId}/items/scrape`,
      { scrapeResultId }
    );
    return response.data;
  }

  /**
   * Add custom text content to a session
   *
   * @example
   * ```typescript
   * await scrapebit.deepResearch.addText('session_abc123', {
   *   title: 'Internal Notes',
   *   content: 'Key insights from the meeting...'
   * });
   * ```
   */
  async addText(sessionId: string, options: AddTextOptions): Promise<DeepResearchItem> {
    const response = await this.http.post<{ data: DeepResearchItem }>(
      `/deep-research/sessions/${sessionId}/items/text`,
      options
    );
    return response.data;
  }

  /**
   * Remove an item from a session
   *
   * @example
   * ```typescript
   * await scrapebit.deepResearch.removeItem('session_abc123', 'item_xyz789');
   * ```
   */
  async removeItem(sessionId: string, itemId: string): Promise<void> {
    await this.http.delete(`/deep-research/sessions/${sessionId}/items/${itemId}`);
  }

  /**
   * Chat with your research data
   *
   * Ask questions about the content in your session and get AI-powered
   * responses with citations.
   *
   * @example
   * ```typescript
   * const response = await scrapebit.deepResearch.chat('session_abc123', {
   *   message: 'What are the common themes across these documents?'
   * });
   * console.log(response.message);
   * ```
   */
  async chat(
    sessionId: string,
    options: { message: string }
  ): Promise<ChatResponse> {
    const response = await this.http.post<{ data: ChatResponse }>(
      `/deep-research/sessions/${sessionId}/chat`,
      options
    );
    return response.data;
  }

  /**
   * Generate an analysis report
   *
   * @example
   * ```typescript
   * const analysis = await scrapebit.deepResearch.analyze('session_abc123', {
   *   type: 'summary',
   *   prompt: 'Summarize the key findings'
   * });
   * ```
   */
  async analyze(
    sessionId: string,
    options: {
      type?: 'summary' | 'comparison' | 'trends' | 'custom';
      prompt?: string;
    }
  ): Promise<AnalysisResult> {
    const response = await this.http.post<{ data: AnalysisResult }>(
      `/deep-research/sessions/${sessionId}/analyze`,
      options
    );
    return response.data;
  }

  /**
   * Get chat history for a session
   *
   * @example
   * ```typescript
   * const history = await scrapebit.deepResearch.getChatHistory('session_abc123');
   * ```
   */
  async getChatHistory(sessionId: string): Promise<ChatMessage[]> {
    const response = await this.http.get<{ data: ChatMessage[] }>(
      `/deep-research/sessions/${sessionId}/chat/history`
    );
    return response.data;
  }
}
