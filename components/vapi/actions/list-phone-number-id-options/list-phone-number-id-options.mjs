import vapi from "../../vapi.app.mjs";

export default {
  key: "vapi-list-phone-number-id-options",
  name: "List Phone Number ID Options",
  description: "Retrieves available options for the Phone Number ID field. [See the documentation](https://docs.vapi.ai/api-reference/phone-numbers/list)",
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
      description: "The timestamp to filter phone numbers by creation date (less than). Example: `2026-01-01T00:00:00Z`",
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      options, context,
    } = await vapi.propDefinitions.phoneNumberId.options.call(this.vapi, {
      prevContext: {
        createdAtLt: this.createdAtLt,
      },
    });
    $.export("$summary", `Successfully retrieved ${options?.length ?? 0} option${options?.length === 1
      ? ""
      : "s"}`);
    return {
      options,
      context,
    };
  },
};
