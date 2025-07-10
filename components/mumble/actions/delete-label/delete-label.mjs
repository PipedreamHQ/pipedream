import app from "../../mumble.app.mjs";

export default {
  key: "mumble-delete-label",
  name: "Delete Label",
  description: "Deletes a label. [See the documentation](https://app.mumble.co.il/mumbleapi/docs)",
  version: "0.0.1",
  type: "action",
  props: {
    app,
    labelNameList: {
      propDefinition: [
        app,
        "labelNameList",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.deleteLabel({
      $,
      data: {
        label_name: this.labelNameList,
      },
    });
    $.export("$summary", "Successfully sent the request to delete a label: " + response.message);
    return response;
  },
};
