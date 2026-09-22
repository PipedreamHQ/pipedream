import buddee from "../../buddee.app.mjs";

export default {
  key: "buddee-list-time-registration-type-id-options",
  name: "List Time Registration Type ID Options",
  description: "Retrieves available options for the Time Registration Type ID field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    buddee,
    page: {
      type: "integer",
      label: "Page",
      description: "The page of results to retrieve.",
      min: 0,
      default: 0,
    },
  },
  async run({ $ }) {
    const options = await buddee.propDefinitions.timeRegistrationTypeId.options.call(this.buddee, {
      page: this.page,
    });
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
