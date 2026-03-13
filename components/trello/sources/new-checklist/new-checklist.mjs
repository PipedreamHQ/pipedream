import common from "../common/common-board-based.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "trello-new-checklist",
  name: "New Checklist (Instant)",
  description: "Emit new event for each new checklist added to a board.",
  version: "0.1.4",
  type: "source",
  dedupe: "unique",
  props: {
    ...common.props,
    board: {
      propDefinition: [
        common.props.app,
        "board",
      ],
    },
    lists: {
      propDefinition: [
        common.props.app,
        "lists",
        (c) => ({
          board: c.board,
        }),
      ],
      description: "If specified, events will only be emitted when a checklist is added to a card in one of the specified lists",
    },
    onlyEventsRelatedWithAuthenticatedUser: {
      label: "Only Events Related To Me",
      description: "Only will emit events from the cards related with the authenticated user",
      type: "boolean",
      default: false,
      optional: true,
    },
  },
  methods: {
    ...common.methods,
    getSampleEvents() {
      return this.app.listBoardChecklists({
        boardId: this.board,
      });
    },
    getSortField() {
      return "id";
    },
    isCorrectEventType({ type }) {
      return type === "addChecklistToCard";
    },
    getResult({ data }) {
      return this.app.getChecklist({
        checklistId: data?.checklist?.id,
      });
    },
  },
  sampleEmit,
};
