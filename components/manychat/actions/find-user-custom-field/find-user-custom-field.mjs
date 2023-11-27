import manychat from "../../manychat.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "manychat-find-user-custom-field",
  name: "Find User by Custom Field",
  description: "Locates a user based on a particular custom field's value. [See the documentation](https://api.manychat.com)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    manychat,
    customField: {
      type: "string",
      label: "Custom Field",
      description: "The name of the custom field to search by",
    },
    value: {
      type: "string",
      label: "Value",
      description: "The value of the custom field to search for",
    },
  },
  async run({ $ }) {
    const response = await this.manychat.findByCustomField({
      customField: this.customField,
      value: this.value,
    });

    $.export("$summary", `Successfully located user with custom field '${this.customField}' and value '${this.value}'`);
    return response;
  },
};
