const stack_exchange = require('../../stack_exchange.app');

module.exports = {
  key: "stack_exchange-new-answers-for-questions",
  name: "New Answers for Specific Questions",
  description: "Emits an event when a new answer is posted in one of the specified questions",
  version: "0.0.2",
  dedupe: "unique",
  props: {
    stack_exchange,
    db: "$.service.db",
    siteId: { propDefinition: [stack_exchange, "siteId"] },
    questionIds: {
      propDefinition: [
        stack_exchange,
        "questionIds",
        c => ({ siteId: c.siteId }),
      ],
    },
    timer: {
      type: '$.interface.timer',
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
        question_id: questionId,
        creation_date: ts,
      } = data;
      const summary = `New answer for question ID ${questionId}`;
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
    const filter = '!SWKA(ozr4ec2cHE9JK'; // See https://api.stackexchange.com/docs/filters
    const searchParams = {
      fromDate,
      toDate,
      filter,
      sort: 'creation',
      order: 'asc',
      site: this.siteId,
    }

    const items = this.stack_exchange.answersForQuestions(this.questionIds, searchParams);
    for await (const item of items) {
      const meta = this.generateMeta(item);
      this.$emit(item, meta);
    }

    this.db.set("fromDate", toDate);
  },
};
