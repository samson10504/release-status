const { timeSince, minutesSince } = require('../../src/utils/format-time');
const a = require('../../src/utils/a');

describe('Utils - Format Time', () => {
  it('should format time correctly', () => {
    // Mock Date.now() to return a fixed timestamp
    const realDateNow = Date.now;
    Date.now = jest.fn(() => new Date('2022-01-02T00:00:00Z').getTime());
    
    try {
      // Test with a date 1 day ago
      expect(timeSince('2022-01-01T00:00:00Z')).toBe('1 day ago');
      
      // Test with a date 2 hours ago
      expect(timeSince('2022-01-01T22:00:00Z')).toBe('2 hours ago');
      
      // Test with a date 30 minutes ago
      expect(timeSince('2022-01-01T23:30:00Z')).toBe('30 minutes ago');
    } finally {
      // Restore original Date.now
      Date.now = realDateNow;
    }
  });
  
  it('should calculate minutes since correctly', () => {
    const realDateNow = Date.now;
    Date.now = jest.fn(() => new Date('2022-01-01T01:00:00Z').getTime());
    
    try {
      // Test with a date 30 minutes ago
      expect(minutesSince('2022-01-01T00:30:00Z')).toBe('30m ago');
      
      // Test with a date 2 hours ago
      expect(minutesSince('2022-01-01T23:00:00Z')).toBe('2h ago');
    } finally {
      Date.now = realDateNow;
    }
  });
});

describe('Utils - Async Handler', () => {
  it('should handle successful async operations', async () => {
    // Mock Express req, res, next
    const req = {};
    const res = { status: jest.fn(() => res), json: jest.fn() };
    const next = jest.fn();
    
    // Create test handler
    const testHandler = a(async (req, res) => {
      res.status(200).json({ success: true });
    });
    
    // Execute handler
    await testHandler(req, res, next);
    
    // Assertions
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ success: true });
    expect(next).not.toHaveBeenCalled();
  });
  
  it('should handle errors in async operations', async () => {
    // Mock Express req, res, next
    const req = {};
    const res = { status: jest.fn(() => res), json: jest.fn() };
    const next = jest.fn();
    
    // Save original env and console.error
    const originalEnv = process.env.NODE_ENV;
    const originalConsoleError = console.error;
    
    // Mock console.error
    console.error = jest.fn();
    
    try {
      // Create test handler that throws
      const testHandler = a(async () => {
        throw new Error('Test error');
      });
      
      // Test in development mode
      process.env.NODE_ENV = 'development';
      await testHandler(req, res, next);
      
      // Assertions for development
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: {
          message: 'Test error',
          stack: expect.any(String)
        }
      });
      
      // Reset mocks
      res.status.mockClear();
      res.json.mockClear();
      
      // Test in production mode
      process.env.NODE_ENV = 'production';
      await testHandler(req, res, next);
      
      // Assertions for production
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: true });
      
    } finally {
      // Restore original values
      process.env.NODE_ENV = originalEnv;
      console.error = originalConsoleError;
    }
  });
});