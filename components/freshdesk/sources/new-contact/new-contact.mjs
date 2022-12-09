import freshdesk from "../../freshdesk.app.mjs";
import moment from "moment";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";

export default {
  key: "freshdesk-new-contact",
  name: "New Contact",
  description: "Emit new notifications when a new contact is created",
  version: "0.0.2",
  type: "source",
  props: {
    freshdesk,
    timer: {
      label: "Polling interval",
      description: "Pipedream will poll Harvest API on this schedule",
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
    db: "$.service.db",
  },
  dedupe: "unique",
  async run() {
    const data = [];
    let lastDateChecked = this.freshdesk.getLastDateChecked(this.db);
    if (!lastDateChecked) {
      lastDateChecked = new Date().toISOString();
      this.freshdesk.setLastDateChecked(this.db, lastDateChecked);
    }
    const formatedDate = lastDateChecked.substr(0, (lastDateChecked + "T").indexOf("T"));
    const contacts = await this.freshdesk.filterContacts({
      query: `"created_at:>'${formatedDate}'"`,
      page: 1,
    });
    for await (const contact of contacts) {
      data.push(contact);
    }
    data && data.reverse().forEach((contact) => {
      this.freshdesk.setLastDateChecked(this.db, contact.created_at);
      if (moment(contact.created_at).isAfter(lastDateChecked)) {
        this.$emit(contact,
          {
            id: contact.id,
            summary: `Contact name: ${contact.name}`,
            ts: Date.parse(contact.created_at),
          });
      }
    });
  },
};
