import pipeline from "../../pipeline.app.mjs";

export default {
  name: "Find User",
  key: "pipeline-find-user",
  description: "Find an existing user on your Pipeline account. [See the docs here](https://app.pipelinecrm.com/api/docs#tag/Users/paths/~1admin~1users/get)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    pipeline,
    email: {
      propDefinition: [
        pipeline,
        "email",
      ],
      description: "Find a user with the exact email",
    },
    admin: {
      type: "boolean",
      label: "Admin",
      description: "Return only account administrators",
      optional: true,
    },
    includingInactive: {
      type: "boolean",
      label: "Include Inactive",
      description: "Return all users, including inactive ones (default returns only active)",
      optional: true,
    },
  },
  async run({ $ }) {
    const data = {
      conditions: {
        email: this.email,
        admin: this.admin,
        includeInactive: this.includeInactive,
      },
    };

    const { results: users } = await this.pipeline.paginate(this.pipeline.listUsers, {
      data,
      $,
    });

    $.export("$summary", `Found ${users.length} matching user${users.length === 1
      ? ""
      : "s"}.`);

    return users;
  },
};
