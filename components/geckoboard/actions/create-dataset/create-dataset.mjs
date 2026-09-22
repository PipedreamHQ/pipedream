import app from "../../geckoboard.app.mjs";

export default {
  key: "geckoboard-create-dataset",
  name: "Create Dataset",
  description: "Create a new dataset. [See the documentation](https://developer.geckoboard.com/?#find-or-create-a-new-dataset)",
  version: "0.0.3",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    fields: {
      propDefinition: [
        app,
        "fields",
      ],
    },
    id: {
      propDefinition: [
        app,
        "id",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.createDataset({
      $,
      id: this.id,
      data: {
        fields: JSON.parse(this.fields),
      },
    });
    $.export("$summary", "Successfully created dataset");
    return response;
  },
};
