import samsara from "../../samsara.app.mjs";

export default {
  key: "samsara-list-driver-id-options",
  name: "List Driver Id Options",
  description: "Retrieves available options for the Driver Id field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    samsara,
    page: {
      type: "integer",
      label: "Page",
      description: "The page of results to retrieve.",
      min: 0,
      default: 0,
    },
  },
  async run({ $ }) {
    const options = await samsara.propDefinitions.driverId.options.call(this.samsara, {
      page: this.page,
    });
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
