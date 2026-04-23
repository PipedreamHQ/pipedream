import microsoftEntraId from "../../microsoft_entra_id.app.mjs";

export default {
  key: "microsoft_entra_id-get-ms365-groups",
  name: "Get MS365 Groups",
  description: "Get the user's Microsoft 365 groups (unified groups). Returns groups the user is a direct member of. [See the documentation](https://learn.microsoft.com/en-us/graph/api/user-list-memberof?view=graph-rest-1.0&tabs=http)",
  version: "0.0.2",
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
    const userIdArg = this.userId || undefined;

    const mapGroup = (group) => ({
      id: group.id,
      name: group.displayName,
      description: group.description ?? null,
      groupTypes: group.groupTypes ?? [],
    });

    const { items: groups } = await this.microsoftEntraId.collectODataValues({
      fetchFirst: () => this.microsoftEntraId.getMS365Groups({
        userId: userIdArg,
      }),
      fetchNext: (url) => this.microsoftEntraId.getMS365Groups({
        userId: userIdArg,
        nextLink: url,
      }),
      mapItem: mapGroup,
    });

    $.export(
      "$summary",
      `Successfully retrieved ${groups.length} Microsoft 365 group${groups.length !== 1
        ? "s"
        : ""}.`,
    );

    return groups;
  },
};
