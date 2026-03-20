import microsoftGraphApi from "../../microsoft_graph_api.app.mjs";

export default {
  key: "microsoft_graph_api-get-organization-groups",
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
    microsoftGraphApi,
  },
  async run({ $ }) {
    const groups = [];
    let response = await this.microsoftGraphApi.listOrganizationGroups();

    const mapGroup = (group) => ({
      id: group.id,
      name: group.displayName,
      description: group.description ?? null,
      mailEnabled: group.mailEnabled ?? false,
      deletedDateTime: group.deletedDateTime ?? null,
    });

    groups.push(...(response.value || []).map(mapGroup));

    while (response["@odata.nextLink"]) {
      response = await this.microsoftGraphApi.listOrganizationGroups({
        nextLink: response["@odata.nextLink"],
      });
      groups.push(...(response.value || []).map(mapGroup));
    }

    $.export(
      "$summary",
      `Successfully retrieved ${groups.length} organization group${groups.length !== 1
        ? "s"
        : ""}.`,
    );

    return groups;
  },
};
