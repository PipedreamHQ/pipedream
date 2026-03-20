import microsoftEntraId from "../../microsoft_entra_id.app.mjs";

export default {
  key: "microsoft_entra_id-get-ms365-groups",
  name: "Get MS365 Groups",
  description: "Get the user's Microsoft 365 groups (unified groups). Returns groups the user is a direct member of. [See the documentation](https://learn.microsoft.com/en-us/graph/api/user-list-memberof?view=graph-rest-1.0&tabs=http)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    microsoftEntraId,
    userId: {
      propDefinition: [
        microsoftEntraId,
        "userId",
      ],
      optional: true,
      description: "Leave empty to use the signed-in user.",
    },
  },
  async run({ $ }) {
    const groups = [];
    let response = await this.microsoftEntraId.getMS365Groups({
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
      response = await this.microsoftEntraId.getMS365Groups({
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
