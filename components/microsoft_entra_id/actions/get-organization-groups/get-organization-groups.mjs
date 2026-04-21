import microsoftEntraId from "../../microsoft_entra_id.app.mjs";

export default {
  key: "microsoft_entra_id-get-organization-groups",
  name: "Get Organization Groups",
  description: "List all groups in the organization (excluding dynamic distribution groups). [See the documentation](https://learn.microsoft.com/en-us/graph/api/group-list?view=graph-rest-1.0&tabs=http)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    microsoftEntraId,
  },
  async run({ $ }) {
    const mapGroup = (group) => ({
      id: group.id,
      name: group.displayName,
      description: group.description ?? null,
      mailEnabled: group.mailEnabled ?? false,
      deletedDateTime: group.deletedDateTime ?? null,
    });

    const { items: groups } = await this.microsoftEntraId.collectODataValues({
      fetchFirst: () => this.microsoftEntraId.listGroups(),
      fetchNext: (url) => this.microsoftEntraId.listGroups({
        url,
      }),
      mapItem: mapGroup,
    });

    $.export(
      "$summary",
      `Successfully retrieved ${groups.length} organization group${groups.length !== 1
        ? "s"
        : ""}.`,
    );

    return groups;
  },
};
