import app from "../../v7_darwin.app.mjs";

export default {
  key: "v7_darwin-create-dataset",
  name: "Create Dataset",
  description: "Creates a new Dataset. [See the documentation](https://docs.v7labs.com/reference/create-dataset)",
  version: "0.0.1",
  type: "action",
  props: {
    app,
    name: {
      propDefinition: [
        app,
        "name",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.createDataset({
      $,
      data: {
        name: this.name,
      },
    });

    $.export("$summary", `Successfully created Dataset with ID: '${response.id}'`);

    return response;
  },
};
