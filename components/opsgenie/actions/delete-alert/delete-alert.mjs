import opsgenie from "../../opsgenie.app.mjs";

export default {
  key: "opsgenie-delete-alert",
  name: "Delete Alert",
  description: "Removes an existing alert from Opsgenie",
  version: "0.0.1",
  type: "action",
  props: {
    opsgenie,
    id: {
      propDefinition: [
        opsgenie,
        "id",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.opsgenie.deleteAlert({
      id: this.id,
    });

    $.export("$summary", `Successfully deleted alert with ID: ${this.id}`);
    return response;
  },
};
