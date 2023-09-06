import mondaySdk from "monday-sdk-js";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";

export default {
  key: "monday-new-board",
  name: "New Board",
  description: "Emit new event when a new board is created in Monday.",
  type: "source",
  version: "0.0.5",
  dedupe: "unique",
  props: {
    monday: {
      type: "app",
      app: "monday",
    },
    db: "$.service.db",
    timer: {
      label: "Polling interval",
      description: "Pipedream will poll the Monday API on this schedule",
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
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
    _getLastId() {
      return this.db.get("lastId") || 0;
    },
    _setLastId(lastId) {
      this.db.set("lastId", lastId);
    },
    emitEvent(item) {
      const meta = this.generateMeta(item);
      this.$emit(item, meta);
    },
    generateMeta(board) {
      return {
        id: board.id,
        summary: board.name,
        ts: Date.now(),
      };
    },
    async makeRequest({
      query, options,
    }) {
      const monday = mondaySdk();
      monday.setToken(this.monday.$auth.api_key);
      return monday.api(query, options);
    },
    async getBoard(variables) {
      const { data } = await this.makeRequest({
        query: `
          query getBoard($id: Int!) {
            boards (ids: [$id]) {
              id
              name
              board_folder_id
              columns {
                id
              }
              description
              groups {
                id
              }
              items {
                id
              }
              owner {
                id
              }
              permissions
              tags {
                id
              }
              type
              updated_at
              workspace_id
            }
          }
        `,
        options: {
          variables,
        },
      });
      return data?.boards[0];
    },
    async listBoards(variables) {
      return this.makeRequest({
        query: `
          query listBoards (
            $page: Int = 1
          ) {
            boards(
              page: $page
              state: all
              order_by: created_at
            ) {
              id
              name
              type
            }
          }
        `,
        options: {
          variables,
        },
      });
    },
  },
  async run() {
    const lastId = this._getLastId();

    let maxId = lastId;
    let done = false;
    let page = 1;
    do {
      const { boards } = (await this.listBoards({
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
        const boardData = await this.getBoard({
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
