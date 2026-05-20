import moosend from "../../moosend.app.mjs";

export default {
  key: "moosend-list-mailing-list-id-options",
  name: "List Mailing List ID Options",
  description: "Retrieves available options for the Mailing List ID field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    moosend,
    page: {
      type: "integer",
      label: "Page",
      description: "The page of results to retrieve.",
      min: 0,
      default: 0,
    },
  },
  async run({ $ }) {
    const options = await moosend.propDefinitions.mailingListId.options.call(this.moosend, {
      page: this.page,
    });
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
