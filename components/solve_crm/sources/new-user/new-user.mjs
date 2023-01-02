import solveCrm from "../../solve_crm.app.mjs";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";
const DEFAULT_LIMIT = 100;

export default {
  key: "solve_crm-new-user",
  name: "New User",
  description: "Emit new event for each new user created. [See the docs here](https://solve360.com/api/contacts/)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    solveCrm,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
  },
  hooks: {
    async deploy() {
      const { users } = await this.solveCrm.listOwnership({
        params: {
          limit: 25,
        },
      });
      this.emitResults(users);
    },
  },
  methods: {
    emitResults(users) {
      for (const user of users) {
        const meta = this.generateMeta(user);
        this.$emit(user, meta);
      }
    },
    generateMeta(user) {
      return {
        id: user.id,
        summary: `New User with ID ${user.id}`,
        ts: Date.now(),
      };
    },
  },
  async run() {
    let total = 0;
    let params = {
      limit: DEFAULT_LIMIT,
      start: 0,
    };
    do {
      const { users } = await this.solveCrm.listOwnership({
        params,
      });
      this.emitResults(users);
      total = users.length;
      params.start = users[users.length - 1].id;
    } while (total === DEFAULT_LIMIT);
  },
};
