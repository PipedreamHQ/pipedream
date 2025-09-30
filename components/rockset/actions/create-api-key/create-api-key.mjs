// legacy_hash_id: a_RAiaRQ
import { axios } from "@pipedream/platform";

export default {
  key: "rockset-create-api-key",
  name: "Create API Key",
  description: "Create a new API key for the authenticated user.",
  version: "0.1.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    rockset: {
      type: "app",
      app: "rockset",
    },
    name: {
      type: "string",
      description: "Descriptive label for the API key.",
    },
  },
  async run({ $ }) {
    const data = {
      "name": this.name,
    };

    return await axios($, {
      method: "POST",
      url: "https://api.rs2.usw2.rockset.com/v1/orgs/self/users/self/apikeys",
      headers: {
        "Authorization": `ApiKey ${this.rockset.$auth.apikey}`,
      },
      data,
    });
  },
};
