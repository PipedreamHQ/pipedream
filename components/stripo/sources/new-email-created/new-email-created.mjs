import stripo from "../../stripo.app.mjs";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";
import sampleEmit from "./test-event.mjs";

export default {
  key: "stripo-new-email-created",
  name: "New Email Created",
  description: "Emit new event when a new email is created in Stripo. [See the documentation](https://api.stripo.email/reference/findemails)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    stripo,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
    query: {
      propDefinition: [
        stripo,
        "query",
      ],
    },
  },
  methods: {
    _getLastTs() {
      return this.db.get("lastTs") || 0;
    },
    _setLastTs(lastTs) {
      this.db.set("lastTs", lastTs);
    },
    generateMeta(email) {
      return {
        id: email.emailId,
        summary: `New Email: ${email.name}`,
        ts: Date.parse(email.updatedTime),
      };
    },
    async processEvent(max) {
      const lastTs = this._getLastTs();

      const results = this.stripo.paginate({
        fn: this.stripo.listEmails,
        params: {
          queryStr: this.query,
          sortingColumn: "createdTime",
          sortingAsc: false,
        },
        max,
      });

      const emails = [];
      for await (const item of results) {
        const ts = Date.parse(item.updatedTime);
        if (ts >= lastTs) {
          emails.push(item);
        }
      }

      if (!emails.length) {
        return;
      }

      this._setLastTs(Date.parse(emails[0].updatedTime));

      emails.reverse().forEach((email) => {
        const meta = this.generateMeta(email);
        this.$emit(email, meta);
      });
    },
  },
  hooks: {
    async deploy() {
      await this.processEvent(25);
    },
  },
  async run() {
    await this.processEvent();
  },
  sampleEmit,
};
