import maintainx from "../../maintainx.app.mjs";
import constants from "../common/constants.mjs";

export default {
  name: "Create Work Order",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  key: "maintainx-create-work-order",
  description: "Creates a work order. [See docs here](https://api.getmaintainx.com/v1/docs#tag/Work-Orders/paths/~1workorders/post)",
  type: "action",
  props: {
    maintainx,
    title: {
      type: "string",
      label: "Title",
      description: "The title of the work order",
    },
    description: {
      type: "string",
      label: "Description",
      description: "The description of the work order",
    },
    priority: {
      type: "string",
      label: "Priority",
      description: "The priority of the work order. E.g. `LOW`",
      options: constants.PRIORITIES,
    },
  },
  async run({ $ }) {
    const response = await this.maintainx.createWorkOrder({
      $,
      data: {
        title: this.title,
        description: this.description,
        priority: this.priority,
      },
    });

    if (response) {
      $.export("$summary", `Successfully created work order with ID ${response.id}`);
    }

    return response;
  },
};
