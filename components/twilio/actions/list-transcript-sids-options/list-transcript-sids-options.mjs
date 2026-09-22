import twilio from "../../twilio.app.mjs";

export default {
  key: "twilio-list-transcript-sids-options",
  name: "List Transcript SIDs Options",
  description: "Retrieves available options for the Transcript SIDs field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    twilio,
    page: {
      type: "integer",
      label: "Page",
      description: "The page of results to retrieve.",
      min: 0,
      default: 0,
    },
  },
  async run({ $ }) {
    const options = await twilio.propDefinitions.transcriptSids.options.call(this.twilio, {
      page: this.page,
    });
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
