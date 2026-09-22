import app from "../../bubble.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "bubble-create-thing",
  name: "Create Thing",
  description: "Creates a new thing (record) in your Bubble app's database. [See the documentation](https://manual.bubble.io/core-resources/api/the-bubble-api/the-data-api/data-api-requests#create-a-thing)",
  version: "0.0.1",
  type: "action",
  annotations: {
    readOnlyHint: false,
    destructiveHint: false,
    openWorldHint: true,
  },
  props: {
    app,
    typeName: {
      propDefinition: [
        app,
        "typeName",
      ],
    },
    data: {
      propDefinition: [
        app,
        "fields",
      ],
    },
  },
  async run({ $ }) {
    const {
      app,
      typeName,
      data,
    } = this;

    const response = await app.createThing({
      $,
      typeName,
      data: utils.parseData(data),
    });

    $.export("$summary", `Successfully created new ${typeName} with ID: \`${response.id}\``);
    return response;
  },
};
