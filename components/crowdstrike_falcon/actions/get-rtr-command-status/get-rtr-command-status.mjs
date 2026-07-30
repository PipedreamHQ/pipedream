import crowdstrikeFalcon from "../../crowdstrike_falcon.app.mjs";

export default {
  key: "crowdstrike_falcon-get-rtr-command-status",
  name: "Get RTR Command Status",
  description: "Retrieve the status and output of a Real-Time Response command via GET /real-time-response/entities/command/v1, returning stdout, stderr and completion status. Provide the cloud_request_id returned by **Run RTR Command**. Requires an RTR entitlement. [See the documentation](https://developer.crowdstrike.com/api-reference/collections/real-time-response/#rtr_checkcommandstatus).",
  version: "0.0.1",
  type: "action",
  annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    openWorldHint: true,
  },
  props: {
    crowdstrikeFalcon,
    cloudRequestId: {
      type: "string",
      label: "Cloud Request ID",
      description: "The cloud_request_id returned by **Run RTR Command**.",
    },
    sequenceId: {
      type: "integer",
      label: "Sequence ID",
      description: "Sequence ID for paging through a long command result. Default: 0.",
      optional: true,
      default: 0,
      min: 0,
    },
  },
  async run({ $ }) {
    const response = await this.crowdstrikeFalcon.getRtrCommandStatus({
      $,
      params: {
        cloud_request_id: this.cloudRequestId,
        sequence_id: this.sequenceId ?? 0,
      },
    });

    const result = response.resources?.[0];
    const complete = result?.complete ?? false;
    $.export("$summary", `RTR command ${this.cloudRequestId} - ${complete
      ? "complete"
      : "pending"}`);
    return response;
  },
};
