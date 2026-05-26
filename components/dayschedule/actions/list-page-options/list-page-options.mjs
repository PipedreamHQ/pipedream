import dayschedule from "../../dayschedule.app.mjs";

export default {
  key: "dayschedule-list-page-options",
  name: "List Page Options",
  description: "Retrieves available options for the Page field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    dayschedule,
    page: {
      type: "integer",
      label: "Page",
      description: "The page of results to retrieve.",
      min: 0,
      default: 0,
    },
  },
  async run({ $ }) {
    const options = await dayschedule.propDefinitions.page.options.call(this.dayschedule, {
      page: this.page,
    });
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
