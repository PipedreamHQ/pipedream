import elastic_email from "../../elastic_email.app.mjs";

export default {
  key: "elastic_email-list-segment-names-options",
  name: "List Segment Names Options",
  description: "Retrieves available options for the Segment Names field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    elastic_email,
    page: {
      type: "integer",
      label: "Page",
      description: "The page of results to retrieve.",
      min: 0,
      default: 0,
    },
  },
  async run({ $ }) {
    const options = await elastic_email.propDefinitions.segmentNames.options
      .call(this.elastic_email, {
        page: this.page,
      });
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
