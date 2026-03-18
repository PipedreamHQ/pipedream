import microsoftGraphApi from "../../microsoft_graph_api.app.mjs";

export default {
  key: "microsoft_graph_api-get-organization-users",
  name: "Get Organization Users",
  description: "List all users in the organization. By default returns only enabled accounts. [See the documentation](https://learn.microsoft.com/en-us/graph/api/user-list?view=graph-rest-1.0&tabs=http)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: false,
    readOnlyHint: true,
  },
  props: {
    microsoftGraphApi,
  },
  async run({ $ }) {
    const users = [];
    let response = await this.microsoftGraphApi.listOrganizationUsers();

    const mapUser = (user) => ({
      id: user.id,
      fullName: user.displayName,
      description: user.description ?? null,
      email: user.mail ?? null,
      userPrincipalName: user.userPrincipalName ?? null,
      surname: user.surname ?? null,
      givenName: user.givenName ?? null,
      jobTitle: user.jobTitle ?? null,
      mobilePhone: user.mobilePhone ?? null,
    });

    users.push(...(response.value || []).map(mapUser));

    while (response["@odata.nextLink"]) {
      response = await this.microsoftGraphApi.listOrganizationUsers({
        nextLink: response["@odata.nextLink"],
      });
      users.push(...(response.value || []).map(mapUser));
    }

    $.export(
      "$summary",
      `Successfully retrieved ${users.length} organization user${users.length !== 1
        ? "s"
        : ""}.`,
    );

    return users;
  },
};
