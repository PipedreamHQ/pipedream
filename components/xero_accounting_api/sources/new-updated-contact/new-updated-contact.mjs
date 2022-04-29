import { formatJsonDate } from "../../common/common.util.mjs";
import xero_accounting_api from "../../xero_accounting_api.app.mjs";

export default {
  key: "xero_accounting_api-new-updated-contact",
  name: "New or updated contact",
  description:
    "Emit notifications when you create a new or updated existing contact",
  version: "0.0.1",
  type: "source",
  props: {
    xero_accounting_api,
    tenant_id: {
      propDefinition: [xero_accounting_api, "tenant_id"],
    },
    timer: {
      label: "Polling interval",
      description: "Pipedream will poll Xero accounting API on this schedule",
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60 * 15,
      },
    },
  },
  dedupe: "unique",
  async run() {
    const contacts = await this.xero_accounting_api.getContact(this.tenant_id);
    contacts.Contacts.forEach((contact) => {
      console.log("Contact", contact, formatJsonDate(contact.UpdatedDateUTC));
      this.$emit(contact, {
        id: contact.ContactID,
        summary: contact.Name,
      });
    });
  },
};
