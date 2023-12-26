import onepagecrm from "../../onepagecrm.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "onepagecrm-create-contact",
  name: "Create Contact",
  description: "Creates a new contact in OnePageCRM. [See the documentation](https://developer.onepagecrm.com/api/)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    onepagecrm,
    contactData: {
      propDefinition: [
        onepagecrm,
        "contactData",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.onepagecrm.createContact(this.contactData);
    $.export("$summary", `Successfully created contact with ID ${response.id}`);
    return response;
  },
};
