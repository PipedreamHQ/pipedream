import app from "../../teamwork.app.mjs";

export default {
  key: "teamwork-list-users",
  name: "List Users",
  description: "List all users. [See the documentation](https://apidocs.teamwork.com/docs/teamwork/v1/people/get-people-json)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    app,
    sort: {
      type: "string",
      label: "Sort",
      description: "The field to sort by",
      optional: true,
      options: [
        "company",
        "logincount",
        "lastlogin",
        "projectlastactive",
        "firstName",
        "lastName",
        "title",
        "dateAdded",
      ],
    },
    sortDirection: {
      type: "string",
      label: "Sort Direction",
      description: "The direction to sort by",
      optional: true,
      options: [
        "asc",
        "desc",
      ],
    },
    maxResults: {
      type: "integer",
      label: "Max Results",
      description: "The maximum number of results to return",
      optional: true,
      default: 100,
    },
  },
  async run({ $ }) {
    let total, count = 0, page = 1;
    let users = [];
    const params = {
      sort: this.sort,
      sortOrder: this.sortDirection,
      pageSize: 100,
    };
    do {
      const items = await this.app.listPeople(page, $, params);
      total = items?.length;
      if (!total) {
        break;
      }
      users.push(...items);
      count += items.length;
      page++;
    } while (count < this.maxResults);

    if (users.length > this.maxResults) {
      users = users.slice(0, this.maxResults);
    }

    $.export("$summary", `Found ${users.length} user${users.length === 1
      ? ""
      : "s"}`);
    return users;
  },
};
