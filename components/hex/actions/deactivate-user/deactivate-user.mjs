import { ConfigurationError } from "@pipedream/platform";
import hex from "../../hex.app.mjs";

export default {
  key: "hex-deactivate-user",
  name: "Deactivate User",
  description: "Deactivate a user. [See the documentation](https://learn.hex.tech/docs/api/api-reference#operation/DeactivateUser)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    hex,
    userId: {
      propDefinition: [
        hex,
        "userId",
      ],
    },
  },
  async run({ $ }) {
    try {
      const response = await this.hex.deactivateUser({
        $,
        userId: this.userId,
      });

      $.export("$summary", `Successfully deactivated user with ID: ${this.userId}`);
      return response;
    } catch ({ response }) {
      throw new ConfigurationError(response.data.reason);
    }
  },
};
