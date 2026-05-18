import dolibarr from "../../dolibarr.app.mjs";

export default {
  key: "dolibarr-list-third-party-id-options",
  name: "List Third Party ID Options",
  description: "Retrieves available options for the Third Party ID field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    dolibarr,
    page: {
      type: "integer",
      label: "Page",
      description: "The page of results to retrieve.",
      min: 0,
      default: 0,
    },
  },
  async run({ $ }) {
    const options = await dolibarr.propDefinitions.thirdPartyId.options.call(this.dolibarr, {
      page: this.page,
    });
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
