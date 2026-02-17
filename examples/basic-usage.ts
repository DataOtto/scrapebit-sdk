/**
 * Basic usage examples for the Scrapebit SDK
 *
 * Run with: npx ts-node examples/basic-usage.ts
 */

import { Scrapebit, ScrapebitError, RateLimitError } from '../src';

// Initialize the client
const scrapebit = new Scrapebit(process.env.SCRAPEBIT_API_KEY || 'sk_test_demo');

async function main() {
  try {
    // ========================================
    // Example 1: Basic web scraping
    // ========================================
    console.log('--- Example 1: Basic Scraping ---');

    const scrapeResult = await scrapebit.content.scrape({
      url: 'https://news.ycombinator.com',
      prompt: 'Extract the top 10 story titles and their points',
    });

    console.log(`Extracted ${scrapeResult.count} items`);
    console.log('Headers:', scrapeResult.headers);
    console.log('Sample data:', scrapeResult.data.slice(0, 3));

    // ========================================
    // Example 2: Structured extraction
    // ========================================
    console.log('\n--- Example 2: Structured Extraction ---');

    const extractResult = await scrapebit.content.extract({
      url: 'https://example.com/about',
      extract: {
        companyName: 'The name of the company',
        description: 'A brief description of what they do',
        foundedYear: 'Year the company was founded',
      },
    });

    console.log('Extracted data:', extractResult.data);

    // ========================================
    // Example 3: PDF generation
    // ========================================
    console.log('\n--- Example 3: PDF Generation ---');

    const pdfResult = await scrapebit.pdf.generate({
      url: 'https://example.com',
      format: 'a4',
      orientation: 'portrait',
    });

    console.log('PDF generated:', pdfResult.pdfUrl);
    console.log('Page count:', pdfResult.pageCount);

    // ========================================
    // Example 4: Screenshot capture
    // ========================================
    console.log('\n--- Example 4: Screenshot Capture ---');

    const screenshotResult = await scrapebit.screenshot.capture({
      url: 'https://example.com',
      format: 'png',
      fullPage: true,
    });

    console.log('Screenshot captured:', screenshotResult.imageUrl);
    console.log('Dimensions:', screenshotResult.dimensions);

    // ========================================
    // Example 5: Check credits
    // ========================================
    console.log('\n--- Example 5: Credit Balance ---');

    const credits = await scrapebit.credits.getBalance();
    console.log('Credits remaining:', credits.remaining);
    console.log('Subscription credits:', credits.subscription);
    console.log('Purchased credits:', credits.purchased);

    // ========================================
    // Example 6: Quick helpers
    // ========================================
    console.log('\n--- Example 6: Quick Helpers ---');

    // One-liner scrape
    const quickScrape = await scrapebit.scrape(
      'https://example.com',
      'Extract the main heading'
    );
    console.log('Quick scrape result:', quickScrape.data);

    // One-liner PDF
    const quickPdf = await scrapebit.toPdf('https://example.com');
    console.log('Quick PDF:', quickPdf.pdfUrl);

    // One-liner screenshot
    const quickScreenshot = await scrapebit.toScreenshot('https://example.com');
    console.log('Quick screenshot:', quickScreenshot.imageUrl);

  } catch (error) {
    // Handle specific error types
    if (error instanceof RateLimitError) {
      console.error(`Rate limited! Retry after ${error.retryAfter} seconds`);
    } else if (error instanceof ScrapebitError) {
      console.error(`API Error: ${error.code} - ${error.message}`);
    } else {
      console.error('Unexpected error:', error);
    }
  }
}

main();
