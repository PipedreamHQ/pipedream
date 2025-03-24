import vercelTokenAuth from "../../vercel_token_auth.app.mjs";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";

export default {
  key: "vercel_token_auth-new-deployment",
  name: "New Deployment",
  description: "Emit new event when a deployment is created",
  version: "0.0.4",
  type: "source",
  dedupe: "unique",
  props: {
    vercelTokenAuth,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
    team: {
      propDefinition: [
        vercelTokenAuth,
        "team",
      ],
    },
    project: {
      propDefinition: [
        vercelTokenAuth,
        "project",
        (c) => ({
          teamId: c.team,
        }),
      ],
    },
    state: {
      propDefinition: [
        vercelTokenAuth,
        "state",
      ],
    },
    max: {
      propDefinition: [
        vercelTokenAuth,
        "max",
      ],
    },
  },
  hooks: {
    async deploy() {
      await this.processEvent(10);
    },
  },
  methods: {
    _getFrom() {
      return this.db.get("from");
    },
    _setFrom(from) {
      this.db.set("from", from);
    },
    generateMeta(deployment) {
      const {
        uid,
        name,
        state,
        created,
      } = deployment;
      return {
        id: uid,
        summary: `${name ?? uid} ${state}`,
        ts: created,
      };
    },
    async processEvent(max) {
      const params = {
        teamId: this.team,
        projectId: this.project,
        state: this.state,
      };
      let from = this._getFrom();
      if (from) {
        params.from = from;
      }
      const deployments = await this.vercelTokenAuth.listDeployments(params, max);
      for (const deployment of deployments) {
        if (!from || deployment.created > from) {
          from = deployment.created;
        }
        const meta = this.generateMeta(deployment);
        this.$emit(deployment, meta);
      }
      this._setFrom(from);
    },
  },
  async run() {
    await this.processEvent(this.max);
  },
};
