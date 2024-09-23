import opsgenie from "../../opsgenie.app.mjs";
import constants from "../../common/constants.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "opsgenie-create-alert",
  name: "Create Alert",
  description: "Creates a new alert in Opsgenie. [See the documentation[(https://docs.opsgenie.com/docs/alert-api#create-alert)",
  version: "0.0.1",
  type: "action",
  props: {
    opsgenie,
    message: {
      type: "string",
      label: "Message",
      description: "The content of the alert",
    },
    alias: {
      type: "string",
      label: "Alias",
      description: "User defined identifier for the alert",
      optional: true,
    },
    description: {
      type: "string",
      label: "Description",
      description: "More detailed information about the alert",
      optional: true,
    },
    responders: {
      type: "string[]",
      label: "Responders",
      description: "Teams, users, escalations and schedules that the alert will be routed to send notifications",
      optional: true,
    },
    actions: {
      type: "string[]",
      label: "Actions",
      description: "Custom actions that can be executed",
      optional: true,
    },
    tags: {
      type: "string[]",
      label: "Tags",
      description: "Labels attached to the alert",
      optional: true,
    },
    details: {
      type: "object",
      label: "Details",
      description: "Key-value pairs to provide detailed properties of the alert",
      optional: true,
    },
    entity: {
      type: "string",
      label: "Entity",
      description: "The entity the alert is related to",
      optional: true,
    },
    priority: {
      type: "string",
      label: "Priority",
      description: "The priority level of the alert",
      options: constants.PRIORITY_LEVELS,
      optional: true,
    },
    note: {
      type: "string",
      label: "Note",
      description: "Additional information that can be added to the alert",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.opsgenie.createAlert({
      $,
      data: {
        message: this.message,
        alias: this.alias,
        description: this.description,
        responders: utils.parseObjArray(this.responders),
        actions: this.actions,
        tags: this.tags,
        details: utils.parseObj(this.details),
        entity: this.entity,
        priority: this.priority,
      },
    });
    $.export("$summary", "Successfully created alert.");
    return response;
  },
};
