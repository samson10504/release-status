const { Octokit } = require('@octokit/rest');
const mockOctokit = require('../mocks/octokit');

// Mock fetch globally
global.fetch = jest.fn();

// Mock modules
jest.mock('@octokit/rest', () => ({
  Octokit: jest.fn().mockImplementation(() => mockOctokit)
}));

// Mock environment variables
process.env.GITHUB_TOKEN = 'test_token';

describe('Data Module', () => {
  let dataModule;
  
  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();
    global.fetch.mockReset();
    
    // Reset module cache between tests
    jest.resetModules();
    dataModule = require('../../src/data');
  });
  
  describe('getReleasesOrUpdate', () => {
    it('should fetch and sort releases', async () => {
      // Setup mock
      const mockReleases = [
        { version: '9.0.0', date: '2022-01-01' },
        { version: '10.0.0', date: '2022-01-02' }
      ];
      
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockReleases
      });
      
      // Test function
      const releases = await dataModule.getReleasesOrUpdate();
      
      // Assertions
      expect(global.fetch).toHaveBeenCalledWith('https://electronjs.org/headers/index.json');
      expect(releases).toEqual([
        { version: '10.0.0', date: '2022-01-02' },
        { version: '9.0.0', date: '2022-01-01' }
      ]);
    });
    
    it('should handle fetch errors', async () => {
      // Setup mock
      global.fetch.mockRejectedValueOnce(new Error('Network error'));
      
      // Test function
      const releases = await dataModule.getReleasesOrUpdate();
      
      // Assertions
      expect(global.fetch).toHaveBeenCalledWith('https://electronjs.org/headers/index.json');
      expect(releases).toEqual([]);
    });
  });
  
  describe('getGitHubRelease', () => {
    it('should fetch GitHub release data', async () => {
      // Test function
      const release = await dataModule.getGitHubRelease('v10.0.0');
      
      // Assertions
      expect(mockOctokit.repos.getReleaseByTag).toHaveBeenCalledWith({
        owner: 'electron',
        repo: 'electron',
        tag: 'v10.0.0'
      });
      expect(release).toEqual({
        id: 1,
        tag_name: 'v10.0.0',
        body: 'Release notes',
        published_at: '2022-01-01T00:00:00Z'
      });
    });
    
    it('should handle nightlies correctly', async () => {
      // Test function
      await dataModule.getGitHubRelease('v10.0.0-nightly.20220101');
      
      // Assertions
      expect(mockOctokit.repos.getReleaseByTag).toHaveBeenCalledWith({
        owner: 'electron',
        repo: 'nightlies',
        tag: 'v10.0.0-nightly.20220101'
      });
    });
  });
});