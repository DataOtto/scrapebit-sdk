# Scrapebit Node.js SDK

The official Node.js SDK for [Scrapebit](https://scrapebit.com) - AI-powered web scraping API.

[![npm version](https://img.shields.io/npm/v/@dataotto/scrapebit-sdk.svg)](https://www.npmjs.com/package/@dataotto/scrapebit-sdk)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Installation

```bash
npm install @dataotto/scrapebit-sdk
```

## Quick Start

```typescript
import { Scrapebit } from '@dataotto/scrapebit-sdk';

const scrapebit = new Scrapebit('sb_live_your_api_key');

const result = await scrapebit.scrape('https://example.com/products');
console.log(result.data);
```

## Features

- **AI-Powered Extraction** - Use natural language prompts to describe what data you want
- **Structured Output** - Get clean, structured JSON data
- **Multi-Page Scraping** - Handle pagination automatically (paid plans)
- **PDF Generation** - Convert any webpage to PDF
- **Screenshot Capture** - Full-page or element screenshots
- **Scheduled Tasks** - Set up recurring scrapes
- **Website Monitoring** - Monitor pages for changes
- **Deep Research** - AI-powered research and analysis

## Usage

### Initialize the Client

```typescript
import { Scrapebit } from '@dataotto/scrapebit-sdk';

const scrapebit = new Scrapebit('sb_live_your_api_key');

// With custom configuration
const scrapebit = new Scrapebit('sb_live_your_api_key', {
  timeout: 60000,
  retries: 3,
});
```

### Web Scraping

```typescript
// Basic scrape with AI prompt
const result = await scrapebit.content.scrape({
  url: 'https://example.com/products',
  prompt: 'Extract all product names, prices, and descriptions'
});

console.log(result.data);
// [
//   { name: 'Product 1', price: '$19.99', description: '...' },
//   { name: 'Product 2', price: '$29.99', description: '...' },
// ]
```

### Structured Extraction

```typescript
const result = await scrapebit.content.scrape({
  url: 'https://example.com/team',
  prompt: 'Extract team member information',
  columns: ['name', 'role', 'email', 'linkedin']
});
```

### Multi-Page Scraping

Note: Pagination requires a paid plan (Starter and above).

```typescript
const result = await scrapebit.content.scrape({
  url: 'https://example.com/listings',
  prompt: 'Extract all listing titles and prices',
  pagination: {
    nextButtonSelector: '.next-page',
    maxPages: 5,
    delayMs: 1000
  }
});
```

### Check Usage and Plan

```typescript
const usage = await scrapebit.usage.get();

console.log(`Credits remaining: ${usage.credits_remaining}`);
console.log(`Plan: ${usage.plan.name}`);
console.log(`API requests today: ${usage.api_requests_today}`);

// Check if you have enough credits
if (await scrapebit.usage.hasCredits(5)) {
  // Proceed with operation
}
```

### PDF Generation

```typescript
const pdf = await scrapebit.pdf.generate({
  url: 'https://example.com/report',
  format: 'a4',
  orientation: 'portrait',
  margin: { top: '20px', bottom: '20px', left: '20px', right: '20px' }
});

console.log(pdf.pdfUrl);
```

### Screenshot Capture

```typescript
const screenshot = await scrapebit.screenshot.capture({
  url: 'https://example.com',
  format: 'png',
  fullPage: true
});

console.log(screenshot.imageUrl);
```

### Website Monitoring

```typescript
const monitor = await scrapebit.monitoring.create({
  name: 'Price Monitor',
  url: 'https://example.com/product',
  checkInterval: 'hourly',
  notifyOnlyOnChanges: true,
  alertChannels: [
    { type: 'email', email: 'alerts@example.com' }
  ]
});

// List all monitors
const monitors = await scrapebit.monitoring.list();

// Pause/resume
await scrapebit.monitoring.pause(monitor.id);
await scrapebit.monitoring.resume(monitor.id);
```

### Scheduled Tasks

```typescript
const task = await scrapebit.schedule.create({
  url: 'https://example.com/prices',
  type: 'scrape',
  scheduledAt: '2024-01-15T09:00:00Z',
  frequency: 'daily',
  options: {
    prompt: 'Extract all product prices'
  },
  webhookUrl: 'https://your-app.com/webhook'
});

// List scheduled tasks
const tasks = await scrapebit.schedule.list({ status: 'pending' });

// Trigger immediately
await scrapebit.schedule.triggerNow(task.id);
```

### Deep Research

```typescript
// Create a research session
const session = await scrapebit.deepResearch.createSession({
  name: 'Market Research Q1 2024'
});

// Add scraped content
await scrapebit.deepResearch.addScrapeResult(session.id, 'scrape_abc123');

// Chat with your research data
const response = await scrapebit.deepResearch.chat(session.id, {
  message: 'What are the main trends across these sources?'
});

// Generate analysis
const analysis = await scrapebit.deepResearch.analyze(session.id, {
  type: 'summary',
  prompt: 'Summarize the key findings'
});
```

## Error Handling

```typescript
import {
  Scrapebit,
  ScrapebitError,
  AuthenticationError,
  RateLimitError,
  InsufficientCreditsError,
  ValidationError,
} from '@dataotto/scrapebit-sdk';

try {
  const result = await scrapebit.content.scrape({
    url: 'https://example.com',
    prompt: 'Extract data'
  });
} catch (error) {
  if (error instanceof AuthenticationError) {
    console.error('Invalid API key');
  } else if (error instanceof RateLimitError) {
    console.error(`Rate limited. Retry after ${error.retryAfter} seconds`);
  } else if (error instanceof InsufficientCreditsError) {
    console.error(`Need ${error.creditsRequired} credits, have ${error.creditsRemaining}`);
  } else if (error instanceof ValidationError) {
    console.error(`Validation error: ${error.message}`);
  } else if (error instanceof ScrapebitError) {
    console.error(`API error: ${error.code} - ${error.message}`);
  }
}
```

## Rate Limits

| Plan | API Requests/Day |
|------|------------------|
| Free | No API access |
| Starter | 100 |
| Pro | 500 |
| Business | Unlimited |

Rate limit headers are included in responses:
- `X-RateLimit-Limit`: Your daily limit
- `X-RateLimit-Remaining`: Requests remaining today
- `X-RateLimit-Reset`: When the limit resets (ISO 8601)

## TypeScript

Full TypeScript support with exported types:

```typescript
import type {
  ScrapeOptions,
  ScrapeResult,
  PdfOptions,
  ScreenshotOptions,
  UsageInfo,
} from '@dataotto/scrapebit-sdk';
```

## Requirements

- Node.js 18.0.0 or higher
- Scrapebit API key ([Get one here](https://scrapebit.com/dashboard/developer))

## Documentation

Full API documentation is available at [docs.scrapebit.com](https://docs.scrapebit.com).

## License

MIT
