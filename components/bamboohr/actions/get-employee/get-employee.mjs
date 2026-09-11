import bamboohr from "../../bamboohr.app.mjs";

export default {
  key: "bamboohr-get-employee",
  name: "Get Employee",
  description: "Get a single employee record (GET /employees/{id}). Only `id` is returned unless you request fields. Use **Get Employees Directory** to find an employee ID. Pass `0` as the ID to fetch the authenticated user. [See the documentation](https://documentation.bamboohr.com/reference/get-employee)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  ai: "optimized",
  props: {
    bamboohr,
    employeeId: {
      propDefinition: [
        bamboohr,
        "employeeId",
      ],
      description: "The employee ID (e.g. `100`). Use `0` for the authenticated user. Run **Get Employees Directory** to discover IDs.",
    },
    fields: {
      type: "string",
      label: "Fields",
      description: "Comma-separated field names/IDs/aliases to return (max 400), e.g. `firstName,lastName,department,workEmail`. Unauthorized fields are silently omitted.",
      optional: true,
    },
    onlyCurrent: {
      type: "boolean",
      label: "Only Current",
      description: "When true, restricts to the employee's current values.",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.bamboohr.getEmployee({
      $,
      employeeId: this.employeeId,
      params: {
        fields: this.fields,
        onlyCurrent: this.onlyCurrent,
      },
    });
    $.export("$summary", `Retrieved employee ${this.employeeId}`);
    return response;
  },
};
