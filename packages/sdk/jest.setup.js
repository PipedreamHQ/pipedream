const fetchMock = require("jest-fetch-mock");
fetchMock.enableMocks();
global.fetch = fetchMock;
