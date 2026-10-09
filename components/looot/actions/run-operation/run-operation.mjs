import { ConfigurationError } from "@pipedream/platform";
import looot from "../../looot.app.mjs";
import { resolveIdempotencyKey } from "../../common/utils.mjs";

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
      description: "The same key with the same input returns the first run and never pays twice. Example: `lead-1042`. When empty, the key is derived from the workflow event, the endpoint and the input, so a retried or replayed step reuses the first run. Set your own key to force a new run for the same event, for example after a top up. Outside a workflow event there is nothing stable to derive from, so an empty key becomes a random one and a repeated call is not deduplicated.",
      optional: true,
    },
    fallback: {
      type: "boolean",
      label: "Fallback",
      description: "Try the next provider of the same job when the first finds nothing. Example: `true`. Only works with `job:` IDs.",
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
      description: "How long to wait for the result before returning a run ID. `0` returns at once. Use **Get Run** to read the result later. Never call **Run Operation** again to poll.",
      min: 0,
      max: 60,
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
    // One key per logical execution: every retry of this step for the same
    // event sends the same key, and looot returns the first run without
    // charging again.
    const {
      key: idempotencyKey, source,
    } = resolveIdempotencyKey({
      userKey: this.idempotencyKey,
      context: $.context,
      request: {
        endpointId: this.endpointId,
        input: this.input,
        fallback,
      },
    });
    $.export("idempotencyKey", idempotencyKey);
    $.export("idempotencyKeySource", source);
    const response = await this.looot.createRun({
      $,
      data: {
        endpointId: this.endpointId,
        input: this.input,
        idempotencyKey,
        wait: this.wait,
        fallback,
      },
    });
    const runId = response?.runId ?? response?.id;
    $.export("$summary", `${response?.replayed
      ? "Reused"
      : "Started"} run${runId
      ? ` ${runId}`
      : ""} for ${this.endpointId}`);
    return response;
  },
};
