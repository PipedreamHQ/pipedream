import app from "../../aero_workflow.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "aero_workflow-create-email-aero",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  name: "Create Email Aero",
  description: "Creates an email aero [See the docs here](https://api.aeroworkflow.com/swagger/index.html)",
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
    status: {
      propDefinition: [
        app,
        "status",
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
    fromEmail: {
      type: "string",
      label: "From Email",
      description: "From email",
      optional: true,
    },
    toEmail: {
      type: "string",
      label: "To Email",
      description: "To email",
      optional: true,
    },
    ccEmail: {
      type: "string",
      label: "Cc Email",
      description: "Cc email",
      optional: true,
    },
    bccEmail: {
      type: "string",
      label: "Bcc Email",
      description: "Bcc email",
      optional: true,
    },
    comments: {
      type: "string",
      label: "Comments",
      description: "Comments",
      optional: true,
    },
    body: {
      type: "string",
      label: "Body",
      description: "Body",
      optional: true,
    },
    incomingEmail: {
      type: "boolean",
      label: "Incoming Email",
      description: "Is incoming email",
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
    const resp = await this.app.createEmail({
      $,
      data,
    });
    $.export("$summary", `The email(ID: ${resp.id}) has been created successfully.`);
    return resp;
  },
};
