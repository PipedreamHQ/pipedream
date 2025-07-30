import miro from "../../miro_custom_app.app.mjs";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";

export default {
  props: {
    miro,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
    teamId: {
      propDefinition: [
        miro,
        "teamId",
      ],
    },
    boardId: {
      propDefinition: [
        miro,
        "boardId",
        ({ teamId }) => ({
          teamId,
        }),
      ],
    },
  },
  methods: {
    _getLastTs() {
      return this.db.get("lastTs") || 0;
    },
    _setLastTs(ts) {
      this.db.set("lastTs", ts);
    },
    async *paginate({
      resourceFn, args = {},
    }) {
      args = {
        ...args,
        params: {
          ...args.params,
          limit: 50,
        },
      };
      let total = 0;
      do {
        const {
          data, cursor,
        } = await resourceFn(args);
        for (const item of data) {
          yield item;
        }
        total = data?.length;
        args.params.cursor = cursor;
      } while (total === args.params.limit);
    },
    generateMeta() {
      throw new Error("generateMeta is not implemented");
    },
  },
};
