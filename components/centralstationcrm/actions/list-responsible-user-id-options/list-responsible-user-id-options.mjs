import centralstationcrm from "../../centralstationcrm.app.mjs";

export default {
  key: "centralstationcrm-list-responsible-user-id-options",
  name: "List Responsible User Options",
  description: "Retrieves available options for the Responsible User field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    centralstationcrm,
    page: {
      type: "integer",
      label: "Page",
      description: "The page of results to retrieve.",
      min: 0,
      default: 0,
    },
  },
  async run({ $ }) {
    const options = await centralstationcrm.propDefinitions.responsibleUserId.options
      .call(this.centralstationcrm, {
        page: this.page,
      });
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
