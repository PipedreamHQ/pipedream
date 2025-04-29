import { createBackendClient } from "../../dist/server/server/index.js";

const client = createBackendClient({
  environment: "development",
  credentials: {
    clientId: "not-empty",
    clientSecret: "not-empty",
  },
});
console.log("sdk version: " + client.version);
