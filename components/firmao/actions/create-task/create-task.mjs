import app from "../../firmao.app.mjs";
import constants from "../common/constants.mjs";

export default {
  key: "firmao-create-task",
  name: "Create Task",
  description:
    "Create a new task for the organization. [See the documentation](https://firmao.net/API-Documentation_EN.pdf)",
  version: "0.0.1",
  type: "action",
  props: {
    app,
    priority: {
      type: "string",
      label: "Priority",
      description: "Priority of the task",
      options: constants.TASK_PRIORITY_OPTS,
    },
    responsibleUsers: {
      propDefinition: [
        app,
        "responsibleUsers",
      ],
    },
    estimatedHours: {
      type: "integer",
      label: "Estimated Hours",
      description: "Estimated hours to complete the task",
    },
    description: {
      type: "string",
      label: "Description",
      description: "Description of the task",
    },
    plannedStartDate: {
      type: "string",
      label: "Planned Start Date",
      description:
        "Planned start date of the task. e.g `2012-07-17T00:00:00+02:00`",
    },
    plannedEndDate: {
      type: "string",
      label: "Planned End Date",
      description:
        "Planned end date of the task. e.g `2012-07-17T00:00:00+02:00`",
    },
    orderCalculateFromGross: {
      type: "boolean",
      label: "Order Calculate From Gross",
      description: "Flag to indicate if order calculation is from gross",
    },
    orderVatPercent: {
      type: "integer",
      label: "Order VAT Percent",
      description: "VAT percent for the order",
      optional: true,
    },
    name: {
      type: "string",
      label: "Name",
      description: "Name of the task",
    },
  },
  async run({ $ }) {
    const data = {
      priority: this.priority,
      responsibleUsers: this.responsibleUsers.map((id) => ({
        id,
      })),
      estimatedHours: this.estimatedHours,
      description: this.description,
      plannedStartDate: this.plannedStartDate,
      plannedEndDate: this.plannedEndDate,
      orderCalculateFromGross: this.orderCalculateFromGross,
      orderVatPercent: this.orderVatPercent,
      name: this.name,
    };

    const task = await this.app.createTask({
      $,
      data,
    });
    $.export("$summary", `Successfully created task "${this.name}"`);

    return task;
  },
};
