import { ConfigurationError } from "@pipedream/platform";
import pingback from "../../pingback.app.mjs";

export default {
  name: "Get Subscriber",
  description: "Get a subscriber by email [See the documentation](https://developer.pingback.com/docs/api/get-subscriber)",
  key: "pingback-get-subscriber",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    pingback,
    email: {
      propDefinition: [
        pingback,
        "email",
      ],
    },
  },
  async run({ $ }) {
    try {
      const response = await this.pingback.getSubscriber({
        $,
        email: this.email,
      });

      $.export("$summary", `Subscriber retrieved successfully with email: ${response.data.data.email}`);
      return response;
    } catch ({ response }) {
      throw new ConfigurationError(response.data.error);
    }
  },
};
