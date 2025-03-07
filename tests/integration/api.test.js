const request = require('supertest');
const mockData = require('../fixtures/mockData');

// Mock data module
jest.mock('../../src/data', () => ({
  getReleasesOrUpdate: jest.fn().mockResolvedValue(mockData.releases),
  getActiveReleasesOrUpdate: jest.fn().mockResolvedValue(mockData.activeReleases),
  getPR: jest.fn().mockResolvedValue({
    number: 123,
    title: 'Test PR',
    body: 'PR description',
    user: { login: 'testuser' },
    merged_at: '2022-01-01T00:00:00Z'
  }),
  getPRComments: jest.fn().mockResolvedValue([
    {
      body: 'Test comment',
      user: { login: 'testuser' },
      created_at: '2022-01-01T00:00:00Z'
    }
  ]),
  getGitHubRelease: jest.fn().mockImplementation((version) => {
    if (version === 'v10.0.0') {
      return Promise.resolve({
        tag_name: 'v10.0.0',
        body: 'Release notes',
        published_at: '2022-01-01T00:00:00Z'
      });
    }
    return Promise.resolve(null);
  })
}));

describe('API Integration Tests', () => {
  let app;
  
  beforeEach(() => {
    // Reset modules
    jest.resetModules();
    
    // Load app
    app = require('../../src/index');
  });
  
  afterEach(() => {
    // Check if server needs to be closed
    if (app && app.close) {
      app.close();
    }
  });
  
  describe('Release Routes', () => {
    it('should render the release page for a valid version', async () => {
      const res = await request(app)
        .get('/release/v10.0.0')
        .expect('Content-Type', /html/)
        .expect(200);
      
      expect(res.text).toContain('10.0.0');
    });
    
    it('should handle non-existent release versions', async () => {
      // Mock data.getGitHubRelease to return null for unknown version
      const dataModule = require('../../src/data');
      dataModule.getGitHubRelease.mockResolvedValueOnce(null);
      
      const res = await request(app)
        .get('/release/v999.0.0')
        .expect(404);
      
      expect(res.text).toContain('Not Found');
    });
  });
  
  describe('PR Routes', () => {
    it('should render the PR page for a valid PR number', async () => {
      const res = await request(app)
        .get('/pr/123')
        .expect('Content-Type', /html/)
        .expect(200);
      
      expect(res.text).toContain('Test PR');
    });
    
    it('should handle non-existent PR numbers', async () => {
      // Mock data.getPR to return null for unknown PR
      const dataModule = require('../../src/data');
      dataModule.getPR.mockResolvedValueOnce(null);
      
      const res = await request(app)
        .get('/pr/999')
        .expect(404);
      
      expect(res.text).toContain('Not Found');
    });
  });
});