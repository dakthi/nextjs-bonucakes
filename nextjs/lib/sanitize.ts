/**
 * Input sanitization utilities to protect against XSS and injection attacks
 */

/**
 * Sanitize text input by removing potentially dangerous characters
 * while preserving legitimate content
 */
export function sanitizeText(input: string): string {
  if (!input) return '';

  return input
    .trim()
    // Remove null bytes
    .replace(/\0/g, '')
    // Remove control characters except newlines and tabs
    .replace(/[\x00-\x08\x0B-\x0C\x0E-\x1F\x7F]/g, '')
    // Remove script tags
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    // Remove on* event handlers
    .replace(/\s*on\w+\s*=\s*["'][^"']*["']/gi, '')
    .replace(/\s*on\w+\s*=\s*[^\s>]*/gi, '');
}

/**
 * Sanitize HTML by escaping special characters
 */
export function escapeHtml(input: string): string {
  if (!input) return '';

  const htmlEscapeMap: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '/': '&#x2F;',
  };

  return input.replace(/[&<>"'/]/g, (char) => htmlEscapeMap[char]);
}

/**
 * Sanitize email addresses
 */
export function sanitizeEmail(email: string): string {
  if (!email) return '';

  return email
    .toLowerCase()
    .trim()
    // Remove any characters that aren't valid in email addresses
    .replace(/[^\w.@+-]/g, '');
}

/**
 * Sanitize phone numbers
 */
export function sanitizePhone(phone: string): string {
  if (!phone) return '';

  return phone
    .trim()
    // Keep only digits, spaces, +, -, (, )
    .replace(/[^\d\s+()-]/g, '');
}

/**
 * Sanitize numeric input
 */
export function sanitizeNumber(input: string | number): number {
  const num = typeof input === 'string' ? parseFloat(input) : input;
  return isNaN(num) ? 0 : num;
}

/**
 * Sanitize URL to prevent javascript: and data: URIs
 */
export function sanitizeUrl(url: string): string {
  if (!url) return '';

  const trimmed = url.trim().toLowerCase();

  // Block dangerous protocols
  if (
    trimmed.startsWith('javascript:') ||
    trimmed.startsWith('data:') ||
    trimmed.startsWith('vbscript:') ||
    trimmed.startsWith('file:')
  ) {
    return '';
  }

  return url.trim();
}

/**
 * Validate and sanitize array of strings
 */
export function sanitizeStringArray(arr: unknown): string[] {
  if (!Array.isArray(arr)) return [];

  return arr
    .filter((item) => typeof item === 'string')
    .map((item) => sanitizeText(item))
    .filter((item) => item.length > 0);
}

/**
 * Sanitize JSON input to prevent prototype pollution
 */
export function sanitizeJson(obj: any): any {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }

  // Remove dangerous keys
  const dangerousKeys = ['__proto__', 'constructor', 'prototype'];

  if (Array.isArray(obj)) {
    return obj.map((item) => sanitizeJson(item));
  }

  const sanitized: any = {};
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      if (!dangerousKeys.includes(key)) {
        sanitized[key] = sanitizeJson(obj[key]);
      }
    }
  }

  return sanitized;
}

/**
 * Validate string length
 */
export function validateLength(
  input: string,
  min: number = 0,
  max: number = 10000
): { valid: boolean; error?: string } {
  if (input.length < min) {
    return { valid: false, error: `Input must be at least ${min} characters` };
  }
  if (input.length > max) {
    return { valid: false, error: `Input must not exceed ${max} characters` };
  }
  return { valid: true };
}

/**
 * Check for SQL injection patterns (basic detection)
 */
export function containsSqlInjection(input: string): boolean {
  const sqlPatterns = [
    /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|EXECUTE)\b)/gi,
    /(UNION\s+SELECT)/gi,
    /(OR\s+1\s*=\s*1)/gi,
    /(AND\s+1\s*=\s*1)/gi,
    /('|";|--|\/\*|\*\/)/g,
  ];

  return sqlPatterns.some((pattern) => pattern.test(input));
}

/**
 * Check for XSS patterns
 */
export function containsXss(input: string): boolean {
  const xssPatterns = [
    /<script[\s\S]*?>[\s\S]*?<\/script>/gi,
    /<iframe[\s\S]*?>[\s\S]*?<\/iframe>/gi,
    /javascript:/gi,
    /on\w+\s*=/gi,
    /<embed/gi,
    /<object/gi,
  ];

  return xssPatterns.some((pattern) => pattern.test(input));
}

/**
 * Comprehensive input validation for user-submitted content
 */
export function validateUserInput(input: string, options: {
  maxLength?: number;
  minLength?: number;
  allowHtml?: boolean;
  checkSql?: boolean;
  checkXss?: boolean;
} = {}): { valid: boolean; sanitized: string; errors: string[] } {
  const {
    maxLength = 5000,
    minLength = 0,
    allowHtml = false,
    checkSql = true,
    checkXss = true,
  } = options;

  const errors: string[] = [];

  // Check length
  const lengthCheck = validateLength(input, minLength, maxLength);
  if (!lengthCheck.valid) {
    errors.push(lengthCheck.error!);
  }

  // Check for SQL injection
  if (checkSql && containsSqlInjection(input)) {
    errors.push('Input contains potentially dangerous SQL patterns');
  }

  // Check for XSS
  if (checkXss && containsXss(input)) {
    errors.push('Input contains potentially dangerous scripts');
  }

  // Sanitize based on options
  const sanitized = allowHtml ? sanitizeText(input) : escapeHtml(sanitizeText(input));

  return {
    valid: errors.length === 0,
    sanitized,
    errors,
  };
}
