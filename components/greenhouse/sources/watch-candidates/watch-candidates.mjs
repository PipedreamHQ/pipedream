import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";
import greenhouse from "../../greenhouse.app.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  key: "greenhouse-watch-candidates",
  name: "New Candidate Watching",
  description: "Emit new event when a candidate's application or status changes.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    greenhouse,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
    candidateId: {
      propDefinition: [
        greenhouse,
        "candidateId",
      ],
    },
  },
  methods: {
    _getLastId() {
      return this.db.get("lastId") || 0;
    },
    _setLastId(id) {
      this.db.set("lastId", id);
    },
    generateMeta(interview) {
      return {
        id: interview.id,
        summary: `New activity for candidate ID ${this.candidateId}`,
        ts: Date.parse(interview.updated_at),
      };
    },
  },
  async run() {
    const lastId = this._getLastId();
    const {
      notes, emails, activities,
    } = await this.greenhouse.getActivity(this.candidateId);
    const feed = [
      ...notes,
      ...emails,
      ...activities,
    ];

    feed.sort((a, b) => Date.parse(b.created_at) - Date.parse(a.created_at))
      .filter((item) => item.id > lastId);

    if (feed.length) this._setLastId(feed[0].id);

    for (const item of feed.reverse()) {
      this.$emit(item, this.generateMeta(item));
    }
  },
  sampleEmit,
};
