import kommo from "../../kommo.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "kommo-update-contact",
  name: "Update Contact",
  description: "Updates the details of an existing contact in the Kommo app. [See the documentation](https://www.kommo.com/developers/content/api_v4/contacts-api/)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    kommo,
    contactIdentifier: {
      propDefinition: [
        kommo,
        "contactIdentifier",
      ],
    },
    newContactDetails: {
      propDefinition: [
        kommo,
        "newContactDetails",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.kommo.updateContact({
      contactIdentifier: this.contactIdentifier,
      newContactDetails: this.newContactDetails,
    });

    $.export("$summary", `Successfully updated contact with identifier ${this.contactIdentifier}`);
    return response;
  },
};
