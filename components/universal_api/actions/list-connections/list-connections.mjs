import app from "../../universal_api.app.mjs";
import {
  UNIVERSAL_APIS, LIST_CONNECTION_SERVICE_IDS,
} from "../../common/constants.mjs";

export default {
  key: "universal_api-list-connections",
  name: "List Connections",
  description:
    "List connections from the Platform API on Universal API. Returns an array; use the returned IDs with **Get Connection**, **Update Connection**, or **Delete Connection**. [See the documentation](https://docs.universalapi.io/reference/list-connections).",
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
      options: UNIVERSAL_APIS.filter((api) => api !== "shipment"),
    },
    serviceId: {
      propDefinition: [
        app,
        "serviceId",
      ],
      description: "The service ID that, together with `universalApi`, identifies which connections to list (e.g. `kandji`, `jamf`, `teamtailor`).",
      optional: false,
      options: LIST_CONNECTION_SERVICE_IDS,
    },
  },
  async run({ $ }) {
    const response = await this.app.listConnections({
      $,
      consumerId: this.consumerId,
      universalApi: this.universalApi,
      serviceId: this.serviceId,
    });
    const count = response.data?.id
      ? 1
      : response.data?.length ?? 0;
    $.export("$summary", `Successfully retrieved ${count} connection(s)`);
    return response;
  },
};
