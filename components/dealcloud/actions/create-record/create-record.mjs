import commonCreateUpdate from "../common/common-create-update.mjs";

export default {
  ...commonCreateUpdate,
  key: "dealcloud-create-record",
  name: "Create Record",
  description: "Creates a new record (entry) in DealCloud. [See the documentation](https://api.docs.dealcloud.com/docs/data/cells/postput)",
  version: "0.1.0",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  async run({ $ }) {
    const data = await this.buildRequestData();

    const response = await this.dealcloud.createEntry({
      $,
      entryTypeId: this.entryTypeId,
      data,
    });

    $.export("$summary", `Successfully created record in object ${this.entryTypeId}`);
    // add id to summary when we know the response schema
    return response;
  },
};

