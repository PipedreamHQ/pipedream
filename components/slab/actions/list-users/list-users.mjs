import slab from "../../slab.app.mjs";
import { LIST_USERS_QUERY } from "../../common/queries.mjs";

export default {
  key: "slab-list-users",
  name: "List Users",
  description: "List all users in the Slab organization via the `organization { users }` GraphQL query, returning an array of user objects with `id`, `name`, and `email` (e.g. `[{\"id\":\"u1\",\"name\":\"Alice\",\"email\":\"alice@example.com\"}]`). This is the picker action agents should call to obtain a user ID for **Update Post**'s Owner ID. [See the documentation](https://studio.apollographql.com/public/Slab/variant/current/schema/reference/objects/Organization#users).",
  version: "0.0.1",
  type: "action",
  ai: "optimized",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    slab,
    includeDeactivated: {
      type: "boolean",
      label: "Include Deactivated",
      description: "Whether to include deactivated users in the results.",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.slab._makeRequest({
      $,
      data: {
        query: LIST_USERS_QUERY,
        variables: {
          includeDeactivated: this.includeDeactivated,
        },
      },
    });
    const users = response.organization?.users || [];
    $.export("$summary", `Successfully retrieved ${users.length} user(s)`);
    return users;
  },
};
