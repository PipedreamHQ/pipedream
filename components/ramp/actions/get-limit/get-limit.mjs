import ramp from "../../ramp.app.mjs";

export default {
  key: "ramp-get-limit",
  name: "Get Limit",
  description: "Retrieve a single Ramp spend limit by ID. Run the **List Limits** action first to find a valid limit ID. Example: given a limit id from **List Limits**, returns the limit's display name, state (e.g. `ACTIVE`), balance, spend program, and spending restrictions. [See the documentation](https://docs.ramp.com/developer-api/v1/api/funds).",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    ramp,
    limitId: {
      type: "string",
      label: "Limit ID",
      description: "The ID of the spend limit to retrieve — a UUID, e.g. `dcd0f7a8-557d-4dc5-bb12-49297c3abfdd`. Run the **List Limits** action to find this value.",
    },
  },
  async run({ $ }) {
    const response = await this.ramp.getLimit({
      $,
      limitId: this.limitId,
    });
    $.export("$summary", `Successfully retrieved limit ${this.limitId}`);
    return response;
  },
};
