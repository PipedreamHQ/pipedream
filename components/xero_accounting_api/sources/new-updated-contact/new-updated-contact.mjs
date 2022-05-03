import { formatJsonDate } from "../../common/util.mjs";
import xeroAccountingApi from "../../xero_accounting_api.app.mjs";

export default {
  key: "xero_accounting_api-new-updated-contact",
  name: "New or updated contact",
  description:
    "Emit new notifications when you create a new or update existing contact",
  version: "0.0.1",
  type: "source",
  props: {
    xeroAccountingApi,
    tenant_id: {
      propDefinition: [
        xeroAccountingApi,
        "tenant_id",
      ],
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
    let lastDateChecked = this.xeroAccountingApi.getLastDateChecked();

    if (!lastDateChecked) {
      lastDateChecked = new Date().toISOString();
      this.xeroAccountingApi.setLastDateChecked(lastDateChecked);
    }
    const contacts = (
      await this.xeroAccountingApi.getContact(
        this.tenant_id,
        null,
        lastDateChecked,
      )
    )?.Contacts;
    contacts && contacts.reverse().forEach((contact) => {
      const formatedDate = formatJsonDate(contact.UpdatedDateUTC);
      this.xeroAccountingApi.setLastDateChecked(formatedDate);
      this.$emit(contact,
        {
          id: `${contact.ContactID}D${formatedDate || ""}`,
          summary: contact.Name,
        });
    });
  },
};
