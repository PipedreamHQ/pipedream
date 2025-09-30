import { parseObject } from "../../common/utils.mjs";
import printful from "../../printful.app.mjs";

export default {
  key: "printful-update-product",
  name: "Update Product",
  description: "Updates an existing product in your Printful store. [See the documentation](https://developers.printful.com/docs/#tag/Products-API/operation/updateSyncProduct)",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    printful,
    storeId: {
      propDefinition: [
        printful,
        "storeId",
      ],
    },
    productId: {
      propDefinition: [
        printful,
        "productId",
        ({ storeId }) => ({
          storeId,
        }),
      ],
    },
    alert: {
      type: "alert",
      alertType: "warning",
      content: `Please note that in the request body you only need to specify the fields that need to be changed.
      \nFurthermore, if you want to update existing sync variants, then in the sync variants array you must specify the IDs of all existing sync variants.
      \nAll omitted existing sync variants will be deleted. All new sync variants without an ID will be created.`,
    },
    syncProduct: {
      type: "object",
      label: "Sync Product",
      description: "Information about the SyncProduct. **Example: {\"external_id\": \"4235234213\", \"name\": \"T-shirt\", \"thumbnail\": \"http://your-domain.com/path/to/thumbnail.png\", \"is_ignored\": true}**",
      optional: true,
    },
    syncVariants: {
      type: "string[]",
      label: "Sync Variants",
      description: "Information about the Sync Variants. **Example: [{\"external_id\": \"12312414\", \"variant_id\": 3001, \"retail_price\": \"29.99\", \"is_ignored\": true, \"sku\": \"SKU1234\", \"files\": [{ \"type\": \"default\", \"url\": \"​https://www.example.com/files/tshirts/example.png\", \"options\": [{ \"id\": \"template_type\", \"value\": \"native\" }], \"filename\": \"shirt1.png\", \"visible\": true }], \"options\": [{ \"id\": \"embroidery_type\", \"value\": \"flat\" }], \"availability_status\": \"active\" }]**",
      optional: true,
    },
  },
  async run({ $ }) {

    const response = await this.printful.updateProduct({
      $,
      headers: {
        "X-PF-Store-Id": this.storeId,
      },
      productId: this.productId,
      data: {
        sync_product: parseObject(this.syncProduct),
        sync_variants: parseObject(this.syncVariants),
      },
    });
    $.export("$summary", `Updated product ${this.productId}`);
    return response;
  },
};
