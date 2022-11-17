import common from "../common/common-polling.mjs";

export default {
  ...common,
  key: "monday-new-board",
  name: "New Board",
  description: "Emit new event when a new board is created in Monday.",
  type: "source",
  version: "0.0.2",
  dedupe: "unique",
  props: {
    ...common.props,
    maxRequests: {
      type: "integer",
      min: 1,
      label: "Max API Requests per Execution",
      description: "The maximum number of API requests to make per execution (e.g., multiple requests are required to retrieve paginated results)",
      optional: true,
      default: 1,
    },
  },
  methods: {
    ...common.methods,
    generateMeta(board) {
      return {
        id: board.id,
        summary: board.name,
        ts: Date.now(),
      };
    },
  },
  async run() {
    const lastId = this._getLastId();

    let maxId = lastId;
    let done = false;
    let page = 1;
    do {
      const { boards } = (await this.monday.listBoards({
        page,
      })).data;
      for (const board of boards) {
        if (+board.id <= lastId) {
          done = true;
          break;
        }
        if (+board.id > maxId) {
          maxId = +board.id;
        }
        const boardData = await this.monday.getBoard({
          id: +board.id,
        });
        this.emitEvent(boardData);
      }
      if (boards.length === 0) {
        done = true;
      }
      page++;
    } while (!done && page <= this.maxRequests);

    this._setLastId(maxId);
  },
};
