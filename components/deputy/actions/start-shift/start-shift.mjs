import deputy from "../../deputy.app.mjs";

export default {
  key: "deputy-start-shift",
  name: "Start Shift",
  description: "Starts a work shift for a specified employee in Deputy. [See the documentation](https://developer.deputy.com/deputy-docs/reference/startanemployeestimesheetclockon)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    deputy,
    locationId: {
      propDefinition: [
        deputy,
        "locationId",
      ],
    },
    employeeId: {
      propDefinition: [
        deputy,
        "employeeId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.deputy.startTimesheet({
      $,
      data: {
        intOpunitId: this.locationId,
        intEmployeeId: this.employeeId,
      },
    });

    $.export("$summary", `Successfully started work shift for employee ${this.employeeId}`);
    return response;
  },
};
