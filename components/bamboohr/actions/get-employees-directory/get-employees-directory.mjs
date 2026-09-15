import bamboohr from "../../bamboohr.app.mjs";

export default {
  key: "bamboohr-get-employees-directory",
  name: "Get Employees Directory",
  description: "Get the company employee directory from BambooHR (GET /employees/directory). Returns the company-configured fieldset for every employee in the published directory; filter client-side, or use `fields` to keep the response small. The directory may omit inactive/former employees and anyone the company excludes from sharing, so it is not an authoritative employee roster. Use this to discover employee IDs before calling **Get Employee**, **Update Employee**, or time-tracking actions. [See the documentation](https://documentation.bamboohr.com/reference/get-employees-directory)",
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
    onlyCurrent: {
      type: "boolean",
      label: "Only Current",
      description: "When true (default), returns only currently-active employees.",
      optional: true,
    },
    fields: {
      type: "string",
      label: "Fields",
      description: "Comma-separated field names to keep on each employee (e.g. `id,displayName,jobTitle,workEmail`), applied client-side after the API call. `id` is always included. The directory returns every company-configured field for every employee (often including large signed photo URLs), so a large company's full response can exceed the model's context — pass this to keep only what you need. Omit to get the full response unchanged.",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.bamboohr.getEmployeesDirectory({
      $,
      params: {
        onlyCurrent: this.onlyCurrent,
      },
    });
    const employees = response?.employees ?? [];
    $.export("$summary", `Retrieved ${employees.length} employee${employees.length === 1
      ? ""
      : "s"} from directory`);
    if (!this.fields) {
      return response;
    }
    const keep = new Set([
      "id",
      ...this.fields.split(",").map((f) => f.trim())
        .filter(Boolean),
    ]);
    const filteredEmployees = employees.map((employee) =>
      Object.fromEntries(Object.entries(employee).filter(([
        key,
      ]) => keep.has(key))));
    return {
      ...response,
      employees: filteredEmployees,
    };
  },
};
