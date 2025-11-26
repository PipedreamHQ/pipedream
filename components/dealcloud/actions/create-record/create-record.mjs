import commonCreateUpdate from "../common/common-create-update.mjs";

export default {
  ...commonCreateUpdate,
  key: "dealcloud-create-record",
  name: "Create Record",
  description: "Creates a new record (entry) in DealCloud. [See the documentation](https://api.docs.dealcloud.com/docs/data/cells/postput)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  async run({ $ }) {
    /* eslint-disable no-unused-vars */
    const {
      dealcloud,
      entryTypeId,
      ignoreNearDups,
      convertFieldsToProps,
      isUpdate,
      getEntryId,
      getRequestData,
      ...props
    } = this;
    /* eslint-enable no-unused-vars */

    const response = await dealcloud.createEntry({
      $,
      entryTypeId,
      data: this.getRequestData(props),
    });

    $.export("$summary", "Successfully created record");
    // add id to summary when we know the response schema
    return response;
  },
};

