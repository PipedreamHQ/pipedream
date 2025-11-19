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
    limit: {
      propDefinition: [
        sendoso,
        "limit",
      ],
    },
    offset: {
      propDefinition: [
        sendoso,
        "offset",
      ],
    },
  },
  async run({ $ }) {
    const params = {};
    if (this.limit) params.limit = this.limit;
    if (this.offset) params.offset = this.offset;

    const response = await this.sendoso.listIntegrations({
      $,
      params,
    });

    const count = Array.isArray(response) ?
      response.length :
      (response.data?.length || response.integrations?.length || 0);
    $.export("$summary", `Successfully retrieved ${count} integration(s)`);
    return response;
  },
};

