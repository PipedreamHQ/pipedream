import common from "../common/common-polling.mjs";

export default {
  ...common,
  key: "coupontools-new-directory-registration",
  name: "New Directory Registration",
  description: "Emit new event when there's a new user registration in the directory. [See the documentation](https://docs.coupontools.com/api/v4/directory#list-users)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    ...common.props,
    directoryId: {
      propDefinition: [
        common.props.coupontools,
        "directoryId",
      ],
    },
  },
  methods: {
    ...common.methods,
    async getResults(max, lastTs) {
      const users = await this.coupontools.listUsers({
        directoryId: this.directoryId,
      });
      let results = [];
      let maxTs = lastTs;
      for (const user of users) {
        const ts = Date.parse(this.getTimestamp(user));
        if (ts > lastTs) {
          results.push(user);
          maxTs = Math.max(maxTs, ts);
        }
      }
      this._setLastTs(maxTs);
      if (max && results.length > max) {
        results = results.slice(-1 * max);
      }
      return results;
    },
    generateMeta(item) {
      return {
        id: item.id,
        summary: `New user registered with ID: ${item.id}`,
        ts: Date.parse(this.getTimestamp(item)),
      };
    },
  },
};
