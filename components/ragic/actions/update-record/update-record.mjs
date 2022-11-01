import ragic from "../../ragic.app.mjs";

export default {
  key: "ragic-update-record",
  name: "Update Record",
  description: "Updates a record. [See the docs](https://www.ragic.com/intl/en/doc-api/16/Modifying-an-Entry)",
  version: "0.0.1",
  type: "action",
  props: {
    ragic,
  },
  async run({ $ }) {
    const response = await this.ragic.updateRecord();
    $.export("$summary", "Updated record successfully");
    return response;
  },
};
