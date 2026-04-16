import actions from "../common/actions.mjs";
import common from "../common/common-webhook.mjs";

export default {
  ...common,
  key: "trello-new-activity",
  name: "New Board Activity (Instant)",
  description: "Emit new event for new activity on a board.",
  version: "0.1.4",
  type: "source",
  props: {
    ...common.props,
    board: {
      propDefinition: [
        common.props.app,
        "board",
      ],
    },
    activityTypes: {
      type: "string[]",
      label: "Activity Types",
      description: "Filter incoming events by the activity type",
      options: actions,
      optional: true,
    },
  },
  methods: {
    ...common.methods,
    getSampleEvents() {
      return this.app.getBoardActivity({
        boardId: this.board,
      });
    },
    getSortField() {
      return "date";
    },
    isRelevant({ action }) {
      const {
        data, type,
      } = action;
      return ((!this.board || this.board === data?.board?.id)
        && (!this.activityTypes?.length || this.activityTypes.includes(type)));
    },
    generateMeta(action) {
      const {
        id,
        type,
        date,
      } = action;
      return {
        id,
        summary: `New ${type} activity`,
        ts: Date.parse(date),
      };
    },
  },
};
