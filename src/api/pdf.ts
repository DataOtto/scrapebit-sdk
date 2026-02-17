/**
 * PDF API - PDF generation from web pages
 */

import type { HttpClient } from '../utils/http';
import type {
  PdfOptions,
  PdfResult,
  PaginationOptions,
  PaginatedResponse,
} from '../types';

/**
 * Saved PDF metadata
 */
export interface SavedPdf {
  id: string;
  url: string;
  pdfUrl: string;
  fileSize: number;
  pageCount: number;
  format: string;
  createdAt: string;
}

/**
 * PDF API client for generating PDFs from web pages
 */
export class PdfApi {
  constructor(private readonly http: HttpClient) {}

  /**
   * Generate a PDF from a URL
   *
   * @example
   * ```typescript
   * const result = await scrapebit.pdf.generate({
   *   url: 'https://example.com/report',
   *   format: 'a4',
   *   orientation: 'portrait'
   * });
   * console.log(result.pdfUrl);
   * ```
   */
  async generate(options: PdfOptions): Promise<PdfResult> {
    return this.http.post<PdfResult>('/pdf', options);
  }

  /**
   * Generate PDFs from multiple URLs in batch
   *
   * @example
   * ```typescript
   * const results = await scrapebit.pdf.batchGenerate({
   *   urls: [
   *     'https://example.com/page1',
   *     'https://example.com/page2',
   *   ],
   *   format: 'letter'
   * });
   * ```
   */
  async batchGenerate(options: {
    urls: string[];
    format?: PdfOptions['format'];
    orientation?: PdfOptions['orientation'];
    margin?: PdfOptions['margin'];
  }): Promise<PdfResult[]> {
    return this.http.post<PdfResult[]>('/pdf/batch', options);
  }

  /**
   * Get a specific PDF by ID
   *
   * @example
   * ```typescript
   * const pdf = await scrapebit.pdf.get('pdf_abc123');
   * ```
   */
  async get(id: string): Promise<PdfResult> {
    return this.http.get<PdfResult>(`/pdf/${id}`);
  }

  /**
   * List generated PDFs
   *
   * @example
   * ```typescript
   * const pdfs = await scrapebit.pdf.list({ page: 1, limit: 20 });
   * ```
   */
  async list(options?: PaginationOptions): Promise<PaginatedResponse<SavedPdf>> {
    const params = new URLSearchParams();
    if (options?.page) params.set('page', options.page.toString());
    if (options?.limit) params.set('limit', options.limit.toString());

    const query = params.toString();
    return this.http.get<PaginatedResponse<SavedPdf>>(
      `/pdf${query ? `?${query}` : ''}`
    );
  }

  /**
   * Delete a PDF
   *
   * @example
   * ```typescript
   * await scrapebit.pdf.delete('pdf_abc123');
   * ```
   */
  async delete(id: string): Promise<void> {
    await this.http.delete(`/pdf/${id}`);
  }

  /**
   * Get download URL for a PDF
   *
   * @example
   * ```typescript
   * const { url } = await scrapebit.pdf.getDownloadUrl('pdf_abc123');
   * ```
   */
  async getDownloadUrl(id: string): Promise<{ url: string; expiresAt: string }> {
    return this.http.get<{ url: string; expiresAt: string }>(`/pdf/${id}/download`);
  }
}
