'use strict';

const axios = require('axios');
const rateLimit = require('axios-rate-limit');
const client = rateLimit(axios.create(), { maxRequests: 3, perMilliseconds: 1000, maxRPS: 3 });

module.exports = {
    get: async (url = "") => client.get(url)
};