import common from "../common/common.mjs";

export default {
  ...common,
  key: "zoho_recruit-update-record",
  name: "Update Record",
  description: "Updates existing record. [See the documentation](https://www.zoho.com/recruit/developer-guide/apiv2/update-records.html)",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    ...common.props,
    record: {
      propDefinition: [
        common.props.zohoRecruit,
        "record",
        (c) => ({
          moduleName: c.module,
        }),
      ],
    },
  },
  async run({ $ }) {
    const response = await this.zohoRecruit.updateRecord({
      moduleName: this.module,
      recordId: this.record,
      data: this.buildData(),
      $,
    });

    if (response.data[0].status === "error") {
      throw new Error(response.data[0].message);
    }

    $.export("$summary", `Successfully updated record with ID ${response.data[0].details.id}`);

    return response;
  },
};
