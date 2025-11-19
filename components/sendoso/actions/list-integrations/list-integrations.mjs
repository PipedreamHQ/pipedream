import sendoso from "../../sendoso.app.mjs";

export default {
  key: "sendoso-list-integrations",
  name: "List Integrations",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  description: "Retrieve a list of available integrations. [See the documentation](https://sendoso.docs.apiary.io/#reference/integration-management)",
  type: "action",
  props: {
    sendoso,
  },
  async run({ $ }) {
    const response = await this.sendoso.listIntegrations({
      $,
    });

    const count = Array.isArray(response) ?
      response.length :
      (response.data?.length || response.integrations?.length || 0);
    $.export("$summary", `Successfully retrieved ${count} integration(s)`);
    return response;
  },
};

