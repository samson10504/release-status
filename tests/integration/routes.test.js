const request = require('supertest');
const mockData = require('../fixtures/mockData');

// Mock data module
jest.mock('../../src/data', () => ({
  getReleasesOrUpdate: jest.fn().mockResolvedValue(mockData.releases),
  getActiveReleasesOrUpdate: jest.fn().mockResolvedValue(mockData.activeReleases),
  getGitHubRelease: jest.fn().mockResolvedValue({
    tag_name: 'v10.0.0',
    body: 'Release notes',
    published_at: '2022-01-01T00:00:00Z'
  }),
  getRecentPRs: jest.fn().mockResolvedValue([
    {
      number: 123,
      title: 'Test PR',
      user: { login: 'testuser' },
      merged_at: '2022-01-01T00:00:00Z',
      html_url: 'https://github.com/electron/electron/pull/123'
    }
  ])
}));

describe('Route Integration Tests', () => {
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
  
  it('should serve the home page', async () => {
    const res = await request(app)
      .get('/')
      .expect('Content-Type', /html/)
      .expect(200);
    
    expect(res.text).toContain('Electron Release History');
  });
  
  it('should serve the releases.json endpoint', async () => {
    const res = await request(app)
      .get('/releases.json')
      .expect('Content-Type', /json/)
      .expect(200);
    
    expect(res.body).toEqual(mockData.releases);
  });
  
  it('should serve the active.json endpoint', async () => {
    const res = await request(app)
      .get('/active.json')
      .expect('Content-Type', /json/)
      .expect(200);
    
    expect(res.body).toEqual(mockData.activeReleases);
  });
  
  it('should redirect to home on 404', async () => {
    const res = await request(app)
      .get('/non-existent-path')
      .expect(302);
    
    expect(res.header.location).toBe('/');
  });
});