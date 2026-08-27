// x-pd-ai: optimized
import bonusly from "../../bonusly.app.mjs";

export default {
  key: "bonusly-list-users-in-department",
  name: "List Users In Department",
  description: "List the users in the authenticated caller's company who belong to a specific department. Use this to enumerate a department's roster - unlike **Search Users**, no search term is required, so it returns every member of the department. [See the documentation](https://docs.bonus.ly/reference/listusersindepartment)",
  version: "0.0.1",
  type: "action",
  annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    openWorldHint: true,
  },
  props: {
    bonusly,
    department: {
      type: "string",
      label: "Department",
      description: "The department to list users for, e.g. `Engineering`. This is an exact match - a partial or differently-cased name returns no users. Use **List Departments** to find the exact names configured for your company.",
    },
    search: {
      propDefinition: [
        bonusly,
        "search",
      ],
      description: "Narrow the department's roster by matching this text against user names or emails, e.g. `john` or `john.smith@company.com`. Omit to return every user in the department.",
    },
    pageSize: {
      propDefinition: [
        bonusly,
        "pageSize",
      ],
      description: "Maximum number of users to return in this page. Defaults to Bonusly's standard page size if omitted.",
    },
    cursor: {
      propDefinition: [
        bonusly,
        "cursor",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.bonusly.listUsersInDepartment({
      $,
      department: this.department,
      search: this.search,
      pageSize: this.pageSize,
      cursor: this.cursor,
    });

    const morePages = response.next_cursor
      ? " (more pages available)"
      : "";
    $.export("$summary", `Found ${response.users?.length ?? 0} user(s) in department "${this.department}"${morePages}`);
    return response;
  },
};
