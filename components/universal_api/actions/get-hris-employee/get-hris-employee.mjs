import app from "../../universal_api.app.mjs";
import { HRIS_SERVICE_IDS } from "../../common/constants.mjs";

export default {
  key: "universal_api-get-hris-employee",
  name: "Get HRIS Employee",
  description:
    "Retrieve a single HRIS employee by ID from Universal API. Run **List HRIS Employees** first to discover valid employee IDs. [See the documentation](https://docs.universalapi.io/reference/get-employee).",
  version: "0.0.1",
  type: "action",
  annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    openWorldHint: true,
  },
  props: {
    app,
    employeeId: {
      propDefinition: [
        app,
        "employeeId",
      ],
    },
    serviceId: {
      propDefinition: [
        app,
        "serviceId",
      ],
      description:
        "Optional `x-uapi-service-id` header to pick the integration when a consumer has multiple active HRIS integrations. One of: `bamboohr`, `google-workspace`, `azure-active-directory`, `catalyst-one`, `haileyhr`, `deel`, `sap`.",
      options: HRIS_SERVICE_IDS,
    },
  },
  async run({ $ }) {
    const response = await this.app.getHrisEmployee({
      $,
      employeeId: this.employeeId,
      serviceId: this.serviceId,
    });
    $.export("$summary", `Successfully retrieved HRIS employee ${this.employeeId}`);
    return response;
  },
};
