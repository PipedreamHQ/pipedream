const stack_exchange = require("../../stack_exchange.app");

module.exports = {
  key: "stack_exchange-new-answers-from-users",
  name: "New Answers from Specific Users",
  description: "Emits an event when a new answer is posted by one of the specified users",
  version: "0.0.2",
  dedupe: "unique",
  type: "source",
  props: {
    stack_exchange,
    db: "$.service.db",
    siteId: {
      propDefinition: [
        stack_exchange,
        "siteId",
      ],
    },
    userIds: {
      propDefinition: [
        stack_exchange,
        "userIds",
        (c) => ({
          siteId: c.siteId,
        }),
      ],
    },
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 15 * 60, // 15 minutes
      },
    },
  },
  hooks: {
    async activate() {
      const fromDate = this._getCurrentEpoch();
      this.db.set("fromDate", fromDate);
    },
  },
  methods: {
    _getCurrentEpoch() {
      // The StackExchange API works with Unix epochs in seconds.
      return Math.floor(Date.now() / 1000);
    },
    generateMeta(data) {
      const {
        answer_id: id,
        owner: owner,
        creation_date: ts,
      } = data;
      const { display_name: username } = owner;
      const summary = `New answer from ${username}`;
      return {
        id,
        summary,
        ts,
      };
    },
  },
  async run() {
    const fromDate = this.db.get("fromDate");
    const toDate = this._getCurrentEpoch();
    const filter = "!SWKA(ozr4ec2cHE9JK"; // See https://api.stackexchange.com/docs/filters
    const searchParams = {
      fromDate,
      toDate,
      filter,
      sort: "creation",
      order: "asc",
      site: this.siteId,
    };

    const items = this.stack_exchange.answersFromUsers(this.userIds, searchParams);
    for await (const item of items) {
      const meta = this.generateMeta(item);
      this.$emit(item, meta);
    }

    this.db.set("fromDate", toDate);
  },
};
