import vercel from "../../vercel.app.mjs";

export default {
  key: "vercel-new-deployment",
  name: "New Deployment",
  description: "Emit new event when a deployment is created",
  version: "0.0.3",
  type: "source",
  dedupe: "unique",
  props: {
    vercel,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 15 * 60, // 15 minutes
      },
    },
    project: {
      propDefinition: [
        vercel,
        "project",
      ],
    },
    state: {
      propDefinition: [
        vercel,
        "state",
      ],
    },
    max: {
      propDefinition: [
        vercel,
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
        projectId: this.project,
        state: this.state,
      };
      let from = this._getFrom();
      if (from) {
        params.from = from;
      }
      const deployments = await this.vercel.listDeployments(params, max);
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
