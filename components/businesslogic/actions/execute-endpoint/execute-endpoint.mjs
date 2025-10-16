import businesslogic from "../../businesslogic.app.mjs";

export default {
  key: "businesslogic-execute-endpoint",
  name: "Execute Endpoint",
  description: "Executes provided input parameters in the uploaded Excel document to retrieve the calculated output.",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    businesslogic,
    data: {
      type: "object",
      label: "Data",
      description: "Input parameters for the uploaded Excel document",
    },
  },
  async run({ $ }) {
    const response = await this.businesslogic.executeEndpoint({
      data: this.data,
      $,
    });
    $.export("$summary", "Successfully executed webservice.");
    return response;
  },
};
