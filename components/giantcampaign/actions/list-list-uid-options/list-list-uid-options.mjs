import giantcampaign from "../../giantcampaign.app.mjs";

export default {
  key: "giantcampaign-list-list-uid-options",
  name: "List List UID Options",
  description: "Retrieves available options for the List UID field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    giantcampaign,
    page: {
      type: "integer",
      label: "Page",
      description: "The page of results to retrieve.",
      min: 0,
      default: 0,
    },
  },
  async run({ $ }) {
    const options = await giantcampaign.propDefinitions.listUid.options.call(this.giantcampaign, {
      page: this.page,
    });
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
