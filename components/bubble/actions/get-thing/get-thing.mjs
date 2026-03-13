import app from "../../bubble.app.mjs";

export default {
  key: "bubble-get-thing",
  name: "Get Thing",
  description: "Retrieves a specific thing (record) by its unique ID from your Bubble app's database. [See the documentation](https://manual.bubble.io/core-resources/api/the-bubble-api/the-data-api/data-api-requests#retrieve-record-by-id)",
  version: "0.0.1",
  type: "action",
  annotations: {
    readOnlyHint: true,
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
    thingId: {
      propDefinition: [
        app,
        "thingId",
      ],
    },
  },
  async run({ $ }) {
    const {
      app,
      typeName,
      thingId,
    } = this;

    const response = await app.getThing({
      $,
      typeName,
      thingId,
    });

    $.export("$summary", `Successfully retrieved ${typeName} with ID: \`${thingId}\``);
    return response;
  },
};
