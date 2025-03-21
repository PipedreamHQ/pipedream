import slack from "../../slack.app.mjs";

export default {
  key: "slack-list-users",
  name: "List Users",
  description: "Return a list of all users in a workspace. [See the documentation](https://api.slack.com/methods/users.list)",
  version: "0.0.23",
  type: "action",
  props: {
    slack,
    teamId: {
      propDefinition: [
        slack,
        "team",
      ],
      optional: true,
    },
    pageSize: {
      propDefinition: [
        slack,
        "pageSize",
      ],
    },
    numPages: {
      propDefinition: [
        slack,
        "numPages",
      ],
    },
  },
  async run({ $ }) {
    const users = [];
    const params = {
      team_id: this.teamId,
      limit: this.pageSize,
    };
    let page = 0;

    do {
      const {
        members, response_metadata: { next_cursor: nextCursor },
      } = await this.slack.usersList(params);
      users.push(...members);
      params.cursor = nextCursor;
      page++;
    } while (params.cursor && page < this.numPages);

    $.export("$summary", `Successfully retrieved ${users.length} user${users.length === 1
      ? ""
      : "s"}`);
    return {
      members: users,
    };
  },
};
