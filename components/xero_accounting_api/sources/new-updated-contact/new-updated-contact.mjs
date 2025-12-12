import common from "../common/base-polling.mjs";
import { formatJsonDate } from "../../common/util.mjs";

export default {
  ...common,
  key: "xero_accounting_api-new-updated-contact",
  name: "New or Updated Contact",
  description: "Emit new notifications when you create a new or update existing contact",
  version: "0.0.5",
  type: "source",
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
        modifiedSince: lastDateChecked.slice(0, 10),
        headers: {
          Accept: "application/json",
        },
      })
    )?.Contacts;
    contacts && contacts.reverse().forEach((contact) => {
      const formattedDate = formatJsonDate(contact.UpdatedDateUTC);
      this.xeroAccountingApi.setLastDateChecked(this.db, formattedDate);
      this.$emit(contact,
        {
          id: `${contact.ContactID}D${formattedDate || ""}`,
          summary: contact.Name,
          ts: Date.parse(contact.DateString),
        });
    });
  },
};
