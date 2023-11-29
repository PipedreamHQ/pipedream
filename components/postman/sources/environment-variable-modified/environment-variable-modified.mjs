import postman from "../../postman.app.mjs";
import {
  axios, DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
} from "@pipedream/platform";

export default {
  key: "postman-environment-variable-modified",
  name: "Environment Variable Modified",
  description: "Emits an event when an environment variable is changed. [See the documentation](https://learning.postman.com/docs/postman/environments-and-globals/variables/)",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    postman,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
    environmentId: {
      propDefinition: [
        postman,
        "environmentId",
      ],
    },
    environmentVariableKey: {
      propDefinition: [
        postman,
        "environmentVariableKey",
      ],
    },
  },
  methods: {
    _getLastModified() {
      return this.db.get("lastModified") || null;
    },
    _setLastModified(lastModified) {
      this.db.set("lastModified", lastModified);
    },
  },
  hooks: {
    async deploy() {
      // Fetch the current value of the environment variable to set the initial state
      const currentEnv = await this.postman.listEnvironments({
        environmentId: this.environmentId,
      });
      const variable = currentEnv.values.find((v) => v.key === this.environmentVariableKey);
      if (variable) {
        this._setLastModified(variable.lastUpdated);
      }
    },
  },
  async run() {
    // Fetch the current value of the environment variable
    const currentEnv = await this.postman.listEnvironments({
      environmentId: this.environmentId,
    });
    const variable = currentEnv.values.find((v) => v.key === this.environmentVariableKey);

    if (!variable) {
      throw new Error(`The variable with key ${this.environmentVariableKey} was not found.`);
    }

    const lastModified = this._getLastModified();

    // Emit an event if the environment variable was modified since the last check
    if (lastModified !== variable.lastUpdated) {
      this.$emit(variable, {
        id: `${variable.key}-${variable.lastUpdated}`,
        summary: `Environment variable ${variable.key} modified`,
        ts: Date.parse(variable.lastUpdated),
      });
      this._setLastModified(variable.lastUpdated);
    }
  },
};
