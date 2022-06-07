import base from "../common/base.mjs";

export default {
  ...base,
  key: "adalo-get-records",
  name: "Get Records",
  description: "Get all records from a collection. [See docs here](https://help.adalo.com/integrations/the-adalo-api/collections)",
  version: "0.0.1",
  type: "action",
  async run({ $ }) {
    const response = await this.adalo.getRecords({
      $,
      collectionId: this.collectionId,
    });

    $.export("$summary", "Successfully retrieved records");

    return response;
  },
};
