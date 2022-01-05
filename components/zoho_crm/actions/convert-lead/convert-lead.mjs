import { axios } from "@pipedream/platform";
import common from "../common.mjs";

export default {
  key: "zoho_crm-convert-lead",
  name: "Convert Lead",
  description: "Converts a Lead into a Contact or an Account.",
  version: "0.0.8",
  type: "action",
  props: {
    ...common.props,
    leadId: {
      type: "string",
      label: "Lead Id",
      description: "Unique identifier of the record associated to the Lead you'd like to convert.",
    },
    overwrite: {
      type: "boolean",
      label: "Overwrite",
      description: "Specifies if the Lead details must be overwritten in the Contact/Account/Deal based on lead conversion mapping configuration.",
    },
    notifyLeadOwner: {
      type: "boolean",
      label: "Notify Lead Owner?",
      default: false,
      description: "Specifies whether the lead owner must get notified about the lead conversion via email.",
    },
    notifyNewEntityOwner: {
      type: "boolean",
      label: "Notify New Contact/Account Owner?",
      default: true,
      description: "Specifies whether the user to whom the contact/account is assigned to must get notified about the lead conversion via email.",
    },
    account: {
      type: "string",
      label: "Account",
      description: "Use this key to associate an account with the lead being converted. Pass the unique and valid account ID.",
      optional: true,
    },
    contact: {
      type: "string",
      label: "Contact",
      description: "Use this key to associate a contact with the lead being converted. Pass the unique and valid contact ID.",
      optional: true,
    },
    user: {
      type: "string",
      label: "User",
      description: "Use this key to assign a record owner for the new contact and account. Pass the unique and valid user ID.",
      optional: true,
    },
    deal: {
      type: "object",
      label: "Deal",
      description: "Use this key to create a deal for the newly created Account. The \"Deal_Name\", \"Closing_Date\", and \"Stage\" are default mandatory keys to be passed as part of the recordId  object structure.",
      optional: true,
    },
    carryOverTags: {
      type: "object",
      label: "Carry Over Tags?",
      description: "Use this key to carry over tags of the lead to contact, account, and deal. Refer to sample input for format.",
      optional: true,
    },
  },
  async run({ $ }) {
    const data = [
      {
        overwrite: Boolean(this.overwrite),
        notify_lead_owner: this.notifyLeadOwner || undefined,
        notify_new_entity_owner: this.notifyNewEntityOwner || undefined,
        Accounts: this.account || undefined,
        Contacts: this.contact || undefined,
        assign_to: this.user || undefined,
        Deals: this.deals || undefined,
        carry_over_tags: this.carryOverTags || undefined,
      },
    ];

    const res = await axios($, this.zohoCrmApp._getAxiosParams({
      path: `/Leads/${this.leadId}/actions/convert`,
      data,
    }));
    console.log(res);
    return res;
  },
};
