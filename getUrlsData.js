const axios = require('axios');

async function getUrlsData(urlsArray, MAX_CONCURRENCY) {
  let requestsResponses = [];
  const queue = [...urlsArray];

  async function getter() {
    while (queue.length) {
      const targetUrl = queue.shift();
      const targetUrlIdx = urlsArray.indexOf(targetUrl);

      try {
        const { data } = await axios.get(targetUrl);
        requestsResponses[targetUrlIdx] = data;
      } catch (error) {
        requestsResponses[targetUrlIdx] = { error: error.message }
      }
    }
  }

  const getters = Array.from({ length: MAX_CONCURRENCY }).map(() => getter());

  await Promise.all(getters);

  return requestsResponses;
}

module.exports = getUrlsData;
