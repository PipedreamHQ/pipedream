import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";
import { formatJsonDate } from "../../common/util.mjs";
import xeroAccountingApi from "../../xero_accounting_api.app.mjs";

export default {
  key: "xero_accounting_api-new-updated-contact",
  name: "New or updated contact",
  description: "Emit new notifications when you create a new or update existing contact",
  version: "0.0.4",
  type: "source",
  props: {
    xeroAccountingApi,
    tenantId: {
      propDefinition: [
        xeroAccountingApi,
        "tenantId",
      ],
    },
    timer: {
      label: "Polling interval",
      description: "Pipedream will poll Xero accounting API on this schedule",
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
    db: "$.service.db",
  },
  dedupe: "unique",
  async run() {
    let lastDateChecked = this.xeroAccountingApi.getLastDateChecked(this.db);

    if (!lastDateChecked) {
      lastDateChecked = new Date().toISOString();
      this.xeroAccountingApi.setLastDateChecked(this.db, lastDateChecked);
    }
    const contacts = (
      await this.xeroAccountingApi.getContact({
        tenantId: this.tenantId,
        modifiedSince: lastDateChecked,
      })
    )?.Contacts;
    contacts && contacts.reverse().forEach((contact) => {
      const formattedDate = formatJsonDate(contact.UpdatedDateUTC);
      this.xeroAccountingApi.setLastDateChecked(this.db, formattedDate);
      this.$emit(contact,
        {
          id: `${contact.ContactID}D${formattedDate || ""}`,
          summary: contact.Name,
        });
    });
  },
};
