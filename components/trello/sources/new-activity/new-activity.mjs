import common from "../common/common-webhook.mjs";
import actions from "../common/actions.mjs";

export default {
  ...common,
  key: "trello-new-activity",
  name: "New Activity (Instant)",
  description: "Emit new event for new activity on a board.",
  version: "0.1.0",
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
    getResult(event) {
      return event.body.action;
    },
    isRelevant({ event }) {
      const {
        data, type,
      } = event.body.action;
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
