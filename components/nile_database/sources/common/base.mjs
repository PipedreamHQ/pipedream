import nile from "../../nile_database.app.mjs";
import {
  DEFAULT_POLLING_SOURCE_TIMER_INTERVAL, ConfigurationError,
} from "@pipedream/platform";

export default {
  props: {
    nile,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
    workspace: {
      propDefinition: [
        nile,
        "workspace",
      ],
    },
    database: {
      propDefinition: [
        nile,
        "database",
        (c) => ({
          workspace: c.workspace,
        }),
      ],
    },
  },
  hooks: {
    async deploy() {
      try {
        await this.nile.getDatabase({
          workspace: this.workspace,
          database: this.database,
        });
      } catch {
        throw new ConfigurationError(`Database "${this.database}" with workspace "${this.workspace}" not found`);
      }
    },
  },
  methods: {
    getResourceFn() {
      throw new Error("getResourceFn is not implemented");
    },
    generateMeta() {
      throw new Error("generateMeta is not implemented");
    },
  },
  async run() {
    const resourceFn = this.getResourceFn();

    const results = await resourceFn({
      workspace: this.workspace,
      database: this.database,
    });

    for (const item of results) {
      const meta = this.generateMeta(item);
      this.$emit(item, meta);
    }
  },
};
