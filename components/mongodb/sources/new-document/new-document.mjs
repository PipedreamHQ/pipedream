import common from "../common/base.mjs";
import { Timestamp } from "mongodb";

export default {
  ...common,
  key: "mongodb-new-document",
  name: "New Document",
  description: "Emit new an event when a new document is added to a collection",
  version: "0.0.9",
  type: "source",
  dedupe: "unique",
  props: {
    ...common.props,
    database: {
      propDefinition: [
        common.props.mongodb,
        "database",
      ],
    },
    collection: {
      propDefinition: [
        common.props.mongodb,
        "collection",
        (c) => ({
          database: c.database,
        }),
      ],
    },
    timestampField: {
      type: "string",
      label: "Timestamp Field",
      description: "The key of a timestamp field, such as 'created_at' that is set to the current timestamp when a document is created. Must be of type Timestamp.",
    },
  },
  hooks: {
    async deploy() {
      const client = await this.mongodb.getClient();
      await this.processEvent(client, Date.now(), 25);
      await client.close();
    },
  },
  methods: {
    ...common.methods,
    _getLastTs() {
      return this.db.get("lastTs");
    },
    _setLastTs(lastTs) {
      this.db.set("lastTs", lastTs);
    },
    getTs(doc) {
      try {
        return JSON.parse(doc[this.timestampField]);
      } catch {
        return doc[this.timestampField];
      }
    },
    convertToTimestamp(timestampStr) {
      const bigIntValue = BigInt(timestampStr);
      const seconds = Number(bigIntValue >> 32n);
      const increment = Number(bigIntValue & 0xFFFFFFFFn);
      return new Timestamp({
        t: seconds,
        i: increment,
      });
    },
    async processEvent(client, eventTs, max) {
      const lastTs = this._getLastTs() || 0;
      let maxTs = lastTs;
      let count = 0;
      const collection = this.mongodb.getCollection(client, this.database, this.collection);
      const sort = {
        [this.timestampField]: -1,
      };
      const query = {
        [this.timestampField]: {
          $gt: this.convertToTimestamp(lastTs),
        },
      };
      const documents = await collection.find(query).sort(sort)
        .toArray();
      const docs = [];
      for (const doc of documents) {
        const ts = this.getTs(doc);
        if (!(ts > lastTs) || (max && count >= max)) {
          break;
        }
        if (ts > maxTs) {
          maxTs = ts;
        }
        docs.push(doc);
        count++;
      }
      docs.reverse().forEach((doc) => this.emitEvent(doc, eventTs));
      this._setLastTs(maxTs);
    },
    generateMeta({ _id: id }, ts) {
      return {
        id,
        summary: `New Document ID ${JSON.stringify(id)}`,
        ts,
      };
    },
  },
};
