import microsoftGraphApi from "../../microsoft_graph_api.app.mjs";

export default {
  key: "microsoft_graph_api-get-ms365-groups",
  name: "Get MS365 Groups",
  description: "Get the user's Microsoft 365 groups (unified groups). Returns groups the user is a direct member of. [See the documentation](https://learn.microsoft.com/en-us/graph/api/user-list-memberof?view=graph-rest-1.0&tabs=http)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: false,
    readOnlyHint: true,
  },
  props: {
    microsoftGraphApi,
    userId: {
      type: "string",
      label: "User ID",
      description: "The user ID or user principal name. Leave empty to get the signed-in user's groups.",
      optional: true,
    },
  },
  async run({ $ }) {
    const groups = [];
    let response = await this.microsoftGraphApi.getMS365Groups({
      userId: this.userId || undefined,
    });

    const mapGroup = (group) => ({
      id: group.id,
      name: group.displayName,
      description: group.description ?? null,
      groupTypes: group.groupTypes ?? [],
    });

    groups.push(...(response.value || []).map(mapGroup));

    while (response["@odata.nextLink"]) {
      response = await this.microsoftGraphApi.getMS365Groups({
        userId: this.userId || undefined,
        nextLink: response["@odata.nextLink"],
      });
      groups.push(...(response.value || []).map(mapGroup));
    }

    $.export(
      "$summary",
      `Successfully retrieved ${groups.length} Microsoft 365 group${groups.length !== 1
        ? "s"
        : ""}.`,
    );

    return groups;
  },
};
