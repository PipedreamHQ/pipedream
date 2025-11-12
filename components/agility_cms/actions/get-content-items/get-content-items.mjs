import app from "../../agility_cms.app.mjs";

export default {
  key: "agility_cms-get-content-items",
  name: "Get Content Items",
  description: "Retrieves all content items. [See the documentation](https://api.aglty.io/swagger/index.html#operations-Sync-get__guid___apitype___locale__sync_items)",
  version: "0.0.3",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    locale: {
      propDefinition: [
        app,
        "locale",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.getItems({
      $,
      locale: this.locale,
    });

    $.export("$summary", `Successfully retrieved ${response.items.length} Items`);

    return response;
  },
};
