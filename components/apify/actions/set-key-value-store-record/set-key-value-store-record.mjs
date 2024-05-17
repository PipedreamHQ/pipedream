import apify from "../../apify.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "apify-set-key-value-store-record",
  name: "Set Key-Value Store Record",
  description: "Create or update a record in the key-value store of Apify. [See the documentation](https://docs.apify.com/api/v2#/reference/key-value-stores/record-collection/put-record)",
  version: "0.0.1",
  type: "action",
  props: {
    apify,
    key: {
      propDefinition: [
        apify,
        "key",
      ],
    },
    value: {
      propDefinition: [
        apify,
        "value",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.apify.setKeyValueStoreRecord({
      key: this.key,
      value: this.value,
    });
    $.export("$summary", `Successfully set the record with key '${this.key}'`);
    return response;
  },
};
