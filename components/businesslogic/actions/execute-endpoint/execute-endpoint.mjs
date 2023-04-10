import businesslogic from "../../businesslogic.app.mjs";

export default {
  key: "businesslogic-execute-endpoint",
  name: "Execute Endpoint",
  description: "Executes provided input parameters in the uploaded Excel document to retrieve the calculated output.",
  version: "0.0.1",
  type: "action",
  props: {
    businesslogic,
  },
  async run({ $ }) {
    const response = await this.businesslogic.executeEndpoint({
      $,
    });
    $.export("$summary", "Successfully executed webservice.");
    return response;
  },
};
