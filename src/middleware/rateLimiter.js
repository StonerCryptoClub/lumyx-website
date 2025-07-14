/**
 * Rate Limiter Middleware for API routes
 * Limits the number of requests from a single IP within a time window
 */

// In-memory store for rate limiting
// For production, consider using Redis or another persistent store
const rateLimit = new Map();

// Configuration
const RATE_LIMIT_MAX = process.env.RATE_LIMIT_MAX || 100; // Maximum requests per window
const RATE_LIMIT_WINDOW_MS = process.env.RATE_LIMIT_WINDOW_MS || 60000; // Window size in milliseconds (1 minute)

/**
 * Rate limiting middleware function
 */
function rateLimiter(req, res, next) {
  // Get client IP
  const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  
  // Current timestamp
  const now = Date.now();
  
  // Initialize or get existing rate limit data for this IP
  if (!rateLimit.has(ip)) {
    rateLimit.set(ip, {
      count: 0,
      resetTime: now + RATE_LIMIT_WINDOW_MS
    });
  }
  
  const rateLimitData = rateLimit.get(ip);
  
  // Reset counter if window has passed
  if (now > rateLimitData.resetTime) {
    rateLimitData.count = 0;
    rateLimitData.resetTime = now + RATE_LIMIT_WINDOW_MS;
  }
  
  // Increment request count
  rateLimitData.count++;
  
  // Set headers to inform client about rate limiting
  res.setHeader('X-RateLimit-Limit', RATE_LIMIT_MAX);
  res.setHeader('X-RateLimit-Remaining', Math.max(0, RATE_LIMIT_MAX - rateLimitData.count));
  res.setHeader('X-RateLimit-Reset', Math.ceil(rateLimitData.resetTime / 1000)); // In seconds
  
  // If rate limit exceeded, return 429 Too Many Requests
  if (rateLimitData.count > RATE_LIMIT_MAX) {
    return res.status(429).json({
      error: 'Too many requests, please try again later.',
      retryAfter: Math.ceil((rateLimitData.resetTime - now) / 1000) // In seconds
    });
  }
  
  // Clean up old entries every hour to prevent memory leaks
  if (now % 3600000 < 1000) { // Roughly every hour
    for (const [ipKey, data] of rateLimit.entries()) {
      if (now > data.resetTime) {
        rateLimit.delete(ipKey);
      }
    }
  }
  
  // Continue to next middleware
  if (typeof next === 'function') {
    next();
  }
}

module.exports = rateLimiter; 