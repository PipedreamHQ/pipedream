import moment from "moment";
import freshservice from "../../freshservice.app.mjs";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";

export default {
  name: "New Contact",
  version: "0.0.1",
  key: "freshservice-new-contact",
  description: "Emit new event for each created contact. [See documentation](https://api.freshservice.com/v2/#list_all_requesters)",
  type: "source",
  dedupe: "unique",
  props: {
    freshservice,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      static: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
  },
  methods: {
    emitEvent(data) {
      this.$emit(data, {
        id: data.id,
        summary: `New contact: ${data.first_name} ${data.last_name || ""} (${data.email})`,
        ts: Date.parse(data.created_at),
      });
    },
    async *getContacts(params = {}) {
      let page = 1;
      let hasMore = true;

      while (hasMore) {
        const { requesters } = await this.freshservice.filterContacts({
          params: {
            ...params,
            page,
            per_page: 100,
          },
        });

        if (!requesters || requesters.length === 0) {
          hasMore = false;
        } else {
          for (const contact of requesters) {
            yield contact;
          }
          page++;
        }
      }
    },
    async emitEvents() {
      const lastDateChecked = await this.freshservice.getLastDateChecked();
      const formattedDate = moment(lastDateChecked).format("YYYY-MM-DDTHH:mm:ss[Z]");

      const params = {
        query: `"created_at:>'${formattedDate}'"`,
        order_by: "created_at",
        order_type: "asc",
      };

      let maxCreatedAt = lastDateChecked;

      for await (const contact of this.getContacts(params)) {
        this.emitEvent(contact);

        if (contact.created_at > maxCreatedAt) {
          maxCreatedAt = contact.created_at;
        }
      }

      await this.freshservice.setLastDateChecked(maxCreatedAt);
    },
  },
  hooks: {
    async deploy() {
      await this.emitEvents();
    },
  },
  async run() {
    await this.emitEvents();
  },
};
