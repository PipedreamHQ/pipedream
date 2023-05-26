import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";
import moment from "moment";
import constantContact from "../../constant_contact.app.mjs";

export default {
  key: "constant_contact-event-added",
  name: "New Event Added",
  description: "Emit new event when a new event is created.",
  type: "source",
  version: "0.0.1",
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
    emitEvent(item) {
      const meta = this.generateMeta(item);
      this.$emit(item, meta);
    },
    generateMeta() {
      throw new Error("generateMeta is not implemented");
    },
    async startEvent(maxResults) {
      const lastDate = this._getLastDate();
      const responseArray = [];
      let tempLastDate = lastDate;

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
        const newLastDate = moment(item.created_at);

        if (!lastDate || moment(newLastDate).isAfter(lastDate)) {
          if (!tempLastDate || moment(newLastDate).isAfter(tempLastDate)) {
            tempLastDate = newLastDate;
          }
          responseArray.push(item);
        } else {
          break;
        }
      }

      if (lastDate != tempLastDate)
        this._setLastDate(tempLastDate);

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
