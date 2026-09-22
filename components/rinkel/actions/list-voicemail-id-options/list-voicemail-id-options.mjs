import rinkel from "../../rinkel.app.mjs";

export default {
  key: "rinkel-list-voicemail-id-options",
  name: "List Voicemail ID Options",
  description: "Retrieves available options for the Voicemail ID field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    rinkel,
    page: {
      type: "integer",
      label: "Page",
      description: "The page of results to retrieve.",
      min: 0,
      default: 0,
    },
  },
  async run({ $ }) {
    const options = await rinkel.propDefinitions.voicemailId.options.call(this.rinkel, {
      page: this.page,
    });
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
