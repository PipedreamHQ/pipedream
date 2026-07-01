import vapi from "../../vapi.app.mjs";

export default {
  key: "vapi-list-squad-id-options",
  name: "List Squad ID Options",
  description: "Retrieves available options for the Squad ID field. [See the documentation](https://docs.vapi.ai/api-reference/squads/list)",
  version: "0.0.3",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    vapi,
    createdAtLt: {
      type: "string",
      label: "Created At (Less Than)",
      description: "The timestamp to filter squads by creation date (less than). Example: `2026-01-01T00:00:00Z`",
      optional: true,
    },
  },
  async run({ $ }) {
    const options = await vapi.propDefinitions.squadId.options.call(this.vapi, {
      prevContext: {
        createdAtLt: this.createdAtLt,
      },
    });
    $.export("$summary", `Successfully retrieved ${options?.length ?? 0} option${options?.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
