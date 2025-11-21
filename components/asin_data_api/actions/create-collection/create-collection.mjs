import app from "../../asin_data_api.app.mjs";

export default {
  key: "asin_data_api-create-collection",
  name: "Create Collection",
  description: "Create a collection to run requests in Asin Data API. [See the documentation](https://docs.trajectdata.com/asindataapi/collections-api/collections/create)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    name: {
      propDefinition: [
        app,
        "name",
      ],
    },
    enabled: {
      propDefinition: [
        app,
        "enabled",
      ],
    },
    priority: {
      propDefinition: [
        app,
        "priority",
      ],
    },
    notificationEmail: {
      propDefinition: [
        app,
        "notificationEmail",
      ],
    },
    notificationAsCsv: {
      propDefinition: [
        app,
        "notificationAsCsv",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.createCollection({
      $,
      data: {
        name: this.name,
        enabled: this.enabled,
        priority: this.priority,
        notification_email: this.notificationEmail,
        notification_as_csv: this.notificationAsCsv,
      },
    });
    $.export("$summary", "Successfully created a collection named: " + this.name);
    return response;
  },
};
