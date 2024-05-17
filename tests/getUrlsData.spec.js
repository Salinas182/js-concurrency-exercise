const axios = require('axios');
const getUrlsData = require('../getUrlsData');

jest.mock('axios');

describe('getUrlsData', () => {
  it(`should get URLs' data with a concurrency control provided by the caller`, async () => {
    const MAX_CONCURRENCY = 2;
    const mockUrls = [
      'https://demo.com/1',
      'https://demo.com/2',
      'https://demo.com/3',
      'https://demo.com/4'
    ];
    const mockResponses = ['Response 1', 'Response 2', 'Response 3', 'Response 4'];

    let activeRequests = 0;

    axios.get.mockImplementation((url) => {
      activeRequests++;
      const responseIndex = mockUrls.indexOf(url);
      return new Promise((resolve) => {
        setTimeout(() => {
          activeRequests--;
          resolve({ data: mockResponses[responseIndex] });
        }, 100);
      });
    });

    const result = await getUrlsData(mockUrls, MAX_CONCURRENCY);

    expect(activeRequests).toBeLessThanOrEqual(MAX_CONCURRENCY);
    expect(axios.get).toHaveBeenCalledTimes(4);
    expect(result).toEqual(mockResponses);
  });
});
