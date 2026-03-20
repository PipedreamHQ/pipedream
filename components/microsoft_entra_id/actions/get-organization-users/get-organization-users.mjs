import microsoftEntraId from "../../microsoft_entra_id.app.mjs";

export default {
  key: "microsoft_entra_id-get-organization-users",
  name: "Get Organization Users",
  description: "List all users in the organization. By default returns only enabled accounts. [See the documentation](https://learn.microsoft.com/en-us/graph/api/user-list?view=graph-rest-1.0&tabs=http)",
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
    const users = [];
    let response = await this.microsoftEntraId.listUsers({
      params: {
        $filter: "accountEnabled eq true",
      },
    });

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
      response = await this.microsoftEntraId.listUsers({
        url: response["@odata.nextLink"],
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
