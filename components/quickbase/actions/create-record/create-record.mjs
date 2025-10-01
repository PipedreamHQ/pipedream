import common from "../common/record.mjs";

export default {
  ...common,
  key: "quickbase-create-record",
  name: "Create Record",
  description: "Creates a new record in a Quick Base table. [See the documentation](https://developer.quickbase.com/operation/upsert)",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    ...common.props,
    tableId: {
      propDefinition: [
        common.props.quickbase,
        "tableId",
        (c) => ({
          appId: c.appId,
        }),
      ],
      reloadProps: true,
    },
  },
  async additionalProps() {
    return await this.getFieldProps();
  },
  async run({ $ }) {
    const fieldData = [
      {},
    ];
    const keyFieldId = await this.getKeyFieldId();
    const {
      fieldsToReturn, data,
    } = await this.buildRecordData(keyFieldId, fieldData);
    const response = await this.quickbase.createOrUpdateRecord({
      $,
      data: {
        to: this.tableId,
        data,
        fieldsToReturn,
      },
    });
    if (response.metadata.lineErrors) {
      throw new Error(JSON.stringify(response.metadata.lineErrors));
    }
    $.export("$summary", `Successfully created record in table ${this.tableId}`);
    return response;
  },
};
