import esputnik from "../../esputnik.app.mjs";
import constants from "../../common/constants.mjs";

export default {
  props: {
    esputnik,
    db: "$.service.db",
    timer: {
      label: "Polling Interval",
      description: "Pipedream will poll the eSputnik API on this schedule",
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60 * 15,
      },
    },
    maxRequests: {
      propDefinition: [
        esputnik,
        "maxRequests",
      ],
    },
  },
  methods: {
    getLastId() {
      return this.db.get("lastId") || 1;
    },
    setLastId(lastId) {
      this.db.set("lastId", lastId);
    },
    generateContactMeta(contact) {
      const summary = contact.firstName && contact.lastName
        ? `${contact.firstName} ${contact.lastName}`
        : `${contact.id}`;
      return {
        id: contact.id,
        summary,
        ts: Date.now(),
      };
    },
    async *getPaginatedContacts(resourceFn, args = {}) {
      let maxId = this.getLastId();
      let startindex = 1;
      let requestCount = 0;
      let total;
      const {
        params, ...otherArgs
      } = args;

      do {
        const contacts = await resourceFn({
          params: {
            startindex,
            maxrows: constants.DEFAULT_PAGE_SIZE,
            ...params,
          },
          ...otherArgs,
        });
        total = contacts?.length;
        startindex += total;

        for (const contact of contacts.reverse()) {
          if (contact.id > maxId) {
            maxId = contact.id;
          }
          yield contact;
        }

        requestCount++;
      } while (requestCount < this.maxRequests && total > 0);

      this.setLastId(maxId);
    },
  },
};
