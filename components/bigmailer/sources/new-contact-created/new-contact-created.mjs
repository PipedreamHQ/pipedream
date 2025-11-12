import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";
import bigmailer from "../../bigmailer.app.mjs";

export default {
  key: "bigmailer-new-contact-created",
  name: "New Contact Created",
  description: "Emit new event when a new contact is created.",
  version: "0.0.2",
  type: "source",
  dedupe: "unique",
  props: {
    bigmailer,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
    brandId: {
      propDefinition: [
        bigmailer,
        "brandId",
      ],
    },
  },
  methods: {
    _getLastTs() {
      return this.db.get("lastTs") ?? 0;
    },
    _setLastTs(lastTs) {
      this.db.set("lastTs", lastTs);
    },
    generateMeta(contact) {
      return {
        id: contact.id,
        summary: `New Contact: ${contact.email}`,
        ts: contact.created,
      };
    },
  },
  async run() {
    const lastTs = this._getLastTs();
    let maxTs = lastTs;

    const contacts = this.bigmailer.paginate({
      resourceFn: this.bigmailer.listContacts,
      args: {
        brandId: this.brandId,
      },
    });

    for await (const contact of contacts) {
      if (contact.created > lastTs) {
        const meta = this.generateMeta(contact);
        this.$emit(contact, meta);
        maxTs = Math.max(maxTs, contact.created);
      }
    }

    this._setLastTs(maxTs);
  },
};
