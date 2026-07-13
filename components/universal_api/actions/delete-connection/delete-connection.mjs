import app from "../../universal_api.app.mjs";
import { CONNECTION_SERVICE_IDS } from "../../common/constants.mjs";

export default {
  key: "universal_api-delete-connection",
  name: "Delete Connection",
  description:
    "Permanently delete a connection by ID via the Platform API on Universal API. This is irreversible. Run **List Connections** first to find the connection ID. [See the documentation](https://docs.universalapi.io/reference/revoke-connection).",
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
        "serviceId",
      ],
      options: CONNECTION_SERVICE_IDS,
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
