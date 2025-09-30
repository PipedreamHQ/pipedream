// legacy_hash_id: a_74ibvw
import { axios } from "@pipedream/platform";

export default {
  key: "honeybadger-get-projects",
  name: "Get projects",
  description: "Get a project list",
  version: "0.1.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    honeybadger: {
      type: "app",
      app: "honeybadger",
    },
  },
  async run({ $ }) {
    return await axios($, {
      url: "https://app.honeybadger.io/v2/projects",
      headers: {
        "Accept": "application/json",
      },
      auth: {
        username: `${this.honeybadger.$auth.api_token}`,
        password: "",
      },
    });
  },
};
