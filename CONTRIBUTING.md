# Contributing to Scrapebit SDK

Thank you for your interest in contributing to the Scrapebit Node.js SDK! This document provides guidelines and instructions for contributing.

## Code of Conduct

Please be respectful and constructive in all interactions. We're all here to build something great together.

## Getting Started

### Prerequisites

- Node.js 18.0.0 or higher
- npm, yarn, or pnpm

### Setup

1. Fork the repository
2. Clone your fork:
   ```bash
   git clone https://github.com/YOUR_USERNAME/scrapebit-node.git
   cd scrapebit-node
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Create a branch for your changes:
   ```bash
   git checkout -b feature/your-feature-name
   ```

## Development

### Project Structure

```
scrapebit-sdk/
├── src/
│   ├── api/           # API module implementations
│   ├── types/         # TypeScript type definitions
│   ├── utils/         # Utility functions and helpers
│   ├── client.ts      # Main client class
│   └── index.ts       # Public exports
├── tests/             # Test files
├── examples/          # Example usage code
└── dist/              # Built output (generated)
```

### Commands

```bash
# Build the SDK
npm run build

# Run in development mode (watch)
npm run dev

# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Lint code
npm run lint

# Fix lint issues
npm run lint:fix

# Type check
npm run typecheck
```

### Code Style

- Use TypeScript for all code
- Follow existing code patterns and style
- Use meaningful variable and function names
- Add JSDoc comments for public APIs
- Keep functions small and focused

### Writing Tests

- Write tests for all new functionality
- Place tests in the `tests/` directory
- Use descriptive test names
- Cover edge cases and error scenarios

Example test:

```typescript
import { describe, it, expect } from 'vitest';
import { Scrapebit } from '../src';

describe('Scrapebit', () => {
  it('should throw if API key is missing', () => {
    expect(() => new Scrapebit('')).toThrow('API key is required');
  });
});
```

## Submitting Changes

### Pull Request Process

1. Ensure all tests pass: `npm test`
2. Ensure code is properly linted: `npm run lint`
3. Ensure TypeScript compiles: `npm run typecheck`
4. Update documentation if needed
5. Write a clear PR description explaining:
   - What changes were made
   - Why the changes were made
   - How to test the changes

### Commit Messages

Use clear, descriptive commit messages:

- `feat: add batch scraping support`
- `fix: handle timeout errors correctly`
- `docs: update README examples`
- `test: add tests for PDF generation`
- `refactor: simplify error handling`

### PR Title Format

Use the same format as commit messages:
- `feat: description`
- `fix: description`
- `docs: description`

## Reporting Issues

### Bug Reports

Include:
- SDK version
- Node.js version
- Steps to reproduce
- Expected vs actual behavior
- Error messages if applicable

### Feature Requests

Include:
- Use case description
- Proposed API design (if applicable)
- Any alternatives considered

## Questions?

If you have questions, feel free to:
- Open a GitHub issue
- Email support@scrapebit.com

Thank you for contributing!
