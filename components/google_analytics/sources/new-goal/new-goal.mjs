import analytics from "../../google_analytics.app.mjs";

const LAST_GOAL_ID = "last_goal_id";

export default {
  key: "google_analytics-new-goal",
  name: "New Goal",
  description: "Emit new event each time a new goal is added",
  type: "source",
  version: "0.0.1",
  dedupe: "greatest",
  props: {
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60 * 15,
      },
    },
    analytics,
  },
  methods: {
    _getLastGoalId() {
      return this.db.get(LAST_GOAL_ID) || 1;
    },
    _setLastGoalId(id) {
      this.db.set(LAST_GOAL_ID, id);
    },
  },
  async run() {
    const startIndex = this._getLastGoalId();
    let params = {
      "accountId": "~all",
      "webPropertyId": "~all",
      "profileId": "~all",
      "start-index": startIndex,
    };

    let response = await this.analytics.listGoals(null, params);

    response.items.forEach((goal) => {
      this.$emit(goal, {
        id: goal.id,
        summary: `Goal added: ${goal.id}`,
        ts: Date.parse(goal.created),
      });
    });

    if (response.items[response.items.length - 1]) {
      const lastGoalId = response.items[response.items.length - 1].id;
      if (lastGoalId !== startIndex) {
        this._setLastGoalId(lastGoalId);
      }
    }
  },
};
