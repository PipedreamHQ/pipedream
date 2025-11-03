import hubspot from "../../hubspot.app.mjs";

export default {
  key: "hubspot-retrieve-workflows",
  name: "Retrieve Workflows",
  description: "Retrieve a list of all workflows. [See the documentation](https://developers.hubspot.com/docs/api-reference/legacy/create-manage-workflows-v3/get-automation-v3-workflows)",
  version: "0.0.5",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    hubspot,
  },
  async run({ $ }) {
    const response = await this.hubspot.listWorkflows({
      $,
    });
    $.export("$summary", `Successfully retrieved ${response.results?.length || 0} workflows`);
    return response;
  },
};
