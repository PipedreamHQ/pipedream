import postgrid from "../../postgrid.app.mjs";

export default {
  key: "postgrid-list-return-envelope-id-options",
  name: "List Return Envelope Options",
  description: "Retrieves available options for the Return Envelope field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    postgrid,
    page: {
      type: "integer",
      label: "Page",
      description: "The page of results to retrieve.",
      min: 0,
      default: 0,
    },
  },
  async run({ $ }) {
    const options = await postgrid.propDefinitions.returnEnvelopeId.options.call(this.postgrid, {
      page: this.page,
    });
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
