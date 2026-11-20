import app from "../../less_annoying_crm.app.mjs";
import { contactSummaryName } from "../../common/utils.mjs";

export default {
  key: "less_annoying_crm-get-contact",
  name: "Get Contact",
  description: "Retrieves one contact or company from Less Annoying CRM by ID, including emails, phones, addresses, websites, job title, background info, owner, and custom fields."
    + " Use **Search Contacts** first if you only have a name or email. To see notes, tasks, events, and leads for the record, use **Get Contact Activities**."
    + " Example: `contactId: \"1234567890123456789012345678901\"` returns `{\"ContactId\": \"1234567890123456789012345678901\", \"IsCompany\": false, \"Name\": {\"FirstName\": \"Jane\", \"LastName\": \"Smith\"}, \"Email\": [{\"Text\": \"jane@acme.com\", \"Type\": \"Work\"}], \"Job Title\": \"VP of Sales\", \"AssignedTo\": \"101\", ...}`."
    + " [See the documentation](https://account.lessannoyingcrm.com/api_docs/v2/Core_Functions/Contacts#Goto-GetContact)",
  version: "0.0.1",
  type: "action",
  ai: "optimized",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    app,
    contactId: {
      propDefinition: [
        app,
        "contactId",
      ],
    },
  },
  async run({ $ }) {
    const contact = await this.app.getContact({
      $,
      parameters: {
        ContactId: this.contactId,
      },
    });

    $.export("$summary", `Retrieved ${contact.IsCompany
      ? "company"
      : "contact"} ${contactSummaryName(contact)}`);
    return contact;
  },
};
