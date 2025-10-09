import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";
import constants from "../../common/constants.mjs";
import app from "../../linearb.app.mjs";

export default {
  key: "linearb-new-deploy-created",
  name: "New Deploy Created",
  description: "Emit new event when a new deploy is created in LinearB. [See the documentation](https://docs.linearb.io/api-deployments/)",
  version: "0.0.2",
  type: "source",
  dedupe: "unique",
  props: {
    app,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      label: "Polling Schedule",
      description: "How often to poll the API",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
    repositoryId: {
      type: "integer",
      label: "Repository ID",
      description: "The git repository id. Eg. `1`",
    },
  },
  methods: {
    generateMeta(resource) {
      return {
        id: resource.id,
        summary: "New Deploy Created",
        ts: Date.now(),
      };
    },
    setLastCreatedAt(value) {
      this.db.set(constants.LAST_CREATED_AT, value);
    },
    getLastCreatedAt() {
      return this.db.get(constants.LAST_CREATED_AT);
    },
    getResourcesName() {
      return "items";
    },
    getResourcesFn() {
      return this.app.listDeployments;
    },
    getResourcesFnArgs() {
      return {
        params: {
          repository_id: this.repositoryId,
          limit: 50,
          sort_by: "published_at",
          sort_dir: "desc",
          after: this.getLastCreatedAt(),
        },
      };
    },
    processResource(resource) {
      const meta = this.generateMeta(resource);
      this.$emit(resource, meta);
    },
  },
  async run() {
    const {
      getResourcesFn,
      getResourcesFnArgs,
      getResourcesName,
      processResource,
    } = this;

    const resourcesFn = getResourcesFn();
    const { [getResourcesName()]: resources } =
      await resourcesFn(getResourcesFnArgs());

    const [
      lastResource,
    ] = resources;

    if (lastResource?.created_at) {
      this.setLastCreatedAt(lastResource.created_at);
    }

    Array.from(resources)
      .reverse()
      .forEach(processResource);
  },
};
