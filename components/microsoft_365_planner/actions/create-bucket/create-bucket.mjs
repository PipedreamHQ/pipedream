import microsoft365Planner from "../../microsoft_365_planner.app.mjs";

export default {
  key: "microsoft_365_planner-create-bucket",
  name: "Create Bucket",
  description: "Create a new bucket in Microsoft 365 Planner. [See the documentation](https://learn.microsoft.com/en-us/graph/api/planner-post-buckets)",
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
    planId: {
      propDefinition: [
        microsoft365Planner,
        "planId",
        (c) => ({
          groupId: c.groupId,
        }),
      ],
    },
    name: {
      type: "string",
      label: "Name",
      description: "The name of the bucket",
    },
    orderHint: {
      type: "string",
      label: "Order Hint",
      description: "Hint used to order items of this type in a list view. For details about the supported format, see [Using order hints in Planner](https://learn.microsoft.com/en-us/graph/api/resources/planner-order-hint-format?view=graph-rest-1.0).",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.microsoft365Planner.createBucket({
      data: {
        planId: this.planId,
        name: this.name,
        orderHint: this.orderHint,
      },
      $,
    });

    if (response.id) {
      $.export("$summary", `Successfully created bucket with ID ${response.id}.`);
    }

    return response;
  },
};
