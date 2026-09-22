import upsales from "../../upsales.app.mjs";

export default {
  key: "upsales-list-nps-id-options",
  name: "List NPS ID Options",
  description: "Retrieves available options for the NPS ID field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    upsales,
    page: {
      type: "integer",
      label: "Page",
      description: "The page of results to retrieve.",
      min: 0,
      default: 0,
    },
  },
  async run({ $ }) {
    const options = await upsales.propDefinitions.npsId.options.call(this.upsales, {
      page: this.page,
    });
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
