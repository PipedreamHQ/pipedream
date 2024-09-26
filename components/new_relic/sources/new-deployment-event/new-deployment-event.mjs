import app from "../../new_relic.app.mjs";
import common from "../../common/common-sources.mjs";

export default {
  dedupe: "unique",
  type: "source",
  key: "new_relic-new-deployment-event",
  name: "New Deployment",
  description: "Emit new event when a new deployment is created.",
  version: "0.0.2",
  props: {
    ...common.props,
    application: {
      propDefinition: [
        app,
        "application",
      ],
    },
  },
  methods: {
    _setLastEmittedDeploy(deployment) {
      this.db.set("lastEmittedDeploy", deployment);
    },
    _getLastEmittedDeploy() {
      return this.db.get("lastEmittedDeploy");
    },
    getMeta({
      id,
      revision,
      timestamp,
    }) {
      return {
        id,
        summary: revision,
        ts: new Date(timestamp),
      };
    },
  },
  async run () {
    const deployments = await this.app.listDeployments(this.application);
    const toEmitEvents = [];
    const prevRequestFirstItem = this._getLastEmittedDeploy();
    for (const deployment of deployments) {
      if (prevRequestFirstItem == deployment.id) {
        break;
      }
      toEmitEvents.unshift(deployment);
    }
    this._setLastEmittedDeploy(deployments[0].id);

    for (const deployment of toEmitEvents) {
      this.$emit(deployment, this.getMeta(deployment));
    }
  },
};
