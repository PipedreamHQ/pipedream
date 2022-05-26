import zohoCrm from "../../zoho_crm.app.mjs";

export default {
  key: "zoho_crm-convert-lead",
  name: "Convert Lead",
  description: "Converts a Lead into a Contact or an Account. [See the docs here](https://www.zoho.com/crm/developer/docs/api/v2/convert-lead.html)",
  version: "0.0.2",
  type: "action",
  props: {
    zohoCrm,
    lead: {
      propDefinition: [
        zohoCrm,
        "lead",
      ],
    },
    account: {
      propDefinition: [
        zohoCrm,
        "account",
      ],
      optional: true,
    },
    contact: {
      propDefinition: [
        zohoCrm,
        "contact",
      ],
      optional: true,
    },
    user: {
      propDefinition: [
        zohoCrm,
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
