import app from "../../universal_api.app.mjs";

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
    consumerId: {
      propDefinition: [
        app,
        "consumerId",
      ],
    },
    employeeId: {
      propDefinition: [
        app,
        "employeeId",
      ],
    },
    serviceId: {
      propDefinition: [
        app,
        "hrisServiceId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.getHrisEmployee({
      $,
      consumerId: this.consumerId,
      employeeId: this.employeeId,
      serviceId: this.serviceId,
    });
    $.export("$summary", `Successfully retrieved HRIS employee ${this.employeeId}`);
    return response;
  },
};
