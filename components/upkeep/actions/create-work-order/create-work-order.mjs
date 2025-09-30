import app from "../../upkeep.app.mjs";
import utils from "../../common/utils.mjs";
import { ConfigurationError } from "@pipedream/platform";

export default {
  type: "action",
  key: "upkeep-create-work-order",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  name: "Create Work Order",
  description: "Create a Work Order, [See the docs](https://developers.onupkeep.com/#create-a-work-order)",
  props: {
    app,
    title: {
      propDefinition: [
        app,
        "title",
      ],
      description: "Title of the work order",
    },
    description: {
      propDefinition: [
        app,
        "description",
      ],
      label: "Description",
      description: "",
    },
    priority: {
      propDefinition: [
        app,
        "priority",
      ],
    },
    category: {
      type: "string",
      label: "Category",
      description: "One of the set categories for Work Orders on your account, including the default ones",
      optional: true,
    },
    dueDate: {
      type: "string",
      label: "Due Date",
      description: "Due date, in ISO 8601 format, e.g. `2022-09-07` or `2022-09-07T13:26:53`",
      optional: true,
    },
    assetId: {
      propDefinition: [
        app,
        "assetId",
      ],
    },
    locationId: {
      propDefinition: [
        app,
        "locationId",
      ],
    },
    userId: {
      propDefinition: [
        app,
        "userId",
      ],
    },
    parts: {
      propDefinition: [
        app,
        "parts",
      ],
    },
    respectivePartQuantityUsed: {
      propDefinition: [
        app,
        "respectivePartQuantityUsed",
      ],
    },
    decreaseInventory: {
      type: "string",
      label: "Decrease Inventory",
      description: "Can be `auto` or `manual`. Default is `auto`. If set to `auto`, inventory will be automatically be decreased when a part is added to a work order. If set to `manual`, inventory will NOT be decreased when a part is added to a work order.",
      optional: true,
      options: [
        "manual",
        "auto",
      ],
    },
    time: {
      type: "integer",
      label: "Time",
      description: "The total time spent on the work order",
      optional: true,
    },
    cost: {
      type: "integer",
      label: "Cost",
      description: "The additional cost assigned to the work order",
      optional: true,
    },
    additionalUsers: {
      propDefinition: [
        app,
        "userId",
      ],
      type: "string[]",
      description: "An array of user IDs for additional workers assigned to the work order.",
    },
  },
  async run ({ $ }) {
    const dueDate = Date.parse(this.dueDate);
    if (isNaN(dueDate))
      throw new ConfigurationError("Due Date should be in ISO 8601 format!");
    const { result } = await this.app.createWorkOrder({
      $,
      data: {
        title: this.title,
        description: this.description,
        priority: parseInt(this.priority),
        category: this.category,
        dueDate,
        asset: this.assetId,
        location: this.locationId,
        assignedToUser: this.userId,
        parts: this.parts,
        respectivePartQuantityUsed: utils.parseArray(this.respectivePartQuantityUsed),
        decreaseInventory: this.decreaseInventory,
        time: parseInt(this.time),
        cost: parseInt(this.cost),
        additionalUsers: this.additionalUsers,
      },
    });
    $.export("$summary", `Request with ID ${result.id} has been created.`);
    return result;
  },
};
