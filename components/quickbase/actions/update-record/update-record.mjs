import common from "../common/record.mjs";

export default {
  ...common,
  key: "quickbase-update-record",
  name: "Update Record",
  description: "Updates an existing record in a Quick Base table. [See the documentation](https://developer.quickbase.com/operation/upsert)",
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
    recordId: {
      propDefinition: [
        common.props.quickbase,
        "recordId",
        (c) => ({
          appId: c.appId,
          tableId: c.tableId,
        }),
      ],
    },
  },
  async additionalProps() {
    return await this.getFieldProps();
  },
  async run({ $ }) {
    const keyFieldId = await this.getKeyFieldId();
    const fieldData = [
      {
        [keyFieldId]: {
          value: this.recordId,
        },
      },
    ];
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
    $.export("$summary", `Successfully created record in table ${this.tableId}`);
    return response;
  },
};
