import maintainx from "../../maintainx.app.mjs";
import constants from "../common/constants.mjs";

export default {
  name: "Update Work Order",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  key: "maintainx-update-work-order",
  description: "Updates a work order. [See docs here](https://api.getmaintainx.com/v1/docs#tag/Work-Orders/paths/~1workorders~1{id}/patch)",
  type: "action",
  props: {
    maintainx,
    workorderId: {
      propDefinition: [
        maintainx,
        "workorderId",
      ],
    },
    title: {
      type: "string",
      label: "Title",
      description: "The title of the work order",
      optional: true,
    },
    description: {
      type: "string",
      label: "Description",
      description: "The description of the work order",
      optional: true,
    },
    priority: {
      type: "string",
      label: "Priority",
      description: "The priority of the work order. E.g. `LOW`",
      options: constants.PRIORITIES,
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.maintainx.updateWorkOrder({
      $,
      workorderId: this.workorderId,
      data: {
        title: this.title,
        description: this.description,
        priority: this.priority,
      },
    });

    if (response) {
      $.export("$summary", `Successfully updated work order with ID ${response.workOrder.id}`);
    }

    return response;
  },
};
