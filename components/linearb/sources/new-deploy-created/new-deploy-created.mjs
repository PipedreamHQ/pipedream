import { axios } from "@pipedream/platform";
import linearb from "../../linearb.app.mjs";

export default {
  key: "linearb-new-deploy-created",
  name: "New Deploy Created",
  description: "Emits an event when a new deploy is created in LinearB. [See the documentation](https://docs.linearb.io/api-deployments/)",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    linearb,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60,
      },
    },
    repoUrl: {
      propDefinition: [
        linearb,
        "repoUrl",
      ],
    },
    refName: {
      propDefinition: [
        linearb,
        "refName",
      ],
    },
    timestamp: {
      propDefinition: [
        linearb,
        "timestamp",
      ],
      optional: true,
    },
    stage: {
      propDefinition: [
        linearb,
        "stage",
      ],
      optional: true,
    },
    services: {
      propDefinition: [
        linearb,
        "services",
      ],
      optional: true,
    },
  },
  hooks: {
    async deploy() {
      // Emit events for the last 50 deployments, sorted by most recent
      const { data: deployments } = await this.linearb.createDeployment({
        repoUrl: this.repoUrl,
        refName: this.refName,
        timestamp: this.timestamp,
        stage: this.stage,
        services: this.services,
      });
      deployments.slice(-50).forEach((deployment) => {
        this.$emit(deployment, {
          id: deployment.id,
          summary: `New Deployment: ${deployment.ref_name}`,
          ts: Date.parse(deployment.created_at),
        });
      });
    },
  },
  async run() {
    // Fetch new deployments since the last time we checked
    const lastTimestamp = this.db.get("lastTimestamp") || new Date().toISOString();
    const { data: deployments } = await this.linearb.createDeployment({
      repoUrl: this.repoUrl,
      refName: this.refName,
      timestamp: lastTimestamp,
      stage: this.stage,
      services: this.services,
    });

    deployments.forEach((deployment) => {
      this.$emit(deployment, {
        id: deployment.id,
        summary: `New Deployment: ${deployment.ref_name}`,
        ts: Date.parse(deployment.created_at),
      });
    });

    // Update the last timestamp we checked
    this.db.set("lastTimestamp", new Date().toISOString());
  },
};
