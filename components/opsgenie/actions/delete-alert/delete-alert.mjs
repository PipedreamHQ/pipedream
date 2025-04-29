import opsgenie from "../../opsgenie.app.mjs";

export default {
  key: "opsgenie-delete-alert",
  name: "Delete Alert",
  description: "Removes an existing alert from Opsgenie. [See the documentation](https://docs.opsgenie.com/docs/alert-api#delete-alert)",
  version: "0.0.1",
  type: "action",
  props: {
    opsgenie,
    alertId: {
      propDefinition: [
        opsgenie,
        "alertId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.opsgenie.deleteAlert({
      $,
      alertId: this.alertId,
    });
    $.export("$summary", `Successfully deleted alert with ID: ${this.alertId}`);
    return response;
  },
};
