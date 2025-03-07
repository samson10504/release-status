const { timeSince, minutesSince } = require('../../src/utils/format-time');
const asyncHandler = require('../../src/utils/a');

describe('Utils - Format Time', () => {
  it('should return correct relative time descriptions', () => {
    // Get the current date and calculate some test dates based on it
    const now = new Date();
    const today = now.toISOString().split('T')[0]; // YYYY-MM-DD
    
    // Test with a known date in the past to ensure consistent results
    const pastDate = '2020-01-01'; // A fixed date in the past
    const pastResult = timeSince(pastDate);
    expect(pastResult.includes('days ago')).toBe(true);
    
    // Test the function with the current year-month to get a more predictable result
    const thisMonth = `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}`;
    const dayToday = now.getDate();
    
    // Test cases with relative dates
    const yesterdayDate = `${thisMonth}-${(dayToday - 1).toString().padStart(2, '0')}`;
    if (dayToday > 1) {
      const yesterdayResult = timeSince(yesterdayDate);
      expect(['Yesterday', '1 day ago'].includes(yesterdayResult)).toBe(true);
    }
  });

  it('should calculate minutes since correctly', () => {
    const now = new Date();
    
    // Test with a time 5 minutes ago
    const fiveMinutesAgo = new Date(now.getTime() - 5 * 60 * 1000).toISOString();
    expect(minutesSince(fiveMinutesAgo)).toBe('5 minutes ago');
    
    // Test with a time 1 minute ago
    const oneMinuteAgo = new Date(now.getTime() - 60 * 1000).toISOString();
    expect(minutesSince(oneMinuteAgo)).toBe('1 minute ago');
    
    // Test with a time 1 hour ago
    const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000).toISOString();
    expect(minutesSince(oneHourAgo)).toBe('1 hour ago');
    
    // Test with a time 1 hour and 5 minutes ago
    const hourAndFiveMinutes = new Date(now.getTime() - (65 * 60 * 1000)).toISOString();
    expect(minutesSince(hourAndFiveMinutes)).toBe('1 hour and 5 minutes ago');
    
    // Test with a time 2 hours ago
    const twoHoursAgo = new Date(now.getTime() - 2 * 60 * 60 * 1000).toISOString();
    expect(minutesSince(twoHoursAgo)).toBe('2 hours ago');
  });
});

describe('Utils - Async Handler', () => {
  it('should handle successful async operations', async () => {
    const mockFn = jest.fn().mockResolvedValue('success');
    const mockReq = {};
    const mockRes = {};
    const mockNext = jest.fn();
    
    await asyncHandler(mockFn)(mockReq, mockRes, mockNext);
    
    expect(mockFn).toHaveBeenCalledWith(mockReq, mockRes, mockNext);
    expect(mockNext).not.toHaveBeenCalled();
  });
  
  it('should handle errors in async operations', async () => {
    const mockError = new Error('Test error');
    const mockFn = jest.fn().mockRejectedValue(mockError);
    const mockReq = {};
    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    const mockNext = jest.fn();
    
    // Set environment to development to get detailed error
    process.env.NODE_ENV = 'development';
    
    await asyncHandler(mockFn)(mockReq, mockRes, mockNext);
    
    expect(mockFn).toHaveBeenCalledWith(mockReq, mockRes, mockNext);
    expect(mockRes.status).toHaveBeenCalledWith(500);
    
    // Expect detailed error object in development
    expect(mockRes.json).toHaveBeenCalledWith({
      error: expect.objectContaining({
        message: 'Test error',
        stack: expect.any(String)
      })
    });
  });
});