import { ConfigurationError } from "@pipedream/platform";
import algenta from "../../algenta.app.mjs";

export default {
  key: "algenta-execute-decision",
  name: "Execute Decision",
  description: "Execute a logged decision through Algenta's governed execution plane and return the execution receipt. The engine enforces the active execution policy (idempotency, confidence, and risk-floor gates) and delivers the decision payload to the provided webhook URL. [See the documentation](https://docs.algenta.ai/sdks/typescript).",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    algenta,
    decisionId: {
      propDefinition: [
        algenta,
        "decisionId",
      ],
    },
    webhookUrl: {
      propDefinition: [
        algenta,
        "webhookUrl",
      ],
    },
    timeoutSeconds: {
      propDefinition: [
        algenta,
        "timeoutSeconds",
      ],
    },
    metadata: {
      propDefinition: [
        algenta,
        "metadata",
      ],
    },
  },
  async run({ $ }) {
    if (!this.decisionId) {
      throw new ConfigurationError("A **Decision ID** is required.");
    }
    if (!this.webhookUrl) {
      throw new ConfigurationError("A **Webhook URL** is required.");
    }

    const receipt = await this.algenta.executeDecision(this.decisionId, {
      webhook_url: this.webhookUrl,
      timeout_seconds: this.timeoutSeconds,
      metadata: this.metadata,
    });

    $.export("$summary", `Successfully executed decision ${receipt.decision_id} (status: ${receipt.execution_status})`);
    return receipt;
  },
};
