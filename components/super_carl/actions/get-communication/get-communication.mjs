import superCarl from "../../super_carl.app.mjs";
export default {
  key: "super_carl-get-communication",
  name: "Get Communication",
  description: "Fetch a Super Carl communication record, normalized status, recent events, task metadata, and artifact URLs after **Create Communication Draft** or **Send Communication**. [See the documentation](https://supercarl.ai/docs/endpoints)",
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
  },
  async run({ $ }) {
    const response = await this.superCarl.getCommunication({
      $,
      communicationId: this.communicationId,
    });

    $.export("$summary", `Communication ${this.communicationId} is ${response?.status || "unknown"}.`);
    return response;
  },
};
