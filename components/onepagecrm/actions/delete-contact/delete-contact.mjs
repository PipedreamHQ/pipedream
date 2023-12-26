import onepagecrm from "../../onepagecrm.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "onepagecrm-delete-contact",
  name: "Delete Contact",
  description: "Deletes an existing contact from OnePageCRM. [See the documentation](https://developer.onepagecrm.com/api/)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    onepagecrm,
    contactId: {
      propDefinition: [
        onepagecrm,
        "contactId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.onepagecrm.removeContact({
      contactId: this.contactId,
    });
    $.export("$summary", `Successfully deleted contact with ID ${this.contactId}`);
    return response;
  },
};
