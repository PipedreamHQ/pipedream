import zohoCrmApp from "../../zoho_crm.app.mjs";

export default {
  key: "zoho_crm-convert-lead",
  name: "Convert Lead",
  description: "Converts a Lead into a Contact or an Account. [See the docs here](https://www.zoho.com/crm/developer/docs/api/v2/convert-lead.html)",
  version: "0.0.1",
  type: "action",
  props: {
    zohoCrmApp,
    lead: {
      propDefinition: [
        zohoCrmApp,
        "lead",
      ],
    },
    account: {
      propDefinition: [
        zohoCrmApp,
        "account",
      ],
      optional: true,
    },
    contact: {
      propDefinition: [
        zohoCrmApp,
        "contact",
      ],
      optional: true,
    },
    user: {
      propDefinition: [
        zohoCrmApp,
        "user",
      ],
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
        {
          Accounts: account || undefined,
          Contacts: contact || undefined,
          assign_to: user || undefined,
        },
      ],
    };
    const res = await this.zohoCrmApp.convertLead(lead, data, $);
    $.export("$summary", "Successfully converted lead");
    return res;
  },
};
