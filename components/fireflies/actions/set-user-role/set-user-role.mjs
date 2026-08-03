// x-pd-ai: optimized
import fireflies from "../../fireflies.app.mjs";
import mutations from "../../common/mutations.mjs";

export default {
  key: "fireflies-set-user-role",
  name: "Set User Role",
  description: "Promote a team member to admin or demote an admin to a regular user. The team must always retain at least one admin — attempting to demote the last remaining admin fails with an `admin_must_exist` error. [See the documentation](https://docs.fireflies.ai/graphql-api/mutation/set-user-role)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    fireflies,
    userId: {
      propDefinition: [
        fireflies,
        "userId",
      ],
      description: "The user whose role should change. Use **Find Recent Meeting** or **List User ID Options** to look up a user ID.",
    },
    role: {
      type: "string",
      label: "Role",
      description: "The role to assign to the user.",
      options: [
        {
          label: "Admin",
          value: "admin",
        },
        {
          label: "User",
          value: "user",
        },
      ],
    },
  },
  async run({ $ }) {
    // setUserRole takes top-level `user_id`/`role` arguments, not a wrapped
    // `input` object — unlike every other mutation in this component.
    const { data: { setUserRole } } = await this.fireflies.query({
      $,
      data: {
        query: mutations.setUserRole,
        variables: {
          userId: this.userId,
          role: this.role,
        },
      },
    });

    $.export("$summary", `Set ${setUserRole.name}'s role to "${setUserRole.role}"`);
    return setUserRole;
  },
};
