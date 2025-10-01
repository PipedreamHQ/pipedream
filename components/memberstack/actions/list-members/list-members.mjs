import memberstack from "../../memberstack.app.mjs";

export default {
  key: "memberstack-list-members",
  name: "List Members",
  description: "Retrieve a list of all members connected to your application. [See the docs](https://memberstack.notion.site/Admin-API-5b9233507d734091bd6ed604fb893bb8)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    memberstack,
    maxResults: {
      type: "integer",
      label: "Max Results",
      description: "Maximum number of results to return",
      optional: true,
      default: 100,
    },
  },
  async run({ $ }) {
    const members = await this.memberstack.paginate(
      this.memberstack.listMembers,
      {},
      this.maxResults,
    );

    $.export("$summary", `Found ${members.length} member${members.length === 1
      ? ""
      : "s" }.`);

    return members;
  },
};
