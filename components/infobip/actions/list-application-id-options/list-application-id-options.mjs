import infobip from "../../infobip.app.mjs";

export default {
  key: "infobip-list-application-id-options",
  name: "List Application ID Options",
  description: "Retrieves available options for the Application ID field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    infobip,
    page: {
      type: "integer",
      label: "Page",
      description: "The page of results to retrieve.",
      min: 0,
      default: 0,
    },
  },
  async run({ $ }) {
    const options = await infobip.propDefinitions.applicationId.options.call(this.infobip, {
      page: this.page,
    });
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
