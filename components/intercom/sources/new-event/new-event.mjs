import common from "../common/common.mjs";

export default {
  ...common,
  key: "intercom-new-event",
  name: "New Event",
  description: "Emit new event for each new Intercom event for a user.",
  version: "0.0.8",
  type: "source",
  dedupe: "unique",
  props: {
    ...common.props,
    userIds: {
      propDefinition: [
        common.props.intercom,
        "userIds",
      ],
    },
  },
  methods: {
    _getNextUrl(userId) {
      return this.db.get(userId) || null;
    },
    _setNextUrl(userId, nextUrl) {
      this.db.set(userId, nextUrl);
    },
    generateMeta({
      id, event_name: eventName, created_at: createdAt,
    }) {
      return {
        id,
        summary: eventName,
        ts: createdAt,
      };
    },
  },
  async run() {
    for (const userId of this.userIds) {
      let nextUrl = this._getNextUrl(userId);
      const results = await this.intercom.getEvents(userId, nextUrl);
      for (const result of results.events) {
        const meta = this.generateMeta(result);
        this.$emit(result, meta);
      }
      // store the latest 'since' url by the userId
      if (results.nextUrl) {
        this._setNextUrl(userId, nextUrl);
      }
    }
  },
};
