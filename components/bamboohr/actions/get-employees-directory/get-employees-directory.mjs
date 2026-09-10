import bamboohr from "../../bamboohr.app.mjs";

export default {
  key: "bamboohr-get-employees-directory",
  name: "Get Employees Directory",
  description: "Get the company employee directory from BambooHR (GET /employees/directory). Returns the company-configured fieldset for every employee in the published directory; filter client-side. The directory may omit inactive/former employees and anyone the company excludes from sharing, so it is not an authoritative employee roster. Use this to discover employee IDs before calling **Get Employee**, **Update Employee**, or time-tracking actions. [See the documentation](https://documentation.bamboohr.com/reference/get-employees-directory)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    bamboohr,
    onlyCurrent: {
      type: "boolean",
      label: "Only Current",
      description: "When true (default), returns only currently-active employees.",
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
    return response;
  },
};
