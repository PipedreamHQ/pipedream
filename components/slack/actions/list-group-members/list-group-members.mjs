import slack from "../../slack.app.mjs";

export default {
  key: "slack-list-group-members",
  name: "List Group Members",
  description: "List all users in a User Group. [See the documentation](https://api.slack.com/methods/usergroups.users.list)",
  version: "0.0.8",
  type: "action",
  props: {
    slack,
    userGroup: {
      propDefinition: [
        slack,
        "userGroup",
      ],
    },
    team: {
      propDefinition: [
        slack,
        "team",
      ],
      optional: true,
      description: "Encoded team id where the user group exists, required if org token is used.",
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
    const members = [];
    const params = {
      usergroup: this.userGroup,
      team_id: this.team,
      limit: this.pageSize,
    };
    let page = 0;

    do {
      const {
        users, response_metadata: { next_cursor: nextCursor },
      } = await this.slack.listGroupMembers(params);
      members.push(...users);
      params.cursor = nextCursor;
      page++;
    } while (params.cursor && page < this.numPages);

    if (members?.length) {
      $.export("$summary", `Successfully retrieved ${members.length} user${members.length === 1
        ? ""
        : "s"}`);
    }
    return members;
  },
};
