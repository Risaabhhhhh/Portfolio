/**
 * lib/rate-limit.ts
 *
 * Upstash Redis rate limiter — serverless safe.
 *
 * Unlike in-memory Map, this persists across ALL Vercel instances
 * so rate limits actually work in production.
 *
 * Install:
 *   npm install @upstash/redis @upstash/ratelimit
 *
 * Setup:
 *   1. Go to console.upstash.com → Create Redis database
 *   2. Copy UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN
 *   3. Add both to .env.local and Vercel dashboard
 */

import { Ratelimit } from "@upstash/ratelimit"; 
import { Redis } from "@upstash/redis";

// Singleton Redis client — reused across warm invocations
const redis = new Redis({
  url:   process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

// Sliding window: 5 requests per 15 minutes per identifier
export const rateLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(5, "15 m"),
  analytics: true,              // visible in Upstash dashboard
  prefix: "portfolio_contact",  // namespaces the Redis keys
});

/**
 * Check rate limit for an IP address.
 *
 * @returns { success, limit, remaining, reset }
 *   success   — true = allowed, false = blocked
 *   remaining — requests left in this window
 *   reset     — epoch ms when the window resets
 */
export async function checkRateLimit(ip: string) {
  const result = await rateLimiter.limit(ip);
  return {
    success:   result.success,
    limit:     result.limit,
    remaining: result.remaining,
    reset:     result.reset,        // epoch ms
  };
}