import apify from "../../apify.app.mjs";
import { parseObject } from "../../common/utils.mjs";

export default {
  key: "apify-set-key-value-store-record",
  name: "Set Key-Value Store Record",
  description: "Create or update a record in the key-value store of Apify. [See the documentation](https://docs.apify.com/api/v2#/reference/key-value-stores/record-collection/put-record)",
  version: "0.0.1",
  type: "action",
  props: {
    apify,
    keyValueStoreId: {
      propDefinition: [
        apify,
        "keyValueStoreId",
      ],
    },
    key: {
      type: "string",
      label: "Key",
      description: "The key of the record to create or update in the key-value store.",
    },
    value: {
      type: "object",
      label: "Value",
      description: "The value of the record to create or update in the key-value store.",
    },
  },
  async run({ $ }) {
    const response = await this.apify.setKeyValueStoreRecord({
      $,
      storeId: this.keyValueStoreId,
      recordKey: this.key,
      data: parseObject(this.value),
    });
    $.export("$summary", `Successfully set the record with key '${this.key}'`);
    return response;
  },
};
