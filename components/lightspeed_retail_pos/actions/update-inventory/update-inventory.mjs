import app from "../../lightspeed_retail_pos.app.mjs";

export default {
  key: "lightspeed_retail_pos-update-inventory",
  name: "Update Inventory",
  description: "Adjusts the stock level of a product in the Lightspeed inventory. [See the documentation](https://developers.lightspeedhq.com/retail/endpoints/Item/#put-update-an-item)",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    accountId: {
      propDefinition: [
        app,
        "accountId",
      ],
    },
    itemId: {
      propDefinition: [
        app,
        "itemId",
        (c) => ({
          accountId: c.accountId,
        }),
      ],
    },
    shopId: {
      propDefinition: [
        app,
        "shopId",
        (c) => ({
          accountId: c.accountId,
        }),
      ],
    },
    quantity: {
      type: "integer",
      label: "Quantity",
      description: "New quantity of the item",
    },
  },
  async run({ $ }) {
    const { Item: item } = await this.app.getItem({
      accountId: this.accountId,
      itemId: this.itemId,
      params: {
        load_relations: "[\"ItemShops\"]",
      },
      $,
    });
    const shops = item.ItemShops.ItemShop;
    const itemShop = shops.find(({ shopID }) => shopID == this.shopId);
    itemShop.qoh = this.quantity;

    const { Item: response } = await this.app.updateItem({
      accountId: this.accountId,
      itemId: this.itemId,
      data: {
        ItemShops: {
          ItemShop: [
            itemShop,
          ],
        },
      },
      $,
    });

    if (response) {
      $.export("$summary", `Successfully updated item with ID ${response.itemID}.`);
    }

    return response;
  },
};
