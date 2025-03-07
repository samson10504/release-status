const mockOctokit = {
    repos: {
      getReleaseByTag: jest.fn().mockResolvedValue({
        data: {
          id: 1,
          tag_name: 'v10.0.0',
          body: 'Release notes',
          published_at: '2022-01-01T00:00:00Z'
        }
      }),
    },
    pulls: {
      list: jest.fn().mockResolvedValue({
        data: [
          {
            number: 123,
            title: 'Test PR',
            user: { login: 'testuser', type: 'User' },
            merged_at: '2022-01-01T00:00:00Z',
            html_url: 'https://github.com/electron/electron/pull/123'
          }
        ]
      }),
      get: jest.fn().mockResolvedValue({
        data: {
          number: 123,
          title: 'Test PR',
          body: 'PR description',
          user: { login: 'testuser' },
          merged_at: '2022-01-01T00:00:00Z',
          html_url: 'https://github.com/electron/electron/pull/123'
        }
      })
    },
    issues: {
      listComments: {
        endpoint: {
          merge: jest.fn().mockReturnValue({})
        }
      }
    },
    paginate: jest.fn().mockResolvedValue([
      {
        id: 1,
        body: 'Test comment',
        user: { login: 'testuser' },
        created_at: '2022-01-01T00:00:00Z'
      }
    ])
  };
  
  module.exports = mockOctokit;