import { ConfigurationError } from "@pipedream/platform";
import wati from "../../wati.app.mjs";

export default {
  key: "wati-update-contact-attribute",
  name: "Update Contact Attribute",
  description: "Allows updating attributes/tags related to an existing contact. [See the documentation](https://docs.wati.io/reference/post_api-v1-updatecontactattributes-whatsappnumber)",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    wati,
    whatsappNumber: {
      propDefinition: [
        wati,
        "whatsappNumber",
      ],
    },
    customParams: {
      propDefinition: [
        wati,
        "customParams",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.wati.updateContactAttributes({
      $,
      whatsappNumber: this.whatsappNumber,
      data: {
        customParams: this.customParams && Object.entries(this.customParams).map(([
          key,
          value,
        ]) => ({
          name: key,
          value,
        })),
      },
    });
    if (!response.result) {
      throw new ConfigurationError(response.info);
    }

    $.export("$summary", `Successfully updated attributes for contact ${this.whatsappNumber}`);
    return response;
  },
};
