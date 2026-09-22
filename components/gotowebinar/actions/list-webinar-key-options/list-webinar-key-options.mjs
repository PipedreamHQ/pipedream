import gotowebinar from "../../gotowebinar.app.mjs";

export default {
  key: "gotowebinar-list-webinar-key-options",
  name: "List Webinar Key Options",
  description: "Retrieves available options for the Webinar Key field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    gotowebinar,
    page: {
      type: "integer",
      label: "Page",
      description: "The page of results to retrieve.",
      min: 0,
      default: 0,
    },
  },
  async run({ $ }) {
    const options = await gotowebinar.propDefinitions.webinarKey.options.call(this.gotowebinar, {
      page: this.page,
    });
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
