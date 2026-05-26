import telnyx from "../../telnyx.app.mjs";

export default {
  key: "telnyx-list-phone-number-options",
  name: "List Phone Number Options",
  description: "Retrieves available options for the Phone Number field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    telnyx,
    page: {
      type: "integer",
      label: "Page",
      description: "The page of results to retrieve.",
      min: 0,
      default: 0,
    },
  },
  async run({ $ }) {
    const options = await telnyx.propDefinitions.phoneNumber.options.call(this.telnyx, {
      page: this.page,
    });
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
