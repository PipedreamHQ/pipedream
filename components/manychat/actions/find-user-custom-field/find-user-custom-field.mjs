import manychat from "../../manychat.app.mjs";

export default {
  key: "manychat-find-user-custom-field",
  name: "Find User by Custom Field",
  description: "Locates a user based on a particular custom field's value. [See the documentation](https://api.manychat.com)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    manychat,
    customFieldId: {
      propDefinition: [
        manychat,
        "customFieldId",
      ],
      withLabel: true,
    },
    customFieldValue: {
      propDefinition: [
        manychat,
        "customFieldValue",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.manychat.findByCustomField({
      params: {
        field_id: this.customFieldId.value,
        field_value: this.customFieldValue,
      },
    });

    $.export("$summary", `Successfully located user with custom field '${this.customFieldId.label}' and value '${this.value}'`);
    return response;
  },
};
