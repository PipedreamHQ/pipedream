import app from "../../mumble.app.mjs";

export default {
  key: "mumble-add-new-label",
  name: "Add New Label",
  description: "Adds a new label. [See the documentation](https://app.mumble.co.il/mumbleapi/docs)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    labelName: {
      propDefinition: [
        app,
        "labelName",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.addNewLabel({
      $,
      data: {
        label_name: this.labelName,
      },
    });
    $.export("$summary", "Successfully sent the request to add a new label: " + response.message);
    return response;
  },
};
