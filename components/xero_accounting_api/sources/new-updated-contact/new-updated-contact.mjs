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
    db: "$.service.db",
  },
  dedupe: "unique",
  async run() {
    let lastDateChecked;

    this.db.get("lastDateChecked") &&
      (lastDateChecked = this.db.get("lastDateChecked"));

    if (!this.db.get("lastDateChecked")) {
      lastDateChecked = new Date().toISOString();
      this.db.set("lastDateChecked", lastDateChecked);
    }
    const contacts = (
      await this.xero_accounting_api.getContact(
        this.tenant_id,
        null,
        lastDateChecked
      )
    )?.Contacts;
    contacts &&
      contacts.reverse().forEach((contact) => {
        const formmatedDate = formatJsonDate(contact.UpdatedDateUTC);
        this.db.set("lastDateChecked", formmatedDate);
        this.$emit(contact, {
          id: `${contact.ContactID}D${formmatedDate || ""}`,
          summary: `${contact.Name} - ${lastDateChecked}`,
        });
      });
  },
};
