import adrapid from "../../adrapid.app.mjs";

export default {
  key: "adrapid-list-banner-id-options",
  name: "List Banner Id Options",
  description: "Retrieves available options for the Banner Id field.",
  version: "0.0.2",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    adrapid,
    page: {
      type: "integer",
      label: "Page",
      description: "The page of results to retrieve.",
      optional: true,
      default: 0,
    },
  },
  async run({ $ }) {
    const options = await adrapid.propDefinitions.bannerId.options
      .call(this.adrapid, {
        page: this.page,
      });
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
