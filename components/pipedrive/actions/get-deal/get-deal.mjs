import pipedriveApp from "../../pipedrive.app.mjs";

export default {
  key: "pipedrive-get-deal",
  name: "Get Deal",
  description: "Retrieves a single deal by its ID, including its title, value, currency, status, pipeline and stage IDs, linked person and organization IDs, owner, label IDs and custom fields."
    + " Use **List Deals** to find the ID or to fetch many deals at once. Example: `Deal ID` `1024`."
    + " Custom fields are returned keyed by their 40-character field hash, not their display name."
    + " [See the documentation](https://developers.pipedrive.com/docs/api/v1/Deals#getDeal)",
  version: "0.0.4",
  type: "action",
  ai: "optimized",
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
      description: "The ID of the deal to retrieve, e.g. `1024`. Use **List Deals** to find it (the `id` field).",
      optional: false,
    },
  },
  async run({ $ }) {
    const response = await this.pipedriveApp.getDeal(this.dealId);
    $.export("$summary", `Successfully retrieved deal with ID ${this.dealId}`);
    return response;
  },
};
