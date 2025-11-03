import { ConfigurationError } from "@pipedream/platform";
import wati from "../../wati.app.mjs";

export default {
  key: "wati-add-contact",
  name: "Add Contact",
  description: "Adds a new contact on the WATI platform. [See the documentation](https://docs.wati.io/reference/post_api-v1-addcontact-whatsappnumber)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
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
    name: {
      type: "string",
      label: "Name",
      description: "The name of the contact",
      optional: true,
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
    const response = await this.wati.addContact({
      $,
      whatsappNumber: this.whatsappNumber,
      data: {
        name: this.name,
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
    $.export("$summary", `Successfully added contact with phone number: ${this.whatsappNumber}`);
    return response;
  },
};
