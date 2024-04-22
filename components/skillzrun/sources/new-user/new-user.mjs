import { axios } from "@pipedream/platform";
import skillzrun from "../../skillzrun.app.mjs";

export default {
  key: "skillzrun-new-user",
  name: "New User Created",
  description: "Emits an event when a new user has been created in SkillzRun",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    skillzrun,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60,
      },
    },
  },
  methods: {
    ...skillzrun.methods,
    generateMeta(data) {
      const ts = new Date(data.created_at).getTime();
      return {
        id: data.id,
        summary: `New user created: ${data.name}`,
        ts,
      };
    },
  },
  hooks: {
    async activate() {
      const lastRunTime = this.db.get("lastRunTime");
      if (!lastRunTime) {
        this.db.set("lastRunTime", new Date().toISOString());
      }
    },
  },
  async run() {
    const lastRunTime = new Date(this.db.get("lastRunTime"));
    const now = new Date();

    // Fetch new users created since the last run
    const newUsers = await this.skillzrun.getNewUsers(lastRunTime);

    for (const user of newUsers) {
      const createdAt = new Date(user.created_at);

      // Ignore users created before the last run
      if (createdAt <= lastRunTime) {
        continue;
      }

      // Emit the new user event
      this.$emit(user, this.generateMeta(user));
    }

    // Update the last run time
    this.db.set("lastRunTime", now.toISOString());
  },
};
