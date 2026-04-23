import pipedriveApp from "../../pipedrive.app.mjs";

export default {
  key: "pipedrive-get-deal",
  name: "Get Deal",
  description: "Get a deal by its ID. [See the documentation](https://developers.pipedrive.com/docs/api/v1/Deals)",
  version: "0.0.2",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    pipedriveApp,
    dealId: {
      propDefinition: [
        pipedriveApp,
        "dealId",
      ],
      description: "The ID of the deal to get details for",
      optional: false,
    },
  },
  async run({ $ }) {
    const response = await this.pipedriveApp.getDeal(this.dealId);
    $.export("$summary", `Successfully retrieved deal with ID ${this.dealId}`);
    return response;
  },
};
