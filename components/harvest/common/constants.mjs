export default {
  HTTP_PROTOCOL: "https://",
  BASE_URL: "api.harvestapp.com",
  VERSION_PATH: "/v2",
  PAGE_SIZE: 100,
  retriableStatusCodes: [
    408,
    429,
    500,
  ],
  DB_LAST_DATE_CHECK: "DB_LAST_DATE_CHECK",
};
