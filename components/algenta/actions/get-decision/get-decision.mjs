import { ConfigurationError } from "@pipedream/platform";
import algenta from "../../algenta.app.mjs";

export default {
  key: "algenta-get-decision",
  name: "Get Decision",
  description: "Fetch a logged decision record from Algenta, including its execution status, policy snapshot, and audit fields. [See the documentation](https://docs.algenta.ai/http-api).",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: false,
    readOnlyHint: true,
  },
  props: {
    algenta,
    decisionId: {
      propDefinition: [
        algenta,
        "decisionId",
      ],
    },
  },
  async run({ $ }) {
    if (!this.decisionId) {
      throw new ConfigurationError("A **Decision ID** is required.");
    }

    const decision = await this.algenta.getDecision(this.decisionId);

    $.export("$summary", `Successfully fetched decision ${decision.id}`);
    return decision;
  },
};
