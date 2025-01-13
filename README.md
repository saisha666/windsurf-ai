# Chrome Extension Project

A modern Chrome extension built with React, TypeScript, and Tailwind CSS.

## Tech Stack

- React
- TypeScript
- Tailwind CSS
- Shadcn UI
- Chrome Extension API
- Express.js

## Project Structure

```
server/
├── src/
    ├── components/     # Shared React components
    ├── hooks/          # Custom React hooks
    ├── utils/          # Helper functions
    ├── types/          # TypeScript types
    └── lib/            # Shared libraries
extension/
├── src/
    ├── background/     # Service worker scripts
    ├── content/        # Content scripts
    ├── popup/          # Extension popup UI
    ├── options/        # Extension options page
    ├── components/     # Shared React components
    ├── hooks/          # Custom React hooks
    ├── utils/          # Helper functions
    ├── lib/            # Shared libraries
    ├── types/          # TypeScript types
    └── storage/        # Chrome storage utilities
shared/
├── src/
    ├── types/          # Shared TypeScript types
    └── utils/          # Shared helper functions
```

## Development Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start development server:
   ```bash
   npm run dev
   ```
4. Build extension:
   ```bash
   npm run build
   ```

## Contributing

Please follow our commit message conventions:

- fix: for bug fixes
- feat: for new features
- perf: for performance improvements
- docs: for documentation changes
- style: for formatting changes
- refactor: for code refactoring
- test: for adding missing tests
- chore: for maintenance tasks

## Security

This extension follows Chrome extension security best practices:
- Implements Content Security Policy
- Sanitizes user inputs
- Handles sensitive data properly
- Follows proper CORS handling

## License

[License Type] - 2025
