import microsoft365Planner from "../../microsoft_365_planner.app.mjs";

export default {
  key: "microsoft_365_planner-create-plan",
  name: "Create Plan",
  description: "Create a new plan in Microsoft 365 Planner. [See the documentation](https://learn.microsoft.com/en-us/graph/api/planner-post-plans)",
  version: "0.0.5",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    microsoft365Planner,
    groupId: {
      propDefinition: [
        microsoft365Planner,
        "groupId",
      ],
    },
    title: {
      type: "string",
      label: "Title",
      description: "The title of the plan",
    },
  },
  async run({ $ }) {
    const response = await this.microsoft365Planner.createPlan({
      data: {
        container: {
          url: `https://graph.microsoft.com/v1.0/groups/${this.groupId}`,
        },
        title: this.title,
      },
      $,
    });

    if (response.id) {
      $.export("$summary", `Successfully created plan with ID ${response.id}.`);
    }

    return response;
  },
};
