import gainsight_nxt from "../../gainsight_nxt.app.mjs";

export default {
  key: "gainsight_nxt-create-or-update-custom-object",
  name: "Create or Update Custom Object",
  description: "Creates or updates a custom object in Gainsight NXT. [See the documentation]()",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    gainsight_nxt,
    customObjectFields: {
      propDefinition: [
        "gainsight_nxt",
        "customObjectFields",
      ],
    },
  },
  async run({ $ }) {
    try {
      const customObjectData = this.customObjectFields.map(JSON.parse);
      const results = [];

      for (const fields of customObjectData) {
        const result = await this.gainsight_nxt.createOrUpdateCustomObject(fields);
        results.push(result);
      }

      $.export("$summary", `Processed ${results.length} custom object(s) successfully.`);
      return results;
    } catch (error) {
      $.export("$summary", `Failed to create or update custom objects: ${error.message}`);
      throw error;
    }
  },
};
