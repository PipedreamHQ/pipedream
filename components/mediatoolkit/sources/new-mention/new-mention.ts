import { defineSource } from "@pipedream/types";
import mediatoolkit from "../../app/mediatoolkit.app";

export default defineSource({
  name: "New Mention",
  version: "0.0.2",
  key: "mediatoolkit-new-mention",
  description: "Emit new event on each new mention.",
  type: "source",
  dedupe: "unique",
  props: {
    mediatoolkit,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      static: {
        intervalSeconds: 15 * 60, // 15 minutes
      },
    },
    organizationId: {
      propDefinition: [
        mediatoolkit,
        "organizationId",
      ],
    },
    groupId: {
      propDefinition: [
        mediatoolkit,
        "groupId",
        (c) => ({
          organizationId: c.organizationId,
        }),
      ],
    },
  },
  methods: {
    emitEvent(data) {
      this.$emit(data, {
        id: data.id,
        summary: `New mention with id ${data.id}`,
        ts: Date.parse(data.insert_time),
      });
    },
    _setLastTimestamp(timestamp) {
      this.db.set("lastTimestamp", timestamp);
    },
    _getLastTimestamp() {
      return this.db.get("lastTimestamp");
    },
  },
  hooks: {
    async deploy() {
      this._setLastTimestamp(Math.round(new Date().getTime() / 1000));

      const mentions = await this.mediatoolkit.getMentions({
        organizationId: this.organizationId,
        groupId: this.groupId,
        params: {
          count: 10,
        },
      });

      mentions.reverse().forEach(this.emitEvent);
    },
  },
  async run() {
    this._setLastTimestamp(Math.round(new Date().getTime() / 1000));

    const mentions = await this.mediatoolkit.getMentions({
      organizationId: this.organizationId,
      groupId: this.groupId,
      params: {
        count: 10000,
        from_time: this._getLastTimestamp(),
      },
    });

    mentions.reverse().forEach(this.emitEvent);
  },
});
