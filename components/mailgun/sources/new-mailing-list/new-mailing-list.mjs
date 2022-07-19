import common from "../common/timer-based.mjs";

export default {
  ...common,
  key: "mailgun-new-mailing-list",
  name: "New Mailing List",
  type: "source",
  description: "Emit new event when a new mailing list is added to the associated Mailgun account.",
  version: "0.0.2",
  dedupe: "greatest",
  props: {
    ...common.props,
    db: "$.service.db",
  },
  hooks: {
    async deploy() {
      const lists = await this.getLists();
      for (const list of lists.slice(-5)) {
        this.$emit(list, this.generateMeta(list));
      }
      if (lists.length) {
        this._setLastCreatedTimestamp(Date.parse(lists[lists.length - 1].created_at));
      }
    },
  },
  methods: {
    ...common.methods,
    _getLastCreatedTimestamp() {
      return this.db.get("lastCreatedTimestamp") || 0;
    },
    _setLastCreatedTimestamp(lastCreatedTimestamp = Date.now()) {
      this.db.set("lastCreatedTimestamp", lastCreatedTimestamp);
    },
    _compareByCreatedAtAsc({ created_at: a }, { created_at: b }) {
      return Date.parse(a) - Date.parse(b);
    },
    _sortLists(lists) {
      return lists.slice().sort(this._compareByCreatedAtAsc);
    },
    _isListForThisDomain(list) {
      const [
        // eslint-disable-next-line no-unused-vars
        _name,
        domain,
      ] = list.address.split("@");
      return domain === this.domain;
    },
    _isCreatedAfter(timestamp) {
      return (list) => Date.parse(list.created_at) > timestamp;
    },
    async getLists() {
      const mailingLists = await this.mailgun.getMailingLists();
      const relevantLists = mailingLists
        .filter(this._isListForThisDomain);
      const sortedRelevantLists = this._sortLists(relevantLists);
      return sortedRelevantLists;
    },
    generateMeta(payload) {
      const ts = +new Date(payload.created_at);
      return {
        id: `${ts}`,
        summary: `New mailing list: ${payload.name}`,
        ts,
      };
    },
  },
  async run() {
    const lastCreatedTimestamp = this._getLastCreatedTimestamp();

    const lists = await this.getLists();
    const relevantLists = lists
      .filter(this._isCreatedAfter(lastCreatedTimestamp));

    for (const list of relevantLists) {
      this.$emit(list, this.generateMeta(list));
    }

    if (relevantLists.length) {
      this._setLastCreatedTimestamp(
        Date.parse(relevantLists[relevantLists.length - 1].created_at),
      );
    }
  },
};
