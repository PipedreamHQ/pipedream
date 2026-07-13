import app from "../../universal_api.app.mjs";
import { CONNECTION_SERVICE_IDS } from "../../common/constants.mjs";

export default {
  key: "universal_api-get-connection",
  name: "Get Connection",
  description:
    "Retrieve a single connection by ID from the Platform API on Universal API. Run **List Connections** first to discover valid IDs. [See the documentation](https://docs.universalapi.io/reference/get-connection).",
  version: "0.0.1",
  type: "action",
  annotations: {
    readOnlyHint: true,
    destructiveHint: false,
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
    const response = await this.app.getConnection({
      $,
      universalApi: this.universalApi,
      serviceId: this.serviceId,
    });
    $.export("$summary", `Successfully retrieved connection ${this.universalApi} ${this.serviceId}`);
    return response;
  },
};
