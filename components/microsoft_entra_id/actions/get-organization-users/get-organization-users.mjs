import microsoftEntraId from "../../microsoft_entra_id.app.mjs";

export default {
  key: "microsoft_entra_id-get-organization-users",
  name: "Get Organization Users",
  description: "List all users in the organization. By default returns only enabled accounts. [See the documentation](https://learn.microsoft.com/en-us/graph/api/user-list?view=graph-rest-1.0&tabs=http)",
  version: "0.0.3",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    microsoftEntraId,
    maxUsers: {
      type: "integer",
      label: "Max Users",
      description: "Maximum number of users to return. Omit for no limit (may be heavy for very large tenants).",
      optional: true,
      min: 1,
    },
    filter: {
      type: "string",
      label: "Filter",
      description: "Filter users by a property. For example, `accountEnabled eq true` will return only enabled users.",
      optional: true,
      default: "accountEnabled eq true",
    },
    search: {
      type: "string",
      label: "Search",
      description: "Search for users by a property. For example, `\"displayName:John Doe\"` will return users with the display name 'John Doe'.",
      optional: true,
    },
  },
  async run({ $ }) {
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

    const maxItems = this.maxUsers ?? undefined;
    const params = {};
    if (this.filter) {
      params.$filter = this.filter;
    }
    if (this.search) {
      params.$search = this.search;
    }

    const {
      items: users, truncated,
    } = await this.microsoftEntraId.collectODataValues({
      fetchFirst: () => this.microsoftEntraId.listUsers({
        params,
      }),
      fetchNext: (url) => this.microsoftEntraId.listUsers({
        url,
      }),
      mapItem: mapUser,
      maxItems,
    });

    const base = `Successfully retrieved ${users.length} organization user${users.length !== 1
      ? "s"
      : ""}`;
    const summary = truncated && maxItems != null
      ? `${base} (truncated to max ${this.maxUsers})`
      : base;
    $.export("$summary", summary);

    return users;
  },
};
