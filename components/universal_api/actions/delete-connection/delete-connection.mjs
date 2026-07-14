import app from "../../universal_api.app.mjs";

export default {
  key: "universal_api-delete-connection",
  name: "Delete Connection",
  description:
    "Permanently delete a connection identified by `universalApi` and `serviceId` via the Platform API on Universal API. This is irreversible. Run **List Connections** first to find the correct `serviceId`. [See the documentation](https://docs.universalapi.io/reference/revoke-connection).",
  version: "0.0.1",
  type: "action",
  annotations: {
    readOnlyHint: false,
    destructiveHint: true,
    openWorldHint: true,
  },
  props: {
    app,
    universalApi: {
      propDefinition: [
        app,
        "universalApi",
      ],
    },
    serviceId: {
      propDefinition: [
        app,
        "connectionServiceId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.deleteConnection({
      $,
      universalApi: this.universalApi,
      serviceId: this.serviceId,
    });
    $.export("$summary", `Successfully deleted connection ${this.universalApi} ${this.serviceId}`);
    return response;
  },
};
