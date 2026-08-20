import ramp from "../../ramp.app.mjs";
import { v4 as uuidv4 } from "uuid";

export default {
  key: "ramp-terminate-limit",
  name: "Terminate Limit",
  description: "Permanently terminate a Ramp spend limit by ID. This is irreversible and runs as a deferred task. Run the **List Limits** action to find the limit ID. Example: given a limit id from **List Limits**, submits a deferred termination and returns a task id (e.g. `{ \"id\": \"82b8859a-1145-497c-87c3-8713fedd46ef\" }`). [See the documentation](https://docs.ramp.com/developer-api/v1/api/funds).",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    ramp,
    limitId: {
      type: "string",
      label: "Limit ID",
      description: "The ID of the spend limit to terminate — a UUID, e.g. `dcd0f7a8-557d-4dc5-bb12-49297c3abfdd`. Run the **List Limits** action to find this value.",
    },
  },
  async run({ $ }) {
    const response = await this.ramp.terminateLimit({
      $,
      limitId: this.limitId,
      data: {
        idempotency_key: uuidv4(),
      },
    });
    $.export("$summary", `Successfully requested termination of limit ${this.limitId}`);
    return response;
  },
};
