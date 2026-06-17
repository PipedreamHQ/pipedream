import servicenow from "../../servicenow.app.mjs";
import constants from "../../common/constants.mjs";

const { MAX_LIMIT } = constants;

export default {
  key: "servicenow-lookup-user-by-name",
  name: "Lookup User by Name",
  description: "Search ServiceNow `sys_user` records by name to find a user's `sys_id`, used by props like the requested-for field on **Add Item to Cart**. For exact email matches use **Get User by Email** instead. [See the documentation](https://www.servicenow.com/docs/bundle/zurich-api-reference/page/integrate/inbound-rest/concept/c_TableAPI.html)",
  version: "0.0.1",
  type: "action",
  annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    openWorldHint: true,
  },
  props: {
    servicenow,
    name: {
      type: "string",
      label: "Name",
      description: "Name (or partial name) to search for; matched against the user name field. Example: `Jane Doe`.",
    },
    limit: {
      propDefinition: [
        servicenow,
        "limit",
      ],
      description: `Maximum number of users to return (maps to \`sysparm_limit\`). Min 1, max ${MAX_LIMIT}.`,
    },
  },
  async run({ $ }) {
    const response = await this.servicenow.listUsers({
      $,
      params: {
        sysparm_query: `nameLIKE${this.name}`,
        sysparm_limit: this.limit,
      },
    });

    const users = Array.isArray(response)
      ? response
      : [];
    $.export("$summary", `Found ${users.length} user(s) matching "${this.name}"`);

    return response;
  },
};
