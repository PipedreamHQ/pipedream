import dixa from "../../dixa.app.mjs";

export default {
  key: "dixa-list-end-user-id-options",
  name: "List End User Id Options",
  description: "Retrieves available options for the End User Id field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    dixa,
    page: {
      type: "integer",
      label: "Page",
      description: "The page of results to retrieve.",
      min: 0,
      default: 0,
    },
  },
  async run({ $ }) {
    const options = await dixa.propDefinitions.endUserId.options.call(this.dixa, {
      page: this.page,
    });
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
