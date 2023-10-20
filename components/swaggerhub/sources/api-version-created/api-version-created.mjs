import base from "../common/polling.mjs";

export default {
  ...base,
  key: "swaggerhub-api-version-created",
  name: "New API Version Created",
  description: "Emit new event for every created version of a specific API. [See the docs here](https://app.swaggerhub.com/apis/swagger-hub/registry-api/1.0.66#/APIs/getApiVersions)",
  type: "source",
  dedupe: "unique",
  version: "0.0.1",
};
