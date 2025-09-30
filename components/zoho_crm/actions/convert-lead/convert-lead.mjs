import zohoCrm from "../../zoho_crm.app.mjs";

export default {
  key: "zoho_crm-convert-lead",
  name: "Convert Lead",
  description: "Converts a Lead into a Contact or an Account. [See the documentation](https://www.zoho.com/crm/developer/docs/api/v2/convert-lead.html)",
  version: "0.1.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    zohoCrm,
    lead: {
      propDefinition: [
        zohoCrm,
        "recordId",
        () => ({
          module: "Leads",
        }),
      ],
      label: "Lead",
      description: "Unique identifier of the lead record to be converted",
    },
    account: {
      propDefinition: [
        zohoCrm,
        "recordId",
        () => ({
          module: "Accounts",
        }),
      ],
      label: "Account",
      description: "Use this key to associate an account with the lead being converted. Pass the unique and valid account ID.",
      optional: true,
    },
    contact: {
      propDefinition: [
        zohoCrm,
        "recordId",
        () => ({
          module: "Contacts",
        }),
      ],
      label: "Contact",
      description: "Use this key to associate a contact with the lead being converted. Pass the unique and valid contact ID.",
      optional: true,
    },
    user: {
      propDefinition: [
        zohoCrm,
        "recordId",
        () => ({
          module: "users?type=ActiveUsers",
        }),
      ],
      label: "User",
      description: "Use this key to assign record owner for the new contact and account. Pass the unique and valid user ID.",
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      lead,
      account,
      contact,
      user,
    } = this;
    const data = {
      data: [
        this.zohoCrm.omitEmptyStringValues({
          Accounts: account,
          Contacts: contact,
          assign_to: user,
        }),
      ],
    };
    const res = await this.zohoCrm.convertLead(lead, data, $);
    $.export("$summary", "Successfully converted lead");
    return res;
  },
};
