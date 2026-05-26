import accelo from "../../accelo.app.mjs";

export default {
  key: "accelo-list-request-type-id-options",
  name: "List Request Type ID Options",
  description: "Retrieves available options for the Request Type ID field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    accelo,
    page: {
      propDefinition: [
        accelo,
        "page",
      ],
    },
  },
  async run({ $ }) {
    const options = await accelo.propDefinitions.requestTypeId.options
      .call(this.accelo, {
        page: this.page,
      });
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
