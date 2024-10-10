import wati from "../../wati.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "wati-add-contact",
  name: "Add Contact",
  description: "Adds a new contact on the WATI platform. [See the documentation](https://docs.wati.io/reference/post_api-v1-addcontact-whatsappnumber)",
  version: "0.0.1",
  type: "action",
  props: {
    wati,
    contactDetails: {
      propDefinition: [
        wati,
        "contactDetails",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.wati.addContact(this.contactDetails);
    $.export("$summary", `Successfully added contact with name: ${this.contactDetails.name}`);
    return response;
  },
};
