import skillzrun from "../../skillzrun.app.mjs";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";
import constants from "../../common/constants.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  key: "skillzrun-new-user-created",
  name: "New User Created",
  description: "Emit new event when a new user has been created in SkillzRun. [See the documentation](https://api.skillzrun.com/external/api/swagger/static/index.html#/users/get_external_api_users_)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    skillzrun,
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
      await this.processEvent(25);
    },
  },
  methods: {
    _getLastTs() {
      return this.db.get("lastTs") || 0;
    },
    _setLastTs(lastTs) {
      this.db.set("lastTs", lastTs);
    },
    emitEvent(user) {
      const meta = this.generateMeta(user);
      this.$emit(user, meta);
    },
    generateMeta(user) {
      return {
        id: user.id,
        summary: `New user created: ${user.name}`,
        ts: user.createdAt,
      };
    },
    async processEvent(max) {
      const lastTs = this._getLastTs();
      const limit = constants.DEFAULT_LIMIT;
      const params = {
        sort: "createdAt",
        order: "DESC",
        start: 0,
        end: limit,
      };
      let total, done, count = 0;
      const users = [];
      do {
        const { items } = await this.skillzrun.listUsers({
          params,
        });
        for (const user of items) {
          if (user.createdAt >= lastTs) {
            users.push(user);
            count++;
            if (max && count >= max) {
              done = true;
              break;
            }
          } else {
            done = true;
            break;
          }
        }
        total = items?.length;
        params.start += limit;
        params.end += limit;
      } while (total === limit && !done);

      this._setLastTs(users[0].createdAt);
      users.reverse().forEach((user) => this.emitEvent(user));
    },
  },
  async run() {
    await this.processEvent();
  },
  sampleEmit,
};
