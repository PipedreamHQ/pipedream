import app from "../../app/wildberries.app";
import common from "../common/common";
import { defineAction } from "@pipedream/types";

export default defineAction({
  name: "List Order Stickers",
  description: "List order stickers. [See docs](https://suppliers-api.wildberries.ru/swagger/index.html#/Marketplace/post_api_v2_orders_stickers)",
  key: "wildberries-list-order-stickers",
  version: "0.0.1",
  type: "action",
  props: {
    app,
    orderIds: {
      propDefinition: [
        app,
        "orderIds",
      ],
    },
    type: {
      label: "Type",
      type: "string",
      description: "Sticker type, default: code128.",
      default: "code128",
      options: common.stickersRequestType,
    },
    asPdf: {
      type: "boolean",
      label: "List as PDF",
      description: "Set true for use the PDF API [See docs](https://suppliers-api.wildberries.ru/swagger/index.html#/Marketplace/post_api_v2_orders_stickers_pdf).",
      default: false,
    },
  },
  async run({ $ }) {
    const params = {
      orderIds: this.orderIds,
      type: this.type,
    };
    const response = await this.app.listOrderStickers($, params, this.asPdf);
    $.export("$summary", `Successfully listed stickers for ${this.orderIds.length} orders.`);
    return response;
  },
});
