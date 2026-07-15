import app from "../../universal_api.app.mjs";
import { CONNECTION_SERVICE_IDS } from "../../common/constants.mjs";

export default {
  key: "universal_api-get-connection",
  name: "Get Connection",
  description:
    "Retrieve a single connection identified by `universalApi` and `serviceId` from the Platform API on Universal API. Run **List Connections** first to find the correct `serviceId`. [See the documentation](https://docs.universalapi.io/reference/get-connection).",
  version: "0.0.1",
  type: "action",
  annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    openWorldHint: true,
  },
  props: {
    app,
    consumerId: {
      propDefinition: [
        app,
        "consumerId",
      ],
    },
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
      description: "The service ID that, together with `universalApi`, identifies the connection (e.g. `kandji`, `jamf`, `teamtailor`).",
      optional: false,
      options: CONNECTION_SERVICE_IDS,
    },
  },
  async run({ $ }) {
    const response = await this.app.getConnection({
      $,
      consumerId: this.consumerId,
      universalApi: this.universalApi,
      serviceId: this.serviceId,
    });
    $.export("$summary", `Successfully retrieved connection ${this.universalApi} ${this.serviceId}`);
    return response;
  },
};
