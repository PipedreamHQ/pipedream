// x-pd-ai: optimized
import superCarl from "../../super_carl.app.mjs";

export default {
  key: "super_carl-get-communication",
  name: "Get Communication",
  description: "Fetch a Super Carl communication record, normalized status, recent events, task metadata, and artifact URLs after **Send Communication**. Use Wait Milliseconds when a workflow should pause for delivery progress. [See the documentation](https://supercarl.ai/docs#endpoints-communications)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    superCarl,
    communicationId: {
      propDefinition: [
        superCarl,
        "communicationId",
      ],
    },
    waitMs: {
      propDefinition: [
        superCarl,
        "waitMs",
      ],
    },
    waitUntil: {
      propDefinition: [
        superCarl,
        "waitUntil",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.superCarl.getCommunication({
      $,
      communicationId: this.communicationId,
      params: {
        wait_ms: this.waitMs,
        wait_until: this.waitUntil,
      },
    });

    $.export("$summary", `Communication ${this.communicationId} is ${response?.status || "unknown"}.`);
    return response;
  },
};
