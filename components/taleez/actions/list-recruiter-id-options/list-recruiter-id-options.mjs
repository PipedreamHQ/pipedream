import taleez from "../../taleez.app.mjs";

export default {
  key: "taleez-list-recruiter-id-options",
  name: "List Recruiter ID Options",
  description: "Retrieves available options for the Recruiter ID field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    taleez,
    page: {
      type: "integer",
      label: "Page",
      description: "The page of results to retrieve.",
      min: 0,
      default: 0,
    },
  },
  async run({ $ }) {
    const options = await taleez.propDefinitions.recruiterId.options.call(this.taleez, {
      page: this.page,
    });
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
