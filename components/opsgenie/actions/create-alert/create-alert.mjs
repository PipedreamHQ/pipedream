import opsgenie from "../../opsgenie.app.mjs";

export default {
  key: "opsgenie-create-alert",
  name: "Create Alert",
  description: "Creates a new alert in Opsgenie",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    opsgenie,
    message: {
      propDefinition: [
        opsgenie,
        "message",
      ],
    },
    alias: {
      propDefinition: [
        opsgenie,
        "alias",
      ],
    },
    description: {
      propDefinition: [
        opsgenie,
        "description",
      ],
      optional: true,
    },
    responders: {
      propDefinition: [
        opsgenie,
        "responders",
      ],
      optional: true,
    },
    actions: {
      propDefinition: [
        opsgenie,
        "actions",
      ],
      optional: true,
    },
    tags: {
      propDefinition: [
        opsgenie,
        "tags",
      ],
      optional: true,
    },
    details: {
      propDefinition: [
        opsgenie,
        "details",
      ],
      optional: true,
    },
    entity: {
      propDefinition: [
        opsgenie,
        "entity",
      ],
      optional: true,
    },
    priority: {
      propDefinition: [
        opsgenie,
        "priority",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const alert = {
      message: this.message,
      alias: this.alias,
      description: this.description,
      responders: this.responders,
      actions: this.actions,
      tags: this.tags,
      details: this.details,
      entity: this.entity,
      priority: this.priority,
    };
    const response = await this.opsgenie.createAlert({
      data: alert,
    });
    $.export("$summary", `Successfully created alert with ID: ${response.alertId}`);
    return response;
  },
};
