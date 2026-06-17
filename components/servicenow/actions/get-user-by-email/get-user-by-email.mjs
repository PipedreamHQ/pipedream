import servicenow from "../../servicenow.app.mjs";

export default {
  key: "servicenow-get-user-by-email",
  name: "Get User by Email",
  description: "Look up a ServiceNow `sys_user` record by exact email address to find a user's `sys_id`, used by props like the requested-for field on **Add Item to Cart**. For partial name matches use **Lookup User by Name** instead. [See the documentation](https://www.servicenow.com/docs/bundle/zurich-api-reference/page/integrate/inbound-rest/concept/c_TableAPI.html)",
  version: "0.0.1",
  type: "action",
  annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    openWorldHint: true,
  },
  props: {
    servicenow,
    email: {
      type: "string",
      label: "Email",
      description: "Exact email address to look up. Example: `jane.doe@example.com`.",
    },
  },
  async run({ $ }) {
    const response = await this.servicenow.listUsers({
      $,
      params: {
        sysparm_query: `email=${this.email}`,
        sysparm_limit: 1,
      },
    });

    const users = Array.isArray(response)
      ? response
      : [];
    const user = users[0];
    const sysId = user?.sys_id;
    const summary = sysId
      ? `Found user ${sysId} for email "${this.email}"`
      : `No user found for email "${this.email}"`;
    $.export("$summary", summary);

    return response;
  },
};
