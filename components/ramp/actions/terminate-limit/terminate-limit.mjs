// x-pd-ai: optimized
import ramp from "../../ramp.app.mjs";

export default {
  key: "ramp-terminate-limit",
  name: "Terminate Limit",
  description: "Permanently terminate a Ramp spend limit by ID. This is irreversible and takes effect immediately. Run the **List Limits** action to find the limit ID. Example: given a limit id from **List Limits**, terminates that limit and returns its final (terminated) state. [See the documentation](https://docs.ramp.com/developer-api/v1/api/funds)",
  version: "0.0.2",
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
    });
    $.export("$summary", `Successfully terminated limit ${this.limitId}`);
    return response;
  },

};
