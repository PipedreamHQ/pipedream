import { ConfigurationError } from "@pipedream/platform";
import { randomUUID } from "crypto";
import looot from "../../looot.app.mjs";

export default {
  key: "looot-run-operation",
  name: "Run Operation",
  description: "Run an endpoint or job and spend prepaid looot credit. A failed call costs nothing. Use **Get Operation** first to read the exact input field names and the price. [See the documentation](https://docs.looot.ai)",
  version: "0.0.1",
  type: "action",
  ai: "optimized",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    looot,
    endpointId: {
      propDefinition: [
        looot,
        "endpointId",
      ],
    },
    input: {
      type: "object",
      label: "Input",
      description: "The input object. Use the exact field names that **Get Operation** lists. Example: `{\"fullName\": \"Jane Doe\", \"companyDomain\": \"acme.com\"}`.",
    },
    idempotencyKey: {
      type: "string",
      label: "Idempotency Key",
      description: "The same key with the same input never pays twice. A random key is generated when empty. Example: `lead-1042`.",
      optional: true,
    },
    fallback: {
      type: "boolean",
      label: "Fallback",
      description: "Try the next provider of the same job when the first finds nothing. Only works with `job:` IDs.",
      optional: true,
    },
    maxCostUsd: {
      type: "string",
      label: "Max Cost (USD)",
      description: "Cap for the whole fallback route, in dollars. Example: `0.25`. Needs **Fallback** on.",
      optional: true,
    },
    wait: {
      type: "integer",
      label: "Wait (Seconds)",
      description: "How long to wait for the result before returning a run ID. `0` returns at once. Use **Get Run** to read the result later.",
      min: 0,
      default: 20,
      optional: true,
    },
  },
  async run({ $ }) {
    let fallback = this.fallback;
    if (this.maxCostUsd) {
      const maxCostUsd = Number(this.maxCostUsd);
      if (!Number.isFinite(maxCostUsd) || maxCostUsd <= 0) {
        throw new ConfigurationError("Max Cost (USD) must be a number above 0, for example `0.25`.");
      }
      if (!this.fallback) {
        throw new ConfigurationError("Max Cost (USD) needs Fallback to be on.");
      }
      fallback = {
        enabled: true,
        maxCostUsd,
      };
    }
    const response = await this.looot.createRun({
      $,
      data: {
        endpointId: this.endpointId,
        input: this.input,
        idempotencyKey: this.idempotencyKey || `pipedream-${randomUUID()}`,
        wait: this.wait,
        fallback,
      },
    });
    $.export("$summary", `Started run ${response?.id ?? response?.runId ?? ""} for ${this.endpointId}`.replace("  ", " "));
    return response;
  },
};
