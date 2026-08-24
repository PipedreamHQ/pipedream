// x-pd-ai: optimized
import bonusly from "../../bonusly.app.mjs";

export default {
  key: "bonusly-list-departments",
  name: "List Departments",
  description: "List the distinct departments configured for users in the authenticated caller's company, with a user count for each. Call this first to discover the exact department names accepted by **List Users In Department**, which matches exactly and returns nothing for a misspelled or differently-cased name. [See the documentation](https://docs.bonus.ly/reference/listdepartments)",
  version: "0.0.1",
  type: "action",
  annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    openWorldHint: true,
  },
  props: {
    bonusly,
    search: {
      propDefinition: [
        bonusly,
        "search",
      ],
      description: "Narrow the results to departments whose name starts with this text, e.g. `Eng` matches `Engineering`. This is a prefix match, so it will not match text in the middle of a name. Omit to return every department.",
    },
    pageSize: {
      propDefinition: [
        bonusly,
        "pageSize",
      ],
      description: "Maximum number of departments to return in this page. Defaults to Bonusly's standard page size if omitted.",
    },
    cursor: {
      propDefinition: [
        bonusly,
        "cursor",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.bonusly.listDepartments({
      $,
      search: this.search,
      pageSize: this.pageSize,
      cursor: this.cursor,
    });

    $.export("$summary", `Found ${response.departments?.length ?? 0} department(s)`);
    return response;
  },
};
