import wati from "../../wati.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "wati-update-contact-attribute",
  name: "Update Contact Attribute",
  description: "Allows updating attributes/tags related to an existing contact. [See the documentation](https://docs.wati.io/reference/post_api-v1-updatecontactattributes-whatsappnumber)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    wati,
    contactDetails: {
      propDefinition: [
        wati,
        "contactDetails",
      ],
    },
    attributeDetails: {
      propDefinition: [
        wati,
        "attributeDetails",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.wati.updateContactAttributes({
      contactDetails: this.contactDetails,
      attributeDetails: this.attributeDetails,
    });

    $.export("$summary", `Successfully updated attributes for contact ${this.contactDetails.name}`);
    return response;
  },
};
