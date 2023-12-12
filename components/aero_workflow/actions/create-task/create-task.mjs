import app from "../../aero_workflow.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "aero_workflow-create-task",
  version: "0.0.1",
  type: "action",
  name: "Create Task",
  description: "Creates a task [See the docs here](https://api.aeroworkflow.com/swagger/index.html)",
  props: {
    app,
    assignedTo: {
      propDefinition: [
        app,
        "assignedTo",
      ],
    },
    aeroType: {
      propDefinition: [
        app,
        "aeroType",
      ],
    },
    contact: {
      propDefinition: [
        app,
        "contact",
      ],
      optional: true,
    },
    company: {
      propDefinition: [
        app,
        "company",
      ],
      optional: true,
    },
    fullProjectName: {
      propDefinition: [
        app,
        "project",
      ],
      optional: true,
    },
    hat: {
      propDefinition: [
        app,
        "hat",
      ],
      optional: true,
    },
    scheduledStartDate: {
      propDefinition: [
        app,
        "scheduledStartDate",
      ],
    },
    scheduledTotalHours: {
      propDefinition: [
        app,
        "scheduledTotalHours",
      ],
    },
    scheduledHours: {
      propDefinition: [
        app,
        "scheduledHours",
      ],
    },
    scheduledMinutes: {
      propDefinition: [
        app,
        "scheduledMinutes",
      ],
    },
    subject: {
      propDefinition: [
        app,
        "subject",
      ],
    },
    priority: {
      propDefinition: [
        app,
        "priority",
      ],
    },
    dueDate: {
      propDefinition: [
        app,
        "dueDate",
      ],
    },
    status: {
      propDefinition: [
        app,
        "status",
      ],
    },
    description: {
      type: "string",
      label: "Description",
      description: "Description",
      optional: true,
    },
    billable: {
      propDefinition: [
        app,
        "billable",
      ],
    },
    fixedFee: {
      propDefinition: [
        app,
        "fixedFee",
      ],
    },
  },
  async run ({ $ }) {
    const data = utils.extractProps(this);
    const resp = await this.app.createTask({
      $,
      data,
    });
    $.export("$summary", `The task(ID: ${resp.id}) has been created successfully.`);
    return resp;
  },
};
