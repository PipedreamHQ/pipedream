import sendoso from "../../sendoso.app.mjs";

export default {
  key: "sendoso-list-groups",
  name: "List Groups",
  description: "List all groups (teams). [See the documentation](https://developer.sendoso.com/rest-api/reference/teams/get-teams)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    sendoso,
    page: {
      propDefinition: [
        sendoso,
        "page",
      ],
    },
    perPage: {
      propDefinition: [
        sendoso,
        "perPage",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.sendoso.listGroups({
      $,
      params: {
        page: this.page,
        per_page: this.perPage,
      },
    });

    $.export("$summary", `Successfully retrieved ${response?.groups?.length || 0} group${response?.groups?.length === 1
      ? ""
      : "s"}`);
    return response;
  },
};
