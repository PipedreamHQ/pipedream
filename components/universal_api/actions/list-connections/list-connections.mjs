import app from "../../universal_api.app.mjs";
import { LIST_CONNECTION_SERVICE_IDS } from "../../common/constants.mjs";

export default {
  key: "universal_api-list-connections",
  name: "List Connections",
  description:
    "List connections from the Platform API on Universal API. Returns an array (paginated internally, up to `maxResults`); use the returned IDs with **Get Connection**, **Update Connection**, or **Delete Connection**. [See the documentation](https://docs.universalapi.io/reference/list-connections).",
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
      options: LIST_CONNECTION_SERVICE_IDS.filter((item) => item !== "shipment"),
    },
    maxResults: {
      propDefinition: [
        app,
        "maxResults",
      ],
    },
  },
  async run({ $ }) {
    const {
      data, hasMore,
    } = await this.app.paginate({
      fn: this.app.listConnections,
      args: {
        $,
        universalApi: this.universalApi,
        serviceId: this.serviceId,
      },
      maxResults: this.maxResults,
    });
    $.export("$summary", `Successfully retrieved ${data.length} connection(s)`);
    return {
      data,
      hasMore,
    };
  },
};
