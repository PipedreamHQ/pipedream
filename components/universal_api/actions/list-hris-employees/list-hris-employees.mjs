import app from "../../universal_api.app.mjs";
import { HRIS_SERVICE_IDS } from "../../common/constants.mjs";

export default {
  key: "universal_api-list-hris-employees",
  name: "List HRIS Employees",
  description:
    "List employees from the connected HRIS integration on Universal API. Returns an array of employee objects (paginated internally, up to `maxResults`); use the returned IDs with **Get HRIS Employee**. Provide `serviceId` only when the consumer has multiple active HRIS integrations. [See the documentation](https://docs.universalapi.io/reference/list-employees).",
  version: "0.0.1",
  type: "action",
  annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    openWorldHint: true,
  },
  props: {
    app,
    serviceId: {
      propDefinition: [
        app,
        "serviceId",
      ],
      description:
        "Optional `x-uapi-service-id` header to pick the integration when a consumer has multiple active HRIS integrations. One of: `bamboohr`, `google-workspace`, `azure-active-directory`, `catalyst-one`, `haileyhr`, `deel`, `sap`.",
      options: HRIS_SERVICE_IDS,
    },
    group: {
      type: "string",
      label: "Group",
      description: "Filter employees by group name.",
      optional: true,
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
      fn: this.app.listHrisEmployees,
      args: {
        $,
        serviceId: this.serviceId,
        group: this.group,
      },
      maxResults: this.maxResults,
    });
    $.export("$summary", `Successfully retrieved ${data.length} HRIS employee(s)`);
    return {
      data,
      hasMore,
    };
  },
};
