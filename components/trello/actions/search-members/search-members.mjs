import app from "../../trello.app.mjs";

export default {
  key: "trello-search-members",
  name: "Search Members",
  description: "Search for Trello members. [See the documentation](https://developer.atlassian.com/cloud/trello/rest/api-group-search/#api-search-members-get).",
  version: "0.2.5",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    app,
    query: {
      type: "string",
      label: "Search Query",
      description: "Search query 1 to 16384 characters long",
    },
    idBoard: {
      label: "Board ID",
      description: "The ID of the board to search for members.",
      optional: true,
      propDefinition: [
        app,
        "board",
      ],
    },
    idOrganization: {
      type: "string",
      label: "Organization ID",
      description: "The ID of the organization to search for members.",
      optional: true,
      propDefinition: [
        app,
        "idOrganizations",
      ],
    },
    limit: {
      type: "integer",
      label: "Limit",
      description: "The maximum number of results to return. Maximum of 20.",
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      query,
      limit,
      idBoard,
      idOrganization,
    } = this;

    const onlyOrgMembers = idBoard || idOrganization;

    const response = await this.app.searchMembers({
      $,
      params: {
        query,
        limit,
        idBoard,
        idOrganization,
        onlyOrgMembers,
      },
    });

    if (response?.length) {
      $.export("$summary", `Successfully found ${response.length} member${response.length === 1
        ? ""
        : "s"}`);
    }

    return response;
  },
};
