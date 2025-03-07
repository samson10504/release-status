module.exports = {
    releases: [
      {
        version: '10.0.0',
        date: '2022-01-01',
        chrome: '100',
        node: '16.0.0'
      },
      {
        version: '9.0.0-nightly.20220101',
        date: '2022-01-01',
        chrome: '99',
        node: '15.0.0'
      },
      {
        version: '9.0.0-beta.1',
        date: '2022-01-01',
        chrome: '99',
        node: '15.0.0'
      }
    ],
    activeReleases: {
      currentlyRunning: [
        {
          id: 'abc123',
          branch: 'main',
          channel: 'beta',
          started: new Date().toISOString()
        }
      ],
      queued: []
    }
  };