import sendoso from "../../sendoso.app.mjs";

export default {
  key: "sendoso-get-integration-status",
  name: "Get Integration Status",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  description: "Retrieve the status of a specific integration. [See the documentation](https://sendoso.docs.apiary.io/#reference/integration-management)",
  type: "action",
  props: {
    sendoso,
    integrationId: {
      type: "string",
      label: "Integration ID",
      description: "The ID of the integration.",
    },
  },
  async run({ $ }) {
    const { integrationId } = this;

    const response = await this.sendoso.getIntegrationStatus({
      $,
      integrationId,
    });

    $.export("$summary", `Successfully retrieved status for integration ID: ${integrationId}`);
    return response;
  },
};

