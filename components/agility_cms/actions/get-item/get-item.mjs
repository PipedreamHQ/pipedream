import app from "../../agility_cms.app.mjs";

export default {
  key: "agility_cms-get-item",
  name: "Get Item Details",
  description: "Get details of the specified item. [See the documentation](https://api.aglty.io/swagger/index.html#operations-Item-get__guid___apitype___locale__item__id_)",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
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
    itemId: {
      propDefinition: [
        app,
        "itemId",
        (c) => ({
          locale: c.locale,
        }),
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.getItem({
      $,
      locale: this.locale,
      itemId: this.itemId,
    });

    $.export("$summary", `Successfully retrieved details of item ID '${response.contentID}'`);

    return response;
  },
};
