import ragic from "../../ragic.app.mjs";

export default {
  key: "ragic-create-record",
  name: "Create Record",
  description: "Creates a record. [See the docs](https://www.ragic.com/intl/en/doc-api/15/Creating-a-New-Entry)",
  version: "0.0.1",
  type: "action",
  props: {
    ragic,
  },
  async run({ $ }) {
    const response = await this.ragic.createRecord();
    $.export("$summary", "Created record successfully");
    return response;
  },
};
