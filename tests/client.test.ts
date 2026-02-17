import { describe, it, expect, vi } from 'vitest';
import { Scrapebit, ValidationError } from '../src';

describe('Scrapebit Client', () => {
  describe('initialization', () => {
    it('should throw ValidationError when API key is missing', () => {
      expect(() => new Scrapebit('')).toThrow(ValidationError);
      expect(() => new Scrapebit('')).toThrow('API key is required');
    });

    it('should throw ValidationError when API key is not a string', () => {
      // @ts-expect-error Testing invalid input
      expect(() => new Scrapebit(123)).toThrow(ValidationError);
      expect(() => new Scrapebit(123 as any)).toThrow('API key must be a string');
    });

    it('should create client with valid API key', () => {
      const client = new Scrapebit('sb_live_abc123def456789012345678901234');
      expect(client).toBeInstanceOf(Scrapebit);
    });

    it('should warn when API key does not start with sb_live_', () => {
      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      new Scrapebit('invalid_key');
      expect(warnSpy).toHaveBeenCalledWith(
        expect.stringContaining('does not start with "sb_live_"')
      );
      warnSpy.mockRestore();
    });

    it('should have version property', () => {
      const client = new Scrapebit('sb_live_abc123def456789012345678901234');
      expect(client.version).toBe('1.0.0');
    });
  });

  describe('API modules', () => {
    const client = new Scrapebit('sb_live_abc123def456789012345678901234');

    it('should have content API', () => {
      expect(client.content).toBeDefined();
      expect(typeof client.content.scrape).toBe('function');
      expect(typeof client.content.extract).toBe('function');
      expect(typeof client.content.list).toBe('function');
    });

    it('should have pdf API', () => {
      expect(client.pdf).toBeDefined();
      expect(typeof client.pdf.generate).toBe('function');
      expect(typeof client.pdf.list).toBe('function');
    });

    it('should have screenshot API', () => {
      expect(client.screenshot).toBeDefined();
      expect(typeof client.screenshot.capture).toBe('function');
      expect(typeof client.screenshot.list).toBe('function');
    });

    it('should have schedule API', () => {
      expect(client.schedule).toBeDefined();
      expect(typeof client.schedule.create).toBe('function');
      expect(typeof client.schedule.list).toBe('function');
    });

    it('should have credits API', () => {
      expect(client.credits).toBeDefined();
      expect(typeof client.credits.getBalance).toBe('function');
      expect(typeof client.credits.getUsage).toBe('function');
    });

    it('should have monitoring API', () => {
      expect(client.monitoring).toBeDefined();
      expect(typeof client.monitoring.create).toBe('function');
      expect(typeof client.monitoring.list).toBe('function');
    });

    it('should have deepResearch API (beta)', () => {
      expect(client.deepResearch).toBeDefined();
      expect(typeof client.deepResearch.createSession).toBe('function');
      expect(typeof client.deepResearch.listSessions).toBe('function');
      expect(typeof client.deepResearch.chat).toBe('function');
      expect(typeof client.deepResearch.analyze).toBe('function');
    });

    it('should have usage API', () => {
      expect(client.usage).toBeDefined();
      expect(typeof client.usage.get).toBe('function');
      expect(typeof client.usage.hasCredits).toBe('function');
      expect(typeof client.usage.hasFeature).toBe('function');
    });
  });

  describe('helper methods', () => {
    const client = new Scrapebit('sb_live_abc123def456789012345678901234');

    it('should have scrape helper', () => {
      expect(typeof client.scrape).toBe('function');
    });

    it('should have toPdf helper', () => {
      expect(typeof client.toPdf).toBe('function');
    });

    it('should have toScreenshot helper', () => {
      expect(typeof client.toScreenshot).toBe('function');
    });
  });
});

describe('DeepResearchApi', () => {
  const client = new Scrapebit('sb_live_abc123def456789012345678901234');

  it('should have all required methods', () => {
    expect(typeof client.deepResearch.listSessions).toBe('function');
    expect(typeof client.deepResearch.createSession).toBe('function');
    expect(typeof client.deepResearch.getSession).toBe('function');
    expect(typeof client.deepResearch.deleteSession).toBe('function');
    expect(typeof client.deepResearch.addScrapeResult).toBe('function');
    expect(typeof client.deepResearch.addText).toBe('function');
    expect(typeof client.deepResearch.removeItem).toBe('function');
    expect(typeof client.deepResearch.chat).toBe('function');
    expect(typeof client.deepResearch.analyze).toBe('function');
    expect(typeof client.deepResearch.getChatHistory).toBe('function');
  });
});

describe('UsageApi', () => {
  const client = new Scrapebit('sb_live_abc123def456789012345678901234');

  it('should have all required methods', () => {
    expect(typeof client.usage.get).toBe('function');
    expect(typeof client.usage.hasCredits).toBe('function');
    expect(typeof client.usage.hasFeature).toBe('function');
    expect(typeof client.usage.getApiRequestsRemaining).toBe('function');
  });
});
