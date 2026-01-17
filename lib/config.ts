/**
 * Application configuration
 * Can be overridden by environment variables
 * 
 * To customize these values:
 * 1. Create a .env.local file in the project root
 * 2. Add the environment variables (see .env.local.example)
 * 3. Restart the development server
 */

const DEFAULT_POLLING_INTERVAL = 2000; // 2 seconds
const DEFAULT_API_BASE_URL = 'http://localhost:4001';

export const config = {
  /**
   * Polling interval in milliseconds
   * Default: 2000 (2 seconds)
   * Can be overridden with NEXT_PUBLIC_POLLING_INTERVAL
   * 
   * Examples:
   * - 1000 = 1 second (faster updates, more server load)
   * - 2000 = 2 seconds (balanced)
   * - 5000 = 5 seconds (slower updates, less server load)
   */
  pollingInterval: Number(process.env.NEXT_PUBLIC_POLLING_INTERVAL) || DEFAULT_POLLING_INTERVAL,

  /**
   * API base URL
   * Default: http://localhost:3001
   * Can be overridden with NEXT_PUBLIC_API_BASE_URL
   */
  apiBaseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || DEFAULT_API_BASE_URL,
} as const;

// Log configuration on startup (only in development)
if (process.env.NODE_ENV === 'development') {
  console.log('📋 App Configuration:');
  console.log(`  - API Base URL: ${config.apiBaseUrl}`);
  console.log(`  - Polling Interval: ${config.pollingInterval}ms (${config.pollingInterval / 1000}s)`);
}
