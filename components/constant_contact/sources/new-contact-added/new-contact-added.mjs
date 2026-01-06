import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";
import constantContact from "../../constant_contact.app.mjs";

export default {
  key: "constant_contact-new-contact-added",
  name: "New Contact Added",
  description: "Emit new event when a new contact is created.",
  type: "source",
  version: "0.0.3",
  dedupe: "unique",
  props: {
    constantContact,
    db: "$.service.db",
    timer: {
      label: "Polling interval",
      description: "Pipedream will poll the Constant Contact on this schedule",
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
  },
  methods: {
    _getLastDate() {
      return this.db.get("lastDate");
    },
    _setLastDate(lastDate) {
      this.db.set("lastDate", lastDate);
    },
    async startEvent(maxResults) {
      const lastDate = this._getLastDate();
      const responseArray = [];

      const items = this.constantContact.paginate({
        fn: this.constantContact.listContacts,
        field: "contacts",
        params: {
          created_after: lastDate,
          sort: "contacts.created_at.desc",
          limit: 500,
        },
        maxResults,
      });

      for await (const item of items) {
        responseArray.push(item);
      }

      if (!responseArray.length) {
        console.log("No new contacts found");
        return;
      }

      this._setLastDate(responseArray[0].created_at);

      for (const responseItem of responseArray.reverse()) {
        this.$emit(
          responseItem,
          {
            id: responseItem.contact_id,
            summary: `A new contact with id "${responseItem.contact_id}" was created!`,
            ts: responseItem.created_at,
          },
        );
      }
    },
  },
  hooks: {
    async deploy() {
      await this.startEvent(25);
    },
  },
  async run() {
    await this.startEvent();
  },
};
