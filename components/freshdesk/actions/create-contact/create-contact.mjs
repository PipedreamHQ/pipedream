import { removeNullEntries } from "../../common/utils.mjs";
import freshdesk from "../../freshdesk.app.mjs";

export default {
  key: "freshdesk-create-contact",
  name: "Create a Contact",
  description: "Create a contact. [See docs here](https://developers.freshdesk.com/api/#create_contact)",
  version: "0.0.1",
  type: "action",
  props: {
    freshdesk,
    name: {
      type: "string",
      label: "Name",
      description: "Name of the contact.",
    },
    email: {
      type: "string",
      label: "Email",
      description: "Primary email address of the contact. If you want to associate additional email(s) with this contact, use the other_emails attribute.",
      optional: true,
    },
    otherEmails: {
      type: "string[]",
      label: "Additional email addresses",
      description: "String array of additional email addresses.",
      optional: true,
    },
    phone: {
      type: "string",
      label: "Phone number",
      description: "Telephone number of the contact.",
      optional: true,
    },
    companyId: {
      propDefinition: [
        freshdesk,
        "companyId",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const data = removeNullEntries({
      name: this.name,
      email: this.email,
      other_emails: this.otherEmails,
      phone: this.phone,
      company_id: this.companyId && Number(this.companyId),
    });
    const response = await this.freshdesk.createContact({
      $,
      data,
    });
    response && $.export("$summary", "Contact successfully created");
    return response;
  },
};
