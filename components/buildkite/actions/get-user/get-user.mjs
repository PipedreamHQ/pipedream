// legacy_hash_id: a_1Wiqr1
import { axios } from "@pipedream/platform";

export default {
  key: "buildkite-get-user",
  name: "Get the current user",
  description: "Returns basic details about the user account that sent the request",
  version: "0.1.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    buildkite: {
      type: "app",
      app: "buildkite",
    },
  },
  async run({ $ }) {
    return await axios($, {
      url: "https://api.buildkite.com/v2/user",
      headers: {
        Authorization: `Bearer ${this.buildkite.$auth.api_token}`,
      },
    });
  },
};
