import { formatJsonDate } from "../../common/util.mjs";
import xeroAccountingApi from "../../xero_accounting_api.app.mjs";

export default {
  key: "xero_accounting_api-new-updated-contact",
  name: "New or updated contact",
  description:
    "Emit new notifications when you create a new or update existing contact",
  version: "0.0.2",
  type: "source",
  props: {
    xeroAccountingApi,
    tenantId: {
      type: "string",
      label: "Tenant ID",
      description:
        "Id of the organization tenant to use on the Xero Accounting API.  See [Get Tenant Connections](https://pipedream.com/@sergio/xero-accounting-api-get-tenant-connections-p_OKCzOgn/edit) for a workflow example on how to pull this data.",
    },
    timer: {
      label: "Polling interval",
      description: "Pipedream will poll Xero accounting API on this schedule",
      type: "$.interface.timer",
      default: {
        intervalSeconds: 15 * 60, // 15 minutes
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
      await this.xeroAccountingApi.getContact(
        null,
        this.tenantId,
        null,
        lastDateChecked,
      )
    )?.Contacts;
    contacts && contacts.reverse().forEach((contact) => {
      const formatedDate = formatJsonDate(contact.UpdatedDateUTC);
      this.xeroAccountingApi.setLastDateChecked(this.db, formatedDate);
      this.$emit(contact,
        {
          id: `${contact.ContactID}D${formatedDate || ""}`,
          summary: contact.Name,
        });
    });
  },
};
