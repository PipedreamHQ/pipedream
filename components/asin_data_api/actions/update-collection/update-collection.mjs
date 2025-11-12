import app from "../../asin_data_api.app.mjs";

export default {
  key: "asin_data_api-update-collection",
  name: "Update Collection",
  description: "Update a collection in Asin Data API. [See the documentation](https://docs.trajectdata.com/asindataapi/collections-api/collections/update)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    collectionId: {
      propDefinition: [
        app,
        "collectionId",
      ],
    },
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
    const response = await this.app.updateCollection({
      $,
      collectionId: this.collectionId,
      data: {
        name: this.name,
        enabled: this.enabled,
        priority: this.priority,
        notification_email: this.notificationEmail,
        notification_as_csv: this.notificationAsCsv,
      },
    });
    $.export("$summary", "Successfully updated the collection with ID: " + this.collectionId);
    return response;
  },
};
