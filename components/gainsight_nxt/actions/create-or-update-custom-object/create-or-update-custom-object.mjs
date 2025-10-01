import app from "../../gainsight_nxt.app.mjs";

export default {
  key: "gainsight_nxt-create-or-update-custom-object",
  name: "Create or Update Custom Object",
  description: "Create or update a custom object record. [See the documentation](https://support.gainsight.com/gainsight_nxt/API_and_Developer_Docs/Custom_Object_API/Gainsight_Custom_Object_API_Documentation#Insert_API)",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    objectName: {
      propDefinition: [
        app,
        "objectName",
      ],
    },
    infoBox: {
      type: "alert",
      alertType: "info",
      content: "Custom object fields may be suffixed with `__gc`, e.g. if you've named your field \"Object Name\", its key would be `Object_Name__gc`. Check the object configuration in the Gainsight platform for the correct field names.",
    },
    fields: {
      type: "string[]",
      label: "Key Field(s)",
      description: "The field(s) which identify this object (max 3), e.g. `fieldName1`. If a record with the same key field(s) exists, it will be updated, otherwise a new one will be created.",
    },
    fieldValues: {
      type: "object",
      label: "Field Values",
      description: "The record data to create or update, as key-value pairs.",
    },
  },
  async run({ $ }) {
    const { objectName } = this;
    const data = {
      records: [
        this.fieldValues,
      ],
    };

    let summary = "";
    let result;
    try {
      result = await this.app.updateCustomObject({
        $,
        objectName,
        data,
        params: {
          keys: this.fields.join?.() ?? this.fields,
        },
      });
      summary = result.result === true
        ? `Successfully updated custom object ${objectName}`
        : `Error updating custom object ${objectName}`;
    }
    catch (err) {
      result = await this.app.createCustomObject({
        $,
        objectName,
        data,
      });
      summary = result.result === true
        ? `Successfully created custom object ${objectName}`
        : `Error creating custom object ${objectName}`;
    }

    $.export(
      "$summary",
      summary,
    );
    return result;
  },
};
