const fetchMock = require("jest-fetch-mock");
fetchMock.enableMocks();
global.fetch = fetchMock;

jest.mock("simple-oauth2");
