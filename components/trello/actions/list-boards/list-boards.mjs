import trello from "../../trello.app.mjs";

export default {
  key: "trello-list-boards",
  name: "List Boards",
  description: "Lists the boards that the user is a member of. [See the documentation](https://developer.atlassian.com/cloud/trello/rest/api-group-members/#api-members-id-boards-get)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    trello,
    memberId: {
      propDefinition: [
        trello,
        "searchMemberId",
      ],
      description: "The ID of the member to retrieve boards for. Leave blank to use the authenticated user. Type in the search field to get members to select from.",
    },
    filter: {
      type: "string[]",
      label: "Filter",
      description: "Filter the boards to return",
      optional: true,
      options: [
        "all",
        "closed",
        "members",
        "open",
        "organization",
        "public",
        "starred",
      ],
      default: [
        "all",
      ],
    },
  },
  async run({ $ }) {
    const boards = await this.trello.getBoards({
      $,
      boardId: this.memberId,
      params: {
        filter: this.filter
          ? typeof this.filter === "string"
            ? this.filter
            : this.filter.join(",")
          : undefined,
      },
    });
    $.export("$summary", `Successfully retrieved ${boards?.length || 0} board${boards?.length === 1
      ? ""
      : "s"}`);
    return boards;
  },
};
