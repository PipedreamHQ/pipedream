// x-pd-ai: optimized
import superCarl from "../../super_carl.app.mjs";

export default {
  key: "super_carl-cancel-communication",
  name: "Cancel Communication",
  description: "Cancel a queued or in-progress Super Carl communication. Use this when a workflow needs to stop delivery before the communication reaches a terminal status. [See the documentation](https://supercarl.ai/docs#endpoints-communications)",
  version: "0.0.1",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
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
    reason: {
      type: "string",
      label: "Reason",
      description: "Optional cancellation reason stored with the communication event log, for example `Duplicate outreach detected`.",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.superCarl.cancelCommunication({
      $,
      communicationId: this.communicationId,
      data: {
        reason: this.reason,
      },
    });

    $.export("$summary", `Cancelled communication ${this.communicationId}.`);
    return response;
  },
};
