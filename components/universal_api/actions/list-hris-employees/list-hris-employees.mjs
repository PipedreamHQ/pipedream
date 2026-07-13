import app from "../../universal_api.app.mjs";
import { HRIS_SERVICE_IDS } from "../../common/constants.mjs";

export default {
  key: "universal_api-list-hris-employees",
  name: "List HRIS Employees",
  description:
    "List employees from the connected HRIS integration on Universal API. Returns a cursor-paginated array of employee objects; use the returned IDs with **Get HRIS Employee**. Provide `serviceId` only when the consumer has multiple active HRIS integrations. [See the documentation](https://docs.universalapi.io/reference/list-employees).",
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
    cursor: {
      propDefinition: [
        app,
        "cursor",
      ],
    },
    limit: {
      propDefinition: [
        app,
        "limit",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.listHrisEmployees({
      $,
      serviceId: this.serviceId,
      group: this.group,
      cursor: this.cursor,
      limit: this.limit,
    });
    $.export("$summary", `Successfully retrieved ${response.data?.length ?? 0} HRIS employee(s)`);
    return response;
  },
};
