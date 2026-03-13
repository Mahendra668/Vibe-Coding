import rateLimit from 'express-rate-limit';

export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  validate: { 
    trustProxy: false,
    xForwardedForHeader: false,
    forwardedHeader: false
  },
  message: {
    success: false,
    message: "Too many requests from this IP, please try again after 15 minutes"
  }
});

export const aiLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 20, // Limit each IP to 20 AI requests per hour
  standardHeaders: true,
  legacyHeaders: false,
  validate: { 
    trustProxy: false,
    xForwardedForHeader: false,
    forwardedHeader: false
  },
  message: {
    success: false,
    message: "AI request limit reached for this hour. Please try again later."
  }
});
