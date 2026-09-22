import motive from "../../motive.app.mjs";

export default {
  key: "motive-list-driver-company-id-options",
  name: "List Driver Company ID Options",
  description: "Retrieves available options for the Driver Company ID field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    motive,
    page: {
      type: "integer",
      label: "Page",
      description: "The page of results to retrieve.",
      min: 0,
      default: 0,
    },
  },
  async run({ $ }) {
    const options = await motive.propDefinitions.driverCompanyId.options.call(this.motive, {
      page: this.page,
    });
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
